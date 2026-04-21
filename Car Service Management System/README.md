# Car Service Management System (CSMS)

A full-stack web application designed to manage and track vehicle service operations digitally. This system allows customers to register, manage vehicles, and submit service requests, while administrators can monitor requests and update service status.

## Technology Stack

### Backend
- **Java 17** with Spring Boot 3.2.0
- **MySQL** Database
- **Spring Security** with JWT Authentication
- **Spring Data JPA** for database operations
- **Maven** for dependency management

### Frontend
- **React 18** with functional components
- **React Router** for navigation
- **Axios** for HTTP requests
- **Bootstrap 5** for responsive UI
- **Material Icons** for icons

## Features

### Administrator Features
- **Secure Login**: JWT-based authentication
- **User Management**: View, edit, and delete customer accounts
- **Service Request Management**: View all requests, update status, filter by status
- **Car Management**: View all registered vehicles
- **Dashboard**: Real-time statistics and overview

### Customer Features
- **User Registration**: Create new customer accounts
- **Profile Management**: Update personal information
- **Car Management**: Add, edit, and delete personal vehicles
- **Service Requests**: Create new service requests, track status
- **Dashboard**: Personal statistics and quick actions

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Encrypted)
- `phone` (String)
- `role` (Enum: ADMIN, CUSTOMER)

### Cars Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `car_model` (String)
- `car_brand` (String)
- `car_number` (String, Unique)

### Service Requests Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `car_id` (Foreign Key to Cars, Nullable)
- `service_type` (String)
- `description` (Text, Nullable)
- `request_date` (DateTime)
- `status` (Enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- `updated_date` (DateTime)

## Project Structure

```
Car Service Management System/
|
backend/
|-- src/main/java/com/csms/
|   |-- CarServiceManagementApplication.java
|   |-- controller/
|   |   |-- AuthController.java
|   |   |-- UserController.java
|   |   |-- CarController.java
|   |   |-- ServiceRequestController.java
|   |-- entity/
|   |   |-- User.java
|   |   |-- Car.java
|   |   |-- ServiceRequest.java
|   |-- repository/
|   |   |-- UserRepository.java
|   |   |-- CarRepository.java
|   |   |-- ServiceRequestRepository.java
|   |-- service/
|   |   |-- UserService.java
|   |   |-- CarService.java
|   |   |-- ServiceRequestService.java
|   |-- security/
|   |   |-- SecurityConfig.java
|   |   |-- JwtUtil.java
|   |   |-- JwtAuthenticationFilter.java
|   |   |-- JwtAuthenticationEntryPoint.java
|   |   |-- CustomUserDetailsService.java
|-- src/main/resources/
|   |-- application.properties
|-- pom.xml

frontend/
|-- public/
|   |-- index.html
|-- src/
|   |-- components/
|   |   |-- Auth/
|   |   |   |-- Login.js
|   |   |   |-- Register.js
|   |   |-- Admin/
|   |   |   |-- AdminDashboard.js
|   |   |   |-- Dashboard.js
|   |   |   |-- UsersManagement.js
|   |   |   |-- ServiceRequestsManagement.js
|   |   |   |-- CarsManagement.js
|   |   |-- Customer/
|   |   |   |-- CustomerDashboard.js
|   |   |   |-- Dashboard.js
|   |   |   |-- MyCars.js
|   |   |   |-- ServiceRequests.js
|   |   |   |-- Profile.js
|   |-- contexts/
|   |   |-- AuthContext.js
|   |-- App.js
|   |-- App.css
|   |-- index.js
|   |-- index.css
|-- package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Cars
- `POST /api/cars` - Add new car
- `GET /api/cars/user/{userId}` - Get user's cars
- `GET /api/cars/{id}` - Get car by ID
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car
- `GET /api/cars` - Get all cars (Admin only)

### Service Requests
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests/user/{userId}` - Get user's requests
- `GET /api/service-requests/status/{status}` - Get requests by status (Admin only)
- `GET /api/service-requests/{id}` - Get request by ID
- `PUT /api/service-requests/{id}` - Update service request
- `PUT /api/service-requests/{id}/status` - Update request status (Admin only)
- `DELETE /api/service-requests/{id}` - Delete request (Admin only)

## Installation and Setup

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Node.js 16 or higher
- npm or yarn

### Database Setup
1. Create a MySQL database named `car_service_db`
2. Update database credentials in `backend/src/main/resources/application.properties`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Usage

### Default Admin Account
After starting the application, you can register an admin account:
1. Go to `http://localhost:3000/register`
2. Fill in the details and select "Administrator" as account type
3. Use this account to access admin features

### Customer Workflow
1. Register a new customer account
2. Login to the customer dashboard
3. Add your vehicles in "My Cars" section
4. Create service requests for your vehicles
5. Track the status of your service requests

### Admin Workflow
1. Login with admin credentials
2. View dashboard statistics
3. Manage users, cars, and service requests
4. Update service request statuses
5. Monitor all system activities

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Database connection settings
- JWT secret and expiration
- Server port
- CORS settings

### Frontend Configuration
The frontend is configured to proxy API requests to `http://localhost:8080` via the `proxy` setting in `package.json`.

## Security Features
- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration
- Input validation

## Testing
- Backend: Use Postman or similar tools to test API endpoints
- Frontend: Test through the web interface
- Database: Verify data integrity through MySQL client

## Future Enhancements
- Email notifications for service status updates
- File upload for service documents
- Payment integration
- Advanced reporting and analytics
- Mobile application
- Real-time notifications with WebSocket

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is for educational purposes as part of an internship program.
