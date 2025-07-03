# Auth Context Usage Guide

The AuthContext now stores the complete login response object and provides helper functions to access user data throughout the entire project.

## Login Response Structure

```javascript
{
  "message": "user logged in successfully, session will be ended on next 24H",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "6859b0b57a0b0d8ffa36083d",
    "email": "tony@gmail.com",
    "firstName": "Tony",
    "lastName": "Stark",
    "phoneNumber": "1234567890",
    "password": "",
    "role": "68162f63ff2da55b40ca61b8",
    "createdByUserId": "68163015624b09de23e942ad",
    "updatedByUserId": "68163015624b09de23e942ad",
    "published": true,
    "createdAt": "2025-06-23T19:53:25.312Z",
    "updatedAt": "2025-06-23T19:53:25.312Z",
    "__v": 0
  }
}
```

## How to Use AuthContext

### 1. Import the hook
```javascript
import { useAuth } from '../context/AuthContext';
```

### 2. Access auth data in any component
```javascript
const MyComponent = () => {
  const { 
    auth,           // Complete auth object
    isAuthenticated, // Boolean: true if logged in
    login,          // Function to login
    logout,         // Function to logout
    
    // Helper functions
    getUser,        // Returns user data object
    getToken,       // Returns JWT token
    getMessage,     // Returns login message
    getUserId,      // Returns user ID
    getUserEmail,   // Returns user email
    getUserName,    // Returns full name
    getUserRole,    // Returns role ID
    isAdmin         // Returns boolean for admin check
  } = useAuth();

  // Your component logic here
};
```

## Usage Examples

### 1. Display User Information
```javascript
const UserProfile = () => {
  const { getUserName, getUserEmail, isAdmin } = useAuth();

  return (
    <div>
      <h2>Welcome, {getUserName()}!</h2>
      <p>Email: {getUserEmail()}</p>
      {isAdmin() && <p>You have admin privileges</p>}
    </div>
  );
};
```

### 2. Conditional Rendering Based on Auth
```javascript
const Dashboard = () => {
  const { isAuthenticated, getUserName } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <div>
      <h1>Dashboard for {getUserName()}</h1>
      {/* Dashboard content */}
    </div>
  );
};
```

### 3. Access Complete Auth Object
```javascript
const DebugComponent = () => {
  const { auth } = useAuth();

  return (
    <pre>
      {JSON.stringify(auth, null, 2)}
    </pre>
  );
};
```

### 4. Role-Based Access Control
```javascript
const AdminPanel = () => {
  const { isAdmin, getUserRole } = useAuth();

  if (!isAdmin()) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Role ID: {getUserRole()}</p>
      {/* Admin content */}
    </div>
  );
};
```

### 5. API Calls with Token
```javascript
const SecureComponent = () => {
  const { getToken, logout } = useAuth();

  const makeSecureApiCall = async () => {
    const token = getToken();
    if (!token) {
      logout();
      return;
    }

    try {
      const response = await fetch('/api/secure-endpoint', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // Handle response
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return <button onClick={makeSecureApiCall}>Make Secure Call</button>;
};
```

## Available Helper Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getUser()` | Object | Complete user data object |
| `getToken()` | String | JWT token for API calls |
| `getMessage()` | String | Login success message |
| `getUserId()` | String | User's unique ID |
| `getUserEmail()` | String | User's email address |
| `getUserName()` | String | User's full name (firstName + lastName) |
| `getUserRole()` | String | User's role ID |
| `isAdmin()` | Boolean | True if user is admin |

## Persistence

- Auth data is automatically saved to localStorage
- Data persists across browser refreshes
- Automatically loaded when the app starts
- Cleared on logout

## Security Notes

- Token is stored in memory and localStorage
- Consider implementing token refresh logic
- Token expires in 24 hours as per backend response
- Implement proper error handling for expired tokens

## Example: Complete Component

```javascript
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { 
    isAuthenticated, 
    getUserName, 
    getUserEmail, 
    getUserId, 
    isAdmin, 
    logout 
  } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {getUserName()}!</h1>
      <div>
        <p><strong>Email:</strong> {getUserEmail()}</p>
        <p><strong>User ID:</strong> {getUserId()}</p>
        <p><strong>Role:</strong> {isAdmin() ? 'Admin' : 'User'}</p>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
```

This setup provides a robust, type-safe way to access user authentication data throughout your entire React application! 🚀 