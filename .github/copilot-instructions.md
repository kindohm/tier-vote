# repo summary

This repository contains a Next.js application for managing tiered voting systems, utilizing Firebase for backend services and Bootstrap for styling.

## code structure

The code is organized into several key directories and files:

- **`/app`**: Contains the main application pages, including the home page and API routes.
- **`/styles`**: Contains global styles and CSS modules for component-specific styling.
- **`/public`**: Contains static assets like images and icons.
- **`/lib`**: Contains all app components, hooks, and utilities.

Note: the `/lib` folder holds the meat of the application. `/app` is nothing but a
thin definition of routes.

### /app and /lib structure

The routes under `src/app` are thin wrappers around actual page components and logic.
For example, if there is an app route named "foo", we would expect this structure

- `src/app/foo/page.tsx`: a very thin wrapper that just renders a single `<FooPage />` component.
- `src/lib/foo-page/foo-page.tsx`: the actual foo page. exports `<FooPage />`
- `src/lib/foo-page/components`: holds any supporting components for FooPage.
- `src/lib/foo-page/hooks`: holds any specific hooks for FooPage
- `src/lib/foo-page/lib`: holds any specific utilities for FooPage

### shared code

Common utilities and hooks that are shared by _multiple_ routes or pages live in `src/lib` or `src/lib/shared`.
Note that reusable components live in `src/lib/components` directory.

When using the `shared` directory, follow this structure:

- `src/lib/shared` - shared utilities and hooks
- `src/lib/shared/hooks` - shared hooks
- `src/lib/shared/lib` - shared utilities and logic

## other documentation

Documentation about technical decisions, optimizations, and other architectural details can be found in the `docs` directory. This includes:

- **`PARTICIPANT_OPTIMIZATION.md`**: Details on how participant tracking was optimized.

## instructions for copilot

Try to re-use patterns that you see in the existing codebase. The code is written in TypeScript and uses React components extensively. Pay attention to the structure of components, especially how props are passed and how state is managed.

In particular, notice the pattern used for data access. These are broken out into hook files
such as `useVotes.ts` and `useTiers.ts`. These hooks encapsulate the logic for fetching and manipulating data, making it easier to manage state and side effects in a clean way.

When writing new components, follow the existing conventions for styling using Bootstrap and CSS modules. Components should be modular and reusable, with clear prop definitions.

When adding new features or components, ensure that they follow the existing styling conventions using Bootstrap and CSS modules. Also, make sure to include appropriate types for TypeScript.

Never, _ever_ use Typescript "as" keyword to cast types. Instead, use type guards or type assertions where necessary. This helps maintain type safety and clarity in the codebase.
