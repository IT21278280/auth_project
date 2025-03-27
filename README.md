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
T e s t   l i n e  
 T e s t   r u n  
 T e s t   a f t e r   d i s a b l i n g   a u t o   a n a l y s i s  
 