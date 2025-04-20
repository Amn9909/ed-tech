# 🧑‍🎓 Student Management System

A full-stack monorepo application for managing student data. Features include authentication, Excel file import, dashboard UI, and paginated student records.

---

## 📁 Project Structure

```
.
├── apps
│   ├── backend       # NestJS backend application (API, services, database)
│   └── web-app       # React frontend application (Dashboard, Auth, UI)
├── docker-compose.yml # Docker setup for services like PostgreSQL
├── package.json       # Root dependency manager
├── turbo.json         # TurboRepo config
└── README.md
```

### Key Parts

- **apps/backend** – Handles APIs, file uploads, and pagination using NestJS.
- **apps/web-app** – React UI with student table, import modal, login/signup pages.
- **docker-compose.yml** – Runs PostgreSQL and other services via Docker.
- **turbo.json** – Configures workspace for running backend & frontend together.

---

## 🚀 Running the Project Locally

### 1. Install dependencies

From the root folder:

```bash
npm install
```

---

### 2. Start Docker services

Make sure [Docker](https://www.docker.com/) is running, then:

```bash
docker compose up
```

This starts PostgreSQL and any other services.

---

### 3. Start development servers

Open a new terminal and run:

```bash
npx turbo run dev
```

This starts both the frontend (`apps/web-app`) and backend (`apps/backend`) development servers.

---

## ✨ Features

- 🔐 Login and Signup functionality
- 📊 Student dashboard with paginated data
- 📁 Excel (.xlsx) file upload to import student records
- ⚙️ Backend with PostgreSQL, TypeORM, NestJS
- 🌐 Frontend with React, Tailwind CSS, React Router
- 🧩 TurboRepo for monorepo management

---

## 📬 Contact

If anything doesn't work or you need help, feel free to reach out:

**Email:** [amankazi.dev@gmail.com](mailto:amankazi.dev@gmail.com)

---

## 👑 Owner & Rights

**Owner:** Aman Kazi  
**© All rights reserved.**