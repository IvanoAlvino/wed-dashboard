# Multi-stage build for single container deployment

# Stage 1: Build Angular frontend
FROM --platform=linux/amd64 node:18-slim AS frontend-build
WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY frontend/package*.json ./
RUN rm -f package-lock.json && npm install
COPY frontend/ .
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot backend
FROM maven:3.8-openjdk-17-slim AS backend-build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src

# Copy Angular build output to Spring Boot's static resources
COPY --from=frontend-build /app/dist/wed-conference-frontend ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Runtime container
FROM openjdk:17-jdk-slim
WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the Spring Boot JAR (now includes Angular static files)
COPY --from=backend-build /app/target/*.jar app.jar

# Create non-root user for security
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
