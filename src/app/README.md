# Frontend Structure Split V1

This version separates the entry points for the public player platform and the admin platform while keeping the current demo business logic intact.

## Routes

- `/` renders `src/app/player/PlayerPlatform.tsx`
- `/admin` renders `src/app/admin/AdminPlatform.tsx` and opens the Admin Control Center by default

## Structure

```txt
src/app/
├─ player/
│  └─ PlayerPlatform.tsx
├─ admin/
│  └─ AdminPlatform.tsx
└─ shared/
   └─ PlayerAdminDemoShell.tsx
```

## Next refactor

The next step can gradually move state, helpers, and UI sections from `PlayerAdminDemoShell.tsx` into dedicated modules:

- `src/app/shared/usePlatformDemoState.ts`
- `src/app/shared/platformStorage.ts`
- `src/app/player/components/*`
- `src/app/admin/components/*`
