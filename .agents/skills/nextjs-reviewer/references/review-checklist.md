# Next.js Reviewer Checklist & Scorecard

Use this scorecard during pull request audits and code reviews to verify compliance across all three pillars.

---

## 1. Next.js App Router Checklist

| Item | Check Description | Severity | Status |
| :--- | :--- | :---: | :---: |
| **RSC-01** | Are components Server Components by default? | `[WARNING]` | [ ] |
| **RSC-02** | Is `'use client'` kept at leaf nodes rather than layouts or route roots? | `[CRITICAL]` | [ ] |
| **RSC-03** | Are Server Components passed as `children` to Client Components where appropriate? | `[WARNING]` | [ ] |
| **ASYNC-01** | Are `params` and `searchParams` handled as `Promise` and awaited (Next.js 15+)? | `[CRITICAL]` | [ ] |
| **ASYNC-02** | Are `cookies()` and `headers()` calls awaited asynchronously? | `[CRITICAL]` | [ ] |
| **FETCH-01** | Are independent data fetches run in parallel via `Promise.all`? | `[WARNING]` | [ ] |
| **FETCH-02** | Are slow data sections wrapped in `<Suspense fallback={<Skeleton />}>`? | `[WARNING]` | [ ] |
| **ACT-01** | Do Server Actions validate input with schemas (e.g. Zod)? | `[CRITICAL]` | [ ] |
| **ACT-02** | Do Server Actions return structured `{ success, data, error }` instead of raw exceptions? | `[WARNING]` | [ ] |
| **ROUTE-01** | Is `error.tsx` declared with `'use client'`? | `[CRITICAL]` | [ ] |
| **OPT-01** | Are internal page transitions handled via `<Link>` instead of `<a>`? | `[WARNING]` | [ ] |
| **OPT-02** | Are images rendered using `next/image` with explicit sizes, alt text, and LCP priority? | `[WARNING]` | [ ] |

---

## 2. TypeScript Strict Mode Checklist

| Item | Check Description | Severity | Status |
| :--- | :--- | :---: | :---: |
| **TS-01** | Is `any` completely avoided, using `unknown` + narrowing or generics instead? | `[CRITICAL]` | [ ] |
| **TS-02** | Are unsafe casts (`as any`, blind `as Type`) replaced by runtime validation/guards? | `[CRITICAL]` | [ ] |
| **TS-03** | Is the non-null assertion operator (`!`) avoided in favor of runtime checks? | `[WARNING]` | [ ] |
| **TS-04** | Do all components have explicit, well-named interface props? | `[WARNING]` | [ ] |
| **TS-05** | Are complex asynchronous states modeled with discriminated unions? | `[SUGGESTION]` | [ ] |
| **TS-06** | Are switch statements over union types handled with exhaustive `never` checks? | `[SUGGESTION]` | [ ] |
| **TS-07** | Does `npx tsc --noEmit` pass with zero errors under `"strict": true`? | `[CRITICAL]` | [ ] |

---

## 3. Tailwind CSS & Styling Checklist

| Item | Check Description | Severity | Status |
| :--- | :--- | :---: | :---: |
| **TW-01** | Are dynamic or overridable classes merged using `cn()` (`clsx` + `tailwind-merge`)? | `[CRITICAL]` | [ ] |
| **TW-02** | Are responsive utilities ordered mobile-first (`base` -> `sm:` -> `md:` -> `lg:`)? | `[WARNING]` | [ ] |
| **TW-03** | Are semantic theme tokens (`bg-background`, `text-foreground`) used over raw hex values? | `[WARNING]` | [ ] |
| **TW-04** | Are dark mode variants (`dark:...`) consistently paired with light styles? | `[WARNING]` | [ ] |
| **TW-05** | Are arbitrary magic pixel values (`[342px]`, `[13px]`) avoided when theme scales exist? | `[SUGGESTION]` | [ ] |
| **TW-06** | Is CSS `@apply` avoided in favor of utility classes in React components? | `[SUGGESTION]` | [ ] |
| **TW-07** | Are class strings organized logically (layout -> spacing -> typography -> colors)? | `[SUGGESTION]` | [ ] |

---

## 4. Anti-Pattern Quick Remediation Index

### Anti-Pattern 1: Unawaited `params` in Next.js 15+
```tsx
// ❌ WRONG
export default function Page({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}

// ✅ RIGHT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}
```

### Anti-Pattern 2: String concatenation in className
```tsx
// ❌ WRONG
<div className={`p-4 rounded ${isActive ? 'bg-primary p-6' : 'bg-muted'}`}>

// ✅ RIGHT
<div className={cn('p-4 rounded', isActive ? 'bg-primary p-6' : 'bg-muted')}>
```

### Anti-Pattern 3: Bypassing type safety with `any`
```tsx
// ❌ WRONG
const handleData = (data: any) => data.map((item: any) => item.id);

// ✅ RIGHT
interface Item {
  id: string;
  name: string;
}
const handleData = (data: Item[]) => data.map((item) => item.id);
```
