import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

import { getSupabaseAdmin, getDemoUserId } from '../_lib/supabaseAdmin'
import { getTopUpPackage } from '../_lib/topUpPackages'

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
