import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

type TopUpPackageId =
  | 'starter_spark'
  | 'rookie_pack'
  | 'hunter_pack'
  | 'elite_pack'
  | 'master_pack'
  | 'whale_vault'

type TopUpPackage = {
  id: TopUpPackageId
  label: string
  amountMyr: number
  amountCents: number
  points: number
}

const TOP_UP_PACKAGES: TopUpPackage[] = [
  {
    id: 'starter_spark',
    label: 'Starter Spark',
    amountMyr: 5,
    amountCents: 500,
    points: 450,
  },
  {
    id: 'rookie_pack',
    label: 'Rookie Pack',
    amountMyr: 10,
    amountCents: 1000,
    points: 1000,
  },
  {
    id: 'hunter_pack',
    label: 'Hunter Pack',
    amountMyr: 30,
    amountCents: 3000,
    points: 3300,
  },
  {
    id: 'elite_pack',
    label: 'Elite Pack',
    amountMyr: 50,
    amountCents: 5000,
    points: 5800,
  },
  {
    id: 'master_pack',
    label: 'Master Pack',
    amountMyr: 100,
    amountCents: 10000,
    points: 12000,
  },
  {
    id: 'whale_vault',
    label: 'Whale Vault',
    amountMyr: 200,
    amountCents: 20000,
    points: 26000,
  },
]

const getTopUpPackage = (packageId: string) =>
  TOP_UP_PACKAGES.find((topUpPackage) => topUpPackage.id === packageId)

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

const getDemoUserId = () => {
  const demoUserId = process.env.DEMO_USER_ID

  if (!demoUserId) {
    throw new Error('Missing DEMO_USER_ID. Replace demo mode with Supabase Auth before production.')
  }

  return demoUserId
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY.' })
  }

  const appUrl = process.env.APP_URL ?? req.headers.origin ?? 'http://localhost:5173'
  const packageId = String(req.body?.packageId ?? '')
  const topUpPackage = getTopUpPackage(packageId)

  if (!topUpPackage) {
    return res.status(400).json({ error: 'Invalid top-up package.' })
  }

  try {
    const supabase = getSupabaseAdmin()
    const userId = getDemoUserId()

    const { data: wallet } = await supabase
      .from('wallets')
      .select('id,user_id,balance_points')
      .eq('user_id', userId)
      .maybeSingle()

    if (!wallet) {
      const { error: walletError } = await supabase.from('wallets').insert({
        user_id: userId,
        balance_points: 0,
        currency: 'points',
      })

      if (walletError) {
        throw walletError
      }
    }

    const { data: paymentOrder, error: orderError } = await supabase
      .from('payment_orders')
      .insert({
        user_id: userId,
        package_id: topUpPackage.id,
        gateway: 'stripe',
        currency: 'myr',
        amount_cents: topUpPackage.amountCents,
        points: topUpPackage.points,
        status: 'pending',
      })
      .select('id')
      .single()

    if (orderError || !paymentOrder) {
      throw orderError ?? new Error('Unable to create payment order.')
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'fpx', 'grabpay'],
      client_reference_id: String(paymentOrder.id),
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel?order_id=${paymentOrder.id}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'myr',
            unit_amount: topUpPackage.amountCents,
            product_data: {
              name: `Jomluffyz ${topUpPackage.label}`,
              description: `${topUpPackage.points.toLocaleString()} points`,
            },
          },
        },
      ],
      metadata: {
        payment_order_id: String(paymentOrder.id),
        user_id: userId,
        package_id: topUpPackage.id,
        points: String(topUpPackage.points),
      },
    })

    const { error: updateError } = await supabase
      .from('payment_orders')
      .update({
        stripe_session_id: session.id,
        status: 'checkout_created',
      })
      .eq('id', paymentOrder.id)

    if (updateError) {
      throw updateError
    }

    return res.status(200).json({ checkoutUrl: session.url })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unable to create Stripe checkout session.',
    })
  }
}
