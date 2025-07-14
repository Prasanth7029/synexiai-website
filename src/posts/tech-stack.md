---
title: "Our Technology Stack at SynexiAI"
date: 2025-07-13
summary: "Explore the tools and technologies that power SynexiAI — from Spring Boot microservices to React, Vite, RabbitMQ, and GitHub Actions."
---

# 💻 The SynexiAI Tech Stack

At SynexiAI, we build future-ready systems using a clean, scalable, and modular technology stack.  
Our choices are intentional — designed for performance, flexibility, and long-term evolution.

Here’s an inside look at the technologies we use (and love) across all layers of our ecosystem:

---

## 🧠 Backend – Microservices

Our backend follows a **Spring Boot Microservices** architecture where each service is independently deployable, secure, and domain-driven.

### Core Tools:
- **Java 17**
- **Spring Boot** (Web, Security, Validation, JPA)
- **Spring Security + JWT** for role-based authentication
- **REST APIs** for synchronous communication
- **RabbitMQ** for asynchronous event-driven messaging
- **PostgreSQL** for structured transactional data
- **MongoDB** for unstructured logs (audit history, activity logs)
- **JPA + Hibernate** for ORM
- **JUnit + Mockito** for unit and integration tests

### Microservices:
- `user-service` – Auth & roles (JWT)
- `inventory-service` – Products, stock, cache
- `order-service` – Order placement, inventory sync
- `notification-service` – Email alerts
- `audit-service` – MongoDB audit logging

---

## 🎨 Frontend – React + Vite

The frontend is a blazing-fast **React** SPA (Single Page Application) powered by **Vite**, with modular components and clean routing.

### Core Frontend Stack:
- **React 18**
- **Vite** – Ultra-fast dev & build tool
- **React Router DOM** – Client-side routing
- **Axios** with JWT interceptor
- **Tailwind CSS** – Utility-first styling
- **Chart.js** – For dynamic dashboards (Bar, Doughnut)
- **AOS** – Scroll animations

### UX Focus:
- Role-based dashboards
- JWT session management with Context API
- Responsive layout for desktop & mobile
- Future-proof blog engine using Markdown & `import.meta.glob`

---

## 🛠️ DevOps & CI/CD

We’re committed to **continuous improvement**, automation, and smooth deployments.

### Tools:
- **GitHub Actions** – For CI/CD pipelines
- **Docker (Planned)** – Containerize every service
- **GitHub Pages** – Hosting the frontend
- **Spring Boot Devtools** – Hot reload for faster backend dev
- **Vite Dev Server** – Instant frontend HMR

---

## 🔒 Security Practices

We take security seriously:
- JWT + Spring Security-based authentication
- Role-based authorization at endpoint level
- CORS and CSRF configured per microservice
- Input validation using `@Valid` and custom exception handling

---

## 🔮 Why This Stack?

✅ **Modularity** – Each service is independent  
✅ **Speed** – Vite + Spring Boot + modern JS build tools  
✅ **Scalability** – Add new features or services without breaking core  
✅ **Security** – Proper access control and token validation  
✅ **Open Standards** – React, Java, PostgreSQL, and RabbitMQ have large communities and enterprise reliability  
✅ **Future-Ready** – Perfect for cloud, Kubernetes, and serverless migration

---

## 🧱 Built from Scratch, Built to Last

We’re not just building apps.  
We’re architecting a foundation for the **SynexiAI platform of tomorrow**.

From microservices to UI polish, everything is version-controlled, documented, and continuously improved.

---

🛠️ **Tech is our craft.**  
💡 **Vision is our fuel.**  
🌍 **SynexiAI is our vessel.**

---

_💙 Explore more at [www.synexiai.online](https://www.synexiai.online)  
🧭 Powered by people who dream in code._
