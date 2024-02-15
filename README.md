# ShadowHawk - Real-time Browser Threat Detection System

ShadowHawk is a comprehensive real-time browser threat detection system that monitors and analyzes web traffic for potential security threats.

## Features

- Real-time threat detection and monitoring
- Browser extension for threat detection
- Dashboard for threat visualization
- Automated threat reporting
- User authentication and authorization
- Real-time alerts and notifications

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Real-time Communication: Socket.io
- Authentication: JWT
- Build Tool: Vite

## Project Structure

```
shadowhawk/
├── client/           # Frontend React application
├── server/           # Backend Node.js application
├── browser-extension/ # Browser extension for threat detection
└── shared/           # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Configure the necessary environment variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Security Features

- Real-time traffic analysis
- Malicious URL detection
- Phishing attempt detection
- Suspicious behavior monitoring
- Automated threat reporting

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details. 