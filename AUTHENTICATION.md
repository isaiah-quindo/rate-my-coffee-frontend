# Authentication Implementation

This document describes the authentication system implemented for the RateMyCoffee frontend application.

## Features

- User registration with email and password
- User login with email and password
- JWT token-based authentication
- Protected routes and user state management
- User profile dropdown in header
- Automatic token refresh and validation

## API Endpoints

The authentication system integrates with the following Laravel backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user/me` - Get current user information

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## File Structure

```
app/
├── contexts/
│   └── AuthContext.tsx          # Authentication context and provider
├── utilities/
│   └── authUtils.ts             # Authentication service and utilities
├── login/
│   └── page.tsx                 # Login page component
├── register/
│   └── page.tsx                 # Registration page component
└── components/
    └── Header.tsx               # Updated header with auth state

types/
└── auth.ts                      # Authentication type definitions
```

## Usage

### Using the Authentication Context

```tsx
import { useAuth } from '@/app/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }

  return <div>Please log in</div>;
}
```

### Authentication Service

```tsx
import { authService } from '@/app/utilities/authUtils';

// Login
await authService.login({ email: 'user@example.com', password: 'password' });

// Register
await authService.register({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password',
  password_confirmation: 'password'
});

// Logout
await authService.logout();

// Get current user
const user = await authService.getCurrentUser();
```

## Components

### Login Page (`/login`)
- Email and password fields
- Form validation
- Error handling
- Link to registration page

### Registration Page (`/register`)
- Name, email, password, and password confirmation fields
- Client-side validation
- Error handling
- Link to login page

### Header Component
- Shows user name when logged in
- Dropdown menu with profile and logout options
- Shows login link when not authenticated
- Loading state during authentication check

## Security Features

- JWT tokens stored in localStorage
- Automatic token validation on app load
- Secure logout with server-side token invalidation
- Error handling for expired or invalid tokens
- CSRF protection through Laravel backend

## Error Handling

The system handles various error scenarios:

- Network errors
- Invalid credentials
- Validation errors from the backend
- Expired tokens
- Server errors

Errors are displayed to users in a user-friendly format with specific field validation messages when available.
