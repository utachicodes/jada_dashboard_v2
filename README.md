# jada-drone-management

**Modern drone fleet management platform with real-time mission planning and analytics**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A cutting-edge web application for managing drone fleets, planning missions, and monitoring operations. Built with React, Node.js, TypeScript, MongoDB, and Redis for robust, scalable, and real-time drone management.

![Drone Management System](jada/frontend/src/assets/FRAME.png)

## Features

- **Real-Time Mission Planning** – Interactive map-based route and waypoint management
- **Fleet Management** – Monitor, assign, and track drones with live status
- **User Authentication** – Secure JWT-based login and role-based access
- **Analytics Dashboard** – Visualize mission stats, heatmaps, and activity
- **Live Monitoring** – Camera feeds and mission status in real time
- **Responsive UI** – Modern, mobile-friendly design
- **Production Ready** – Robust error handling and scalable architecture

## Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **MongoDB** 6+
- **Redis** 6+

### Installation

```bash
# Clone the repository
cd jada

# Backend setup
cd backend
npm install
cp env.example .env # Edit .env as needed

# Frontend setup
cd ../frontend
npm install
```

### Development

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

- Backend: [http://localhost:5001](http://localhost:5001)
- Frontend: [http://localhost:5174](http://localhost:5174)

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd ../frontend
npm run build
npm run preview
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Sass, Leaflet, Recharts, Axios
- **Backend**: Node.js, Express 5, TypeScript, MongoDB, Redis, JWT, bcrypt, Multer, GridFS
- **DevOps**: Docker (optional), npm scripts

## Project Structure

```
jada/
├── backend/
│   ├── src/
│   │   ├── client/         # DB connections (mongo, redis)
│   │   ├── config/         # App configs & constants
│   │   ├── controller/     # Business logic (Auth, Mission, Drone, Waypoint)
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes (v1)
│   │   ├── utils/          # Utility functions
│   │   ├── seeds/          # DB seeding
│   │   ├── types/          # TypeScript types
│   │   ├── index.ts        # App entry
│   │   └── server.ts       # Server config
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management
│   │   ├── styles/         # SCSS styles
│   │   ├── utils/          # Utility components
│   │   ├── App.tsx         # Main app
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Available Scripts

| Command            | Directory   | Description                       |
|--------------------|------------|-----------------------------------|
| `npm run dev`      | backend    | Start backend in dev mode         |
| `npm run build`    | backend    | Build backend for production      |
| `npm start`        | backend    | Start backend in production       |
| `npm run seed`     | backend    | Seed the database                 |
| `npm run dev`      | frontend   | Start frontend in dev mode        |
| `npm run build`    | frontend   | Build frontend for production     |
| `npm run preview`  | frontend   | Preview frontend production build |
| `npm run lint`     | frontend   | Run ESLint                        |

## Configuration

### Environment Variables

Create a `.env` file in `backend/` based on `env.example`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/drone_management
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=
CLIENT_URL=http://localhost:5174
NODE_ENV=development
```

## API Overview

- **Auth:** Register, login, refresh token, get current user
- **Missions:** CRUD, status updates, analytics
- **Drones:** Fleet management, status, details
- **Waypoints:** Route planning, GPS, actions

See full API documentation in the [docs](#) or in-code comments.

## Deployment

### Docker (Optional)

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

## Contributing

We welcome contributions! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Guidelines
- Use TypeScript best practices
- Write meaningful commit messages
- Test changes locally
- Follow code style and patterns
- Ensure responsive design

## Support

- **Issues**: [GitHub Issues](#)
- **Documentation**: See this README and in-code docs

## License

MIT © Development Team

---

**Built with ❤️ for the drone and aerospace community** 