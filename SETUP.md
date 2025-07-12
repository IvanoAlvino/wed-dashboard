# WeAreDevelopers Conference Rating Setup Guide

## Project Overview
A full-stack webapp for rating talks from the WeAreDevelopers conference, built with Spring Boot (backend) and Angular (frontend).

## Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **Angular CLI 17** (`npm install -g @angular/cli`)

## Backend Setup (Spring Boot)

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies and run
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Test the API
- H2 Database Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: `password`
- API Base URL: `http://localhost:8080/api`

### 4. Sample API Endpoints
- `GET /api/talks` - Get all talks grouped by date
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/ratings` - Submit a rating (requires authentication)

## Frontend Setup (Angular)

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
ng serve
```

The frontend will start on `http://localhost:4200`

## Demo Users
The application comes with pre-created demo users:

| Username | Password |
|----------|----------|
| `demo`   | `password` |
| `admin`  | `password` |

## Sample Data
The application initializes with sample conference talks including:
- Keynotes and technical sessions
- Speakers like Satya Nadella, Josh Long, Kent C. Dodds
- Talks spread across 2 days (May 29-30, 2024)
- Various tracks: Frontend, Backend, DevOps, AI/ML, Security

## Features
- ✅ Talks organized by date and time
- ✅ User authentication with JWT
- ✅ Interactive star rating system (1-5 stars)
- ✅ Real-time rating updates
- ✅ Responsive Material Design UI
- ✅ Average ratings display
- ✅ Track and room information

## Architecture
- **Backend**: Spring Boot 3.x with Spring Security, JPA, H2 Database
- **Frontend**: Angular 17 with standalone components, Angular Material
- **Authentication**: JWT tokens with HTTP interceptors
- **Database**: H2 (in-memory for development)

## Development Notes
- Backend API runs on port 8080
- Frontend development server runs on port 4200
- CORS is configured to allow frontend-backend communication
- JWT tokens are stored in localStorage
- Database is reset on each restart (in-memory H2)

## Production Considerations
To deploy to production:
1. Replace H2 with PostgreSQL or MySQL
2. Configure proper JWT secret and expiration
3. Set up HTTPS
4. Configure environment-specific properties
5. Build Angular app for production (`ng build --prod`)
