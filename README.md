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

The public site builds without secrets. To activate admissions enquiry delivery, configure these Vercel environment variables for Production and Preview:

```text
RESEND_API_KEY=
ENQUIRY_FROM_EMAIL=
INTERNATIONAL_SHARING_SCHOOL_ENQUIRY_EMAIL=
```

`ENQUIRY_FROM_EMAIL` must use a sender/domain verified in Resend. Without the email variables, the enquiry endpoint intentionally returns `DELIVERY_NOT_CONFIGURED`; it never pretends that an enquiry was sent.

Vercel Web Analytics is enabled automatically in Vercel deployments.

## Application structure

- `app/` contains App Router pages, metadata, legal pages, and the enquiry API.
- `components/education/` contains the production editorial UI and interactive client components.
- `lib/education-data.ts` is the shared school, job, and article content source.
- `public/education/` contains localized production photography and magazine assets.
