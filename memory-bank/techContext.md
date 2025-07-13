# Technical Context: WeAreDevelopers Conference Talk Rating Dashboard

## Technology Stack

### Backend Technologies
- **Java 17**: Modern LTS version with latest features
- **Spring Boot 3.x**: Framework for rapid application development
  - Spring Web: REST API development
  - Spring Security: Authentication and authorization
  - Spring Data JPA: Database abstraction layer
  - Spring Boot Starter: Auto-configuration and dependency management
- **H2 Database**: In-memory database for development
- **PostgreSQL**: Production database (configuration ready)
- **Maven**: Build automation and dependency management
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism

### Frontend Technologies
- **Angular 20+**: Modern web application framework
  - Standalone Components: Modern component architecture
  - Functional Guards: Modern route protection pattern
  - Angular Material: UI component library
  - Angular CLI: Development tooling
- **TypeScript**: Type-safe JavaScript superset
- **RxJS**: Reactive programming library
- **SCSS**: Enhanced CSS with variables and mixins
- **Node.js 18+**: JavaScript runtime for development
- **npm**: Package management

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **Maven**: Java project management
- **VS Code**: Primary development environment
- **Git**: Version control system

## Development Environment Setup

### Prerequisites Checklist
```bash
# Verify Java installation
java -version  # Should show Java 17+

# Verify Maven installation  
mvn -version   # Should show Maven 3.6+

# Verify Node.js installation
node -version  # Should show Node 18+

# Verify Angular CLI installation
ng version     # Should show Angular CLI 20+
```

### Backend Setup Process
```bash
# Navigate to backend directory
cd backend

# Install dependencies and compile
mvn clean install

# Run application
mvn spring-boot:run

# Application starts on http://localhost:8080
```

### Frontend Setup Process
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve

# Application starts on http://localhost:4200
```

## Database Configuration

### Development Database (H2)
```yaml
# application.yml configuration
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password
    driver-class-name: org.h2.Driver
  h2:
    console:
      enabled: true
      path: /h2-console
```

**Access**: 
- Console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

### Production Database (PostgreSQL Ready)
```yaml
# Production configuration template
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/conference_rating
    username: ${DB_USERNAME:conference_user}
    password: ${DB_PASSWORD:secure_password}
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/signin
  Body: { "username": "string", "password": "string" }
  Response: { "token": "jwt_token", "username": "string" }

POST /api/auth/signup
  Body: { "username": "string", "password": "string" }
  Response: { "message": "User registered successfully" }
```

### Talk Endpoints
```
GET /api/talks
  Response: TalksByDate object with talks grouped by date
  Authentication: Not required

GET /api/talks/{id}
  Response: Talk object with details
  Authentication: Not required
```

### Rating Endpoints
```
POST /api/ratings
  Body: { "talkId": number, "rating": number, "comment": "string" }
  Headers: Authorization: Bearer {jwt_token}
  Response: Rating object

PUT /api/ratings/{id}
  Body: { "rating": number, "comment": "string" }
  Headers: Authorization: Bearer {jwt_token}
  Response: Updated rating object
```

## Security Configuration

### JWT Implementation
```java
// JWT Token Structure
{
  "sub": "username",
  "iat": timestamp,
  "exp": timestamp,
  "authorities": ["ROLE_USER"]
}
```

### Security Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### CORS Configuration
```java
@CrossOrigin(origins = "http://localhost:4200")
// Allows frontend-backend communication in development
```

## Build Configuration

### Backend Build (Maven)
```xml
<!-- Key dependencies in pom.xml -->
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
</dependencies>
```

### Frontend Build (Angular)
```json
// Key configurations in angular.json
{
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "port": 4200,
      "host": "localhost"
    }
  },
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "outputPath": "dist/frontend"
    }
  }
}
```

## Environment Variables

### Development Defaults
```bash
# Backend
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=defaultSecretForDevelopment
JWT_EXPIRATION=86400000  # 24 hours

# Frontend
NODE_ENV=development
API_BASE_URL=http://localhost:8080/api
```

### Production Environment Variables
```bash
# Database
DB_HOST=production-db-host
DB_PORT=5432
DB_NAME=conference_rating
DB_USERNAME=app_user
DB_PASSWORD=secure_production_password

# Security
JWT_SECRET=production_secret_key_should_be_complex
JWT_EXPIRATION=3600000  # 1 hour for production

# Application
ALLOWED_ORIGINS=https://your-domain.com
SPRING_PROFILES_ACTIVE=prod
```

## Port Configuration

### Default Ports
- **Backend**: 8080 (Spring Boot default)
- **Frontend**: 4200 (Angular CLI default)
- **H2 Console**: 8080/h2-console

### Port Conflicts Resolution
```bash
# Change Angular port
ng serve --port 4201

# Change Spring Boot port
SERVER_PORT=8081 mvn spring-boot:run
# or in application.yml: server.port: 8081
```

## Testing Configuration

### Backend Testing
```bash
# Run unit tests
mvn test

# Run with coverage
mvn test jacoco:report
```

### Frontend Testing
```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e

# Run tests with coverage
ng test --code-coverage
```

## Performance Considerations

### Database Optimization
- **Connection Pooling**: HikariCP (Spring Boot default)
- **Query Optimization**: JPA query methods with proper indexing
- **Lazy Loading**: Configured for rating relationships

### Frontend Optimization
- **Lazy Loading**: Route-based code splitting
- **OnPush Strategy**: Change detection optimization
- **Tree Shaking**: Automatic with Angular CLI build

## Development Workflow

### Hot Reload Setup
- **Backend**: Spring Boot DevTools enabled
- **Frontend**: Angular CLI watch mode automatic

### Debugging Configuration
- **Backend**: Remote debugging on port 5005
- **Frontend**: Source maps enabled for development

### Code Quality Tools
- **Java**: Built-in compiler warnings and Spring Boot actuator
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint configuration for Angular

## Deployment Preparation

### Production Build Commands
```bash
# Backend
mvn clean package -Pprod

# Frontend  
ng build --configuration=production
```

### Docker Readiness
Project structure supports containerization:
- Backend: JAR file deployment
- Frontend: Static file serving
- Database: External PostgreSQL container

## Troubleshooting Common Issues

### Backend Issues
- **Port 8080 in use**: Change server.port in application.yml
- **Database connection**: Verify H2 console access
- **JWT errors**: Check secret configuration and token expiration

### Frontend Issues
- **CORS errors**: Verify backend CORS configuration
- **Module not found**: Run `npm install`
- **Port conflicts**: Use `ng serve --port <new-port>`

### Integration Issues
- **Authentication failures**: Verify JWT token format and expiration
- **API timeouts**: Check backend service status
- **Route protection**: Verify AuthGuard implementation
