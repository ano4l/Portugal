# Supabase setup

Supabase provides editorial authentication, structured content, lead tracking,
and media storage. The application falls back to `features/content/fallback-data.ts` when
Supabase is unavailable or contains no published records.

## Environment

Copy `.env.example` to `.env.local` and provide:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The publishable key is safe for browser use. The service-role key is server-only
and must never be committed or exposed through a `NEXT_PUBLIC_` variable.

AI-assisted Portuguese translation additionally requires:

```text
OPENAI_API_KEY=
OPENAI_TRANSLATION_MODEL=gpt-5-mini
```

## Database

Apply migrations in filename order from `supabase/migrations/`. The initial
migration creates:

- editorial staff profiles;
- articles, schools, magazines, and jobs;
- leads and lead activity history;
- public image and magazine storage buckets;
- row-level security policies for public reads and staff-only mutations.

After creating the first Supabase Auth user, add its UUID to `staff_profiles`:

```sql
insert into public.staff_profiles (user_id, display_name, role)
values ('AUTH_USER_UUID', 'Editorial administrator', 'administrator');
```

## Code layout

- `lib/supabase/browser.ts` creates the browser client.
- `lib/supabase/server.ts` creates cookie-aware and service-role clients.
- `lib/supabase/proxy.ts` refreshes authentication cookies.
- `proxy.ts` applies session refresh to application requests.
- `features/content/published-content.ts` maps database records to website models.
- `features/leads/capture-lead.ts` records submissions using the server-only client.

## Verification

```bash
pnpm typecheck
pnpm build
```

Verify live publishing only after the migration, storage policies, staff profile,
and deployment environment variables are configured.
