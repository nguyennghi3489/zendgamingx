# Zendgamingx App

This app will allow users to view upcoming esports tournaments, register to participate, and see tournament brackets and match details. The idea is to simulate a P2P gaming environment where players can join tournaments and see their progress visually.

## Design Overview

### App Flow
<img width="932" height="553" alt="Screenshot 2025-11-13 at 01 10 31" src="https://github.com/user-attachments/assets/215e16dc-43c3-4189-9705-d9d8f53dd26c" />

#### AppLayer
##### - Frontend Layer (Nuxt.js): High-quality web applications 
##### - Backend Layer (NestJS): Modular architecture with controllers, services, and repositories
##### - Database Layer (MySQL): Persistent data storage and support transaction 
##### - Memory Cache Layer (Redis): High-performance caching and temporary data

#### Database Schemas
<img width="582" height="347" alt="Screenshot 2025-11-13 at 01 11 07" src="https://github.com/user-attachments/assets/26a7a3d8-9b23-4499-b005-a7ef4aaead72" />


## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose

### 1. Start Database Services

```bash
cd backend
docker-compose up -d
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

npm install

npm run migration:run
npm run seed:sql

npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

The backend will be running on port 3001 and the frontend on port 3000. Make sure both Docker services (MySQL and Redis) are running before starting the backend server.


## Assumption

#### Join tournament
- This flow I don't create the match when the user joined a tournament. My assumption that we will create all matches when we have full participant join to tournament. 
