# Project Plan

## Front End

### Goal:
Get a working version of the frontend deployed to Cloud Run and containerize it.

1. Containerize the frontend using Docker.
2. Deploy the frontend to Cloud Run.

### Key Features for Frontend:

1. Role-based UI
2. Client-side authentication
3. Grabbing the tables from Cloud Database and directly updating it (should be dealing with csv files, not JSON files). Edits should be simple like adding a row removing a row and updating a row. Also the data should be updated in real time so there could be conflicts when multiple users are editing the same row. We need to deal with this by using a version control system based on timestamps and names.
4. Google Genkit AI integration (not needed for now)
5. Docker image (linux/amd64)
6. API integration (needs backend)
7. Secure authentication (needs IAP + backend)


### Timeline:
1. make sure the data update is working (locally)
2. make sure the frontend can update data and upload to cloud using help of backend
3. make sure the frontend's user interface is working for different roles, for now check the role-based UI (no implementation of IAP or secure authentication yet)
4. make sure the frontend is containerized and deployed to Cloud Run


## Back End

### Goal:
Get a working version of the backend deployed to Cloud Run and containerize it.

1. Containerize the backend using Docker.
2. Deploy the backend to Cloud Run.

### Key Features for Backend:

1. Database connection
2. SQLAlchemy models (need to design data pipeling and the database schema)
3. API endpoints (need to design the API endpoints)
4. Authentication middleware (need to design the authentication middleware, make sure IAP works)
5. CRUD operations (need to design the CRUD operations, make sure the data is updated in real time with timestamps and names)

## Database

### Goal:
Get a working version of the database deployed to Cloud SQL and containerize it.

1. Containerize the database using Docker (PostgreSQL 15 image).
    - Use `docker-compose.yml` for local orchestration.
    - Ensure persistent storage with Docker volumes.
2. Deploy the database to Cloud SQL.

### Key Features for Database:

1. Database connection
1. Database connection: Use `database.py` with environment variables to switch between Local Docker DB and Cloud SQL.
2. SQLAlchemy models: Use ORM for all 14 tables, creating relationships (Foreign Keys) to replace CSV parsing.
3. Local Data Persistence: Use Docker Volumes to save data locally.

## Authentication

### Goal:
Get a working version of the authentication deployed to Cloud Run and containerize it.

1. Containerize the authentication using Docker.
2. Deploy the authentication to Cloud Run.

### Key Features for Authentication:

1. Authentication middleware (need to design the authentication middleware, make sure IAP works)
2. CRUD operations (need to design the CRUD operations, make sure the data is updated in real time with timestamps and names)

## Data Pipeline

### Goal:
Get a working version of the data pipeline deployed to Cloud Run and containerize it.

1. Containerize the data pipeline using Docker.
2. Deploy the data pipeline to Cloud Run.

### Key Features for Data Pipeline:

1. Data pipeline (need to design the data pipeline)

## Deployment

### Goal:
Get a working version of the deployment deployed to Cloud Run and containerize it.

1. Containerize the deployment using Docker.
2. Deploy the deployment to Cloud Run.

### Key Features for Deployment:

1. Deployment (need to design the deployment)

## Testing

### Goal:
Get a working version of the testing deployed to Cloud Run and containerize it.

1. Containerize the testing using Docker.
2. Deploy the testing to Cloud Run.

### Key Features for Testing:

1. Testing (need to design the testing)

## Security

### Goal:
Get a working version of the security deployed to Cloud Run and containerize it.

1. Containerize the security using Docker.
2. Deploy the security to Cloud Run.

### Key Features for Security:

1. Security (need to design the security)

## Maintenance

### Goal:
Get a working version of the maintenance deployed to Cloud Run and containerize it.

1. Containerize the maintenance using Docker.
2. Deploy the maintenance to Cloud Run.

### Key Features for Maintenance:

1. Maintenance (need to design the maintenance)

## Future Enhancements

## Lessons Learned
