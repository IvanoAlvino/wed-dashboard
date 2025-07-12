# System Patterns: WeAreDevelopers Conference Talk Rating Dashboard

## Architecture Overview
Full-stack web application following modern enterprise patterns with clear separation of concerns between presentation, business logic, and data layers.

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Angular       │ ◄──────────────► │   Spring Boot   │
│   Frontend      │                  │   Backend       │
│   (Port 4200)   │                  │   (Port 8080)   │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   H2 Database   │
                                     │   (In-Memory)   │
                                     └─────────────────┘
```

## Backend Architecture Patterns

### 1. Layered Architecture
**Pattern**: Classic n-tier architecture with clear layer separation
```
Controller Layer (REST endpoints)
    ▼
Service Layer (Business logic)
    ▼
Repository Layer (Data access)
    ▼
Entity Layer (Domain models)
```

### 2. Repository Pattern
**Implementation**: Spring Data JPA repositories
- `UserRepository`: User management operations
- `TalkRepository`: Talk CRUD and queries
- `RatingRepository`: Rating operations with user-talk constraints

**Benefits**: Data access abstraction, query encapsulation, testing isolation

### 3. DTO Pattern
**Purpose**: API contract stability and data transformation
- `AuthRequest/AuthResponse`: Authentication flow
- `RegisterRequest`: User registration
- `RatingRequest`: Rating submission
- `TalkResponse`: Talk data with computed averages

### 4. Security Patterns

#### JWT Token-Based Authentication
```
Login → JWT Generation → Token Storage → Request Headers → Validation
```

#### Filter Chain Pattern
- `AuthTokenFilter`: JWT validation and user context setting
- `WebSecurityConfig`: Security configuration and endpoint protection

#### Principal Pattern
- `UserPrincipal`: Custom authentication object
- `CustomUserDetailsService`: User loading for Spring Security

### 5. Configuration Patterns
- **`@Configuration` Classes**: Centralized configuration management
- **`@Component` Scanning**: Automatic bean discovery
- **Profile-based Configuration**: Environment-specific settings

## Frontend Architecture Patterns

### 1. Angular Standalone Components
**Modern Pattern**: Component-first architecture without NgModules
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  // ...
})
```

### 2. Service Layer Pattern
**Services as Singletons**: Centralized business logic and data management
- `AuthService`: Authentication state management
- `TalkService`: Talk data operations and caching

### 3. Guard Pattern
**Route Protection**: Declarative access control
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  // Route protection logic
}
```

### 4. Interceptor Pattern
**Cross-cutting Concerns**: Automatic request/response handling
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // JWT token attachment to requests
}
```

### 5. Reactive Patterns
**Observable Streams**: Reactive programming with RxJS
- HTTP operations return Observables
- State management through BehaviorSubjects
- Async pipe for template integration

## Data Model Patterns

### 1. Entity Relationship Pattern
```
User (1) ←────→ (N) Rating (N) ←────→ (1) Talk
```

### 2. Unique Constraint Pattern
**One Rating Per User-Talk Pair**
```sql
UNIQUE KEY (user_id, talk_id)
```

### 3. Audit Pattern
**Timestamps**: Creation and modification tracking
- `createdAt`: Initial rating timestamp
- `updatedAt`: Last modification timestamp

### 4. Validation Patterns
**Bean Validation**: Declarative validation rules
```java
@NotNull
@Min(1) @Max(5)
private Integer rating;
```

## API Design Patterns

### 1. RESTful Resource Pattern
```
GET    /api/talks           # List all talks
POST   /api/auth/signin     # Authentication
POST   /api/ratings         # Submit rating
```

### 2. CORS Pattern
**Cross-Origin Configuration**: Frontend-backend communication
```java
@CrossOrigin(origins = "http://localhost:4200")
```

### 3. Error Handling Pattern
**Consistent Error Responses**: Standardized error format
- HTTP status codes
- Structured error messages
- Exception mapping

## State Management Patterns

### 1. Frontend State
**Service-based State**: Centralized state in Angular services
- `AuthService`: User authentication state
- Local component state for UI interactions

### 2. Backend State
**Stateless Services**: Each request is independent
- JWT tokens carry user context
- Database maintains persistent state

## Security Patterns

### 1. Authentication Flow
```
1. User submits credentials
2. Backend validates against database
3. JWT token generated and returned
4. Frontend stores token (localStorage)
5. Token included in subsequent requests
6. Backend validates token for protected endpoints
```

### 2. Authorization Pattern
**Role-based Access**: User roles determine access levels
- Authenticated users can rate talks
- All users can view talk listings

### 3. Input Validation
**Multi-layer Validation**:
- Frontend: Form validation for UX
- Backend: Bean validation for security
- Database: Constraint validation for integrity

## Development Patterns

### 1. Data Initialization Pattern
**`DataInitializer`**: Automatic sample data loading
- Demo users for testing
- Sample conference talks
- Development environment setup

### 2. Configuration Management
**Environment-specific Properties**:
- `application.yml`: Base configuration
- Profile-specific overrides for deployment

### 3. Build Patterns
**Multi-module Structure**:
- Backend: Maven-based Java build
- Frontend: npm/Angular CLI build
- Independent deployment capabilities

## Performance Patterns

### 1. Lazy Loading
**Frontend**: Route-based code splitting
**Backend**: JPA lazy loading for entity relationships

### 2. Caching Patterns
**Browser Caching**: Static assets
**Connection Pooling**: Database connections

### 3. Pagination Readiness
**Repository Methods**: Designed for future pagination implementation

## Testing Patterns

### 1. Layer Testing
**Separation of Concerns**: Each layer independently testable
- Unit tests for services
- Integration tests for repositories
- Component tests for frontend

### 2. Mock Patterns
**Test Isolation**: Mock external dependencies
- Database mocking for unit tests
- HTTP mocking for frontend tests

## Deployment Patterns

### 1. Development Pattern
**Local Development**: H2 in-memory database
- Zero configuration database
- Automatic schema generation
- Sample data initialization

### 2. Production Readiness
**Database Migration**: PostgreSQL compatibility
- JPA annotations support multiple databases
- Connection configuration externalized
