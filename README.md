# Authentication Microservices Project
#test 1

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


## Deploying to AWS ECS with Fargate

This section outlines the process to deploy the `user-auth`, `notification`, and `user-profile` microservices to AWS ECS with Fargate using the AWS Management Console. The deployment uses IAM roles for secure access, Security Groups to restrict traffic to HTTP port 80, and integrates SonarCloud for static code analysis to meet DevSecOps requirements.

### Prerequisites

- **AWS Account**: Active with administrative access (Owner ID: `471112988525`).
- **Docker**: Installed locally to build and push images.
- **GitHub Repository**: `https://github.com/IT21278280/auth_project`.
- **SonarCloud Account**: Project key `IT21278280_auth_project`, organization `it21278280`.
- **MongoDB Atlas**: Configured with `MONGO_URI` and network access set to `0.0.0.0/0` (temporary for testing).
- **Gmail SMTP**: App Password for `notification` service.

### Step 1: Create Subnets

Create public and private subnets in the existing VPC (`vpc-0d75c31b34abe1e2a`).

1. Log in to the AWS Console at `https://console.aws.amazon.com`.
2. Navigate to **VPC** &gt; Your VPCs &gt; Select `vpc-0d75c31b34abe1e2a`.
3. Go to **Subnets** &gt; Create subnet:
   - **VPC ID**: `vpc-0d75c31b34abe1e2a`.
   - Create 4 subnets:
     - **Public Subnet 1**: Name: `public-subnet-1`, AZ: `us-east-1a`, CIDR: `10.0.1.0/24`.
     - **Public Subnet 2**: Name: `public-subnet-2`, AZ: `us-east-1b`, CIDR: `10.0.2.0/24`.
     - **Private Subnet 1**: Name: `private-subnet-1`, AZ: `us-east-1a`, CIDR: `10.0.3.0/24`.
     - **Private Subnet 2**: Name: `private-subnet-2`, AZ: `us-east-1b`, CIDR: `10.0.4.0/24`.
   - Note Subnet IDs (e.g., `subnet-11111111`, `subnet-22222222`, `subnet-33333333`, `subnet-44444444`).
4. Enable auto-assign public IP for public subnets:
   - Select `public-subnet-1` &gt; Actions &gt; Edit subnet settings &gt; Check **Enable auto-assign public IPv4 address** &gt; Save.
   - Repeat for `public-subnet-2`.

### Step 2: Configure VPC Networking

Set up Internet Gateway, Route Tables, and NAT Gateway.

1. **Create Internet Gateway**:
   - VPC &gt; Internet Gateways &gt; Create internet gateway &gt; Name: `auth-igw` &gt; Create.
   - Select `auth-igw` &gt; Actions &gt; Attach to VPC &gt; Select `vpc-0d75c31b34abe1e2a` &gt; Attach.
2. **Create Route Table for Public Subnets**:
   - VPC &gt; Route Tables &gt; Create route table &gt; Name: `public-rt`, VPC: `vpc-0d75c31b34abe1e2a` &gt; Create.
   - Select `public-rt` &gt; Routes &gt; Edit routes &gt; Add route: Destination `0.0.0.0/0`, Target `auth-igw` &gt; Save.
   - Subnet Associations &gt; Edit &gt; Select `public-subnet-1`, `public-subnet-2` &gt; Save.
3. **Create NAT Gateway**:
   - VPC &gt; NAT Gateways &gt; Create NAT Gateway &gt; Subnet: `public-subnet-1`, Create new EIP &gt; Create.
   - Wait for status to be `Available`.
4. **Create Route Table for Private Subnets**:
   - Route Tables &gt; Create route table &gt; Name: `private-rt`, VPC: `vpc-0d75c31b34abe1e2a` &gt; Create.
   - Select `private-rt` &gt; Routes &gt; Edit routes &gt; Add route: Destination `0.0.0.0/0`, Target NAT Gateway &gt; Save.
   - Subnet Associations &gt; Edit &gt; Select `private-subnet-1`, `private-subnet-2` &gt; Save.

### Step 3: Create Security Groups

Restrict traffic to HTTP port 80 and allow outbound connections.

1. **Security Group for ALB**:
   - VPC &gt; Security Groups &gt; Create security group.
   - Name: `auth-alb-sg`, Description: `Security group for ALB`, VPC: `vpc-0d75c31b34abe1e2a`.
   - Inbound rules: Type: HTTP, Protocol: TCP, Port: 80, Source: `0.0.0.0/0`.
   - Outbound rules: Default (All traffic).
   - Create &gt; Note Group ID (e.g., `sg-11111111`).
2. **Security Group for Fargate Tasks**:
   - Name: `auth-fargate-sg`, Description: `Security group for Fargate tasks`, VPC: `vpc-0d75c31b34abe1e2a`.
   - Inbound rules:
     - Type: Custom TCP, Protocol: TCP, Port: 3001, Source: `auth-alb-sg` (`sg-11111111`).
     - Type: Custom TCP, Protocol: TCP, Port: 3002, Source: `auth-alb-sg`.
     - Type: Custom TCP, Protocol: TCP, Port: 3003, Source: `auth-alb-sg`.
   - Outbound rules: Default (All traffic).
   - Create &gt; Note Group ID (e.g., `sg-22222222`).

### Step 4: Create IAM Roles

Create roles for ECS task execution and tasks.

1. **ECS Task Execution Role**:

   - Services &gt; IAM &gt; Roles &gt; Create role.
   - Trusted entity: AWS service &gt; ECS &gt; ECS Tasks.
   - Permissions: Select `AmazonECSTaskExecutionRolePolicy`.
   - Name: `ecsTaskExecutionRole` &gt; Create role.
   - Note ARN (e.g., `arn:aws:iam::471112988525:role/ecsTaskExecutionRole`).

2. **ECS Task Role**:

   - Create role &gt; Trusted entity: AWS service &gt; ECS &gt; ECS Tasks.

   - Permissions: Create inline policy:

     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "logs:CreateLogStream",
             "logs:PutLogEvents"
           ],
           "Resource": "*"
         }
       ]
     }
     ```

   - Name: `ecsTaskRole` &gt; Create role.

   - Note ARN (e.g., `arn:aws:iam::471112988525:role/ecsTaskRole`).

### Step 5: Create ECR Repositories

Store Docker images.

1. Navigate to **Elastic Container Registry** &gt; Repositories &gt; Create repository.
2. Create repositories:
   - Name: `user-auth` &gt; Create &gt; Note URI (e.g., `471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth`).
   - Repeat for `notification` and `user-profile`.
3. Enable **Scan on Push**:
   - Select each repository &gt; Edit &gt; Check **Scan on push** &gt; Save.

### Step 6: Push Docker Images to ECR

Push images from your local machine using minimal CLI commands.

1. Authenticate Docker to ECR:

   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 471112988525.dkr.ecr.us-east-1.amazonaws.com
   ```

2. Build and push images:

   ```bash
   # user-auth
   cd C:\Users\USER\Documents\GitHub\auth_project\user-auth
   docker build -t user-auth .
   docker tag user-auth:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth:latest
   docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth:latest
   
   # notification
   cd C:\Users\USER\Documents\GitHub\auth_project\notification
   docker build -t notification .
   docker tag notification:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/notification:latest
   docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/notification:latest
   
   # user-profile
   cd C:\Users\USER\Documents\GitHub\auth_project\user-profile
   docker build -t user-profile .
   docker tag user-profile:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-profile:latest
   docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-profile:latest
   ```

### Step 7: Create ECS Cluster

1. Navigate to **Elastic Container Service** &gt; Clusters &gt; Create Cluster.
2. Cluster template: Networking only (Fargate).
3. Cluster name: `auth-cluster` &gt; Create.

### Step 8: Create Task Definitions

Create task definitions for each microservice.

1. **user-auth Task Definition**:
   - ECS &gt; Task Definitions &gt; Create new task definition.
   - Compatibility: Fargate.
   - Name: `user-auth-task`.
   - Task Role: `ecsTaskRole`.
   - Task Execution Role: `ecsTaskExecutionRole`.
   - CPU: 0.25 vCPU.
   - Memory: 0.5 GB.
   - Container Definitions &gt; Add container:
     - Name: `user-auth`.
     - Image: `471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth:latest`.
     - Port mappings: Container port `3002` (TCP).
     - Environment variables:
       - `PORT`: `3002`
       - `JWT_SECRET`: `your_strong_secret_here_12345`
       - `MONGO_URI`: `mongodb+srv://rusithp:jEDwp09p0wS3HcNa@cluster0.tz2dapj.mongodb.net/userAuthDB?retryWrites=true&w=majority`
     - Log configuration: AWS CloudWatch Logs.
       - Log group: `/ecs/user-auth`
       - Stream prefix: `user-auth`
   - Create.
2. **notification Task Definition**:
   - Name: `notification-task`.
   - Same settings (Fargate, `ecsTaskRole`, `ecsTaskExecutionRole`, 0.25 vCPU, 0.5 GB).
   - Container:
     - Name: `notification`.
     - Image: `471112988525.dkr.ecr.us-east-1.amazonaws.com/notification:latest`.
     - Port mappings: Container port `3003` (TCP).
     - Environment variables:
       - `PORT`: `3003`
       - `SMTP_HOST`: `smtp.gmail.com`
       - `SMTP_PORT`: `587`
       - `SMTP_USER`: `your-email@gmail.com`
       - `SMTP_PASS`: `your-app-password`
     - Log group: `/ecs/notification`, Stream prefix: `notification`.
   - Create.
3. **user-profile Task Definition**:
   - Name: `user-profile-task`.
   - Same settings.
   - Container:
     - Name: `user-profile`.
     - Image: `471112988525.dkr.ecr.us-east-1.amazonaws.com/user-profile:latest`.
     - Port mappings: Container port `3001` (TCP).
     - Environment variables:
       - `PORT`: `3001`
       - `JWT_SECRET`: `your_strong_secret_here_12345`
       - `MONGO_URI`: `mongodb+srv://rusithp:jEDwp09p0wS3HcNa@cluster0.tz2dapj.mongodb.net/userAuthDB?retryWrites=true&w=majority`
     - Log group: `/ecs/user-profile`, Stream prefix: `user-profile`.
   - Create.

### Step 9: Create Application Load Balancer (ALB)

Route traffic to services.

1. **Create ALB**:
   - Services &gt; EC2 &gt; Load Balancers &gt; Create Load Balancer &gt; Application Load Balancer.
   - Name: `auth-alb`.
   - Scheme: Internet-facing.
   - IP address type: IPv4.
   - Listeners: HTTP:80.
   - VPC: `vpc-0d75c31b34abe1e2a`.
   - Subnets: `public-subnet-1`, `public-subnet-2`.
   - Security Groups: `auth-alb-sg`.
   - Create.
2. **Create Target Groups**:
   - EC2 &gt; Target Groups &gt; Create target group.
   - **user-auth-tg**:
     - Target type: IP.
     - Name: `user-auth-tg`.
     - Protocol: HTTP, Port: `3002`.
     - VPC: `vpc-0d75c31b34abe1e2a`.
     - Health check path: `/`.
     - Create.
   - Repeat for:
     - `notification-tg` (Port: `3003`).
     - `user-profile-tg` (Port: `3001`).
3. **Configure ALB Listener Rules**:
   - Load Balancers &gt; Select `auth-alb` &gt; Listeners &gt; View/edit rules for HTTP:80.
   - Add rule: Condition: Path is `/api/auth/*` &gt; Action: Forward to `user-auth-tg`.
   - Add rule: Condition: Path is `/api/notify/*` &gt; Action: Forward to `notification-tg`.
   - Add rule: Condition: Path is `/api/profile/*` &gt; Action: Forward to `user-profile-tg`.
   - Save.

### Step 10: Deploy ECS Services

Deploy each microservice.

1. **user-auth Service**:
   - ECS &gt; Clusters &gt; `auth-cluster` &gt; Services &gt; Create.
   - Launch type: Fargate.
   - Task definition: `user-auth-task` (latest revision).
   - Service name: `user-auth-service`.
   - Number of tasks: 1.
   - VPC: `vpc-0d75c31b34abe1e2a`.
   - Subnets: `private-subnet-1`, `private-subnet-2`.
   - Security Groups: `auth-fargate-sg`.
   - Public IP: Enabled.
   - Load balancing: Application Load Balancer.
     - Load balancer: `auth-alb`.
     - Container: `user-auth:3002` &gt; Target group: `user-auth-tg`.
   - Create.
2. **notification Service**:
   - Same settings.
   - Task definition: `notification-task`.
   - Service name: `notification-service`.
   - Container: `notification:3003` &gt; Target group: `notification-tg`.
   - Create.
3. **user-profile Service**:
   - Task definition: `user-profile-task`.
   - Service name: `user-profile-service`.
   - Container: `user-profile:3001` &gt; Target group: `user-profile-tg`.
   - Create.

### Step 11: Integrate SonarCloud

Set up static code analysis.

1. **Configure SonarCloud**:

   - Log in to `sonarcloud.io`.
   - Create project: `IT21278280_auth_project` in organization `it21278280`.
   - Generate token (e.g., `sonar_token_1234567890abcdef`).

2. **Add** `.sonarcloud.properties`:

   - Create file in project root: `.sonarcloud.properties`.

   ```properties
   sonar.organization=it21278280
   sonar.projectKey=IT21278280_auth_project
   sonar.sources=user-auth,notification,user-profile
   sonar.exclusions=**/node_modules/**,**/coverage/**,**/test/**
   sonar.javascript.lcov.reportPaths=user-auth/coverage/lcov.info,notification/coverage/lcov.info,user-profile/coverage/lcov.info
   sonar.host.url=https://sonarcloud.io
   ```

3. **Update GitHub Actions**:

   - Create file: `.github/workflows/ci-cd.yml`.

   ```yaml
   name: CI/CD Pipeline
   on:
     push:
       branches: [ main ]
   jobs:
     build-and-test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         - name: Install user-auth dependencies
           run: cd user-auth && npm install
         - name: Run user-auth tests
           run: cd user-auth && npm test
         - name: Install notification dependencies
           run: cd notification && npm install
         - name: Run notification tests
           run: cd notification && npm test
         - name: Install user-profile dependencies
           run: cd user-profile && npm install
         - name: Run user-profile tests
           run: cd user-profile && npm test
         - name: SonarCloud Scan
           uses: SonarSource/sonarcloud-github-action@master
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
             SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
         - name: Login to Amazon ECR
           uses: aws-actions/amazon-ecr-login@v1
           env:
             AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             AWS_REGION: us-east-1
         - name: Build and Push user-auth
           run: |
             cd user-auth
             docker build -t user-auth .
             docker tag user-auth:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth:latest
             docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-auth:latest
         - name: Build and Push notification
           run: |
             cd notification
             docker build -t notification .
             docker tag notification:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/notification:latest
             docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/notification:latest
         - name: Build and Push user-profile
           run: |
             cd user-profile
             docker build -t user-profile .
             docker tag user-profile:latest 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-profile:latest
             docker push 471112988525.dkr.ecr.us-east-1.amazonaws.com/user-profile:latest
         - name: Update ECS Services
           run: |
             aws ecs update-service --cluster auth-cluster --service user-auth-service --force-new-deployment --region us-east-1
             aws ecs update-service --cluster auth-cluster --service notification-service --force-new-deployment --region us-east-1
             aws ecs update-service --cluster auth-cluster --service user-profile-service --force-new-deployment --region us-east-1
           env:
             AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             AWS_REGION: us-east-1
   ```

4. **Add GitHub Secrets**:

   - GitHub &gt; Settings &gt; Secrets and variables &gt; Actions &gt; New repository secret:
     - `SONAR_TOKEN`: `<sonar_token_1234567890abcdef>`
     - `AWS_ACCESS_KEY_ID`: Your AWS IAM user access key.
     - `AWS_SECRET_ACCESS_KEY`: Your AWS IAM user secret key.

5. **Commit Changes**:

   ```bash
   cd C:\Users\USER\Documents\GitHub\auth_project
   git add .sonarcloud.properties .github/workflows/ci-cd.yml
   git commit -m "Added SonarCloud and ECS deployment pipeline"
   git push origin main
   ```

### Step 12: Test Deployment

1. **Get ALB DNS Name**:
   - EC2 &gt; Load Balancers &gt; Select `auth-alb` &gt; Note **DNS name** (e.g., `auth-alb-1234567890.us-east-1.elb.amazonaws.com`).
2. **Test with Postman**:
   - Update endpoints from the API Endpoints section:
     - `http://<ALB_DNS>/api/auth/register`
     - `http://<ALB_DNS>/api/notify`
     - `http://<ALB_DNS>/api/profile`
   - Run all tests (register, login, create profile, etc.).
   - Verify Gmail for notification emails.
3. **Check Logs**:
   - Services &gt; CloudWatch &gt; Log groups &gt; `/ecs/user-auth`, `/ecs/notification`, `/ecs/user-profile`.
   - Confirm `MongoDB connected` and no errors.

### Step 13: Verify SonarCloud

- GitHub &gt; Actions &gt; Check workflow status.
- SonarCloud &gt; `IT21278280_auth_project` &gt; Verify scan results (coverage ≥ 60%, minimal issues).

### Step 14: Secure and Optimize

1. **MongoDB Atlas**:
   - Network Access &gt; Edit &gt; Replace `0.0.0.0/0` with `10.0.0.0/16` or ALB IP.
2. **AWS Secrets Manager**:
   - Services &gt; Secrets Manager &gt; Store new secret.
   - Create secrets for `MONGO_URI`, `JWT_SECRET`, `SMTP_USER`, `SMTP_PASS`.
   - Update task definitions (ECS &gt; Task Definitions &gt; Create new revision):
     - Add secrets under container environment:
       - Name: `MONGO_URI` &gt; Value from: Select secret ARN.
     - Update `ecsTaskRole` in IAM to allow `secretsmanager:GetSecretValue`.
3. **Auto Scaling**:
   - ECS &gt; `auth-cluster` &gt; `user-auth-service` &gt; Update service:
     - Minimum tasks: 1, Maximum tasks: 4.
     - Add scaling policy: Target tracking &gt; CPU utilization &gt; Target value: 70%.



## License
This project is licensed under the MIT License.