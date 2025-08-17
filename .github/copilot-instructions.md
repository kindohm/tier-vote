# repo summary

This repository contains a Next.js application for managing tiered voting systems, utilizing Firebase for backend services and Bootstrap for styling.

## code structure

The code is organized into several key directories and files:
- **`/pages`**: Contains the main application pages, including the home page and API routes.
- **`/components`**: Houses reusable React components used across the application.
- **`/styles`**: Contains global styles and CSS modules for component-specific styling.
- **`/public`**: Contains static assets like images and icons.

- **`/lib`**: Contains utility functions and Firebase configuration.
- **`/hooks`**: Custom React hooks for managing state and side effects.

## instructions for copilot

Try to re-use patterns that you see in the existing codebase. The code is written in TypeScript and uses React components extensively. Pay attention to the structure of components, especially how props are passed and how state is managed.

In particular, notice the pattern used for data access. These are broken out into hook files
such as `useVotes.ts` and `useTiers.ts`. These hooks encapsulate the logic for fetching and manipulating data, making it easier to manage state and side effects in a clean way.

When writing new components, follow the existing conventions for styling using Bootstrap and CSS modules. Components should be modular and reusable, with clear prop definitions.

When adding new features or components, ensure that they follow the existing styling conventions using Bootstrap and CSS modules. Also, make sure to include appropriate types for TypeScript.

