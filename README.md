# Education in Portugal

A premium editorial guide for families comparing schools, activities, tutors, and education opportunities across Portugal. The application is built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Local development

Requirements:

- Node.js 20.9 or newer
- pnpm 11.9

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Supabase configuration and migration instructions are documented in
[`docs/supabase.md`](docs/supabase.md).

## Verification

```bash
pnpm typecheck
pnpm build
```

The production server can be checked locally with:

```bash
pnpm start
```

## Vercel deployment

Import `ano4l/Portugal` into Vercel and keep the detected Next.js defaults:

- Framework preset: Next.js
- Install command: `pnpm install`
- Build command: `pnpm build`
- Output directory: managed by Next.js
- Node.js: 20.x or newer

The public site builds without secrets. To activate shared editorial content,
lead tracking, and admissions email delivery, configure the variables documented
in `.env.example` for Production and Preview.

```text
RESEND_API_KEY=
ENQUIRY_FROM_EMAIL=
INTERNATIONAL_SHARING_SCHOOL_ENQUIRY_EMAIL=
CONTACT_EMAIL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`ENQUIRY_FROM_EMAIL` must use a sender/domain verified in Resend. Without the email variables, the enquiry endpoint intentionally returns `DELIVERY_NOT_CONFIGURED`; it never pretends that an enquiry was sent.

Vercel Web Analytics is enabled automatically in Vercel deployments.

## Application structure

- `app/` contains App Router pages, metadata, legal pages, and the enquiry API.
- `features/content/` contains published-content queries and fallback data.
- `features/admin/` contains the authenticated Editorial Studio workspace.
- `features/schools/` contains the directory, map, listings, and school enquiries.
- `features/jobs/` contains recruitment search and job interfaces.
- `features/leads/` contains server-side lead capture.
- `features/site/` contains shared public-site sections and navigation.
- `features/shared/` contains cross-feature utilities such as analytics.
- `lib/supabase/` contains the browser, server, and session-refresh clients.
- `supabase/migrations/` contains versioned database and storage setup.
- `docs/` contains operational setup documentation.
- `public/education/` contains localized production photography and magazine assets.
