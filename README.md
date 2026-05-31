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
