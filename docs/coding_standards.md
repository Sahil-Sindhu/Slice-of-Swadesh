# Slice of Swadesh - Coding Standards & Style Guide

To maintain production-grade quality, follow these guidelines across all workspaces.

## Clean Code & SOLID Principles
1. **Single Responsibility**: Every component, function, or controller must do exactly one thing.
2. **Open/Closed**: Software entities should be open for extension but closed for modification.
3. **No Placeholders**: Never leave temporary placeholder text, console logs, or mock bypasses in production code.

## TypeScript Standards
- Enable `strict` compilation mode.
- Avoid using `any`. Use descriptive interfaces or unknown utility generics where typing is dynamic.
- Prefer interface extension over type unions where appropriate.

## React & Next.js App Router
- Use Server Components by default. Keep client interactive scripts contained within nested components marked with `"use client"`.
- Centralize shared UI in `components/ui/` with clear accessible labels.
- Manage persistent global layouts (navbar/footer) in root `(customer)` layouts.

## Directory Structure Naming
- Use camelCase for functions and variables.
- Use PascalCase for React component names and TypeScript interfaces.
- Use feature-based sub-folders (e.g., `src/features/orders/`, `src/features/auth/`) to group pages, endpoints, and helpers together.
