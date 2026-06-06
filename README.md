# Campus Companion (it's a simple version so don't expect too much)

Campus Companion is a student productivity web app for managing courses, tasks, deadlines, and personal activities in one dashboard.

The app helps students organize their semester by tracking academic schedules, assignments, upcoming deadlines, and calendar events.

## Features

* Dashboard summary for courses, tasks, deadlines, and upcoming events
* Course management
* Task management
* Task search and filtering
* Task deadline status: Overdue, Due Soon, Upcoming, and Done
* Mark task as done or undo completed task
* Monthly calendar view
* Add personal or academic calendar events
* Upcoming tasks and events on the dashboard
* Responsive layout for desktop and mobile

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* React Router
* Axios
* CSS

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Maven

### Database

* PostgreSQL

## Project Structure

```txt
campus-companion/
├── backend/
│   └── Spring Boot REST API
└── frontend/
    └── React + Vite app
```

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/SidikYaeger/campus-companion.git
cd campus-companion
```

### 2. Setup the database

Create a PostgreSQL database named:

```txt
campus_companion_db
```

Then configure the backend database connection in:

```txt
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/campus_companion_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the backend

Open the `backend` folder in IntelliJ IDEA, then run:

```txt
BackendApplication.java
```

Backend runs on:

```txt
http://localhost:8080
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Main Pages

### Dashboard

Shows semester overview, including total courses, total tasks, overdue tasks, due soon tasks, completed tasks, upcoming deadlines, and upcoming calendar events.

### Courses

Used to add, edit, delete, and view course data.

### Tasks

Used to manage assignments and study tasks. Tasks can be filtered by course, status, and priority.

### Calendar

Used to add and view personal or academic activities in a monthly calendar.

## Status

This project is currently in active development.

Current completed features:

* Course CRUD
* Task CRUD
* Dashboard summary
* Calendar event management
* Frontend-backend integration
* PostgreSQL integration
* Responsive UI

## Author

Created by Zhafir Tectona.
