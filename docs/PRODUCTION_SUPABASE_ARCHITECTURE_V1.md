# Production Supabase Architecture V1

This document defines the production direction for Jomluffyz TCG. The current demo still uses localStorage for wallet, vault, transactions, pack stock and rewards. Production must move these records to Supabase and make the backend the source of truth.

## Production principle

Frontend only displays data and sends user actions. Supabase PostgreSQL, RLS, server-side functions and payment webhooks must control all trusted data.

Never trust the browser for:

- Wallet balance
- Pack stock
- Pack opening result
- Vault card ownership
- Marketplace listing status
- Auction bid status
- Payment status
- Shipping status
- Rewards and raffle tickets

## Core tables

Recommended production tables:

- `profiles`
- `wallets`
- `wallet_transactions`
- `packs`
- `pack_openings`
- `vault_cards`
- `marketplace_listings`
- `auction_listings`
- `auction_bids`
- `shipping_requests`
- `payment_orders`
- `quest_progress`
- `raffle_entries`
- `admin_audit_logs`

## Role model

Recommended roles:

- `player`
- `admin`
- `owner`

Players can only read and act on their own data. Admins can manage packs, shipping, disputes, auctions and support actions. Owners can access revenue, payment and audit reports.

## RLS direction

Every user-owned table must include `user_id uuid references auth.users(id)`. RLS should allow:

- User can select their own rows.
- User cannot directly update wallet balance.
- User cannot directly insert vault cards.
- User cannot directly mark payment as paid.
- Admin role can update controlled operational fields.
- All money, point, card and shipping updates must be done by server-side functions.

## Trusted flows

### Top Up

1. Player creates a payment order.
2. Backend creates a gateway checkout session.
3. Payment gateway sends webhook.
4. Backend verifies webhook signature.
5. Backend marks payment order as paid.
6. Backend credits wallet through `wallet_transactions`.

### Pack Opening

1. Player requests open pack.
2. Backend checks wallet balance and pack stock.
3. Backend deducts points.
4. Backend generates server-side card result.
5. Backend writes `pack_openings` and `vault_cards`.
6. Frontend reveals returned result.

### Sell Back

1. Player requests sell back.
2. Backend checks card ownership and status.
3. Backend removes or marks vault card as sold back.
4. Backend credits wallet transaction.

### Shipping

1. Player requests shipping.
2. Backend checks ownership and card status.
3. Backend locks card.
4. Backend creates `shipping_requests` row.
5. Admin updates fulfillment status.

### Marketplace

1. Player lists owned card.
2. Backend locks card from sell back / shipping.
3. Buyer purchases with points.
4. Backend transfers card ownership and writes ledger transactions.

## Migration path from demo

Step 1: Keep UI but replace localStorage loaders with Supabase reads.
Step 2: Replace localStorage writes with server-side RPC / Edge Functions.
Step 3: Move wallet, opening and marketplace actions to server authority.
Step 4: Add admin audit logs.
Step 5: Only then connect live payment gateway.

