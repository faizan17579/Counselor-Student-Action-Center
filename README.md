# Counselor Student Action Center — Bonus Assessment

This repo contains the full-stack action center (Express + TypeScript backend, React + Vite frontend) with additional production-ready improvements and tests.

## Production improvements

- Request logging: added `morgan` request logging with a `reqId` token so each request includes a unique request id for tracing.
- Request ID and error middleware: every request gets a UUID `x-request-id`; the error handler returns JSON containing the `requestId` so support staff can correlate logs.
- Minimal structured error logging: errors are logged as JSON to stderr to make ingestion into logging systems easier.

Performance decisions and tradeoffs:

- Using `morgan` and console JSON logging is lightweight and low-overhead for a single-process app. For higher throughput or multi-process deployments, replace console logging with a structured logger (winston/pino) and ship logs to a central collector.
- Request IDs are generated per-request (UUID v4). For extremely high QPS systems, consider using shorter collision-resistant IDs (e.g., ULID) to reduce size.
- Tests run locally; integration tests interact with the file-backed mock store and restore it after the run. In production, replace the mock store with a real database and run tests against a disposable test database/fixtures.

## How to run tests locally

Server:

```bash
cd server
npm install
npm test
```

Client:

```bash
cd client
npm install
npm test
```

## CI

CI should run both server and client tests. Example steps:

```bash
# server
cd server && npm ci && npm test
# client
cd client && npm ci && npm test
```

## Test outputs

Server integration test output (excerpt):

```
PASS  tests/actionCenter.int.test.ts
  Action Center integration
    √ mark single message as read reduces unread count

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

Client unit test output (excerpt):

```
PASS  src/components/UnreadMessagesCard.test.tsx
  UnreadMessagesCard
    ✓ renders count and opens modal

Test Files  1 passed (1)
Tests  1 passed (1)
```

## Notes on publishing

I implemented the changes in this workspace. To submit a public GitHub repository, push this project to a new public repository and include this README. If you'd like, I can prepare a git branch and provide the exact git commands to push.
# Counselor Student Action Center

Mini full-stack assessment project for a counselor to review one student’s profile, unread messages, task list, urgency level, and task status updates.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Styling: Tailwind CSS
- State and server cache: TanStack React Query
- Data source: backend-only mock data

## Project Structure

```text
counselor-student-action-center/
  client/
    src/
      api/
      components/
      pages/
      types/
      App.tsx
      main.tsx
  server/
    src/
      data/
      routes/
      controllers/
      types/
      app.ts
      index.ts
```

## Setup

Install dependencies separately in each app:

```bash
cd server
npm install

cd ../client
npm install
```

The frontend expects the backend at `http://localhost:4000` by default. You can override it with `VITE_API_BASE_URL`.

## Run Backend

```bash
cd server
npm run dev
```

Production build:

```bash
cd server
npm run build
npm start
```

## Run Frontend

```bash
cd client
npm run dev
```

Production build:

```bash
cd client
npm run build
```

## API Contract

### GET `/students/:id/action-center`

Returns the action center payload for one student.

Example response:

```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "unreadMessagesCount": 2,
  "urgency": {
    "level": "urgent",
    "label": "Immediate attention",
    "note": "Student is marked at risk and needs counselor follow-up."
  },
  "tasks": [
    {
      "id": "tsk_001",
      "studentId": "stu_001",
      "title": "Submit FAFSA application",
      "description": "Deadline is approaching. Student has not started the form.",
      "status": "todo",
      "priority": "urgent",
      "dueDate": "2026-06-05",
      "createdAt": "2026-05-13T14:00:00Z",
      "updatedAt": "2026-05-13T14:00:00Z"
    }
  ]
}
```

### PATCH `/tasks/:taskId/status`

Request body:

```json
{
  "status": "pending"
}
```

Allowed values:

- `pending`
- `in_progress`
- `completed`

Example response:

```json
{
  "task": {
    "id": "tsk_001",
    "studentId": "stu_001",
    "title": "Submit FAFSA application",
    "description": "Deadline is approaching. Student has not started the form.",
    "status": "completed",
    "priority": "urgent",
    "dueDate": "2026-06-05",
    "createdAt": "2026-05-13T14:00:00Z",
    "updatedAt": "2026-05-31T00:00:00.000Z"
  }
}
```

## Architecture Note

### Frontend component structure

- `StudentSummaryCard` renders the student profile summary.
- `UrgencyBadge` renders the priority/urgency callout.
- `UnreadMessagesCard` shows unread message count.
- `TaskList` renders the task collection and empty state.
- `TaskItem` owns the status dropdown and update button.
- `LoadingState` and `ErrorState` handle query feedback.

React Query fetches the action center data, owns the cache, and handles the mutation lifecycle when a task status changes.

### Backend route/controller/data structure

- `server/src/data/mockData.ts` stores the mock data in memory only.
- `server/src/routes/actionCenterRoutes.ts` wires the HTTP routes.
- `server/src/controllers/actionCenterController.ts` performs lookup, validation, updates, and error responses.
- `server/src/app.ts` configures middleware and routing.

## Why React Query Is Used

React Query keeps the data flow simple and production-friendly. It handles fetching, caching, refetching, loading, and error states without manual request-state wiring in the page component.

## How Task Status Updates Work

When the counselor changes a task’s status, the frontend sends a `PATCH` request to the backend. The backend validates the status, updates the in-memory mock task, and returns the updated task. The React Query mutation then updates the cached action-center data and refetches to keep the UI consistent.
