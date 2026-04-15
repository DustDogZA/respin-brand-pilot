

# Fix: "useAuth must be used within AuthProvider" on page load

## Root Cause

The `/login` route calls `useAuth()` (line 14 of `login.tsx`), but `AuthProvider` is only rendered inside `AppLayout` which wraps `_app.*` routes. The login page is a standalone route outside `_app`, so it has no `AuthProvider` ancestor.

The same issue affects the root `/` route — when unauthenticated users land on `/`, the `_app` layout's `AuthGate` tries to redirect to `/login`, but `/login` crashes because there's no `AuthProvider`.

## Fix

Move `AuthProvider` to the root layout (`__root.tsx`) so it wraps ALL routes, including `/login`. This way `useAuth()` works everywhere.

### `src/routes/__root.tsx`
- Import `AuthProvider` from `@/context/AuthContext`
- Wrap `<Outlet />` in `RootComponent` with `<AuthProvider>`

### `src/components/AppLayout.tsx`
- Remove the `<AuthProvider>` wrapper from `AppLayout` (it's now in root)
- `AuthGate` still calls `useAuth()` — this works because `AuthProvider` is above it in the tree

Two files changed. No logic changes, just moving the provider up the tree.

