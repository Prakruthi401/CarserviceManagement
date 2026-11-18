# Java backend API reference

Endpoints implemented by the Spring Boot backend in `backend-java/`. Base URL is `http://localhost:8080/api`.

Everything except `/api/auth/**` needs a JWT from login or register:

```
Authorization: Bearer <token>
```

## Auth

- `POST /auth/register` - create an account
- `POST /auth/login` - log in, returns a token
- `GET /auth/me` - the logged-in user's details

## Cars

- `POST /cars` - add a car
- `GET /cars/user/{userId}` - a user's cars
- `GET /cars/{id}` - one car
- `GET /cars` - all cars
- `PUT /cars/{id}` - update a car
- `DELETE /cars/{id}` - remove a car

## Service requests

- `POST /service-requests` - create a request
- `GET /service-requests/user/{userId}` - a user's requests
- `GET /service-requests/status/{status}` - filter by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`)
- `GET /service-requests/filter` - combined filters
- `GET /service-requests/{id}` - one request
- `GET /service-requests` - all requests
- `PUT /service-requests/{id}` - update a request
- `PUT /service-requests/{id}/status` - change only the status
- `DELETE /service-requests/{id}` - remove a request

## Users

- `GET /users` - all users
- `GET /users/{id}` - one user
- `PUT /users/{id}` - update a user
- `DELETE /users/{id}` - remove a user

## Not implemented

Notification, report, settings and invoice endpoints were drafted once but their services were never written. The controller sketches are kept under `docs/incomplete-java-controller-examples/` for reference only; they are not part of the running application.
