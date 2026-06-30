import type { TopUpPackageId } from './topUpPackages'

type CreateCheckoutSessionResponse = {
  checkoutUrl?: string
  error?: string
}

export async function createStripeTopUpCheckoutSession(packageId: TopUpPackageId) {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ packageId }),
  })

  let payload: CreateCheckoutSessionResponse = {}

  try {
    payload = (await response.json()) as CreateCheckoutSessionResponse
  } catch {
    payload = {}
  }

  if (!response.ok || !payload.checkoutUrl) {
    throw new Error(payload.error ?? 'Unable to create Stripe checkout session.')
  }

  return payload.checkoutUrl
}
