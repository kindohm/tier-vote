# repo summary

This repository contains a Next.js application for managing tiered voting systems, utilizing Firebase for backend services and Bootstrap for styling.

## code structure

The code is organized into several key directories and files:

- **`/app`**: Contains the main application pages, including the home page and API routes.
- **`/components`**: Houses _shared_ React components used across the application.
- **`/styles`**: Contains global styles and CSS modules for component-specific styling.
- **`/public`**: Contains static assets like images and icons.
- **`/lib`**: Contains utility functions and Firebase configuration.
- **`/hooks`**: Custom _shared_ React hooks for managing state and side effects.

### Individual /app page structure

In an /app page, all of the page's components, hooks, and utilities related to that
page should be stored inside of the page folder. For example, if we have a page called "foo":

- `src/app/foo/page.tsx`
- `src/app/foo/components/`
- `src/app/foo/hooks/`
- `src/app/foo/lib`

Note: the top level `src/components`, `src/hooks`, and `src/lib` folders
_should only be used for items shared across the entire application_.

## instructions for copilot

Try to re-use patterns that you see in the existing codebase. The code is written in TypeScript and uses React components extensively. Pay attention to the structure of components, especially how props are passed and how state is managed.

In particular, notice the pattern used for data access. These are broken out into hook files
such as `useVotes.ts` and `useTiers.ts`. These hooks encapsulate the logic for fetching and manipulating data, making it easier to manage state and side effects in a clean way.

When writing new components, follow the existing conventions for styling using Bootstrap and CSS modules. Components should be modular and reusable, with clear prop definitions.

When adding new features or components, ensure that they follow the existing styling conventions using Bootstrap and CSS modules. Also, make sure to include appropriate types for TypeScript.

Never, _ever_ use Typescript "as" keyword to cast types. Instead, use type guards or type assertions where necessary. This helps maintain type safety and clarity in the codebase.
