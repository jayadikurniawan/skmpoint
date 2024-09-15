import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);  // State untuk menyimpan data pengguna setelah login

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);  // Set pengguna setelah login
  };

  if (user) {
    return <Dashboard user={user} />;  // Arahkan ke dashboard setelah login
  }

  return (
    <div>
      <h1>Signup Mahasiswa</h1>
      <SignupForm />
      <h1>Login Mahasiswa</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default App;