# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router application. Route entry points, metadata, legal pages, and the enquiry API live in `app/`. The production site UI is isolated in `components/education/`; older prototype components elsewhere under `components/` are intentionally excluded from TypeScript compilation and should not be reused for the editorial experience. Shared school, job, and article content is defined in `lib/education-data.ts`, while interaction telemetry helpers live in `lib/analytics.ts`. Production imagery is local under `public/education/`.

## Build, Test, and Development Commands

- `pnpm install` installs the locked dependency graph.
- `pnpm dev` starts the local Next.js development server.
- `pnpm typecheck` runs strict TypeScript checking without emitting files.
- `pnpm build` creates the production build and validates all routes.
- `pnpm start` serves an existing production build.

There is no automated unit-test suite in this repository. Treat `pnpm typecheck` and `pnpm build` as the required code checks, then manually verify the affected route and responsive states.

## Coding Style & Naming Conventions

TypeScript strict mode is enabled. Follow the established formatting: double quotes, no semicolons, two-space indentation, and trailing commas in multiline structures. Use PascalCase for React components, camelCase for functions and state, and kebab-case filenames. Keep server-rendered pages as the default; add `"use client"` only to interactive leaves. Reuse the existing Lucide icon family and the motion/reduced-motion conventions in `components/education/`.

## Deployment & Environment

Next.js is deployed with Vercel defaults. Email delivery requires the variables documented in `.env.example`; never commit real credentials. The enquiry API must preserve honest delivery status and must not report success when Resend is unconfigured.

## Commit & Pull Request Guidelines

The remote history contains only an initial repository commit, so no mature convention exists. Use concise, imperative commit subjects that describe the shipped outcome. Pull requests should summarize user-facing changes and include desktop/mobile evidence for visual work.
