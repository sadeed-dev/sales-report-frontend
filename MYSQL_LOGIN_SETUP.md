# Login Setup - MySQL Table Based

## ✅ Updated Login System

The login system now uses the MySQL `leadsCheckerUser` table directly. No test user creation scripts needed.

## 📋 How It Works

1. **User credentials stored in MySQL table**: `leadsCheckerUser`
   - `id` (int, primary key, auto-increment)
   - `email` (varchar 255)
   - `password` (varchar 255)

2. **Login Flow**:
   - User enters email and password in login form
   - Backend queries `leadsCheckerUser` table
   - If email exists and password matches → JWT token generated
   - Token stored in localStorage
   - User redirected to dashboard

3. **Protected Routes**:
   - All dashboard routes require valid JWT token
   - Token validated on every API request
   - Expired token redirects to login

## 🚀 Quick Start

### 1. Ensure Backend is Running
```bash
cd sales-dashboard-backend
npm run dv
```
Backend: `http://localhost:3008`

### 2. Start Frontend
```bash
cd frontend2/sales-report-frontend
npm run dev
```
Frontend: `http://localhost:5173`

### 3. Add Users to Database

Insert test users directly into the `leadsCheckerUser` table:

```sql
INSERT INTO leadsCheckerUser (email, password) VALUES 
('shadeed@startupflora.com', 'shadeed@123'),
('test@example.com', 'password123'),
('admin@company.com', 'admin@123');
```

### 4. Test Login

1. Go to `http://localhost:5173/login`
2. Enter email: `shadeed@startupflora.com`
3. Enter password: `shadeed@123`
4. Click "Login"
5. Should redirect to dashboard
6. Click "Logout" to return to login page

## 🔑 Important Notes

- **Passwords are stored as plain text** in the table (not hashed)
- This is suitable for simple authentication
- For production, consider:
  - Hashing passwords with bcrypt
  - Using environment variables for sensitive data
  - Adding rate limiting on login attempts
  - Using HTTPS

## 📝 File Structure

```
Backend:
- controllers/authController.js → Login & token verification
- routes/userRoutes.js → API routes
- utils/db.js → MySQL connection pool

Frontend:
- src/context/AuthContext.jsx → Auth state management
- src/pages/LoginPage.jsx → Login UI
- src/components/ProtectedRoute.jsx → Route protection
- src/components/Sidebar.jsx → Logout functionality
```

## ✅ Features

✅ Simple email/password login
✅ JWT token-based authentication
✅ Token persists on page refresh
✅ Protected dashboard routes
✅ Logout functionality clears session
✅ Error handling for invalid credentials
✅ Loading states during login

## 🐛 Troubleshooting

### "Credentials are incorrect" error
- Check email exists in `leadsCheckerUser` table
- Verify password matches exactly (case-sensitive)
- Check for trailing spaces

### Can't login despite correct credentials
- Backend running on port 3008?
- MySQL connection working?
- `leadsCheckerUser` table exists?
- Check console for error messages

### Token not persisting on refresh
- Browser localStorage might be disabled
- Check browser dev tools → Application → Storage → LocalStorage

## 🎯 Backend API

### Login Endpoint
```
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "shadeed@startupflora.com",
  "password": "shadeed@123"
}

Response (200):
{
  "status": "success",
  "token": "eyJhbGc...",
  "data": {
    "user": {
      "id": 1,
      "email": "shadeed@startupflora.com"
    }
  }
}
```

### Protected Endpoints

All other endpoints require authorization header:

```
GET /api/v1/users/org-chart
Authorization: Bearer eyJhbGc...
```

If token is missing or invalid → 401 Unauthorized

---

Done! Your login system now uses the MySQL `leadsCheckerUser` table. 🎉
