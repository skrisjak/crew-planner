## Crew Planner

Crew Planner is a shared calendar application designed to simplify shift planning and crew management. The app enables teams to collaboratively plan shifts, manage availability, and stay informed through real‑time notifications. Authentication is handled via Google OAuth, ensuring secure and seamless access.

### ✨ Features

 - 📅 Shared calendar for shift planning

 - 👥 Multi‑role access (e.g. crew member, manager)

 - 🔐 Authentication via Google OAuth

 - 🔔 Web‑push notifications for important events

 - 📱 Mobile‑friendly UI

 - 🐳 Dockerized deployment

### 🖥️ Frontend (UI)

The frontend is implemented as a Single Page Application (SPA).

Tech stack:

 - React

 - Material UI (MUI)

 - Zustand (state management)

 - Drag & Drop Kit (interactive shift manipulation)

Key characteristics:

 - Responsive and mobile‑friendly design

 - Drag & drop shift assignment

 - Centralized state management with Zustand

 - Clean and modern UI based on Material Design

### ⚙️ Backend

The backend is a Spring Boot based web service following a layered architecture.

Tech stack:

 - Java / Spring Boot

 - PostgreSQL

 - REST API

 - Web Push Notifications

Responsibilities:

 - User authentication and authorization

 - Multi‑role access control

 - Shift and calendar management

 - Persistence layer backed by PostgreSQL

 - Sending push notifications on relevant events (e.g. shift changes)

### 🚀 Deployment

The application is fully containerized and deployed using Railway.

Docker image build for both frontend and backend

Railway used for hosting and orchestration

Environment‑based configuration (database, OAuth, push notifications)
