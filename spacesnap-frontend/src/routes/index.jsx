// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
// ... other page imports

// Import the new dashboard page
import PremiumUserDashboardPage from '../pages/PremiumUserDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* ... other routes */}

      {/* Add a new route for the dashboard */}
      <Route path="/dashboard" element={<PremiumUserDashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;