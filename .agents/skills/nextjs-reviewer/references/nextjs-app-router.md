# Next.js App Router Review Reference

This reference establishes the architectural rules and best practices for evaluating Next.js App Router implementations.

---

## 1. Server vs. Client Component Boundaries

### Core Principles
- **Default to Server Components (RSC)**: All components in the `app` directory are Server Components by default. Keep them as Server Components to reduce client JavaScript bundle size and enable direct, secure data access.
- **Push `'use client'` to the Leaves**: Place `'use client'` only at leaf components requiring browser interactivity, event listeners (`onClick`, `onChange`), React hooks (`useState`, `useEffect`), or browser APIs (`window`, `localStorage`).
- **Never Mark Layouts or Root Pages as Client**: Making a `layout.tsx` or top-level `page.tsx` a Client Component converts all its imported descendant components into client bundles.

### Composition Patterns
When an interactive client component needs to wrap server-rendered content, pass the Server Component via `children` or props:

```tsx
// ❌ Anti-pattern: Direct import of Server Component inside Client Component
'use client';
import ServerContent from './ServerContent'; // Forces ServerContent into client bundle!

export function Modal() {
  const [open, setOpen] = useState(false);
  return open ? <div><ServerContent /></div> : null;
}

// ✅ Correct Pattern: Pass Server Component as children
'use client';
import { useState, type ReactNode } from 'react';

export function Modal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && <div>{children}</div>}
    </div>
  );
}

// In parent Server Component (page.tsx):
export default function Page() {
  return (
    <Modal>
      <ServerContent /> {/* Rendered securely on server */}
    </Modal>
  );
}
```

### Preventing Data Leaks
Use `import 'server-only'` in any utility or module that accesses database credentials, private API keys, or internal services to prevent accidental inclusion in client bundles:

```ts
// src/lib/db.ts
import 'server-only';
export async function getSecretData() { ... }
```

---

## 2. Async Dynamic APIs (Next.js 15+ / 16 Breaking Changes)

In modern Next.js, dynamic parameters and request headers/cookies are **asynchronous promises**. Synchronous access triggers runtime warnings or build failures.

### Page and Layout `params` & `searchParams`
```tsx
// ❌ Anti-pattern (Synchronous access - Deprecated / Error in Next.js 15+)
interface PageProps {
  params: { slug: string };
  searchParams: { tab?: string };
}
export default function Page({ params, searchParams }: PageProps) {
  return <h1>Post: {params.slug}</h1>;
}

// ✅ Correct Pattern (Asynchronous Promises)
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tab } = await searchParams;
  return <h1>Post: {slug} (Tab: {tab ?? 'all'})</h1>;
}
```

### Asynchronous `cookies()` and `headers()`
```tsx
// ❌ Anti-pattern (Synchronous)
import { cookies, headers } from 'next/headers';
const cookieStore = cookies(); // Deprecated sync call

// ✅ Correct Pattern (Asynchronous)
import { cookies, headers } from 'next/headers';
const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;

const headerList = await headers();
const userAgent = headerList.get('user-agent');
```

---

## 3. Data Fetching, Streaming & Suspense

### Parallel Data Fetching
Avoid sequential request waterfalls. Initiate promises concurrently with `Promise.all`:

```tsx
// ❌ Anti-pattern: Waterfall requests
const user = await getUser(id);
const posts = await getPosts(id); // Waits for user to finish

// ✅ Correct Pattern: Parallel execution
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id)
]);
```

### Granular Suspense Boundaries
Wrap slow or streaming components in `<Suspense>` with skeleton fallbacks rather than blocking the entire route:

```tsx
import { Suspense } from 'react';
import { UserProfile, UserProfileSkeleton } from '@/components/UserProfile';
import { PostFeed, PostFeedSkeleton } from '@/components/PostFeed';

export default function DashboardPage() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile />
      </Suspense>
      <div className="md:col-span-2">
        <Suspense fallback={<PostFeedSkeleton />}>
          <PostFeed />
        </Suspense>
      </div>
    </main>
  );
}
```

### Modern Caching & Revalidation
- In Next.js 15+, `fetch` requests are not cached by default (`cache: 'no-store'`).
- Explicitly configure caching when data can be cached:
  ```ts
  // Static cached fetch
  fetch('https://api.example.com/data', { cache: 'force-cache' });

  // Time-based revalidation (ISR)
  fetch('https://api.example.com/data', { next: { revalidate: 3600 } });

  // Tag-based on-demand revalidation
  fetch('https://api.example.com/data', { next: { tags: ['portfolio-projects'] } });
  ```
- Trigger revalidation in Server Actions or Route Handlers:
  ```ts
  import { revalidateTag, revalidatePath } from 'next/cache';
  revalidateTag('portfolio-projects');
  revalidatePath('/projects');
  ```

---

## 4. Server Actions Best Practices

### Validation and Structured Error Responses
- Always mark server action files or functions with `'use server'`.
- Validate all incoming arguments using schemas (e.g. `zod`).
- Do NOT throw raw unhandled errors to the client; return structured status objects.

```ts
// src/actions/contact.ts
'use server';

import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; errors?: Record<string, string[]> };

export async function submitContactForm(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const validation = contactSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    // Send email or save to DB...
    return { success: true };
  } catch (err) {
    console.error('Failed to submit contact:', err);
    return { success: false, error: 'Internal server error' };
  }
}
```

---

## 5. Route Handlers (`app/api/**/route.ts`)

- Use `NextRequest` and `NextResponse`.
- Always return appropriate HTTP status codes.
- Type dynamic route context with `Promise<params>`.

```ts
// app/api/projects/[id]/route.ts
import { NextResponse, type NextRequest } from 'next/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const project = await findProjectById(id);

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: project });
}
```

---

## 6. Special App Router Files

- **`error.tsx`**: Must be a Client Component (`'use client'`). Must accept `{ error: Error & { digest?: string }; reset: () => void }`.
- **`loading.tsx`**: Instant loading state for a route segment using React Suspense.
- **`not-found.tsx`**: Rendered when `notFound()` is invoked.
- **`layout.tsx`**: Preserves state and does not re-render across navigation; must accept `children: React.ReactNode`.

---

## 7. Optimization Conventions

### Images (`next/image`)
- Always use `next/image` over raw `<img>`.
- Specify explicit `width` and `height`, or use `fill` with a positioned parent (`relative`).
- Always provide descriptive, accessible `alt` text.
- Add `priority` to Largest Contentful Paint (LCP) images (e.g. Hero banners).

### Links (`next/link`)
- Use `<Link href="...">` for internal routing. Avoid raw `<a>` tags for internal pages.
- Avoid manual imperative navigation (`router.push`) when a standard declarative `<Link>` suffices.
