# Car Service Management System

A learning project with a React interface for customer accounts, vehicles, and service requests. This repository contains two backend implementations. Choose one; do not run both on port 8080.

## Repository layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Root React frontend |
| `backend/` | Express demo backend with in-memory data |
| `Car Service Management System/backend/` | Java 17 / Spring Boot 3.2 / MySQL backend |
| `Car Service Management System/frontend/` | Frontend copy for the Java setup |
| `Car Service Management System/mock-backend/` | Older Express mock variant |

The Node demo is not a MySQL-backed service. Its data is seeded in memory and is lost on restart. The Java backend is a separate implementation using Spring Data JPA and MySQL. Four incomplete controller examples (invoice, report, settings, notification) are preserved under `docs/incomplete-java-controller-examples/` outside the executable source tree because their required services were absent. Those Java features are not implemented.

## Quick local demo: Node + React

Use Node.js 20 or 22. Set `JWT_SECRET` to a private random value of at least 32 bytes in the backend terminal. Do not use the old committed `mySecretKey` value.

```sh
cd backend
npm ci
# Set JWT_SECRET in your environment before this command:
npm start
```

In a second terminal:

```sh
cd frontend
npm ci
npm run build
npm run preview
```

Open the local preview URL (normally port 3000). The loopback-only preview proxies API requests to port 8080. `npm start` is also available for the older development server, but its host checks can fail in restricted network environments. Demo seed accounts include `john.anderson@email.com` (customer) and `robert.taylor@email.com` (admin), both with the intentionally public demo password `password123`. Use only synthetic data. The demo API binds to loopback, has public read endpoints and incomplete access checks, and must not be exposed on the internet. The legacy React Scripts dependency tree also has known audit findings that require a separate dependency and security update before hosting.

## Java + MySQL implementation

Requires Java 17, Maven, and a local MySQL database named `car_service_db`. Set `DB_USERNAME`, `DB_PASSWORD`, and a private random `JWT_SECRET` of at least 32 bytes in the environment. The required JWT secret prevents the old short signing key from causing token-generation failures.

```sh
cd "Car Service Management System/backend"
mvn spring-boot:run
```

Run the matching frontend from `Car Service Management System/frontend/` with `npm ci`, `npm run build`, and `npm run preview`. Database tables are updated through Hibernate in the current development configuration. Review that setting before using an existing database.

The Docker Compose configuration in the nested project also requires private `MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`, and `JWT_SECRET` environment values. It is an alternative development setup, not a verified hosted deployment.

## Scope and limits

This is a local demonstration, not a deployed service. Authentication, authorization, seeded demo accounts, CORS, database settings, and error handling need review before handling real customer data. Generated dependency folders are excluded; install packages from the lockfiles. The root README is the setup guide for both implementations; nested setup documents point here to avoid contradictory instructions.
