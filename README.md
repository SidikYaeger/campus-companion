# Campus Companion (pls don't expect too much)

A full-stack student productivity application for managing courses, assignments,
weekly schedules, deadlines, and calendar activities in one place.

Each user has a private account and can only access their own academic data.

## Live Demo

- Application: [campus-companion-woad.vercel.app](https://campus-companion-woad.vercel.app)
- API health check: [campus-companion-4ltd.onrender.com/api/health](https://campus-companion-4ltd.onrender.com/api/health)

> The backend uses Render's free tier, so the first request after a period of
> inactivity may take a moment while the service wakes up.

## Features

### Authentication and Privacy

- Register and log in with email and password
- Passwords are securely stored as BCrypt hashes
- Browser sessions remain active across refreshes
- Courses, tasks, schedules, dashboard totals, and events are isolated per user
- Users cannot read, edit, or delete another user's data

### Dashboard

- View course and task totals
- Track pending, completed, overdue, due-soon, and high-priority tasks
- View upcoming academic deadlines
- View calendar activities for the next seven days

### Course Management

- Add, view, edit, and delete courses
- Store lecturer, room, day, schedule, and SKS information
- Prevent courses with related tasks from being deleted accidentally

### Task Management

- Add, view, edit, and delete tasks
- Connect tasks to courses
- Set status, priority, and optional deadlines
- Mark tasks as done or return them to not started
- Search and filter tasks by course, status, and priority
- Automatically identify overdue, due-soon, upcoming, and completed tasks

### Schedule and Calendar

- View courses in a responsive weekly schedule
- Group courses by day and sort them by start time
- View activities in a monthly calendar
- Add, edit, and delete personal, academic, or organization events
- Set event reminder times

### User Experience

- Clear validation and API error messages
- Loading, empty, and retry states
- Responsive layouts for desktop and mobile
- Duplicate actions are prevented while requests are processing

## Screenshots

### Dashboard

![Campus Companion Dashboard](https://i.imgur.com/5isXK8E.png)

### Course Manager

![Campus Companion Course Manager](https://i.imgur.com/noi8IcJ.png)

### Task Manager

![Campus Companion Task Manager](https://i.imgur.com/BEIXCwN.png)

### Weekly Schedule

![Campus Companion Weekly Schedule](https://i.imgur.com/BNSRk5Z.png)

### Activity Calendar

![Campus Companion Activity Calendar](https://i.imgur.com/7lIKVid.png)

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, React Router, Axios, CSS |
| Backend | Java 21, Spring Boot, Spring Web MVC, Spring Data JPA, Jakarta Validation |
| Security | BCrypt password hashing, database-backed bearer sessions |
| Database | PostgreSQL, hosted on Neon |
| Deployment | Vercel frontend, Render backend, Neon database |

## Architecture

```text
React Frontend
      |
      | REST API + Bearer Token
      v
Controller -> Service -> Repository -> Neon PostgreSQL
```

Backend endpoints identify the authenticated user from their bearer session.
Every course, task, and calendar query is filtered using that user's ownership.

## Project Structure

```text
campus-companion/
|-- backend/
|   |-- src/main/java/com/campuscompanion/backend/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- entity/
|   |   |-- exception/
|   |   |-- repository/
|   |   `-- service/
|   `-- src/main/resources/
|-- frontend/
|   `-- src/
|       |-- api/
|       |-- auth/
|       |-- components/
|       `-- pages/
`-- docs/
```

## Local Setup

### Requirements

- Java JDK 21
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/SidikYaeger/campus-companion.git
cd campus-companion
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```text
campus_companion_db
```

Create:

```text
backend/src/main/resources/application.properties
```

Use `application-example.properties` as a template and provide your local
database credentials. This file is ignored by Git.

### 3. Run the Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API runs at `http://localhost:8080`.

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and connects to
`http://localhost:8080/api` by default.

## Environment Variables

### Backend

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST/DATABASE?sslmode=require
SPRING_DATASOURCE_USERNAME=USERNAME
SPRING_DATASOURCE_PASSWORD=PASSWORD
JPA_DDL_AUTO=update
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.vercel.app
```

### Frontend

```env
VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api
```

## Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check backend availability |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the authenticated user |
| POST | `/api/auth/logout` | Log out |
| GET, POST | `/api/courses` | List or create courses |
| GET, PUT, DELETE | `/api/courses/{id}` | Read, update, or delete a course |
| GET, POST | `/api/tasks` | List or create tasks |
| GET, PUT, DELETE | `/api/tasks/{id}` | Read, update, or delete a task |
| GET | `/api/dashboard/summary` | Get dashboard totals |
| GET | `/api/dashboard/upcoming-tasks` | Get upcoming tasks |
| GET, POST | `/api/calendar-events` | List or create calendar events |
| GET, PUT, DELETE | `/api/calendar-events/{id}` | Read, update, or delete an event |

Except for health checks and authentication, API endpoints require:

```http
Authorization: Bearer SESSION_TOKEN
```

## Verification

```bash
# Frontend
cd frontend
npm run lint
npm run build
```

```powershell
# Backend
cd backend
.\mvnw.cmd clean test
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for the Vercel, Render, and Neon
deployment guide.

## Security Notes

- Never commit `.env`, `application.properties`, passwords, or API tokens.
- Passwords are stored as BCrypt hashes and cannot be recovered as plain text.
- Production database credentials are configured through Render environment
  variables.

## Author

Created by Zhafir Tectona.
