# Campus Companion (it's a simple version, don't expect too much)

Campus Companion is a full-stack student productivity application for managing
courses, assignments, deadlines, and personal activities in one place.

The application helps students organize their semester through a dashboard that
summarizes their academic workload, upcoming tasks, course schedules, and
calendar events.

## Features

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
- Set task status, priority, and deadline
- Mark tasks as done or return them to not started
- Search and filter tasks by course, status, and priority
- Automatically identify overdue, due-soon, upcoming, and completed tasks

### Activity Calendar

- View activities in a monthly calendar
- Add and delete personal or academic activities
- Set activity type and reminder time
- Display upcoming activities on the dashboard

### Validation and Error Handling

- Validate course, task, and calendar event input
- Return structured API error responses
- Display understandable error messages in the frontend
- Prevent duplicate actions while requests are processing

## Screenshots

### Dashboard

![Campus Companion Dashboard](https://i.imgur.com/75gxlnF.png)

### Course Manager

![Campus Companion Course Manager](https://i.imgur.com/4d84PHt.png)

### Task Manager

![Campus Companion Task Manager](https://i.imgur.com/md7MyjV.png)

### Activity Calendar

![Campus Companion Activity Calendar](https://i.imgur.com/JGdr9zV.png)

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Jakarta Validation
- Maven

### Database

- PostgreSQL

## Requirements

Install the following software before running the project:

- Java JDK 21
- Node.js and npm
- PostgreSQL
- Git
- IntelliJ IDEA or another Java IDE
- VS Code or another frontend editor

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
`-- frontend/
    `-- src/
        |-- api/
        |-- components/
        `-- pages/
```

The backend uses a layered architecture:

```text
Controller -> Service -> Repository -> PostgreSQL
```

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/SidikYaeger/campus-companion.git
cd campus-companion
```

### 2. Create the Database

Create a PostgreSQL database:

```text
campus_companion_db
```

### 3. Configure the Backend

Create this local configuration file:

```text
backend/src/main/resources/application.properties
```

Use `application-example.properties` as a template and provide your PostgreSQL
username and password.

Do not commit `application.properties` because it contains local database
credentials.

### 4. Run the Backend

Open the `backend` folder in IntelliJ IDEA and run:

```text
BackendApplication.java
```

The backend runs at:

```text
http://localhost:8080
```

### 5. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The frontend uses `VITE_API_BASE_URL` when configured and otherwise connects to:

```text
http://localhost:8080/api
```

## Main API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check backend availability |
| GET, POST | `/api/courses` | List or create courses |
| GET, PUT, DELETE | `/api/courses/{id}` | Read, update, or delete a course |
| GET, POST | `/api/tasks` | List or create tasks |
| GET, PUT, DELETE | `/api/tasks/{id}` | Read, update, or delete a task |
| GET | `/api/dashboard/summary` | Get dashboard totals |
| GET | `/api/dashboard/upcoming-tasks` | Get upcoming tasks |
| GET, POST | `/api/calendar-events` | List or create calendar events |
| GET, PUT, DELETE | `/api/calendar-events/{id}` | Read, update, or delete an event |

## Security Notes

Do not commit sensitive local files or credentials, including:

- `application.properties`
- `.env`
- Database passwords
- API keys and tokens
- Private keys

Use example configuration files such as `application-example.properties` and
`.env.example` instead.

## Author

Created by Zhafir Tectona.
