# How to Run the Car Service Management System

## Current System Status
- Node.js: Available (v24.12.0)
- Java: Not installed
- Maven: Not installed
- MySQL: Not installed

## Option 1: Docker Setup (Recommended)

### Prerequisites
- Docker Desktop installed on your system

### Steps
1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop/

2. **Run the application with Docker Compose:**
   ```bash
   cd "Car Service Management System"
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:3306

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Option 2: Manual Setup (Without Docker)

### Step 1: Install Required Software

#### Install Java 17
1. Download and install Java 17 from: https://adoptium.net/
2. Set JAVA_HOME environment variable
3. Verify installation: `java -version`

#### Install Maven
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract and add to PATH
3. Verify installation: `mvn -version`

#### Install MySQL
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install and start MySQL service
3. Create database:
   ```sql
   CREATE DATABASE car_service_db;
   ```

### Step 2: Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Option 3: Using Online IDE (Quick Test)

If you have issues with local setup, you can use:

1. **Replit**: Upload the project to Replit
2. **Gitpod**: Use Gitpod with the project
3. **CodeSandbox**: Import the frontend

## Option 4: Alternative Database Setup

If MySQL is not available, you can use:

### H2 Database (In-memory)
Update `backend/src/main/resources/application.properties`:
```properties
# H2 Database Setup
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Settings
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
```

Add H2 dependency to `pom.xml`:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Troubleshooting

### Frontend Issues
If React fails to start:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rmdir /s node_modules`
3. Reinstall: `npm install`
4. Try different port: `PORT=3001 npm start`

### Backend Issues
If Spring Boot fails:
1. Check Java version: `java -version`
2. Check Maven version: `mvn -version`
3. Clean and rebuild: `mvn clean install`

### Database Issues
If MySQL connection fails:
1. Verify MySQL is running
2. Check database credentials
3. Test connection: `mysql -u root -p`

## Quick Start Commands

### With Docker (Easiest)
```bash
# One command to start everything
docker-compose up --build

# Access app at http://localhost:3000
```

### Without Docker (Manual)
```bash
# Terminal 1 - Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Frontend
cd frontend
npm start
```

## Default Test Accounts

After starting the application:

1. **Register Admin Account:**
   - Email: admin@test.com
   - Password: admin123
   - Role: Administrator

2. **Register Customer Account:**
   - Email: customer@test.com
   - Password: customer123
   - Role: Customer

## Verification

Once running, test these URLs:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:8080/actuator/health
- API Documentation: http://localhost:8080/swagger-ui.html (if configured)

## Next Steps

1. Choose one of the setup options above
2. Follow the steps carefully
3. Test the application functionality
4. Refer to TESTING.md for comprehensive testing procedures

If you encounter any issues, please check the specific error messages and refer to the troubleshooting section above.
