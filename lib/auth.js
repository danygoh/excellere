// Auth utilities

// Get current user from localStorage (client-side)
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Get token
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Check if user is logged in
export function isLoggedIn() {
  return !!getToken();
}

// Check user role
export function hasRole(role) {
  const user = getCurrentUser();
  return user?.role === role;
}

// Logout
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Require auth (redirect if not logged in)
export function requireAuth() {
  if (!isLoggedIn()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return false;
  }
  return true;
}

// Require role
export function requireRole(role) {
  if (!requireAuth()) return false;
  if (!hasRole(role)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
    return false;
  }
  return true;
}
