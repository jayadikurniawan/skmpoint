import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import LoginAdmin from './components/LoginAdmin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);  // State untuk admin

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);  // Login untuk mahasiswa
  };

  const handleAdminLogin = (loggedInAdmin) => {
    setAdmin(loggedInAdmin);  // Login untuk admin
  };

  if (admin) {
    return <AdminDashboard />;
  }

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <div>
      <h1>Signup Mahasiswa</h1>
      <SignupForm />
      <h1>Login Mahasiswa</h1>
      <LoginForm onLogin={handleLogin} />
      <h1>Login Admin</h1>
      <LoginAdmin onLogin={handleAdminLogin} />
    </div>
  );
}

export default App;