import React, { useEffect } from 'react';
import axios from 'axios';
import LoginPage from './pages/auth/LoginPage.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage.tsx';

function App() {
  useEffect(() => {
    axios
      .get('http://localhost:5000')
      .then((response) => {
        console.log('Connection successful:', response.data);
      })
      .catch((error) => {
        console.error('Error during connection:', error);
      });
  }, []);

  return (
    <Router>
      {/* <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h1>Docku Signed Frontend</h1> */}
      <Routes>
        <Route path="/" element={<h2>Welcome</h2>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {/* </div> */}
    </Router>
  );
}

export default App;
