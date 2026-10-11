# TypeScript Strict Mode Review Reference

This reference outlines strict TypeScript requirements, type-safety patterns, and anti-patterns to enforce during Next.js code reviews.

---

## 1. Compiler Configuration Standards

A compliant Next.js project must have `"strict": true` enabled in `tsconfig.json`.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Recommended enterprise-grade flags:
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 2. Zero `any` Policy & Safe Alternatives

Using `any` disables TypeScript's type checker and is treated as a **`[CRITICAL]`** or **`[WARNING]`** violation in reviews.

### ❌ Anti-pattern: Using `any`
```ts
// ❌ Violations
function processData(data: any) {
  return data.user.name;
}

const res: any = await fetch('/api/user');
```

### ✅ Solution 1: Use `unknown` with Type Guards
```ts
function isUser(data: unknown): data is { user: { name: string } } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in data &&
    typeof (data as { user: unknown }).user === 'object' &&
    (data as { user: { name?: unknown } }).user !== null &&
    typeof (data as { user: { name?: unknown } }).user.name === 'string'
  );
}

function processData(data: unknown) {
  if (isUser(data)) {
    return data.user.name; // Type-safe!
  }
  throw new Error('Invalid user payload');
}
```

### ✅ Solution 2: Schema Validation with Zod
```ts
import { z } from 'zod';

const UserSchema = z.object({
  user: z.object({
    name: z.string(),
  }),
});

type UserPayload = z.infer<typeof UserSchema>;

function processData(rawData: unknown): string {
  const result = UserSchema.safeParse(rawData);
  if (!result.success) {
    throw new Error('Validation failed');
  }
  return result.data.user.name;
}
```

---

## 3. Ban Unsafe Type Assertions (`as` Casting)

Type assertions (`foo as TargetType`) bypass compiler checks and lead to runtime crashes if the data shape changes.

### ❌ Anti-pattern: Blind Casting
```ts
// ❌ Unsafe cast: fails at runtime if API returns null or changes fields
const user = (await response.json()) as User;
```

### ✅ Solution: Validate at Boundary or Narrow Types
```ts
// ✅ Parse and validate at runtime boundary
const raw = await response.json();
const user = UserSchema.parse(raw);
```

### ❌ Anti-pattern: Non-Null Assertion Operator (`!`)
```ts
// ❌ Non-null assertion can cause Cannot read properties of undefined
const button = document.getElementById('submit')!;
button.click();
```

### ✅ Solution: Explicit Null Handling
```ts
// ✅ Guard condition
const button = document.getElementById('submit');
if (button) {
  button.click();
}
```

---

## 4. Next.js App Router Typing Patterns

### Page and Layout Component Props
In Next.js 15+, `params` and `searchParams` are asynchronous `Promise` types.

```tsx
// src/app/projects/[slug]/page.tsx
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Project: ${slug}`,
  };
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  return (
    <div>
      <h1>Project: {slug}</h1>
      <p>Active Tab: {Array.isArray(tab) ? tab[0] : (tab ?? 'overview')}</p>
    </div>
  );
}
```

### Layout Component Props
```tsx
// src/app/(dashboard)/layout.tsx
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  return (
    <div lang={locale ?? 'en'} className="min-h-screen">
      {children}
    </div>
  );
}
```

---

## 5. UI & State Modeling: Discriminated Unions

Avoid bag-of-booleans state models (e.g. `isLoading`, `isError`, `data`). Use discriminated unions to make invalid states unrepresentable.

### ❌ Anti-pattern: Bag of Booleans
```ts
// ❌ Allows impossible states: isLoading: true AND isError: true AND data: {...}
interface FetchState<T> {
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  data?: T;
}
```

### ✅ Solution: Discriminated Union
```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Exhaustive switch handling
function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <Display data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
    default: {
      const _exhaustiveCheck: never = state;
      return _exhaustiveCheck;
    }
  }
}
```

---

## 6. Extending Native Component Props

When creating reusable UI components (e.g. Buttons, Inputs), always extend standard React HTML element attributes and support refs cleanly:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={...}
      {...props}
    >
      {isLoading ? <Spinner /> : leftIcon}
      {children}
    </button>
  );
}
```
