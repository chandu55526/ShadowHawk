# Middleware Documentation

This directory contains all the middleware used in the application. Each middleware is designed to handle a specific aspect of request processing.

## Available Middleware

### Authentication (`auth.ts`)
- `authenticate`: Verifies JWT tokens and attaches user information to the request
- `authorize`: Checks if the user has the required role to access a route

### Validation (`validation.ts`)
- `validate`: Validates request data against a Zod schema

### Caching (`caching.ts`)
- `cache`: Caches GET request responses in Redis

### Request Logging (`requestLogger.ts`)
- `requestLogger`: Logs request details including method, URL, status code, and duration

### Response Time (`responseTime.ts`)
- `responseTime`: Records response time metrics for Prometheus

### Rate Limiting (`rateLimit.ts`)
- `rateLimit`: Limits the number of requests from an IP address

### Security Headers (`securityHeaders.ts`)
- `securityHeaders`: Adds security headers to responses using Helmet

### Compression (`compression.ts`)
- `compress`: Compresses responses using gzip

### CORS (`cors.ts`)
- `corsMiddleware`: Handles Cross-Origin Resource Sharing

### Body Parser (`bodyParser.ts`)
- `bodyParser`: Parses JSON and URL-encoded request bodies

### Error Handler (`errorHandler.ts`)
- `errorHandler`: Handles errors and sends appropriate responses

## Usage

```typescript
import { authenticate, authorize, validate, cache } from './middleware';
import { z } from 'zod';

// Authentication
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route' });
});

// Authorization
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin route' });
});

// Validation
const schema = z.object({
  name: z.string(),
  age: z.number()
});
router.post('/users', validate(schema), (req, res) => {
  res.json({ message: 'User created' });
});

// Caching
router.get('/data', cache(60), (req, res) => {
  res.json({ data: 'Cached data' });
});
```

## Configuration

Middleware configuration can be found in `constants.ts`:

```typescript
export const RATE_LIMIT = {
  POINTS: 100,
  DURATION: 60,
  BLOCK_DURATION: 60 * 15
};

export const CACHE = {
  DURATION: 60 * 5
};

export const CORS = {
  ORIGIN: process.env.CORS_ORIGIN || '*',
  METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
  CREDENTIALS: true,
  MAX_AGE: 86400
};

export const SECURITY = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '1d'
};
```

## Testing

Middleware tests are located in `__tests__/middleware.test.ts`. Run tests with:

```bash
npm test
```

## Error Handling

The error handler middleware provides consistent error responses:

```typescript
// Validation Error
{
  error: 'Validation Error',
  details: [
    {
      path: 'name',
      message: 'Required'
    }
  ]
}

// Authentication Error
{
  error: 'Unauthorized',
  message: 'Invalid or expired token'
}

// Authorization Error
{
  error: 'Forbidden',
  message: 'Insufficient permissions'
}

// Rate Limit Error
{
  error: 'Too Many Requests',
  message: 'Rate limit exceeded. Please try again later.'
}
``` 