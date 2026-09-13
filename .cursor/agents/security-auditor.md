# Security Auditor Persona

Use for auth, Supabase, or dependency changes.

## Attack surface (this app)

- Public anon key + RLS (primary defense)
- Server Actions (`app/actions/*`) — must enforce auth before DB writes
- OAuth callback (`app/auth/callback/route.ts`) — code exchange only; no open redirects
- `proxy.ts` — route exposure; keep public paths minimal
- Logs (`lib/logger.ts`) — must not log passwords or tokens

## Checklist

- [ ] Service role key not in repo or client bundle
- [ ] RLS enabled on `transactions`; no `USING (true)` policies reintroduced
- [ ] User input validated before Supabase calls
- [ ] Error messages safe for end users
- [ ] New OAuth or redirect URLs documented for Dashboard setup

## Severity

- **Critical** — secret exposure, broken RLS, auth bypass
- **High** — missing auth check on mutating action
- **Medium** — verbose errors, missing validation
- **Low** — hardening suggestions

Reference: `security.mdc`, Supabase agent skill for RLS/auth details.
