import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100  ">
        
        <Header/>

        <main className="p-4 ">
          <Routes>
            <Route path="/login" element={<LoginForm setToken={setToken} />} />
        
            <Route path="/" element={<ProtectedRoute element={<TaskList token={token} />} />} />
            <Route path="/add" element={<ProtectedRoute element={<TaskForm token={token} />} />} />
            <Route path="/edit/:id" element={<ProtectedRoute element={<TaskForm token={token} />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
