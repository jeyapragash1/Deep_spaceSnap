// src/components/layout/MainLayout.jsx

import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow pt-[64px]">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;