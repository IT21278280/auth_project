# Authentication Microservices Project

This project implements a microservices-based authentication system using Node.js, Express, and MongoDB Atlas. It consists of three microservices: `user-auth` (handles user registration and login), `notification` (sends email notifications), and `user-profile` (manages user profiles). The services are containerized with Docker, orchestrated with Docker Compose, and integrated with a CI/CD pipeline and security scanning.

## Table of Contents
- [Project Overview](#project-overview)
- [Microservices](#microservices)
  - [user-auth](#user-auth)
  - [notification](#notification)
  - [user-profile](#user-profile)
- [Docker Setup](#docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security](#security)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Setup and Running Locally](#setup-and-running-locally)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The project is a distributed authentication system built with Node.js and Express, using MongoDB Atlas for persistent data storage. Each microservice is independently deployable, communicates via HTTP, and is containerized for scalability and portability. Key features include:
- User registration and login with JWT-based authentication.
- Email notifications for user registration.
- User profile management with CRUD operations.
- CI/CD pipeline with GitHub Actions for automated builds and deployments.
- Security scanning with SonarCloud to ensure code quality.

## Microservices

### user-auth
- **Purpose**: Handles user registration and login, storing user data in MongoDB Atlas.
- **Endpoints**:
  - `POST /api/auth/register`: Registers a new user and triggers a welcome email.
  - `POST /api/auth/login`: Authenticates a user and returns a JWT token.
- **Technologies**:
  - Node.js, Express, Mongoose
  - bcryptjs for password hashing
  - jsonwebtoken for JWT generation
  - axios for HTTP requests to `notification`
  - express-validator for input validation
- **Database**: MongoDB Atlas (`userAuthDB`)
- **Port**: 3002

### notification
- **Purpose**: Sends email notifications for user registration events.
- **Endpoint**:
  - `POST /api/notify`: Sends an email to the specified user.
- **Technologies**:
  - Node.js, Express
  - nodemailer for email sending
  - express-validator for input validation
- **Port**: 3003

### user-profile
- **Purpose**: Manages user profiles, allowing creation, retrieval, updating, and deletion.
- **Endpoints**:
  - `POST /api/profile`: Creates or updates a user profile (requires JWT).
  - `GET /api/profile/:userId`: Retrieves a user profile (requires JWT).
  - `DELETE /api/profile/:userId`: Deletes a user profile (requires JWT).
- **Technologies**:
  - Node.js, Express, Mongoose
  - jsonwebtoken for JWT verification
  - express-validator for input validation
- **Database**: MongoDB Atlas (`userAuthDB`)
- **Port**: 3001

## Docker Setup
- **Images**:
  - `rusithfernando/user-auth:latest`
  - `rusithfernando/notification:latest`
  - `rusithfernando/user-profile:latest`
- **Build**:
  - Each microservice has a `Dockerfile` in its respective directory.
  - Build with: `docker-compose build`
- **Run**:
  - Orchestrated with `docker-compose.yml`.
  - Run with: `docker-compose up --build`
  - Ports:
    - `user-auth`: `3002:3002`
    - `notification`: `3003:3003`
    - `user-profile`: `3001:3001`
- **Network**: All services communicate over a custom bridge network (`app-network`).
- **Environment**:
  - `user-auth` and `user-profile` use environment variables for `MONGO_URI`, `JWT_SECRET`, and `PORT`.
  - `notification` uses an `.env` file for SMTP credentials.
- **Testing**:
  - Endpoints tested successfully in containers using Postman.
  - MongoDB Atlas connectivity verified with DNS resolution (Google DNS: `8.8.8.8`, `8.8.4.4`).

## CI/CD Pipeline
- **Tool**: GitHub Actions
- **Workflow**: `.github/workflows/ci-cd.yml`
- **Functionality**:
  - Triggered on push to `main` branch.
  - Builds Docker images for `user-auth`, `notification`, and `user-profile`.
  - Runs unit tests using Jest (`npm test`).
  - Pushes images to Docker Hub (`rusithfernando/<service>:latest`).
  - Runs SonarCloud SAST scan for code quality.
- **Configuration**:
  - Secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` for Docker Hub access.
  - SonarCloud: Project Key `IT21278280_auth_project`, Organization `it21278280`.

## Security
- **SonarCloud**:
  - Static Application Security Testing (SAST) scans code on every push to `main`.
  - Configured in `.sonarcloud.properties`.
  - Automatic Analysis disabled to enable CI-based scanning.
  - Quality Gate metrics: coverage (target ≥ 60%), new issues, duplications (≤ 5%).
- **Security Hotspots**:
  - Reviewed and resolved (e.g., `notification/Dockerfile`, `axios` internal calls).
  - Hardcoded credentials in `MONGO_URI` mitigated by using environment variables.
- **MongoDB Atlas**:
  - Network Access restricted to trusted IPs (temporary `0.0.0.0/0` for testing).
- **JWT**: Secure token generation and verification with `jsonwebtoken`.

## Testing
- **Unit Tests**:
  - `user-auth`: 6 Jest tests (~90% coverage) for registration, login, and error cases.
  - `notification`: 3 Jest tests (~90% coverage) for email sending and validation.
  - `user-profile`: Assumed Jest tests for profile CRUD operations.
  - Run with: `npm test` in each service directory.
- **Integration Tests**:
  - Postman used to test all API endpoints (see [API Endpoints](#api-endpoints)).
  - Verified MongoDB connectivity, email delivery, and JWT authentication.
- **Docker**:
  - Tested with `docker-compose up --build`.
  - Ensured inter-service communication via `app-network`.
- **CI/CD**:
  - GitHub Actions verifies tests and SonarCloud scans on each push.

## Environment Variables
- **user-auth**:
  ```env
  PORT=3002
  JWT_SECRET=your_strong_secret_here_12345
  MONGO_URI=mongodb+srv://rusithp:jEDwp09p0wS3HcNa@cluster0.tz2dapj.mongodb.net/userAuthDB?retryWrites=true&w=majority
  ```
- **notification** (`notification/.env`):
  ```env
  PORT=3003
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-app-password
  ```
- **user-profile**:
  ```env
  PORT=3001
  JWT_SECRET=your_strong_secret_here_12345
  MONGO_URI=mongodb+srv://rusithp:jEDwp09p0wS3HcNa@cluster0.tz2dapj.mongodb.net/userAuthDB?retryWrites=true&w=majority
  ```

## Setup and Running Locally
1. **Prerequisites**:
   - Node.js (v18.x)
   - Docker and Docker Compose
   - MongoDB Atlas account
   - Gmail account with App Password for SMTP
2. **Clone Repository**:
   ```bash
   git clone https://github.com/IT21278280/auth_project.git
   cd auth_project
   ```
3. **Install Dependencies**:
   ```bash
   cd user-auth && npm install
   cd ../notification && npm install
   cd ../user-profile && npm install
   ```
4. **Set Environment Variables**:
   - Create `notification/.env` with SMTP credentials.
   - Ensure `MONGO_URI` and `JWT_SECRET` are set in `docker-compose.yml`.
5. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```
6. **Run Tests**:
   ```bash
   cd user-auth && npm test
   cd ../notification && npm test
   cd ../user-profile && npm test
   ```
7. **Test Endpoints**:
   - Use Postman with the [API Endpoints](#api-endpoints) below.
   - Verify email delivery in Gmail.

## API Endpoints
All endpoints tested with Postman. Obtain a JWT token from `user-auth` login for `user-profile` requests.

### user-auth (Base URL: `http://localhost:3002/api/auth`)
- **POST /register**
  - Body: `{"username":"testuser42","email":"test42@example.com","password":"test12345"}`
  - Response: `201`, `{"user":{"id":"...","username":"testuser42","email":"test42@example.com"}}`
  - Checks: User created, welcome email sent.
- **POST /register (Invalid Email)**
  - Body: `{"username":"testuser43","email":"invalid","password":"test12345"}`
  - Response: `400`, `{"errors":[{"msg":"Invalid email"}]}`
- **POST /register (Existing Username)**
  - Body: `{"username":"testuser42","email":"different@example.com","password":"test12345"}`
  - Response: `400`, `{"message":"User already exists"}`
- **POST /register (Existing Email)**
  - Body: `{"username":"differentuser","email":"test42@example.com","password":"test12345"}`
  - Response: `400`, `{"message":"User already exists"}`
- **POST /login**
  - Body: `{"username":"testuser42","password":"test12345"}`
  - Response: `200`, `{"token":"..."}`
- **POST /login (Wrong Password)**
  - Body: `{"username":"testuser42","password":"wrongpassword"}`
  - Response: `401`, `{"message":"Invalid credentials"}`
- **POST /login (Empty Password)**
  - Body: `{"username":"testuser42","password":""}`
  - Response: `400`, `{"errors":[{"msg":"Password is required"}]}`

### notification (Base URL: `http://localhost:3003/api/notify`)
- **POST /notify**
  - Body: `{"userId":"12345","email":"test42@example.com","message":"Test notification message"}`
  - Response: `200`, `{"message":"Email notification sent successfully"}`
  - Checks: Email sent to `test42@example.com`.
- **POST /notify (Invalid Email)**
  - Body: `{"userId":"12345","email":"invalid","message":"Test notification message"}`
  - Response: `400`, `{"errors":[{"msg":"Invalid email"}]}`
- **POST /notify (Missing Message)**
  - Body: `{"userId":"12345","email":"test42@example.com"}`
  - Response: `400`, `{"errors":[{"msg":"Message is required"}]}`

### user-profile (Base URL: `http://localhost:3001/api/profile`)
- **POST /profile** (Header: `Authorization: Bearer <jwt_token>`)
  - Body: `{"firstName":"John","lastName":"Doe","bio":"Software developer"}`
  - Response: `201`, `{"profile":{"userId":"...","firstName":"John","lastName":"Doe","bio":"Software developer",...}}`
- **POST /profile (Update)** (Header: `Authorization: Bearer <jwt_token>`)
  - Body: `{"firstName":"Jane","lastName":"Doe","bio":"Updated bio"}`
  - Response: `200`, `{"profile":{"userId":"...","firstName":"Jane","lastName":"Doe","bio":"Updated bio",...}}`
- **GET /profile/:userId** (Header: `Authorization: Bearer <jwt_token>`)
  - Response: `200`, `{"profile":{"userId":"...","firstName":"Jane","lastName":"Doe","bio":"Updated bio",...}}`
- **GET /profile/invalid_user_id** (Header: `Authorization: Bearer <jwt_token>`)
  - Response: `404`, `{"message":"Profile not found"}`
- **DELETE /profile/:userId** (Header: `Authorization: Bearer <jwt_token>`)
  - Response: `200`, `{"message":"Profile deleted successfully"}`
- **POST /profile (Invalid Data)** (Header: `Authorization: Bearer <jwt_token>`)
  - Body: `{"firstName":"","lastName":""}`
  - Response: `400`, `{"errors":[{"msg":"First name is required"},{"msg":"Last name is required"}]}`
- **POST /profile (No Token)**
  - Body: `{"firstName":"John","lastName":"Doe","bio":"Software developer"}`
  - Response: `401`, `{"message":"No token, authorization denied"}`

## Contributing
- Fork the repository.
- Create a feature branch: `git checkout -b feature/your-feature`.
- Commit changes: `git commit -m "Add your feature"`.
- Push to branch: `git push origin feature/your-feature`.
- Open a pull request.

## License
This project is licensed under the MIT License.