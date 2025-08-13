## Prerequisites

- Node.js (>= 14.0.0)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd technician-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/technician_booking

   # Frontend URLs (for CORS)
   FRONTEND_URL=http://localhost:3000
   REACT_NATIVE_URL=http://localhost:8081

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRE=7

   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=uploads/

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   BURST_LIMIT_WINDOW_MS=1000
   BURST_LIMIT_MAX_REQUESTS=10

   # Security
   SESSION_SECRET=your-session-secret-change-in-production

   # Logging
   LOG_LEVEL=info

   # Timezone
   TIMEZONE=UTC
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Root

- `GET /` - API information

### API Base URL

- All API endpoints will be prefixed with `/api/v1`

## Security Features

### CORS Configuration

- Configurable allowed origins
- Support for both web and React Native
- Development mode allows localhost variations

### Rate Limiting

- General rate limiting: 100 requests per 15 minutes
- Burst limiting: 10 requests per second
- Authentication rate limiting: 5 attempts per 15 minutes

### Security Headers

- Helmet.js for security headers
- Custom security headers
- Content Security Policy (CSP)
- XSS protection
- Frame options

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables

All configuration is handled through environment variables. See the `.env` example above for all available options.

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up MongoDB connection string
5. Configure email settings
6. Set up proper logging
