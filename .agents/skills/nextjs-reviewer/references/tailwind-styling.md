# Tailwind CSS Styling Review Reference

This reference establishes standards for reviewing Tailwind CSS in Next.js applications, covering class composition, modern Tailwind v4 configuration, responsive design, and maintainability.

---

## 1. Modern Tailwind Architecture (Tailwind v4 vs v3)

In Tailwind CSS v4:
- The configuration moves from `tailwind.config.js` into CSS files using `@import "tailwindcss";` and the `@theme` directive.
- Colors, fonts, and radii map directly to CSS variables.

### Using Semantic Theme Tokens
Avoid hardcoded utility colors (like `bg-white dark:bg-black`) when semantic tokens are configured in `@theme`:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}
```

### ❌ Anti-pattern: Hardcoded Colors & Magic Hex Values
```tsx
// ❌ Hardcoded values break theme switches and dark mode consistency
<div className="bg-[#ffffff] text-[#09090b] border-[#e4e4e7] dark:bg-[#09090b] dark:text-[#fafafa]">
```

### ✅ Solution: Semantic Theme Classes
```tsx
// ✅ Adapts automatically to light/dark themes defined in @theme
<div className="bg-card text-card-foreground border border-border">
```

---

## 2. Dynamic Class Merging with `cn()` (`clsx` + `tailwind-merge`)

Whenever a component accepts an external `className` prop or applies conditional styles, use a `cn(...)` utility helper.

### Why Template Strings Fail:
Template strings cause CSS cascade conflicts because Tailwind utilities have identical CSS specificity:
```tsx
// ❌ Bug: 'p-6' will clash with 'p-4'; CSS order in stylesheet decides winner!
<button className={`p-4 ${isLarge ? 'p-6' : ''} ${className}`}>
```

### ✅ Standard `cn()` Implementation
```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### ✅ Proper Component Class Merging
```tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-colors shadow-sm',
        variant === 'default' && 'bg-card text-card-foreground border-border',
        variant === 'muted' && 'bg-muted text-muted-foreground border-transparent',
        className // Allows caller to override classes safely (e.g. p-8 or shadow-lg)
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

---

## 3. Responsive Design Rules

### Mobile-First Methodology
Always design for mobile viewports first, then apply progressive breakpoint modifiers (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).

```tsx
// ❌ Anti-pattern: Desktop-first mental model with negative overrides
<div className="grid-cols-4 md:grid-cols-2 max-sm:grid-cols-1">

// ✅ Correct Pattern: Mobile-first progression
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

### Breakpoint Conventions:
- Base: `320px+` (Mobile phone default)
- `sm:` `640px+` (Large phones / small tablets)
- `md:` `768px+` (Tablets / small laptops)
- `lg:` `1024px+` (Desktop screens)
- `xl:` `1280px+` (Wide screens)
- `2xl:` `1536px+` (Extra wide monitors)

---

## 4. Class Ordering & Readability

Follow a predictable, logical sequence when organizing long utility strings:

1. **Layout / Display**: `flex`, `grid`, `inline-block`, `hidden`
2. **Positioning**: `relative`, `absolute`, `top-0`, `z-10`
3. **Box Model & Sizing**: `w-full`, `max-w-xl`, `h-12`, `p-4`, `m-auto`, `space-y-4`
4. **Typography**: `font-sans`, `text-lg`, `font-semibold`, `tracking-wide`, `text-center`
5. **Visuals (Colors, Borders, Effects)**: `bg-primary`, `text-primary-foreground`, `border`, `rounded-lg`, `shadow-md`
6. **Transitions & Interactivity**: `cursor-pointer`, `transition-all`, `duration-200`, `hover:bg-primary/90`, `focus-visible:ring-2`

```tsx
// ✅ Well-ordered, readable component
<button
  className="inline-flex items-center justify-center relative z-0 h-10 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
>
  Click Me
</button>
```

---

## 5. Anti-Patterns to Flag

### ❌ Arbitrary Magic Values
Flag arbitrary values like `w-[347px]` or `text-[13px]` when standard tokens exist:
- Use `w-80` or `max-w-sm` instead of `w-[347px]`.
- Use `text-xs` (12px) or `text-sm` (14px) instead of `text-[13px]`.
*Exception: Truly unique third-party SVGs or specific canvas dimensions.*

### ❌ Abusing `@apply` in CSS Files
Do not create bloated custom CSS classes with `@apply`.
- `@apply` defeats the purpose of utility CSS and bloats the output bundle.
- Instead, encapsulate repeated styles in reusable React components (`<Button>`, `<Badge>`).

### ❌ Duplicate or Contradicting Utilities
Watch for mutually exclusive classes in the same element:
- `flex inline-flex`
- `block hidden`
- `p-4 px-2` (use `py-4 px-2` or let `cn()` merge)
