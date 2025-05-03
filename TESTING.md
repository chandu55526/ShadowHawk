# Testing ShadowHawk - Recruiter's Guide

This guide will help you test and evaluate the ShadowHawk project. The project consists of three main components:
1. Frontend (React application)
2. Backend (Node.js server)
3. Browser Extension

## Prerequisites

Before testing, ensure you have:
- Node.js (v18 or higher) installed
- MongoDB installed and running
- A modern web browser (Chrome, Firefox, or Edge)
- Git installed

## Step 1: Clone and Setup

1. Clone the repository:
```bash
git clone https://github.com/chandu55526/ShadowHawk.git
cd ShadowHawk
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 2: Start the Servers

1. Start the backend server:
```bash
cd server
npm run dev
```
The backend should start on port 5001.

2. Start the frontend server:
```bash
cd client
npm run dev
```
The frontend should start on port 3000.

## Step 3: Testing the Application

1. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`
   - You should see the login page

2. **Authentication Testing**:
   - Create a new account using the signup form
   - Log in with your credentials
   - Test the logout functionality

3. **Threat Detection Testing**:
   - The dashboard should show real-time threat monitoring
   - Test the threat visualization features
   - Check the alert system

4. **Browser Extension Testing**:
   - Install the browser extension from the `browser-extension` directory
   - Test the extension's threat detection capabilities
   - Verify real-time alerts

## Common Issues and Solutions

1. **Port Conflicts**:
   - If port 5001 is in use, the backend server will fail to start
   - Solution: Kill the process using port 5001 or change the port in `server/src/index.ts`

2. **MongoDB Connection**:
   - Ensure MongoDB is running
   - Check the connection string in `server/.env`

3. **CORS Issues**:
   - If you see CORS errors, verify the frontend and backend URLs in the configuration

## Evaluation Points

1. **Frontend**:
   - Responsive design
   - User interface intuitiveness
   - Real-time updates
   - Error handling

2. **Backend**:
   - API response times
   - Error handling
   - Security measures
   - Database integration

3. **Browser Extension**:
   - Installation process
   - Threat detection accuracy
   - Performance impact
   - User notifications

## Support

If you encounter any issues during testing, please:
1. Check the console logs for both frontend and backend
2. Verify all services are running
3. Ensure all environment variables are properly set

For additional questions, you can contact the developer through GitHub issues or the contact information provided in the repository. 