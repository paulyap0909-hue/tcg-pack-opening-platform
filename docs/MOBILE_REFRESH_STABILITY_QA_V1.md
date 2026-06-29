# Mobile Refresh Stability QA V1

Fixes included in this package:

1. Pack cover restore bug
   - Player pack storage key moved from `tcg-platform-packs-v5` to `tcg-platform-packs-v6`.
   - Stored default packs restore their original pack cover instead of being replaced by generic inferred covers.

2. BGM refresh stability
   - BGM files are no longer preloaded during audio warmup.
   - SFX warmup remains lightweight.
   - `desiredBgmName` prevents lobby / packs BGM from fighting after pull refresh, focus or pageshow events.
   - Pointer/touch repeated BGM loop listeners were removed.

3. Production Supabase architecture
   - Added schema draft under `supabase/migrations/001_production_core_schema.sql`.
   - Added architecture notes under `docs/PRODUCTION_SUPABASE_ARCHITECTURE_V1.md`.

4. Payment gateway integration direction
   - Added `docs/PAYMENT_GATEWAY_INTEGRATION_V1.md`.
   - Added `.env.example` placeholders.

Manual QA:

- Open website on mobile.
- Enter Home, Packs, Auction, Rewards.
- Pull-refresh on Home and Packs.
- Confirm pack covers remain GREAT / ULTRA / MASTER and do not change to generic deck covers.
- Turn sound on, move Home -> Packs -> Home, then pull-refresh.
- Confirm BGM does not overlap or restart multiple tracks.
- Run `npm run build` and `npm run preview`.
