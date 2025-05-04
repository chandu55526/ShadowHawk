# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
RUN cd client && npm ci
RUN cd server && npm ci

# Copy source code
COPY . .

# Build client and server
RUN cd client && npm run build
RUN cd server && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package*.json ./server/

# Install production dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Expose port
EXPOSE 5001

# Start the server
CMD ["node", "dist/index.js"] 