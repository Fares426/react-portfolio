#!/usr/bin/env node

/**
 * Next.js Reviewer Automated Audit Script
 * Scans the project for violations of Next.js App Router, TypeScript strictness,
 * and Tailwind CSS styling rules.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TARGET_DIRS = ['src', 'app'].filter((dir) =>
  fs.existsSync(path.join(ROOT_DIR, dir))
);

if (TARGET_DIRS.length === 0) {
  console.log('⚠️ No `src` or `app` directory found. Running audit from root.');
  TARGET_DIRS.push('.');
}

const FILE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', '.agents']);

let totalFilesScanned = 0;
const findings = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (FILE_EXTENSIONS.has(ext)) {
        auditFile(fullPath);
      }
    }
  }
}

function addFinding({ file, line, severity, category, rule, message }) {
  const relPath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
  findings.push({ file: relPath, line, severity, category, rule, message });
}

function auditFile(filePath) {
  totalFilesScanned++;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileName = path.basename(filePath);
  const isLayout = fileName.startsWith('layout.');
  const isError = fileName.startsWith('error.');
  const isPage = fileName.startsWith('page.');
  const isRoute = fileName.startsWith('route.');

  // Check 1: Layout marked with 'use client'
  if (isLayout && (/^['"]use client['"]/m.test(content))) {
    addFinding({
      file: filePath,
      line: 1,
      severity: 'WARNING',
      category: 'App Router',
      rule: 'RSC-02',
      message: 'Layout file is marked with "use client". Layouts should remain Server Components; move client interactivity to leaf components.',
    });
  }

  // Check 2: error.tsx missing 'use client'
  if (isError && !(/^['"]use client['"]/m.test(content))) {
    addFinding({
      file: filePath,
      line: 1,
      severity: 'CRITICAL',
      category: 'App Router',
      rule: 'ROUTE-01',
      message: 'Next.js App Router error boundaries (error.tsx) MUST be Client Components ("use client").',
    });
  }

  // Check 3: Synchronous params in page/layout (Next.js 15+ breaking change check)
  if ((isPage || isLayout) && content.includes('params')) {
    // If page export is synchronous but takes params: export default function Page({ params }
    const syncPageRegex = /export\s+default\s+function\s+\w*\s*\(\s*\{[^}]*params[^}]*\}\s*:\s*\{[^}]*params\s*:\s*\{/g;
    if (syncPageRegex.test(content)) {
      addFinding({
        file: filePath,
        line: 1,
        severity: 'CRITICAL',
        category: 'App Router',
        rule: 'ASYNC-01',
        message: 'Params accessed synchronously in page/layout. In Next.js 15+, params is a Promise and must be typed as Promise<...> and awaited.',
      });
    }
  }

  // Line-by-line checks
  lines.forEach((lineText, idx) => {
    const lineNum = idx + 1;
    const trimmed = lineText.trim();

    // Ignore comments
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return;
    }

    // Check 4: Use of `any` type
    if (/:\s*any\b/.test(lineText) || /as\s+any\b/.test(lineText) || /<any>/.test(lineText)) {
      addFinding({
        file: filePath,
        line: lineNum,
        severity: 'CRITICAL',
        category: 'TypeScript',
        rule: 'TS-01',
        message: 'Forbidden use of "any" type. Use "unknown" with type guards or define explicit interfaces.',
      });
    }

    // Check 5: Raw <img> tags in JSX
    if (/<img\b[^>]*src=/.test(lineText)) {
      addFinding({
        file: filePath,
        line: lineNum,
        severity: 'WARNING',
        category: 'App Router',
        rule: 'OPT-02',
        message: 'Raw <img> tag detected. Use "next/image" for automatic resizing, WebP/AVIF formatting, and lazy loading.',
      });
    }

    // Check 6: Raw <a> tags for internal routing
    if (/<a\b[^>]*href=["']\/(?!_next|favicon|api)/.test(lineText)) {
      addFinding({
        file: filePath,
        line: lineNum,
        severity: 'WARNING',
        category: 'App Router',
        rule: 'OPT-01',
        message: 'Raw <a> tag used for internal route. Use "<Link href=...>" from "next/link" for client-side prefetching.',
      });
    }

    // Check 7: Template string class concatenation without cn() or clsx
    if (/className=\{`[^`]*\$\{[^}]+\}[^`]*`\}/.test(lineText)) {
      if (!lineText.includes('cn(') && !lineText.includes('twMerge(') && !lineText.includes('clsx(')) {
        addFinding({
          file: filePath,
          line: lineNum,
          severity: 'WARNING',
          category: 'Tailwind',
          rule: 'TW-01',
          message: 'Template literal used in className with dynamic interpolation. Use "cn(...)" (clsx + tailwind-merge) to avoid class conflicts.',
        });
      }
    }

    // Check 8: Arbitrary pixel values in Tailwind (e.g. w-[342px], text-[13px])
    const arbitraryPixelMatch = lineText.match(/(?:className=|[ '"])[^'"]*(?:w|h|text|p|m|gap|rounded)-\[(\d+px)\]/);
    if (arbitraryPixelMatch) {
      addFinding({
        file: filePath,
        line: lineNum,
        severity: 'SUGGESTION',
        category: 'Tailwind',
        rule: 'TW-05',
        message: `Arbitrary pixel value "${arbitraryPixelMatch[0].trim()}" detected. Prefer standard design system tokens or theme scales.`,
      });
    }
  });
}

// Execute scan
for (const target of TARGET_DIRS) {
  scanDirectory(path.join(ROOT_DIR, target));
}

// Print results
console.log('\n======================================================');
console.log('   Next.js Reviewer: App Router, TS & Tailwind Audit  ');
console.log('======================================================\n');
console.log(`Scanned ${totalFilesScanned} files across ${TARGET_DIRS.join(', ')}\n`);

if (findings.length === 0) {
  console.log('✅ No violations found! Code complies with all review rules.\n');
  process.exit(0);
}

const criticals = findings.filter((f) => f.severity === 'CRITICAL');
const warnings = findings.filter((f) => f.severity === 'WARNING');
const suggestions = findings.filter((f) => f.severity === 'SUGGESTION');

console.log(`Found ${findings.length} issue(s): ` +
  `${criticals.length} Critical, ${warnings.length} Warning, ${suggestions.length} Suggestion\n`);

findings.forEach((f) => {
  const icon = f.severity === 'CRITICAL' ? '🛑' : f.severity === 'WARNING' ? '⚠️' : '💡';
  console.log(`${icon} [${f.severity}] [${f.category}] (${f.rule})`);
  console.log(`   Location: ${f.file}:${f.line}`);
  console.log(`   ${f.message}\n`);
});

if (criticals.length > 0) {
  process.exitCode = 1;
}
