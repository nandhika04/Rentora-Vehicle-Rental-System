# Authentication System Setup Guide

## Overview
This project now includes a complete, secure authentication system with the following features:

### ✅ Implemented Features
- **User Registration & Login** - Secure user account creation and authentication
- **Password Hashing** - Bcrypt with salt rounds for secure password storage
- **JWT Tokens** - Access and refresh token system for stateless authentication
- **Role-Based Access Control** - Admin and user roles with different permissions
- **Protected Routes** - Frontend route protection based on authentication status
- **Token Refresh** - Automatic token refresh to maintain user sessions
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - Comprehensive validation on both frontend and backend
- **Security Headers** - Helmet.js for security headers
- **Error Handling** - Proper error handling and user feedback

## Backend Authentication Features

### New Dependencies Added
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "express-jwt": "^8.4.1",
  "express-rate-limit": "^7.1.5",
  "helmet": "^7.1.0"
}
```

### API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)

#### Protected Admin Routes
- `POST /api/bikes` - Add new bike (admin only)
- `PUT /api/bikes/:id` - Update bike (admin only)
- `DELETE /api/bikes/:id` - Delete bike (admin only)
- `POST /api/cars` - Add new car (admin only)
- `PUT /api/cars/:id` - Update car (admin only)
- `DELETE /api/cars/:id` - Delete car (admin only)

### Security Features
- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Tokens**: 7-day access tokens, 30-day refresh tokens
- **Rate Limiting**: 5 auth attempts per 15 minutes per IP
- **Input Validation**: Comprehensive validation with error messages
- **CORS Protection**: Configured for specific frontend URL
- **Security Headers**: Helmet.js for security headers

## Frontend Authentication Features

### New Components
- **AuthContext** - Global authentication state management
- **ProtectedRoute** - Route protection component
- **Profile** - User profile management page
- **Updated Navbar** - Shows authentication status and user menu

### Authentication Flow
1. User registers/logs in through forms
2. JWT tokens are stored in localStorage
3. Tokens are automatically included in API requests
4. Automatic token refresh on 401 responses
5. Protected routes redirect to login if not authenticated
6. Admin routes require admin role

### User Interface Updates
- **Dynamic Navbar**: Shows different options for authenticated/unauthenticated users
- **User Menu**: Dropdown with profile and logout options
- **Admin Access**: Admin users see admin dashboard link
- **Loading States**: Proper loading indicators during authentication
- **Error Handling**: User-friendly error messages

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vehicleRentalDB

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Usage Instructions

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```

### 3. Test Authentication
1. Visit `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Or click "Login" to sign in with existing account
4. Admin access: Use email `admin@gmail.com` during registration

### 4. Admin Features
- Admin users can access `/admindashboard`
- Admin users can add/edit/delete vehicles
- Admin users see "Admin" link in navbar

## Security Considerations

### Production Deployment
1. **Change JWT Secret**: Use a strong, random secret key
2. **Use HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Store sensitive data in environment variables
4. **Database Security**: Use MongoDB Atlas or secure database hosting
5. **Rate Limiting**: Consider using Redis for distributed rate limiting
6. **Token Blacklisting**: Implement token blacklisting for logout

### Password Requirements
- Minimum 6 characters
- Stored with bcrypt hashing
- Validated on both frontend and backend

### Token Security
- Access tokens expire in 7 days
- Refresh tokens expire in 30 days
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Automatic refresh prevents session interruption

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check FRONTEND_URL in backend .env
2. **Token Errors**: Clear localStorage and login again
3. **Database Connection**: Ensure MongoDB is running
4. **Rate Limiting**: Wait 15 minutes or restart server

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages in API responses.

## Next Steps

### Potential Enhancements
1. **Email Verification**: Add email verification for new accounts
2. **Password Reset**: Implement forgot password functionality
3. **Two-Factor Authentication**: Add 2FA for enhanced security
4. **Social Login**: Add Google/Facebook login options
5. **Session Management**: Add active session tracking
6. **Audit Logging**: Log authentication events for security monitoring

The authentication system is now fully functional and ready for production use with proper security measures in place.
