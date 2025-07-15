# WeAreDevelopers Conference Talk Rating Dashboard - Deployment Guide

This guide covers the minimal deployment setup for your internal team using Docker Compose for local testing and Kubernetes with ArgoCD for production deployment.

## Architecture

- **Single Container**: Frontend (Angular) and Backend (Spring Boot) in one container
- **Database**: PostgreSQL with persistent storage
- **Local Testing**: Docker Compose
- **Production**: Kubernetes with ArgoCD GitOps

## Local Testing with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Git repository cloned

### Quick Start
```bash
# Build and run the entire stack
docker-compose up --build

# Access the application
open http://localhost:8080

# Stop the stack
docker-compose down

# Clean up (removes data)
docker-compose down -v
```

### What Docker Compose Provides
- **Application**: Single container with Angular frontend + Spring Boot backend
- **Database**: PostgreSQL with persistent data volume
- **Networking**: Internal network for app-to-database communication
- **Environment**: Configured for local development with PostgreSQL

## Kubernetes Deployment with ArgoCD

### Prerequisites
- Access to your Kubernetes cluster
- ArgoCD installed and configured
- Docker registry access (update image references)

### Deployment Steps

#### 1. Update Image Registry
Edit `k8s/app.yaml` and replace:
```yaml
image: your-registry/wed-dashboard:latest
```
With your actual registry path.

#### 2. Build and Push Container Image
```bash
# Build the image
docker build -t your-registry/wed-dashboard:latest .

# Push to your registry
docker push your-registry/wed-dashboard:latest
```

#### 3. Deploy with ArgoCD
```bash
# Apply the ArgoCD application
kubectl apply -f k8s/argocd-app.yaml

# Check ArgoCD application status
kubectl get applications -n argocd

# Monitor deployment
kubectl get pods -n iv-develop
```

#### 4. Access the Application
Once deployed, the application will be available at:
- **URL**: https://wed-dashboard.renvc.net
- **Namespace**: iv-develop

### What Kubernetes Provides
- **Application Pod**: Single container with frontend + backend
- **PostgreSQL Pod**: Database with persistent volume
- **Services**: Internal cluster networking
- **Ingress**: External access with SSL/TLS
- **Secrets**: Database credentials and JWT secrets

## Configuration Details

### Environment Variables

#### Local (Docker Compose)
```yaml
SPRING_PROFILES_ACTIVE: local
DB_HOST: postgres
DB_USERNAME: conference_user
DB_PASSWORD: local_password
JWT_SECRET: local_jwt_secret_for_development_only
```

#### Kubernetes
```yaml
SPRING_PROFILES_ACTIVE: local
DB_HOST: postgres-service
DB_USERNAME: <from postgres-secret>
DB_PASSWORD: <from postgres-secret>
JWT_SECRET: <from app-secret>
```

### Database Configuration

#### Local Development
- **Type**: PostgreSQL 15
- **Database**: conference_rating
- **User**: conference_user
- **Password**: local_password
- **Data**: Persists in Docker volume `postgres_data`

#### Kubernetes
- **Type**: PostgreSQL 15
- **Database**: conference_rating
- **User**: conference_user (from secret)
- **Password**: postgres_password (from secret)
- **Storage**: 5Gi persistent volume

### Application Endpoints

#### Frontend Routes
- `/` - Main application (talk list)
- `/popular` - Popular talks ranking
- `/login` - User authentication

#### Backend API
- `/api/auth/signin` - User login
- `/api/auth/signup` - User registration
- `/api/talks` - Get all talks
- `/api/talks/popular` - Get popular talks
- `/api/ratings` - Rating operations
- `/api/actuator/health` - Health check

## Troubleshooting

### Local Development Issues

#### Port 8080 Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process or use different port
docker-compose down
```

#### Database Connection Issues
```bash
# Check postgres container logs
docker-compose logs postgres

# Connect to database directly
docker-compose exec postgres psql -U conference_user -d conference_rating
```

#### Application Logs
```bash
# View application logs
docker-compose logs app

# Follow logs in real-time
docker-compose logs -f app
```

### Kubernetes Issues

#### Pod Not Starting
```bash
# Check pod status
kubectl get pods -n iv-develop

# Check pod logs
kubectl logs -f deployment/wed-dashboard -n iv-develop
kubectl logs -f deployment/postgres -n iv-develop

# Describe pod for events
kubectl describe pod <pod-name> -n iv-develop
```

#### Database Issues
```bash
# Check postgres pod
kubectl exec -it deployment/postgres -n iv-develop -- psql -U conference_user -d conference_rating

# Check persistent volume
kubectl get pv,pvc -n iv-develop
```

#### ArgoCD Issues
```bash
# Check ArgoCD application
kubectl get applications -n argocd
kubectl describe application wed-dashboard -n argocd

# ArgoCD UI access (if available)
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

## Security Notes

### Secrets Management
- **Local**: Hardcoded in docker-compose.yml (development only)
- **Kubernetes**: Base64 encoded in secrets (update for production)

### Production Recommendations
1. Use proper secret management (sealed-secrets, external-secrets)
2. Update default passwords in `k8s/postgres.yaml`
3. Generate strong JWT secret in `k8s/app.yaml`
4. Configure proper TLS certificates
5. Set up monitoring and logging

## Customization

### Change Domain
Update `k8s/app.yaml` ingress section:
```yaml
spec:
  tls:
  - hosts:
    - your-domain.renvc.net
  rules:
  - host: your-domain.renvc.net
```

### Change Namespace
Update all files in `k8s/` directory:
```yaml
metadata:
  namespace: your-namespace
```

### Resource Limits
Adjust in `k8s/app.yaml` and `k8s/postgres.yaml`:
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

## Development Workflow

1. **Develop**: Use existing H2 setup for rapid development
2. **Test Integration**: Use `docker-compose up --build` to test with PostgreSQL
3. **Deploy**: Push changes to Git, ArgoCD automatically deploys
4. **Monitor**: Check application health at https://wed-dashboard.renvc.net

This setup provides a simple, minimal deployment solution perfect for internal team use while leveraging your existing Kubernetes infrastructure.
