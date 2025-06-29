// src/services/adminService.js

// This is a MOCK service. It simulates fetching data from a backend.
const getAnalytics = async () => {
  console.log("Fetching mock admin analytics...");
  // Wait 1 second to simulate a network request
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return dummy data that matches what the AdminDashboard component expects
  return {
    totalUsers: 1250,
    totalDesignsSaved: 3400,
    activeUsers: 450,
    topFeatures: [],
    userRolesDistribution: [],
    content: [
        { id: 'c1', status: 'Pending Review' },
        { id: 'c2', status: 'Approved' },
        { id: 'c3', status: 'Pending Review' },
    ]
  };
};

const adminService = {
  getAnalytics,
};

export default adminService;