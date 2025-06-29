// src/App.jsx

import React, { useState } from 'react';
import AppRoutes from './routes'; // The path is './routes' which means "the routes folder in the same directory"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

export default App;