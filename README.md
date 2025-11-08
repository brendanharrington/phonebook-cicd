# CI/CD Phonebook Application

This repository contains my **Part 12** submission for the [Full Stack Open](https://fullstackopen.com/en/part12) course.  
The focus of this project is deploying the **Phonebook application** using modern cloud platforms and automating the process with **GitHub Actions**.

## Overview

The Phonebook app is a full stack web application built with a React frontend and a Node.js + Express backend connected to a MongoDB database.  
For Part 12, the goal was to move the app into production using continuous deployment practices.

## Deployment Details

### Platform – Vercel

Vercel automatically builds and deploys the application from the `main` branch whenever new commits are pushed.  
It detects both the frontend (React) and backend (Express) code and builds them together using a custom configuration.

### Live Application

[https://phonebook-cicd.vercel.app/](https://phonebook-cicd.vercel.app/)

## Quick start (local development)

### Prerequisites:

- Node.js (v18+ recommended)
- npm
- Docker (for running a local MongoDB when running e2e)

Install dependencies:

```bash
npm ci
```

### Run app in development (starts backend and Vite client concurrently):

```bash
npm run dev
```

The frontend is available at http://localhost:5173 and the backend API at http://localhost:5001 (default). The server port and DB URL can be overridden with environment variables (see below).

## Environment variables

Create a `.env` file in the project root for local overrides (this repo uses `dotenv` in `server/config.js`). Example:

```env
MONGODB_URI=mongodb://localhost:27017/phonebook_dev
PORT=5001
```

Note: the server exports defaults so it will fall back to `mongodb://localhost:27017/phonebook` and port `5001` if env vars are not set.

## Scripts

- `npm run dev` — start backend and frontend for local development (uses `concurrently`).
- `npm run build` — build the frontend.
- `npm test` — run unit tests (Vitest).
- `npm run test:e2e` — run Playwright e2e tests.

## Tests

### Unit tests

- Vitest is used for unit tests and runs in a jsdom environment. A global `vi.mock('axios')` is configured for unit tests so UI tests don't make real network requests.

### End-to-end tests (Playwright)

- Playwright tests are under `tests/e2e` and include UI smoke tests and API-level seeding helpers that POST/DELETE directly to the backend to make e2e deterministic.
- Playwright configuration highlights:
  - `baseURL` is `http://localhost:5173` (Vite dev server)
  - `webServer.reuseExistingServer` is set to reuse an already-started server in CI/run environments
  - traces are captured on retry to help debug failures

## CI / GitHub Actions

This project includes a consolidated pipeline in `.github/workflows/pipeline.yml`. The important parts:

- `simple_deployment_pipeline` — checks out the code, installs deps, lints, builds and runs unit tests.
- `playwright_tests` — runs after `simple_deployment_pipeline` and:
	- spins up a MongoDB service in the job
	- starts the app (using the same `npm run dev` as local dev)
	- waits for both the HTTP health endpoint and a "connected to MongoDB" message in the server log before running Playwright
	- runs Playwright and uploads `playwright-report/` and `server.log` on failures for debugging
- `tag_release` — depends on `playwright_tests`. tagging (and the subsequent `vercel_deployment_pipeline`) will only run if e2e pass. This gates production deploys on passing e2e.

This arrangement prevents accidental deployments when the e2e suite fails in CI.
