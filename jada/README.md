# Drone Management System Documentation

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

## Overview

The Drone Management System is a comprehensive web application designed for managing drone fleets, planning missions, and monitoring drone operations. The system consists of a React-based frontend and a Node.js/Express backend with MongoDB and Redis for data storage.

### Key Features
- **User Authentication & Authorization**: Secure login/register system with JWT tokens
- **Mission Management**: Create, track, and manage drone missions
- **Drone Fleet Management**: Monitor and manage drone inventory
- **Route Planning**: Interactive map-based route planning with waypoints
- **Real-time Monitoring**: Live camera feeds and mission status tracking
- **Analytics Dashboard**: Comprehensive mission analytics and reporting
- **Mission Timeline**: Visual timeline of mission activities

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Databases     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   MongoDB       │
│                 │    │   (Express)     │    │   Redis         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Frontend:**
- React 19.1.0
- TypeScript
- Vite (Build tool)
- React Router DOM (Routing)
- Leaflet (Maps)
- Recharts (Charts)
- Sass (Styling)
- Axios (HTTP client)

**Backend:**
- Node.js
- Express.js 5.1.0
- TypeScript
- MongoDB (Primary database)
- Redis (Caching & sessions)
- JWT (Authentication)
- bcrypt (Password hashing)
- Multer (File uploads)
- GridFS (File storage)

## Backend Documentation

### Project Structure
```
backend/
├── src/
│   ├── client/           # Database connections
│   │   ├── mongo.ts      # MongoDB connection
│   │   └── redis.ts      # Redis connection
│   ├── config/           # Configuration files
│   │   ├── const.config.ts
│   │   ├── error.constant.ts
│   │   ├── response.types.ts
│   │   └── success.constant.ts
│   ├── controller/       # Business logic
│   │   ├── Auth/
│   │   │   └── AuthController.ts
│   │   └── Mission/
│   │       └── MissionController.ts
│   ├── middleware/       # Express middleware
│   │   └── protected.ts
│   ├── models/          # Database models
│   │   ├── Drone.model.ts
│   │   ├── Mission.model.ts
│   │   ├── MissionActivity.model.ts
│   │   ├── User.model.ts
│   │   └── Waypoint.model.ts
│   ├── routes/          # API routes
│   │   └── v1/
│   │       ├── appRouter.ts
│   │       ├── authRouter.ts
│   │       └── healthRouter.ts
│   ├── utils/           # Utility functions
│   │   ├── asyncHandler.ts
│   │   ├── auth.utils.ts
│   │   ├── error.utils.ts
│   │   ├── errorHandler.ts
│   │   └── gridfs.ts
│   ├── seeds/           # Database seeding
│   │   └── index.ts
│   ├── types/           # TypeScript interfaces
│   │   └── auth.interface.ts
│   ├── index.ts         # Application entry point
│   └── server.ts        # Server configuration
├── package.json
├── tsconfig.json
└── env.example
```

### Key Components

#### 1. Server Configuration (`server.ts`)
- Express application setup
- CORS configuration
- Middleware configuration
- Database connections
- Route setup
- Error handling

#### 2. Authentication System
- JWT-based authentication
- Access and refresh tokens
- Password hashing with bcrypt
- Protected route middleware
- Token refresh mechanism

#### 3. Database Models

**User Model:**
- User registration and authentication
- Role-based access control
- Email verification status

**Mission Model:**
- Mission creation and management
- Status tracking (planned, in-progress, completed, aborted)
- Priority levels (low, medium, high, critical)
- Drone assignments
- Location and timing information

**Drone Model:**
- Drone inventory management
- Status tracking
- Technical specifications

**Waypoint Model:**
- Route planning waypoints
- GPS coordinates
- Altitude and action specifications

#### 4. API Controllers

**AuthController:**
- User registration
- User login/logout
- Token refresh
- Current user information

**MissionController:**
- Mission CRUD operations
- Status updates
- Mission analytics

### Environment Configuration

Create a `.env` file based on `env.example`:

```env
# Server Configuration
PORT=5001

# Database Configuration
MONGO_URI=mongodb://localhost:27017/drone_management

# JWT Configuration
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_min_32_chars_long
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars_long
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=

# Client Configuration
CLIENT_URL=http://localhost:5174

# Environment
NODE_ENV=development
```

## Frontend Documentation

### Project Structure
```
frontend/
├── src/
│   ├── api/             # API integration
│   │   ├── authApi.ts
│   │   └── missionApi.ts
│   ├── components/      # React components
│   │   ├── Dashboard/   # Dashboard components
│   │   ├── DroneRoutePlanner/  # Route planning
│   │   └── MissionSummary/     # Mission summary
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── DroneManagement.tsx
│   │   ├── DroneRoutePlanner.tsx
│   │   ├── MissionCreator.tsx
│   │   └── MissionSummary.tsx
│   ├── store/           # State management
│   │   └── AuthContext.tsx
│   ├── styles/          # Styling files
│   │   ├── components/
│   │   ├── theme.scss
│   │   └── [component].scss
│   ├── utils/           # Utility components
│   │   └── components/
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Key Features

#### 1. Authentication System
- Login/Register forms
- JWT token management
- Protected routes
- Automatic token refresh
- User context management

#### 2. Dashboard
- Mission overview
- Drone fleet status
- Activity heatmaps
- Resource allocation
- Critical missions AI
- Weekly activity charts

#### 3. Mission Management
- Mission creation wizard
- Mission timeline view
- Status tracking
- Analytics and reporting
- Export functionality

#### 4. Route Planning
- Interactive map interface
- Waypoint management
- Camera feed integration
- Real-time tracking

#### 5. Drone Management
- Fleet overview
- Individual drone details
- Status monitoring
- Maintenance tracking

### Component Architecture

#### Authentication Context (`AuthContext.tsx`)
- Global authentication state
- Token management
- User information
- Login/logout functions

#### API Integration
- Centralized API calls
- Error handling
- Request/response interceptors
- Authentication headers

#### Routing System
- Protected routes
- Route-based code splitting
- Navigation guards
- Deep linking support

## API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "type": "success",
  "accessToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "operator",
    "isEmailVerified": false
  }
}
```

#### POST `/api/v1/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "type": "success",
  "accessToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "operator",
    "isEmailVerified": true
  }
}
```

#### GET `/api/v1/auth/me`
Get current user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### POST `/api/v1/auth/refreshToken`
Refresh access token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

### Mission Endpoints

#### POST `/api/v1/app/missions`
Create a new mission.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Surveillance Mission",
  "type": "surveillance",
  "startDate": "2024-01-15T10:00:00Z",
  "endDate": "2024-01-15T12:00:00Z",
  "description": "Aerial surveillance of downtown area",
  "assignedDrones": ["drone_id_1", "drone_id_2"],
  "location": "Downtown Area",
  "priority": "high",
  "takeoffPoint": {
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "altitude": "100"
  },
  "landingPoint": {
    "latitude": "40.7589",
    "longitude": "-73.9851",
    "altitude": "100"
  },
  "waypoints": [
    {
      "id": 1,
      "latitude": "40.7505",
      "longitude": "-73.9934",
      "altitude": "150",
      "action": "capture"
    }
  ]
}
```

#### GET `/api/v1/app/missions`
Get all missions.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### GET `/api/v1/app/missions/:id`
Get mission by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### PUT `/api/v1/app/missions/:id/status`
Update mission status.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "in-progress"
}
```

### Health Check

#### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": 3600
}
```

## Database Schema

### User Collection
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

### Mission Collection
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
  takeoffPoint: {
    latitude: String,
    longitude: String,
    altitude: String
  },
  landingPoint: {
    latitude: String,
    longitude: String,
    altitude: String
  },
  waypoints: [{
    id: Number,
    latitude: String,
    longitude: String,
    altitude: String,
    action: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Drone Collection
```javascript
{
  _id: ObjectId,
  name: String,
  model: String,
  status: String (enum: ['available', 'in-mission', 'maintenance', 'offline']),
  batteryLevel: Number,
  maxFlightTime: Number,
  maxPayload: Number,
  currentLocation: {
    latitude: String,
    longitude: String,
    altitude: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### MissionActivity Collection
```javascript
{
  _id: ObjectId,
  missionId: ObjectId (ref: 'Mission'),
  droneId: ObjectId (ref: 'Drone'),
  activityType: String,
  timestamp: Date,
  location: {
    latitude: String,
    longitude: String,
    altitude: String
  },
  data: Object,
  createdAt: Date
}
```

### Waypoint Collection
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

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v6 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository and navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB and Redis:**
```bash
# Start MongoDB
mongod

# Start Redis
redis-server
```

5. **Run database seeds (optional):**
```bash
npm run seed
```

6. **Start development server:**
```bash
npm run dev
```

The backend will be available at `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5174`

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Run database seeds

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Backend Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set production environment variables:**
```env
NODE_ENV=production
PORT=5001
MONGO_URI=your_production_mongodb_uri
REDIS_HOST=your_production_redis_host
CLIENT_URL=your_frontend_url
```

3. **Start the production server:**
```bash
npm start
```

### Frontend Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy the `dist` folder to your web server**

### Docker Deployment (Optional)

Create a `docker-compose.yml` file:

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

## Security

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Role-based access control
- Protected API endpoints
- Token refresh mechanism

### Data Protection
- Input validation and sanitization
- CORS configuration
- Rate limiting (recommended for production)
- HTTPS enforcement in production
- Secure cookie settings

### Database Security
- MongoDB authentication
- Redis password protection
- Connection encryption
- Regular security updates

## Troubleshooting

### Common Issues

#### Backend Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Redis Connection Error:**
   - Ensure Redis is running
   - Check Redis host and password in `.env`
   - Verify Redis port accessibility

3. **JWT Token Issues:**
   - Verify JWT secrets in `.env`
   - Check token expiration settings
   - Ensure proper token format

#### Frontend Issues

1. **API Connection Errors:**
   - Verify backend server is running
   - Check API base URL configuration
   - Ensure CORS is properly configured

2. **Authentication Issues:**
   - Clear browser storage
   - Check token expiration
   - Verify login credentials

3. **Build Errors:**
   - Clear node_modules and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

### Logs and Debugging

**Backend Logs:**
- Check console output for errors
- Enable debug logging in development
- Monitor MongoDB and Redis logs

**Frontend Logs:**
- Check browser console for errors
- Use React Developer Tools
- Monitor network requests

### Performance Optimization

1. **Backend:**
   - Implement caching strategies
   - Optimize database queries
   - Use connection pooling
   - Enable compression

2. **Frontend:**
   - Implement code splitting
   - Optimize bundle size
   - Use lazy loading
   - Enable caching headers

### Support

For additional support:
1. Check the GitHub repository issues
2. Review the API documentation
3. Test with the provided seed data
4. Verify environment configuration

---

**Version:** 1.0.0  
**Last Updated:** January 2024  
**Maintainer:** Development Team 