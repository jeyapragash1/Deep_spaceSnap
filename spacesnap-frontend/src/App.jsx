// src/App.jsx
import AppRoutes from './routes';
import AuthRedirector from './components/auth/AuthRedirector';

function App() {
  return (
    <div>
      {/* This component is now always listening for login events */}
      <AuthRedirector />
      {/* This renders all your pages */}
      <AppRoutes />
    </div>
  );
}

export default App;