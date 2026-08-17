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

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

## Backend

- Node.js
- Express.js
- Mongoose
- REST API

## Database

- MongoDB
- MongoDB Atlas

## DevOps

- Docker
- Docker Compose
- GitHub Actions
- Render

## Development Environment

- WSL Ubuntu
- Git
- GitHub
- VS Code

---

# 🏗️ Architecture

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
