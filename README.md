# WeAreDevelopers Conference Talk Rating Dashboard

A webapp for rating talks from the WeAreDevelopers conference, helping teams identify valuable content to share.

## Features

- List talks organized by date and time
- Star rating system (1-5 stars)
- User authentication
- Team-based rating collection

## Project Structure

- `frontend/` - Angular application
- `backend/` - Spring Boot REST API

## Getting Started

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```

## Tech Stack

- **Frontend:** Angular 17+, Angular Material
- **Backend:** Spring Boot 3.x, Spring Security, Spring Data JPA
- **Database:** H2 (development), PostgreSQL (production)
