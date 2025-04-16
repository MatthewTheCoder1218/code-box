import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MainPage from './pages/MainPage.jsx';
import Wrapper from './pages/Wrapper.jsx';
import SharePage from './pages/SharePage.jsx';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: 'white',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/share/:id" element={<SharePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={
          <Wrapper>
            <MainPage />
          </Wrapper>
          } />
      </Routes>
    </Router>
  );
}

export default App;