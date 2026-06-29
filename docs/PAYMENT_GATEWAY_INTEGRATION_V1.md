# Payment Gateway Integration V1

This document defines the payment gateway direction for production. Do not credit wallet points from frontend redirect alone. Only verified webhook events can credit the wallet.

## Recommended gateway choices

For Malaysia-first launch:

- Billplz for FPX / DuitNow local payments.
- Stripe for cards, FPX and stronger international developer tooling.

The final choice depends on approval for the business model, fees, payout timing and whether mystery pack / auction / reward mechanics are accepted by the gateway.

## Production payment flow

1. Player selects a top up package.
2. Frontend calls backend create payment order.
3. Backend creates `payment_orders` row with status `pending`.
4. Backend creates checkout session / bill with payment gateway.
5. Player pays on gateway page.
6. Gateway calls webhook endpoint.
7. Backend verifies webhook signature.
8. Backend marks payment order as `paid`.
9. Backend creates `wallet_transactions` credit row.
10. Frontend reloads wallet from Supabase.

## Required payment tables

Use `payment_orders` to track:

- User ID
- Gateway provider
- Gateway reference
- Amount in MYR cents
- Points to credit
- Status
- Raw webhook metadata
- Paid timestamp

Use `wallet_transactions` to track:

- User ID
- Type: top_up, open_pack, sell_back, marketplace_purchase, marketplace_sale, refund, adjustment
- Amount points
- Balance before / after
- Related payment order or object

## Security rules

- Never expose service role key to frontend.
- Never credit points from frontend success page.
- Verify webhook signatures.
- Use idempotency key / unique gateway reference to prevent double credit.
- Store every payment status change.
- Handle failed, expired, cancelled, chargeback and refund states.

## Important business risk

Paid random rewards, mystery packs, raffles, auctions and prizes may be sensitive for payment gateways. Get written approval from the payment provider and legal review before live money launch.

