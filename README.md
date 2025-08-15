## Prerequisites

- Node.js (>= 14.0.0)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NirajanMahato/technician-server
   cd technician-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and copy the contents from `env-template.txt`:

   ```bash
   cp env-template.txt .env
   ```

   Then update the `.env` file with your actual configuration values for:

   - MongoDB connection string
   - JWT secret
   - Email credentials
   - Google OAuth credentials
   - Cloudinary credentials

4. **Start the server**

   ```bash
   # Development mode
   npm run dev
   ```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Authentication Endpoints

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login with email and password
- `POST /api/v1/users/google` - Login with Google OAuth

### User Profile Endpoints

- `GET /api/v1/users/profile` - Get user profile (requires authentication)
- `POST /api/v1/users/upload-profile-image` - Upload profile image to Cloudinary (requires authentication)
- `PUT /api/v1/users/update-profile-image` - Update existing profile image (requires authentication)

### API Base URL

- All API endpoints are prefixed with `/api/v1`

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables

All configuration is handled through environment variables. See the `.env` example above for all available options.
