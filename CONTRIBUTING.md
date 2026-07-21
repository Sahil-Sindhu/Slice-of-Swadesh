# Contributing to Slice of Swadesh

First off, thank you for considering contributing to Slice of Swadesh!

## Development Workflow

1.  **Clone the repository.**
2.  **Install dependencies** in both `/frontend` and `/backend` using `npm install`.
3.  **Set up your `.env` files** based on the `.env.example` templates.
4.  **Start the local environment** using `npm run dev` in both folders.

## Branching Strategy

- `main`: Contains the production-ready code.
- `develop`: Contains the latest integrated features for the next release.
- Feature branches: Created off `develop` (e.g., `feature/add-razorpay`).

## Pull Request Guidelines

1.  Ensure all TypeScript checks pass (`npm run build`).
2.  Ensure ESLint reports zero errors.
3.  Write clean, documented code following the established abstractions (Service, Provider, Controller).
4.  Reference the specific issue or Jira ticket in the PR title.

## Bug Reports

Please use the issue tracker to report bugs. Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (Browser, OS, Node version)
