# Stripe Supabase Top Up Integration V1

This package adds a production-ready direction for **Top Up Points with Stripe Checkout + Supabase**.

## Included Top Up Packages

| Package | Price | Points | Positioning |
|---|---:|---:|---|
| Starter Spark | RM5 | 450 | Trial |
| Rookie Pack | RM10 | 1,000 | Basic |
| Hunter Pack | RM30 | 3,300 | Most Popular |
| Elite Pack | RM50 | 5,800 | Mid-tier |
| Master Pack | RM100 | 12,000 | Best Value |
| Whale Vault | RM200 | 26,000 | Max Bonus |

## Files Added

```text
src/lib/topUpPackages.ts
src/lib/paymentClient.ts
src/components/PaymentStatusPage.tsx
api/_lib/topUpPackages.ts
api/_lib/supabaseAdmin.ts
api/stripe/create-checkout-session.ts
api/stripe/webhook.ts
supabase/migrations/002_stripe_topup_wallet.sql
.env.example
docs/STRIPE_SUPABASE_TOPUP_V1.md
```

## Files Updated

```text
src/components/TopUpModal.tsx
src/App.tsx
src/lib/i18n.ts
```

## Install Dependencies

Your main project package needs these dependencies:

```bash
npm install stripe @supabase/supabase-js
npm install -D @vercel/node
```

## Environment Variables

Copy `.env.example` into `.env.local` locally, then configure the same values in Vercel.

```bash
APP_URL=http://localhost:5173

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

DEMO_USER_ID=your-supabase-auth-user-id
```

## Supabase Setup

1. Create a Supabase project.
2. Create one test user in Supabase Auth.
3. Copy that user UUID into `DEMO_USER_ID`.
4. Run this migration:

```text
supabase/migrations/002_stripe_topup_wallet.sql
```

5. Insert a wallet for the demo user if not auto-created:

```sql
insert into public.wallets (user_id, balance_points)
values ('YOUR_DEMO_USER_ID', 0)
on conflict (user_id) do nothing;
```

## Stripe Setup

1. Go to Stripe Dashboard.
2. Use Test Mode.
3. Get `STRIPE_SECRET_KEY`.
4. Create webhook endpoint:

```text
https://your-domain.com/api/stripe/webhook
```

5. Listen to:

```text
checkout.session.completed
checkout.session.expired
```

6. Copy webhook signing secret into:

```text
STRIPE_WEBHOOK_SECRET
```

## Local Webhook Testing

Install Stripe CLI, then run:

```bash
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Copy the `whsec_...` secret into `.env.local`.

## Flow

```text
TopUpModal
→ /api/stripe/create-checkout-session
→ Supabase payment_orders pending
→ Stripe Checkout
→ /payment/success or /payment/cancel
→ Stripe webhook
→ verify signature
→ payment_orders paid
→ wallets balance_points updated
→ wallet_transactions inserted
```

## Important

The success page does **not** credit points.  
Only the Stripe webhook credits points.

This prevents:
- fake success redirects
- double credit
- user-side wallet manipulation
- localStorage balance tampering

## Production Notes

This V1 uses `DEMO_USER_ID` because the current demo project does not yet have real user login wired into the payment flow.

Before live launch, replace demo user handling with:

```text
Supabase Auth session
server-side user verification
wallet balance fetched from Supabase
localStorage wallet removed for production
```

Recommended next step:

```text
Supabase Auth Wallet Sync V1
```
