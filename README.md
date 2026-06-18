# 🩺 Schedula

### Intelligent Healthcare Appointment Scheduling Platform

Schedula is a healthcare appointment scheduling backend built using NestJS, PostgreSQL, JWT Authentication, OpenAI APIs, and advanced scheduling strategies.

The platform enables doctor and patient onboarding, doctor discovery, intelligent recommendations, appointment booking, slot generation, and appointment rescheduling with multiple validation checks.

---

# 🚀 Live Deployment

### Base URL

https://schedula-project-urvashi.onrender.com

### Swagger Documentation

https://schedula-project-urvashi.onrender.com/api

### Health Check Endpoint

https://schedula-project-urvashi.onrender.com/health

---

# 📌 Project Overview

Schedula simplifies healthcare appointment management by providing a scalable backend system for doctors and patients.

The system supports:

* User Authentication
* Doctor & Patient Profile Management
* Doctor Discovery
* AI-powered Doctor Recommendations
* Availability Management
* Automatic Slot Generation
* Appointment Booking
* Appointment Cancellation
* Appointment Rescheduling
* Advanced Scheduling Strategies

---

# 🛠 Tech Stack

| Category          | Technologies      |
| ----------------- | ----------------- |
| Backend Framework | NestJS            |
| Language          | TypeScript        |
| Database          | PostgreSQL (Neon) |
| ORM               | TypeORM           |
| Authentication    | JWT               |
| API Documentation | Swagger           |
| API Testing       | Postman           |
| Deployment        | Render            |
| AI Integration    | OpenAI API        |

---

# ⚙️ Environment Variables

Create a `.env` file and add the following variables:

```env
DATABASE_URL=

JWT_SECRET=

OPENAI_API_KEY=

PORT=
```

---

# 🔧 Project Setup

Clone the repository

```bash
git clone https://github.com/urvashi-shah/schedula-urvashi.git
```

Move to project directory

```bash
cd schedula-urvashi
```

Install dependencies

```bash
npm install
```

Run database migrations

```bash
npm run migration:run
```

Start development server

```bash
npm run start:dev
```

---

# 🧩 Features Implemented

## Authentication

✅ User Registration

✅ User Login

✅ JWT Authentication

✅ Role-Based Authorization

---

## Doctor Module

✅ Create Doctor Profile

✅ Get Doctor Profile

✅ Update Doctor Profile

---

## Patient Module

✅ Create Patient Profile

✅ Get Patient Profile

✅ Update Patient Profile

---

## Doctor Discovery

✅ Search Doctors

✅ Filter by Specialization

✅ Pagination Support

---

## AI Recommendation

✅ Symptom-Based Doctor Recommendation

✅ OpenAI Assisted Matching

✅ Fallback Recommendations

---

## Availability Management

✅ Create Recurring Availability

✅ Update Recurring Availability

✅ Delete Recurring Availability

✅ Create Custom Availability Override

✅ Get Availability for Specific Date

---

## Slot Generation

✅ Automatic Slot Generation

✅ Dynamic Slot Duration

✅ Buffer Time Support

✅ Patient Slot View

---

## Appointment Management

✅ Book Appointment

✅ View My Appointments

✅ Cancel Appointment

✅ Reschedule Appointment

---

# 🧠 Advanced Scheduling

### STREAM Scheduling

Continuous patient flow with configurable buffer intervals between appointments.

### WAVE Scheduling

Allows multiple patients to be booked within the same appointment window.

---

# ✨ Validation Enhancements

✅ Appointment overlap detection

✅ Suggested alternative slots

✅ Doctor unavailable recommendations

✅ Prevent booking in past time slots

✅ Prevent rescheduling cancelled appointments

✅ Prevent rescheduling to the same slot

✅ 30-minute cutoff validation for rescheduling

✅ Sequential token number generation

---

# 📄 API Collection

Postman Collection exported and included with the project submission.

Collection File:

```text
Schedula_API.postman_collection.json
```

---

# 🌿 Git Workflow

Feature Branching Strategy was followed during development.

Examples:

```text
feature/day6-doctor-availability

feature/day7-slot-generation

feature/day8-appointment-booking

feature/day9-advanced-scheduling

feature/day10-reschedule-enhancements
```

Changes were merged into the main branch through Pull Requests after implementation, testing, and review.

---

# 📚 Learning Outcomes

This project helped in understanding:

* NestJS Architecture
* JWT Authentication
* TypeORM and Database Migrations
* Swagger API Documentation
* Render Deployment
* Neon PostgreSQL Integration
* Git Branching Strategy
* Pull Request Workflow
* Advanced Scheduling Algorithms
* Appointment Validation Techniques

---

# 👩‍💻 Developer

**Urvashi Shah**

Backend Engineering Intern

Pearl Thoughts
