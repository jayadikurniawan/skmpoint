import React, { useState } from 'react';
import axios from 'axios';

function LoginAdmin({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lakukan POST request ke backend untuk login admin
    axios.post('http://localhost:5000/auth/admin/login', formData)
      .then(response => {
        setResponseMessage(response.data.msg);
        onLogin(response.data.admin);  // Kirimkan data admin ke fungsi onLogin
      })
      .catch(error => {
        setResponseMessage(error.response?.data.msg || 'Error');
      });
  };

  return (
    <div>
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default LoginAdmin;