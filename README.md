# Campus Companion (it's a simple version so don't expect too much)

Campus Companion is a fullstack student productivity dashboard for managing courses, assignments, deadlines, calendar activities, and semester workload.

This project is designed as a portfolio-ready web application built with a modern fullstack architecture: React on the frontend, Spring Boot on the backend, and PostgreSQL as the database.

## Features

### Dashboard

* View total registered courses
* View total tasks
* Track pending and completed tasks
* Track high-priority tasks
* Detect overdue tasks
* Detect tasks due soon
* View upcoming academic deadlines
* View upcoming calendar events for the next 7 days

### Course Management

* Add new courses
* View all courses
* Edit course information
* Delete courses
* Store course data in PostgreSQL

Course data includes:

* Course name
* Lecturer
* Room
* Day
* Start time
* End time
* SKS / credits

### Task Management

* Add assignments or study tasks
* Connect tasks to courses
* View all tasks
* Edit tasks
* Delete tasks
* Mark tasks as done
* Undo completed tasks
* Search tasks
* Filter tasks by course
* Filter tasks by status
* Filter tasks by priority
* Automatically sort tasks by urgency

Task deadline statuses:

* Overdue
* Due Soon
* Upcoming
* Done
* No Deadline

### Calendar

* Monthly calendar view
* Add personal or academic activities
* Store calendar events in PostgreSQL
* View events on their respective dates
* Delete calendar events
* Set simple reminder time data
* Show upcoming calendar events on the dashboard

Calendar event types include:

* Personal
* Study
* Meeting
* Exam
* Other

### Error Handling and Validation

* Backend request validation
* Custom global error response
* Clean validation messages
* Proper error handling for missing data and invalid requests

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router DOM
* Axios
* CSS

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Jakarta Validation
* Maven

### Database

* PostgreSQL

### Tools

* IntelliJ IDEA Community
* VS Code
* Postman
* pgAdmin
* Git
* GitHub
* Miro

## Project Structure

```txt
campus-companion/
├── backend/
│   ├── src/main/java/com/campuscompanion/backend/
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   ├── controller/
│   │   │   ├── HealthController.java
│   │   │   ├── CourseController.java
│   │   │   ├── TaskController.java
│   │   │   ├── DashboardController.java
│   │   │   └── CalendarEventController.java
│   │   ├── dto/
│   │   │   ├── TaskRequest.java
│   │   │   ├── DashboardSummary.java
│   │   │   └── CalendarEventRequest.java
│   │   ├── entity/
│   │   │   ├── Course.java
│   │   │   ├── Task.java
│   │   │   └── CalendarEvent.java
│   │   ├── exception/
│   │   │   ├── ErrorResponse.java
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── repository/
│   │   │   ├── CourseRepository.java
│   │   │   ├── TaskRepository.java
│   │   │   └── CalendarEventRepository.java
│   │   ├── service/
│   │   │   ├── CourseService.java
│   │   │   ├── TaskService.java
│   │   │   ├── DashboardService.java
│   │   │   └── CalendarEventService.java
│   │   └── BackendApplication.java
│   └── src/main/resources/
│       ├── application.properties
│       └── application-example.properties
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axiosConfig.js
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Courses.jsx
    │   │   ├── Tasks.jsx
    │   │   └── Calendar.jsx
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## Backend Architecture

The backend uses a layered architecture:

```txt
Controller → Service → Repository → Database
```

### Controller

Handles incoming HTTP requests and returns API responses.

### Service

Contains business logic and validation-related flow.

### Repository

Handles database operations using Spring Data JPA.

### Database

Stores persistent data using PostgreSQL.

## API Endpoints

### Health Check

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| GET    | `/api/health` | Check if backend is running |

### Courses

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/api/courses`      | Get all courses     |
| GET    | `/api/courses/{id}` | Get course by ID    |
| POST   | `/api/courses`      | Create a new course |
| PUT    | `/api/courses/{id}` | Update a course     |
| DELETE | `/api/courses/{id}` | Delete a course     |

### Tasks

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/tasks`               | Get all tasks          |
| GET    | `/api/tasks/{id}`          | Get task by ID         |
| GET    | `/api/tasks?courseId={id}` | Get tasks by course ID |
| POST   | `/api/tasks`               | Create a new task      |
| PUT    | `/api/tasks/{id}`          | Update a task          |
| DELETE | `/api/tasks/{id}`          | Delete a task          |

### Dashboard

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/api/dashboard/summary`        | Get dashboard summary |
| GET    | `/api/dashboard/upcoming-tasks` | Get upcoming tasks    |

### Calendar Events

| Method | Endpoint                                               | Description                 |
| ------ | ------------------------------------------------------ | --------------------------- |
| GET    | `/api/calendar-events`                                 | Get all calendar events     |
| GET    | `/api/calendar-events/{id}`                            | Get calendar event by ID    |
| GET    | `/api/calendar-events?start={datetime}&end={datetime}` | Get events by date range    |
| POST   | `/api/calendar-events`                                 | Create a new calendar event |
| PUT    | `/api/calendar-events/{id}`                            | Update a calendar event     |
| DELETE | `/api/calendar-events/{id}`                            | Delete a calendar event     |

## Screenshots

### Dashboard

The dashboard summarizes courses, task progress, urgent deadlines, and upcoming calendar activities.

![Campus Companion Dashboard](docs/screenshots/dashboard.png)

### Course Manager

The course manager provides course scheduling details and complete create, update, and delete workflows.

![Campus Companion Course Manager](docs/screenshots/courses.png)

### Task Manager

The task manager supports course-linked assignments, status updates, deadline tracking, search, and filtering.

![Campus Companion Task Manager](docs/screenshots/tasks.png)

### Activity Calendar

The monthly calendar organizes personal and academic events with reminder settings.

![Campus Companion Activity Calendar](docs/screenshots/calendar.png)

## Getting Started

### Prerequisites

Make sure these are installed:

* Java JDK 21
* Node.js and npm
* PostgreSQL
* Git

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/SidikYaeger/campus-companion.git
cd campus-companion
```

### 2. Create PostgreSQL database

Create a database named:

```txt
campus_companion_db
```

### 3. Configure application properties

Create a local file:

```txt
backend/src/main/resources/application.properties
```

Use `application-example.properties` as a template:

```properties
spring.application.name=backend

spring.datasource.url=jdbc:postgresql://localhost:5432/campus_companion_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Important:

Do not upload `application.properties` to GitHub because it may contain local database credentials.

### 4. Run the backend

Open the `backend` folder in IntelliJ IDEA and run:

```txt
BackendApplication.java
```

Backend will run on:

```txt
http://localhost:8080
```

Health check:

```txt
http://localhost:8080/api/health
```

## Frontend Setup

### 1. Open frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

## Local Development Flow

Run both backend and frontend at the same time:

```txt
Backend  → http://localhost:8080
Frontend → http://localhost:5173
```

The frontend communicates with the backend through Axios using:

```txt
http://localhost:8080/api
```

## Git and Security Notes

Before committing or pushing, always check:

```bash
git status
```

Do not commit sensitive files such as:

* `application.properties`
* `.env`
* database passwords
* API keys
* tokens
* private keys
* credential JSON files
* local configuration files

Use example config files instead:

```txt
application-example.properties
```

## Current Status

This project is currently in active development.

Completed:

* Backend Spring Boot setup
* PostgreSQL integration
* Course CRUD API
* Task CRUD API
* Dashboard API
* Calendar Event API
* Service layer
* Validation
* Global error handler
* CORS configuration
* React + Vite frontend
* Sidebar navigation
* Dashboard page
* Courses page
* Tasks page
* Calendar page
* Responsive styling fix

## Roadmap

### High Priority

* Edit calendar events from frontend
* Integrate task deadlines into calendar view
* Integrate course schedules into calendar view
* Keep README screenshots updated
* Improve UI polish

### Medium Priority

* Reminder Center on dashboard
* Browser notification for reminders
* Backend enum for task status and priority
* Better DTO response structure
* Search and filter calendar events

### Later

* Login and register
* User-specific data
* Deployment
* GPA/IPK calculator
* Weekly calendar view
* Export schedule
* Dark/light mode toggle

## Author

Created by Zhafir Tectona.

## License

This project is currently for learning and portfolio purposes.
