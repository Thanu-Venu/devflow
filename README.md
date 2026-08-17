# DevFlow

A full-stack project and task management platform built with the MERN stack, secured with JWT authentication, and deployed using Docker and GitHub Actions CI/CD.

## 🚀 Live Demo

**Frontend:**
https://devflow-frontend-gufn.onrender.com

**Backend API:**
https://devflow-backend-f80z.onrender.com

**Health Check:**
https://devflow-backend-f80z.onrender.com/api/health

---

## 📌 Overview

DevFlow is a full-stack project management application designed to demonstrate modern software engineering and DevOps practices.

Users register and log in, then manage their own projects and tasks through a RESTful, authenticated backend API and a React-based web interface. Every project and task is scoped to the account that created it.

The project was developed with a focus on:

- Full-stack MERN development
- REST API design with JWT authentication and per-user data ownership
- MongoDB data modeling
- Automated testing (Jest/Supertest, run against a live MongoDB in CI)
- Docker containerization
- Application monitoring with Prometheus and Grafana
- GitHub Actions CI/CD
- Cloud deployment
- Environment-based configuration

---

## ✨ Features

### Authentication

- Register and log in with email/password
- Passwords hashed with bcrypt, never stored in plain text
- JWT-based sessions
- All project and task endpoints require a valid token and are scoped to the logged-in user

### Project Management

- Create projects
- View your own projects
- Store project descriptions
- Associate tasks with projects

### Task Management

- Create tasks
- View tasks (scoped to your own projects)
- Update task status
- Delete tasks
- Task statuses:
  - TODO
  - IN_PROGRESS
  - DONE

### DevOps

- Dockerized frontend and backend
- Docker Compose for local development, including a Prometheus + Grafana monitoring stack
- GitHub Actions CI pipeline: lint/build, automated tests against a real MongoDB service container, Docker image builds
- Continuous deployment to Render (frontend and backend redeploy independently on every push to `main`)
- Production MongoDB using MongoDB Atlas
- Application metrics exposed via Prometheus and scraped for dashboards in Grafana

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- REST API
- JWT (jsonwebtoken) + bcrypt for authentication

### Database
- MongoDB
- MongoDB Atlas

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Render
- Prometheus
- Grafana

### Testing
- Jest
- Supertest

### Development Environment
- WSL Ubuntu
- Git
- GitHub
- VS Code

---

## 🏗️ Architecture

```text
                         GitHub
                           │
                           │ Push
                           ▼
                  ┌─────────────────┐
                  │ GitHub Actions  │
                  │                 │
                  │ CI              │
                  │ ├─ npm ci       │
                  │ ├─ Tests        │
                  │ ├─ React build  │
                  │ └─ Docker build │
                  │                 │
                  │ CD              │
                  │ ├─ Deploy Hook (backend)  │
                  │ └─ Deploy Hook (frontend) │
                  └────────┬────────┘
                           │
                           ▼
                     ┌───────────┐
                     │  Render   │
                     └─────┬─────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
                 ▼                   ▼
          ┌─────────────┐     ┌─────────────┐
          │  Frontend   │     │   Backend   │
          │ React/Nginx │────▶│ Node/Express│
          └─────────────┘     └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │  MongoDB    │
                              │    Atlas    │
                              └─────────────┘
```

---

## 📂 Project Structure

```text
devflow/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AuthForm.jsx
│   │   ├── api.js
│   │   └── index.css
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   │
│   │   ├── metrics.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── setup.js
│   │   ├── health.test.js
│   │   ├── auth.test.js
│   │   └── project.test.js
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── monitoring/
│   └── prometheus/
│       └── prometheus.yml
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🐳 Docker

The application can be run locally using Docker Compose, including the monitoring stack:

```text
Docker Compose
│
├── Frontend
│   └── React + Nginx
│
├── Backend
│   └── Node.js + Express
│
├── MongoDB
│   └── MongoDB 8
│
├── Prometheus
│   └── Scrapes metrics from the backend's /metrics endpoint
│
└── Grafana
    └── Dashboards on top of Prometheus
```

**Start the application**
```bash
docker compose up -d
```

**Check containers**
```bash
docker compose ps
```

**Stop the application**
```bash
docker compose down
```

**Rebuild containers**
```bash
docker compose build
docker compose up -d
```

### Local URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`
- Metrics: `http://localhost:5000/metrics`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`

---

## ⚙️ Local Development Without Docker

### Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## 🔐 Environment Variables

Environment variables are used to keep configuration and secrets outside the source code.

### Backend

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
```

`JWT_SECRET` is required — it signs and verifies every session token, so the API won't authenticate requests without it set.

### Frontend

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://devflow-backend-f80z.onrender.com/api
```

> `.env` files containing secrets should never be committed to Git.

---

## 🔄 CI/CD Pipeline

DevFlow uses GitHub Actions to automate the development workflow. Whenever code is pushed to the `main` branch:

```text
                    git push
                       │
                       ▼
               GitHub Actions
                       │
                       ▼
             Continuous Integration
                       │
              ┌────────┴────────┐
              │                 │
          npm install       Docker Build
              │                 │
              ▼                 ▼
     Tests (real MongoDB)  Backend + Frontend Images
     Frontend Build
              │                 │
              └────────┬────────┘
                       │
                    SUCCESS
                       │
                       ▼
             Continuous Deployment
                       │
              ┌────────┴────────┐
              ▼                 ▼
      Render Deploy       Render Deploy
      (backend)           (frontend)
```

**CI performs:**
- Repository checkout
- Node.js setup
- Backend dependency installation
- Automated backend tests, run against a real MongoDB service container (auth, and per-user project/task ownership boundaries are covered)
- Frontend dependency installation
- Frontend production build
- Backend Docker image build
- Frontend Docker image build

**CD performs:**
After CI succeeds, GitHub Actions triggers a Render deployment for both the backend and frontend services, each using its own deployment hook stored in GitHub Secrets. This prevents deployment when the CI pipeline fails, and ensures both services stay in sync on every push.

---

## 🌐 Deployment

The application is deployed using Render.

### Frontend

React is built into static production files and served through Nginx.

```text
React
  ↓
Vite Production Build
  ↓
Nginx Docker Container
  ↓
Render
```

### Backend

The Express API runs inside a Docker container.

```text
Node.js
  ↓
Express
  ↓
Docker
  ↓
Render
```

### Database

Production data is stored in MongoDB Atlas.

```text
Render Backend
      │
      ▼
MongoDB Atlas
      │
      ▼
devflow database
```

---

## 📊 Monitoring & Observability

The backend exposes a Prometheus-compatible `/metrics` endpoint (via `prom-client`), tracking:

- `devflow_http_requests_total` — request count, labeled by method, route, and status code
- `devflow_http_request_duration_seconds` — request latency histogram, labeled by method and route
- Default Node.js process metrics (memory, event loop lag, GC, etc.)

`monitoring/prometheus/prometheus.yml` configures Prometheus to scrape the backend every 5 seconds. Grafana runs alongside it in `docker-compose.yml` and can be pointed at that Prometheus instance to build dashboards on top of these metrics.

---

## 🗄️ Database Design

MongoDB uses collections rather than traditional SQL tables.

```text
devflow
│
├── users
├── projects
└── tasks
```

**Users**
```js
{
  _id: ObjectId,
  name: String,
  email: String,        // unique
  password: String,     // bcrypt hash
  createdAt: Date,
  updatedAt: Date
}
```

**Projects**
```js
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId,      // ref -> User._id
  createdAt: Date,
  updatedAt: Date
}
```

**Tasks**
```js
{
  _id: ObjectId,
  title: String,
  status: String,       // TODO | IN_PROGRESS | DONE
  project: ObjectId,    // ref -> Project._id
  createdAt: Date,
  updatedAt: Date
}
```

Tasks don't carry their own owner field — ownership is derived through the project they belong to:

```text
Task ──▶ project ──▶ Project.owner ──▶ User._id
```

---

## 🔌 REST API

All endpoints under `/api/projects` and `/api/tasks` require a valid session token, sent as:

```
Authorization: Bearer <token>
```

**Auth**
```
POST /api/auth/register     { name, email, password } -> { token, user }
POST /api/auth/login        { email, password }        -> { token, user }
```

**Health**
```
GET /api/health
```

**Projects** *(requires auth)*
```
GET  /api/projects           # only projects owned by the current user
POST /api/projects           # { name, description }
```

**Tasks** *(requires auth)*
```
GET    /api/tasks            # only tasks under the current user's projects
POST   /api/tasks            # { title, project }
PUT    /api/tasks/:id        # { title?, status? }
DELETE /api/tasks/:id
```

---

## 🧪 Testing the API

**Health check**
```bash
curl http://localhost:5000/api/health
```

**Register and grab a token**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secret123"}'
```

**Create a project (authenticated)**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"DevFlow","description":"CI/CD demonstration project"}'
```

**Create a task (authenticated)**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Implement CI pipeline","project":"PROJECT_ID"}'
```

Automated equivalents of these flows — including that one user can't read or modify another user's projects/tasks — live in `server/tests/` and run in CI on every push.

---

## 🔒 Security Considerations

The project follows several security practices:

- JWT-based authentication with bcrypt password hashing
- Per-user data ownership enforced at the API layer (projects and tasks are only visible/editable by their owner)
- Environment variables for secrets
- `.env` excluded from Git
- Database credentials not stored in source code
- GitHub Secrets used for deployment credentials
- Production database hosted separately from application containers
- HTTPS enforced by Render at the platform level

For a larger production system, additional measures would include:

- Role-based authorization (e.g. project members/collaborators, not just a single owner)
- Request validation (e.g. via Zod/Joi, instead of ad hoc checks in controllers)
- Rate limiting
- Application-level security headers (e.g. Helmet)
- Centralized logging
- Alerting on top of the existing Prometheus metrics

---

## 🚀 Future Improvements

Potential improvements include:

- Role-based access control and project collaborators
- Task assignment
- Due dates
- Task priorities
- Search and filtering
- Kanban board
- Broader automated test coverage
- Redis caching
- API documentation with Swagger
- Centralized logging and alerting
- Custom domain
- Infrastructure as Code using Terraform

---

## 📚 What This Project Demonstrates

This project demonstrates practical knowledge of:

- Full-stack JavaScript development
- REST API development with JWT authentication and authorization
- MongoDB data modeling, including ownership/relational scoping between collections
- React frontend development
- Automated testing (Jest/Supertest) run against a live database in CI
- Docker containerization
- Docker Compose, including a monitoring stack
- Application observability with Prometheus and Grafana
- Git and GitHub
- GitHub Actions
- Continuous Integration
- Continuous Deployment (multiple services, independently deployed)
- Cloud deployment
- Environment configuration
- Production application architecture

---

## 👨‍💻 Author

**Thanu Venu**
GitHub: [https://github.com/Thanu-Venu](https://github.com/Thanu-Venu)

---

## ⭐ Project Status

Completed
