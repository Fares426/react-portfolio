---
name: nextjs-reviewer
description: >-
  Expert code review and auditing skill for Next.js App Router applications,
  TypeScript strict mode compliance, and Tailwind CSS styling rules. Activate
  this skill when reviewing, auditing, refactoring, or writing Next.js code to
  enforce server/client component boundaries, async dynamic APIs, strict type
  safety, responsive design, and modern Tailwind patterns.
---

# Next.js Reviewer: App Router, TypeScript & Tailwind

The `nextjs-reviewer` skill provides an automated and systematic review protocol for Next.js projects. It enforces modern App Router architecture, TypeScript strict-mode adherence, and clean, scalable Tailwind CSS styling practices.

---

## When to Activate This Skill

Activate this skill whenever:
- Reviewing pull requests, commits, or changed files in a Next.js App Router codebase.
- Auditing existing components, pages, layouts, or route handlers.
- Refactoring components from Pages Router or legacy Next.js patterns to modern App Router.
- Verifying TypeScript code for strictness (no `any`, explicit props, strict null safety).
- Inspecting Tailwind CSS markup for responsive design, dark mode compatibility, class sorting, and proper `cn()` merging.
- Debugging Next.js 15+ / 16+ breaking changes (such as asynchronous `params`, `searchParams`, `cookies()`, and `headers()`).

---

## 5-Phase Review Protocol

When invoked, execute the review following these 5 structured phases:

```
┌────────────────────────────────────────────────────────┐
│  Phase 1: Environment & Project Setup Discovery        │
│  - Inspect package.json (Next.js version, Tailwind v3/4)│
│  - Check tsconfig.json (strict flags, path aliases)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Phase 2: Next.js App Router Architecture Review       │
│  - Server vs. Client boundaries & composition          │
│  - Async dynamic APIs (params, cookies, headers)       │
│  - Streaming, Suspense & parallel data fetching        │
│  - Server Actions & Route Handlers validation          │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Phase 3: TypeScript Strict Mode Enforcement           │
│  - Zero `any` policy & proper type narrowing           │
│  - Strict null/undefined handling & non-null assertions│
│  - Explicit interfaces for Props, State & Async params │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Phase 4: Tailwind CSS & Design System Review          │
│  - Dynamic class merging using `cn()` (clsx + twMerge) │
│  - Mobile-first responsive hierarchy & dark variants   │
│  - Semantic theme tokens vs arbitrary values           │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  Phase 5: Automated Verification & Report Generation   │
│  - Run audit script: `node scripts/audit.mjs`          │
│  - Run compiler check: `npx tsc --noEmit`              │
│  - Deliver structured findings with Before/After diffs │
└────────────────────────────────────────────────────────┘
```

---

## Detailed Reference Documentation

To keep context efficient, deep architectural rules and detailed examples are stored in dedicated references. Consult each reference as needed during review:

1. **Next.js App Router Guide**: [references/nextjs-app-router.md](./references/nextjs-app-router.md)
   - Server vs. Client component placement & leaf-node strategy.
   - Next.js 15+ async `params`, `searchParams`, `cookies()`, and `headers()`.
   - Streaming architecture (`Suspense`, `loading.tsx`, `error.tsx`).
   - Server Actions security, input validation, and mutation patterns.
   - Image & Font optimization conventions (`next/image`, `next/font`).

2. **TypeScript Strict Mode Guide**: [references/typescript-strict.md](./references/typescript-strict.md)
   - Eliminating `any`, `as any`, and unsafe type assertions.
   - Strict typing for App Router pages, layouts, and route contexts.
   - Discriminated unions for UI and network state modeling.
   - Exhaustive checking and strict null safety.

3. **Tailwind Styling Guide**: [references/tailwind-styling.md](./references/tailwind-styling.md)
   - Tailwind v4 `@theme` and CSS variable token integration.
   - Safe conditional styling with `clsx` and `tailwind-merge`.
   - Mobile-first breakpoints and accessibility-compliant dark mode.
   - Flagging anti-patterns: arbitrary values, CSS `@apply` abuse, class clashes.

4. **Reviewer Checklist & Scorecard**: [references/review-checklist.md](./references/review-checklist.md)
   - High-speed scoring checklist for pull requests and code audits.
   - Quick issue classification table (Critical, Warning, Suggestion).

---

## Automated Verification Tools

Run the included automated audit script to immediately identify common static violations across components:

```bash
# Run the automated Next.js reviewer audit script
node .agents/skills/nextjs-reviewer/scripts/audit.mjs

# Run TypeScript type check in strict mode
npx tsc --noEmit

# Run project linter
npm run lint
```

Refer to [scripts/audit.mjs](./scripts/audit.mjs) for customization of pattern rules.

---

## Findings Reporting Standard

When providing review feedback, structure every finding using this format:

### `[SEVERITY] <Short Description>`
- **Location**: `[filepath:line](file:///path/to/file#L123)`
- **Category**: `App Router` | `TypeScript` | `Tailwind`
- **Violation**: Clear explanation of why this code violates best practices or causes bugs.
- **Remediation**: Concrete recommendation.
- **Diff / Code Example**:
```tsx
// ❌ Before (Anti-pattern)
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}

// ✅ After (Recommended)
type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### Severity Definitions:
- **`[CRITICAL]`**: Bugs, security issues, runtime crashes (e.g. unawaited async params in Next.js 15+, client credential leaks, `'use client'` on sensitive data files).
- **`[WARNING]`**: Performance bottlenecks, bundle bloat, anti-patterns (e.g. `'use client'` at root layout, missing `cn()` on dynamic classes, use of `any`).
- **`[SUGGESTION]`**: Clean code improvements, minor Tailwind ordering, readability enhancements.
