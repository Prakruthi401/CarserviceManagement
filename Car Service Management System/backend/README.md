# Car Service Management System - Backend

Spring Boot backend application for the Car Service Management System.

## Technology Stack
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- MySQL 8.0
- Maven

## Project Structure
```
src/main/java/com/csms/
|-- CarServiceManagementApplication.java     # Main application class
|-- controller/                              # REST API controllers
|   |-- AuthController.java                  # Authentication endpoints
|   |-- UserController.java                   # User management
|   |-- CarController.java                   # Car management
|   |-- ServiceRequestController.java        # Service request management
|-- entity/                                  # JPA entities
|   |-- User.java                            # User entity
|   |-- Car.java                             # Car entity
|   |-- ServiceRequest.java                  # Service request entity
|-- repository/                              # JPA repositories
|   |-- UserRepository.java                   # User repository
|   |-- CarRepository.java                   # Car repository
|   |-- ServiceRequestRepository.java        # Service request repository
|-- service/                                 # Business logic
|   |-- UserService.java                      # User service
|   |-- CarService.java                      # Car service
|   |-- ServiceRequestService.java           # Service request service
|-- security/                                # Security configuration
|   |-- SecurityConfig.java                  # Spring Security config
|   |-- JwtUtil.java                         # JWT utilities
|   |-- JwtAuthenticationFilter.java         # JWT filter
|   |-- JwtAuthenticationEntryPoint.java     # JWT entry point
|   |-- CustomUserDetailsService.java        # User details service
```

## Database Configuration
Update `src/main/resources/application.properties` with your database settings:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/car_service_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## Running the Application

### Using Maven
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Using IDE
1. Import the project as a Maven project
2. Run the `CarServiceManagementApplication.java` main class

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Users (Admin only for most operations)
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

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

## Security Configuration

### JWT Configuration
```properties
jwt.secret=mySecretKey
jwt.expiration=86400000  # 24 hours
```

### CORS Configuration
```properties
spring.web.cors.allowed-origins=http://localhost:3000
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER'
);
```

### Cars Table
```sql
CREATE TABLE cars (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    car_brand VARCHAR(100) NOT NULL,
    car_number VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Service Requests Table
```sql
CREATE TABLE service_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    car_id BIGINT,
    service_type VARCHAR(200) NOT NULL,
    description TEXT,
    request_date DATETIME NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    updated_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);
```

## Testing with Postman

### Authentication
1. **Register User**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/register`
   - Body: JSON with user details

2. **Login**
   - Method: POST
   - URL: `http://localhost:8080/api/auth/login`
   - Body: JSON with email and password
   - Response: JWT token in response

3. **Use Token**
   - Add Authorization header: `Bearer <token>`

### Example Requests
```json
// Register User
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": "CUSTOMER"
}

// Login
{
    "email": "john@example.com",
    "password": "password123"
}

// Add Car
{
    "carModel": "Camry",
    "carBrand": "Toyota",
    "carNumber": "ABC-1234"
}

// Create Service Request
{
    "serviceType": "Oil Change",
    "description": "Regular oil change service",
    "carId": 1
}
```

## Environment Variables
You can use environment variables instead of hardcoding values in `application.properties`:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=car_service_db
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your_secret_key
```

## Logging
The application uses Spring Boot's default logging configuration. You can customize logging levels in `application.properties`:

```properties
logging.level.com.csms=DEBUG
logging.level.org.springframework.security=DEBUG
```

## Troubleshooting

### Common Issues
1. **Database Connection Error**: Check MySQL service and credentials
2. **Port Already in Use**: Change server port in `application.properties`
3. **JWT Token Issues**: Check JWT secret and expiration settings
4. **CORS Issues**: Verify CORS configuration matches frontend URL

### Health Check
- `GET /actuator/health` - Application health status
- `GET /actuator/info` - Application information

## Production Deployment
1. Build the JAR file: `mvn clean package`
2. Deploy to application server
3. Configure production database
4. Set environment variables
5. Configure reverse proxy (nginx/Apache)
6. Set up SSL/TLS
7. Configure monitoring and logging
