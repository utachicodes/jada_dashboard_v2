# Drone Management System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

**Drone Management System** is a full-stack web application for managing drone fleets, planning missions, and monitoring drone operations. It features a React frontend and a Node.js/Express backend, with MongoDB and Redis for data storage and caching.

---

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Setup and Installation](#setup-and-installation)
8. [Deployment](#deployment)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**Key Features:**
- User authentication and authorization (JWT-based)
- Mission creation, tracking, and management
- Drone fleet inventory and status monitoring
- Interactive map-based route planning with waypoints
- Real-time camera feeds and mission status
- Analytics dashboard with mission statistics and reporting
- Visual timeline of mission activities

---

## System Architecture

```
Frontend (React) <-> Backend (Node.js/Express) <-> Databases (MongoDB, Redis)
```

**Frontend:** React 19.1.0, TypeScript, Vite, React Router DOM, Leaflet, Recharts, Sass, Axios  
**Backend:** Node.js, Express.js 5.1.0, TypeScript, MongoDB, Redis, JWT, bcrypt, Multer, GridFS

---

## Backend Documentation

**Project Structure:**
```
backend/
├── src/
│   ├── client/           # Database connections
│   ├── config/           # Configuration files
│   ├── controller/       # Business logic
│   ├── middleware/       # Express middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── seeds/            # Database seeding
│   ├── types/            # TypeScript interfaces
│   ├── index.ts          # Application entry point
│   └── server.ts         # Server configuration
├── package.json
├── tsconfig.json
└── env.example
```

**Key Components:**
- Server configuration (Express, CORS, middleware, database connections, routes, error handling)
- Authentication system (JWT, access/refresh tokens, bcrypt, protected middleware, token refresh)
- Database models (User, Mission, Drone, Waypoint, MissionActivity)
- API controllers (AuthController for registration, login, token, user info; MissionController for CRUD, status, analytics)

**Environment Configuration:**
Create a `.env` file in `backend/` based on `env.example`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/drone_management
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars_long
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars_long
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

---

## Frontend Documentation

**Project Structure:**
```
frontend/
├── src/
│   ├── api/             # API integration
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── store/           # State management
│   ├── styles/          # Styling files
│   ├── utils/           # Utility components
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Key Features:**
- Authentication system (login/register, JWT, protected routes, token refresh, user context)
- Dashboard (mission overview, drone status, heatmaps, resource allocation, critical missions, weekly activity)
- Mission management (creation wizard, timeline, status, analytics, export)
- Route planning (map interface, waypoints, camera feed, real-time tracking)
- Drone management (fleet overview, details, status, maintenance)

**Component Architecture:**
- `AuthContext.tsx`: Global authentication state, token management, user info, login/logout
- API integration: Centralized calls, error handling, interceptors, authentication headers
- Routing system: Protected routes, code splitting, navigation guards, deep linking

---

## API Documentation

**Authentication Endpoints:**
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Authenticate user and get access token
- `GET /api/v1/auth/me`: Get current user info (requires Bearer token)
- `POST /api/v1/auth/refreshToken`: Refresh access token (requires Bearer refresh token)

**Mission Endpoints:**
- `POST /api/v1/app/missions`: Create a new mission
- `GET /api/v1/app/missions`: Get all missions
- `GET /api/v1/app/missions/:id`: Get mission by ID
- `PUT /api/v1/app/missions/:id/status`: Update mission status

**Health Check:**
- `GET /health`: API health status

---

## Database Schema

**User Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String (enum: ['admin', 'operator', 'viewer']),
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```
**Mission Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  status: String (enum: ['planned', 'in-progress', 'completed', 'aborted']),
  location: String,
  drone: ObjectId (ref: 'Drone'),
  operator: ObjectId (ref: 'User'),
  priority: String (enum: ['low', 'medium', 'high', 'critical']),
  type: String,
  startDate: Date,
  endDate: Date,
  description: String,
  assignedDrones: [ObjectId] (ref: 'Drone'),
  takeoffPoint: { latitude: String, longitude: String, altitude: String },
  landingPoint: { latitude: String, longitude: String, altitude: String },
  waypoints: [{ id: Number, latitude: String, longitude: String, altitude: String, action: String }],
  createdAt: Date,
  updatedAt: Date
}
```
**Drone Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  model: String,
  status: String (enum: ['available', 'in-mission', 'maintenance', 'offline']),
  batteryLevel: Number,
  maxFlightTime: Number,
  maxPayload: Number,
  currentLocation: { latitude: String, longitude: String, altitude: String },
  createdAt: Date,
  updatedAt: Date
}
```
**MissionActivity Collection:**
```javascript
{
  _id: ObjectId,
  missionId: ObjectId (ref: 'Mission'),
  droneId: ObjectId (ref: 'Drone'),
  activityType: String,
  timestamp: Date,
  location: { latitude: String, longitude: String, altitude: String },
  data: Object,
  createdAt: Date
}
```
**Waypoint Collection:**
```javascript
{
  _id: ObjectId,
  missionId: ObjectId (ref: 'Mission'),
  sequence: Number,
  latitude: String,
  longitude: String,
  altitude: String,
  action: String,
  completed: Boolean,
  createdAt: Date
}
```

---

## Setup and Installation

**Prerequisites:**
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v6 or higher)
- npm or yarn

**Backend Setup:**
```bash
cd backend
npm install
cp env.example .env # Edit .env with your configuration
# Start MongoDB
mongod
# Start Redis
redis-server
# (Optional) Seed the database
npm run seed
# Start the development server
npm run dev
```
Backend will be available at http://localhost:5001

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at http://localhost:5174

**Available Scripts:**
| Backend           | Frontend           |
|-------------------|-------------------|
| `npm run dev`     | `npm run dev`     |
| `npm run build`   | `npm run build`   |
| `npm start`       | `npm run preview` |
| `npm run seed`    | `npm run lint`    |

---

## Deployment

**Backend Deployment:**
```bash
npm run build
# Set production .env
npm start
```

**Frontend Deployment:**
```bash
npm run build
npm run preview
```

**Docker Deployment (Optional):**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/drone_management
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  redis:
    image: redis:6
    ports:
      - "6379:6379"
volumes:
  mongo_data:
```

---

## Security

- JWT-based authentication (access/refresh tokens)
- Password hashing (bcrypt)
- Role-based access control
- Protected API endpoints
- Token refresh mechanism
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)
- HTTPS enforcement in production
- Secure cookie settings
- MongoDB/Redis authentication and encryption

---

## Troubleshooting

**Backend:**
- MongoDB connection error: Ensure MongoDB is running, check `.env`, verify network
- Redis connection error: Ensure Redis is running, check `.env`, verify port
- JWT token issues: Check secrets, expiration, token format

**Frontend:**
- API connection errors: Verify backend is running, check API base URL, CORS
- Authentication issues: Clear browser storage, check token expiration, verify credentials
- Build errors: Clear node_modules, check TypeScript config, verify dependencies

**Logs and Debugging:**
- Backend: Console output, enable debug logging, monitor MongoDB/Redis logs
- Frontend: Browser console, React Developer Tools, monitor network requests

**Performance Optimization:**
- Backend: Caching, query optimization, connection pooling, compression
- Frontend: Code splitting, bundle optimization, lazy loading, caching headers

---

## Support
- Check GitHub issues
- Review API documentation
- Test with provided seed data
- Verify environment configuration

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintainer:** Development Team 