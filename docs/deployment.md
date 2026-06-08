# Deployment Guide

Campus Companion is deployed as three pieces:

- Frontend: Vercel
- Backend: Render Web Service
- Database: PostgreSQL from Supabase, Neon, or Render PostgreSQL

## 1. Prepare PostgreSQL

Create a PostgreSQL database and keep these values:

- Database host
- Database port
- Database name
- Database username
- Database password
- External connection URL

The backend needs a JDBC URL:

```text
jdbc:postgresql://HOST:PORT/DATABASE_NAME
```

If the provider requires SSL, append the provider's required SSL query string.
For many managed PostgreSQL providers this is commonly:

```text
jdbc:postgresql://HOST:PORT/DATABASE_NAME?sslmode=require
```

## 2. Deploy Backend to Render

Use `render.yaml` or create a Render Web Service manually.

Recommended settings:

- Runtime: Docker
- Dockerfile path: `./backend/Dockerfile`
- Docker context: `./backend`
- Health check path: `/api/health`

Set these Render environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:PORT/DATABASE_NAME?sslmode=require
SPRING_DATASOURCE_USERNAME=your_database_username
SPRING_DATASOURCE_PASSWORD=your_database_password
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
JPA_DDL_AUTO=update
```

After deploy, test:

```text
https://your-render-backend-url.onrender.com/api/health
```

Expected response:

```text
Campus Companion backend is running
```

## 3. Deploy Frontend to Vercel

Import the repository into Vercel and set:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

The frontend has `vercel.json` configured so client-side routes such as
`/tasks`, `/calendar`, and `/schedule` load correctly after refresh.

## 4. Update CORS

After Vercel gives the final frontend domain, update Render:

```text
CORS_ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

For multiple domains, separate them with commas:

```text
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-vercel-domain.vercel.app
```

Redeploy or restart the Render backend after changing CORS.

## 5. Final Checks

- Backend `/api/health` returns a successful response.
- Frontend opens without console CORS errors.
- Dashboard can load summary data.
- Courses can be created and listed.
- Tasks can be created with a course.
- Calendar events can be created, edited, and deleted.
- Schedule shows courses grouped by day.
