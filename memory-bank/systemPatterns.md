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

## JSON Data Integration Patterns

### 1. Data Loading Architecture
**JsonDataLoader Service**: Centralized JSON processing
- Reads from classpath resources (`conference-data.json`)
- Type-safe parsing with Jackson ObjectMapper
- Transformation from complex JSON to simple entity fields

### 2. JSON Mapping Pattern
**POJO Structure**: Hierarchical data mapping
```
ConferenceData
├── sessions[]
    ├── SessionData
    ├── SpeakerData[]
    ├── TrackData
    └── StageData
```

### 3. Data Transformation Pattern
**Complex to Simple Mapping**:
- `speakers[].full_name` → comma-separated string
- `stage.name` → room field
- `track.name` → track field
- `recording_url` → recordingUrl field

### 4. DateTime Processing Pattern
**ISO 8601 Parsing**: Robust datetime handling
```java
DateTimeFormatter.ISO_OFFSET_DATE_TIME
LocalDateTime.parse(dateTimeString, formatter)
```

### 5. Startup Data Loading Pattern
**DataInitializer Integration**: JSON loading at application startup
- Replaces hardcoded sample data
- Fail-fast approach for malformed JSON
- Maintains demo user creation

### 6. Recording URL Integration Pattern
**Frontend Enhancement**: Conditional UI elements
- Recording button appears only when URL exists
- Opens in new tab for better UX
- Styled with gradient background and hover effects

### 7. Error Handling Pattern
**Graceful Degradation**: Robust error handling
- Missing fields default to empty strings
- Invalid datetime falls back to current time
- Malformed JSON prevents application startup

## Search Functionality Patterns

### 1. Reactive Search Pattern
**Real-time Filtering**: Client-side search with reactive programming
```typescript
searchControl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged()
  )
  .subscribe(searchTerm => this.applySearch())
```

### 2. Debounced Input Pattern
**Performance Optimization**: Prevents excessive processing
- 300ms delay between keystrokes and search execution
- `distinctUntilChanged()` prevents duplicate searches
- Client-side filtering avoids API calls

### 3. Dual Data Structure Pattern
**Original and Filtered Data**: Maintains both states
```typescript
talksByDate: TalksByDate | null = null;           // Original data
filteredTalksByDate: TalksByDate | null = null;   // Filtered results
```

### 4. Search Highlighting Pattern
**Visual Feedback**: HTML highlighting of search terms
```typescript
highlightMatch(text: string, searchTerm: string): string {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}
```

### 5. Search State Management Pattern
**Centralized Search State**: Single source of truth
- `searchControl`: FormControl for reactive form handling
- `searchTerm`: Current search string for highlighting
- `clearSearch()`: Reset functionality

### 6. Preserved Functionality Pattern
**Feature Compatibility**: All existing features work with filtered data
- Rating system works on filtered results
- Expand/collapse functionality preserved
- Day grouping maintained in search results

### 7. User Experience Patterns
**Search Feedback**: Comprehensive user guidance
- Result count display: "Found X talks matching 'term'"
- No results state with clear search option
- Visual highlighting of matched terms
- Clear search button when active

### 8. Case-Insensitive Search Pattern
**Flexible Matching**: User-friendly search behavior
```typescript
const normalizedSearch = searchTerm.toLowerCase();
talk.title.toLowerCase().includes(normalizedSearch)
```
