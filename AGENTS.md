<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# my-app — 家計簿 (Household Ledger)

Personal finance app: record income/expense, categories, monthly summaries, and charts. Each user sees only their own data (Supabase Auth + RLS).

**Repo:** `pokomaru-cell/my-app-` · **Supabase project:** `xcmnmvhneqxtwyucyuvw` (see `.cursor/rules/supabase-project.mdc`)

## Stack

TypeScript 5 strict · Next.js 16 App Router · React 19 · Supabase (`@supabase/ssr` + Postgres RLS) · Zod · shadcn/ui · Tailwind 4 · npm · ESLint

## Commands

```bash
npm install && npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Run lint + typecheck + build before commit when possible.

## Architecture (this repo)

```
app/
  page.tsx              # Dashboard: form, summary, charts, list
  login/page.tsx        # Email/password + Google OAuth
  auth/callback/        # OAuth code exchange
  actions/
    auth.ts             # signIn, signUp, signOut, getCurrentUser
    transactions.ts     # CRUD via Server Actions
  layout.tsx            # Root layout + AuthHeader

components/             # Feature UI (forms, charts, rows)
components/ui/          # shadcn/ui primitives

lib/
  auth/schema.ts        # Auth Zod schemas
  constants/categories.ts
  transactions/         # schema, parser, stats
  supabase/             # client, server, config, proxy session helper
  types/transaction.ts
  logger.ts

proxy.ts                # Next.js 16: session refresh + route protection (not middleware.ts)

supabase/
  schema.sql            # Reference schema
  migrations/           # Apply via Supabase MCP or SQL Editor
```

**Data flow:** UI → Server Actions → `createSupabaseServerClient()` → `transactions` table (RLS filters by `auth.uid()` = `user_id`).

## Hard rules (short)

- No `any`. Auth via `supabase.auth.getUser()` (not `getSession()` alone).
- Never expose Service Role Key; only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the client.
- RLS on user data; policies must match `user_id`.
- Validate input with Zod (`lib/**/schema.ts`, parsers).
- Do not push to `main`; use feature branches + PR. Do not merge `main` without user approval.
- Do not commit `.env*` or secrets.
- Read Next.js 16 docs before changing routing, `proxy.ts`, or Server Actions.
- Prefer existing patterns over new libraries (approval required for new deps — see `code-standards.mdc`).

## Out of scope (unless user asks)

- Stripe billing, multi-tenant orgs, admin dashboards
- Express REST API layer (this app uses Server Actions, not separate API routes for CRUD)
- Bulk shadcn component installs
- TypeScript 7 / ESLint 10 (ecosystem not ready)

## Stack manifest

**Pack:** `nextjs-supabase` (see `.cursor/stack.json`). Shared rules live in [cursor-dev-templates](https://github.com/pokomaru-cell/cursor-dev-templates) under `stacks/nextjs-supabase/`.

## Cursor rules

**Always applied:** `stack`, `code-standards`, `tech-stack`, `security`, `git-workflow`, `github-cli`, `supabase-project` (under `.cursor/rules/`).

**Load when relevant:** `project-context`, `agent-workflow`, `nextjs-supabase-patterns`, `review-checklist`, `github-security`.

Copy `.env.example` → `.env.local` for local Supabase credentials (never commit `.env.local`).

## MCP

Supabase MCP is scoped in `.cursor/mcp.json`. Use project id `xcmnmvhneqxtwyucyuvw` for migrations and schema checks. Read the Supabase agent skill before auth/RLS/migration changes.

## Specialized review prompts

- `.cursor/agents/code-reviewer.md` — PR / diff review
- `.cursor/agents/security-auditor.md` — auth, RLS, secrets
