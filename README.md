Node.js Express app with Mongoose connects to MongoDB Atlas for user data storage. Handles /register and /login endpoints.
## Docker Setup
- Image: `auth-microservice`
- Built with: `docker build -t auth-microservice .`
- Run with: `docker run -p 3000:3000 --env-file .env auth-microservice`
- Tested endpoints successfully in container.

## CI/CD Pipeline
- Tool: GitHub Actions
- Workflow: `.github/workflows/ci-cd.yml`
- Automates building and pushing `auth-microservice` to Docker Hub on push to `main`.



## CI/CD and Security
- CI/CD pipeline builds and pushes Docker image to Docker Hub.
- SonarCloud SAST scans code on every push to `main` (Project Key: IT21278280_auth_project, Org: it21278280).
- Disabled Automatic Analysis to enable CI-based scanning.