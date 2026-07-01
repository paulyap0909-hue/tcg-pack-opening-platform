import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
})

async function readRawBody(req: VercelRequest) {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

async function creditWalletFromCheckoutSession(session: Stripe.Checkout.Session) {
  const paymentOrderId = session.metadata?.payment_order_id ?? session.client_reference_id

  if (!paymentOrderId) {
    throw new Error('Stripe session missing payment_order_id.')
  }

  const supabase = getSupabaseAdmin()

  const { data: paymentOrder, error: orderError } = await supabase
    .from('payment_orders')
    .select('*')
    .eq('id', paymentOrderId)
    .single()

  if (orderError || !paymentOrder) {
    throw orderError ?? new Error('Payment order not found.')
  }

  if (paymentOrder.status === 'paid') {
    return
  }

  if (paymentOrder.amount_cents !== session.amount_total) {
    throw new Error('Stripe amount mismatch.')
  }

  if (session.currency?.toLowerCase() !== paymentOrder.currency) {
    throw new Error('Stripe currency mismatch.')
  }

  const points = Number(paymentOrder.points)
  const userId = String(paymentOrder.user_id)

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id,balance_points')
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    throw walletError ?? new Error('Wallet not found.')
  }

  const nextBalance = Number(wallet.balance_points) + points

  const { error: updateOrderError } = await supabase
    .from('payment_orders')
    .update({
      status: 'paid',
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      paid_at: new Date().toISOString(),
      raw_gateway_event: session,
    })
    .eq('id', paymentOrder.id)
    .neq('status', 'paid')

  if (updateOrderError) {
    throw updateOrderError
  }

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({
      balance_points: nextBalance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', wallet.id)

  if (walletUpdateError) {
    throw walletUpdateError
  }

  const { error: transactionError } = await supabase.from('wallet_transactions').insert({
    user_id: userId,
    type: 'topup',
    amount_points: points,
    balance_after: nextBalance,
    payment_order_id: paymentOrder.id,
    description: `Stripe top up · ${points.toLocaleString()} points`,
  })

  if (transactionError) {
    throw transactionError
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers['stripe-signature']

  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret || !signature) {
    return res.status(500).json({ error: 'Stripe webhook is not configured.' })
  }

  let event: Stripe.Event

  try {
    const rawBody = await readRawBody(req)
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error(error)

    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid Stripe webhook signature.',
    })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await creditWalletFromCheckoutSession(event.data.object as Stripe.Checkout.Session)
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const paymentOrderId = session.metadata?.payment_order_id ?? session.client_reference_id

      if (paymentOrderId) {
        const supabase = getSupabaseAdmin()

        await supabase
          .from('payment_orders')
          .update({ status: 'cancelled' })
          .eq('id', paymentOrderId)
          .in('status', ['pending', 'checkout_created'])
      }
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unable to process Stripe webhook.',
    })
  }
}
