import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DeptLogin from './pages/DeptLogin';
import TouristRegistration from './pages/TouristRegistration';
import AirportRegistration from './pages/AirportRegistration';
import TouristDashboard from './pages/TouristDashboard';
import AdminDashboard from './pages/AdminDashboard';

import LanguageSwitcher from './components/LanguageSwitcher';
import SaarthAI from './components/SaarthAI';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <LanguageSwitcher />
      <SaarthAI />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/airport" element={<DeptLogin type="AIRPORT" />} />
        <Route path="/login/police" element={<DeptLogin type="POLICE" />} />
        <Route path="/register" element={<TouristRegistration />} />
        <Route path="/airport/register" element={<AirportRegistration />} />
        <Route path="/tourist/dashboard" element={<TouristDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
