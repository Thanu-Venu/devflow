# DevFlow

A full-stack project and task management platform built with the MERN stack and deployed using Docker and GitHub Actions CI/CD.

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

The application allows users to manage projects and tasks through a RESTful backend API and a React-based web interface.

The project was developed with a focus on:

- Full-stack MERN development
- REST API design
- MongoDB data modeling
- Docker containerization
- GitHub Actions CI/CD
- Cloud deployment
- Environment-based configuration

---

## ✨ Features

### Project Management

- Create projects
- View projects
- Store project descriptions
- Associate tasks with projects

### Task Management

- Create tasks
- View tasks
- Update task status
- Delete tasks
- Task statuses:
  - TODO
  - IN_PROGRESS
  - DONE

### DevOps

- Dockerized frontend and backend
- Docker Compose for local development
- GitHub Actions CI pipeline
- Automated Docker image builds
- Continuous deployment through Render
- Production MongoDB using MongoDB Atlas

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

### Database
- MongoDB
- MongoDB Atlas

### DevOps
- Docker
- Docker Compose
- GitHub Actions
- Render

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
                  │ ├─ React build  │
                  │ └─ Docker build │
                  │                 │
                  │ CD              │
                  │ └─ Deploy Hook  │
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
│   │   └── index.css
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   │
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
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

The application can be run locally using Docker Compose. The local architecture consists of three services:

```text
Docker Compose
│
├── Frontend
│   └── React + Nginx
│
├── Backend
│   └── Node.js + Express
│
└── MongoDB
    └── MongoDB 8
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
       Frontend Build      Backend Image
              │                 │
              └────────┬────────┘
                       │
                    SUCCESS
                       │
                       ▼
             Continuous Deployment
                       │
                       ▼
                 Render Deploy
                       │
                       ▼
                 Production
```

**CI performs:**
- Repository checkout
- Node.js setup
- Backend dependency installation
- Frontend dependency installation
- Frontend production build
- Backend Docker image build
- Frontend Docker image build

**CD performs:**
After CI succeeds, GitHub Actions triggers the Render deployment using a secure deployment hook stored in GitHub Secrets. This prevents deployment when the CI pipeline fails.

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

## 🗄️ Database Design

MongoDB uses collections rather than traditional SQL tables.

```text
devflow
│
├── users
├── projects
└── tasks
```

**Projects**
```js
{
  _id: ObjectId,
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Tasks**
```js
{
  _id: ObjectId,
  title: String,
  status: String,      // TODO | IN_PROGRESS | DONE
  project: ObjectId,    // ref -> Project._id
  createdAt: Date,
  updatedAt: Date
}
```

Tasks reference projects using the project's MongoDB ObjectId:

```text
Task
 │
 └── project ──────▶ Project._id
```

---

## 🔌 REST API

**Health**
```
GET /api/health
```

**Projects**
```
GET  /api/projects
POST /api/projects
```

**Tasks**
```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 🧪 Testing the API

**Health check**
```bash
curl http://localhost:5000/api/health
```

**Create a project**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"DevFlow","description":"CI/CD demonstration project"}'
```

**Create a task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Implement CI pipeline","project":"PROJECT_ID"}'
```

---

## 🔒 Security Considerations

The project follows several basic security practices:

- Environment variables for secrets
- `.env` excluded from Git
- Database credentials not stored in source code
- GitHub Secrets used for deployment credentials
- Production database hosted separately from application containers

For a larger production system, additional measures would include:

- JWT authentication
- Role-based authorization
- Request validation
- Rate limiting
- HTTPS enforcement
- Security headers
- Centralized logging
- Monitoring and alerting

---

## 🚀 Future Improvements

Potential improvements include:

- User authentication and authorization
- Role-based access control
- Project members
- Task assignment
- Due dates
- Task priorities
- Search and filtering
- Kanban board
- Automated tests
- Redis caching
- API documentation with Swagger
- Monitoring and logging
- Custom domain
- Infrastructure as Code using Terraform

---

## 📚 What This Project Demonstrates

This project demonstrates practical knowledge of:

- Full-stack JavaScript development
- REST API development
- MongoDB data modeling
- React frontend development
- Docker containerization
- Docker Compose
- Git and GitHub
- GitHub Actions
- Continuous Integration
- Continuous Deployment
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
