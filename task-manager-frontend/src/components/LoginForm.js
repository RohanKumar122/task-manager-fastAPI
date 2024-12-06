import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const backendapi ='http://localhost:8000'
// const backendapi ='0.0.0.0:8000'
const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); 
    const response = await fetch(`${backendapi}/token`, {
      method: 'POST',
      body: new URLSearchParams({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.access_token); 
      localStorage.setItem('token', data.access_token); 
      navigate('/'); 
    } else {
      alert('Invalid credentials');
    }
    setLoading(false); 
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleLogin}
        disabled={loading} 
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};

export default LoginForm;
