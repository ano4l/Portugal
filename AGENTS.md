# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router application. Route entry points, metadata, legal pages, and APIs live in `app/`. Product code is grouped by responsibility under `features/`: `content`, `schools`, `jobs`, `leads`, `site`, and `shared`. Supabase infrastructure helpers live in `lib/supabase/`, versioned SQL lives in `supabase/migrations/`, and production imagery is local under `public/education/`.

## Build, Test, and Development Commands

- `pnpm install` installs the locked dependency graph.
- `pnpm dev` starts the local Next.js development server.
- `pnpm typecheck` runs strict TypeScript checking without emitting files.
- `pnpm build` creates the production build and validates all routes.
- `pnpm start` serves an existing production build.

There is no automated unit-test suite in this repository. Treat `pnpm typecheck` and `pnpm build` as the required code checks, then manually verify the affected route and responsive states.

## Coding Style & Naming Conventions

TypeScript strict mode is enabled. Follow the established formatting: double quotes, no semicolons, two-space indentation, and trailing commas in multiline structures. Use PascalCase for React components, camelCase for functions and state, and kebab-case filenames. Keep server-rendered pages as the default; add `"use client"` only to interactive leaves. Reuse the existing Lucide icon family and the motion/reduced-motion conventions in `features/`.

## Deployment & Environment

Next.js is deployed with Vercel defaults. Email delivery requires the variables documented in `.env.example`; never commit real credentials. The enquiry API must preserve honest delivery status and must not report success when Resend is unconfigured.

## Commit & Pull Request Guidelines

The remote history contains only an initial repository commit, so no mature convention exists. Use concise, imperative commit subjects that describe the shipped outcome. Pull requests should summarize user-facing changes and include desktop/mobile evidence for visual work.
