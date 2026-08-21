# test

A small full-stack **Todo** app used to demonstrate a working Cloud Agent development environment end to end.

- **`server/`** — Express REST API (`/api/todos`, `/api/health`) with Vitest + Supertest tests.
- **`client/`** — Vite + React single-page app that talks to the API (dev proxy forwards `/api` → `http://localhost:3001`).

## Requirements

- Node.js 22.x (npm 10+)

## Getting started

```bash
npm install          # install all workspace dependencies
npm run dev          # run API (:3001) and client (:5173) together
```

Then open http://localhost:5173.

## Common commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and client dev servers concurrently |
| `npm run dev:server` | Run only the API on port 3001 |
| `npm run dev:client` | Run only the Vite client on port 5173 |
| `npm test` | Run the API test suite (Vitest) |
| `npm run lint` | Lint the whole workspace (ESLint) |
| `npm run build` | Build the production client bundle |

## Project layout

```
.
├── client/            # Vite + React front end
├── server/            # Express API + tests
├── eslint.config.js   # Flat ESLint config for both workspaces
└── package.json       # npm workspaces + root scripts
```
