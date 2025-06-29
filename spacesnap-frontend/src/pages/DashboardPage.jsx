// src/pages/DashboardPage.jsx

import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Modal from '../components/ui/Modal';
import { FaCheckCircle, FaLock } from 'react-icons/fa';

const DashboardPage = ({ isLoggedIn, setIsLoggedIn }) => {
  // State to track user's progress. Initially, nothing is complete.
  const [completedSteps, setCompletedSteps] = useState({
    quiz: false,
    visualizer: false,
  });

  // State to control the modal pop-up
  const [modalState, setModalState] = useState({
    isOpen: false,
    targetFeature: null, // e.g., 'visualizer' or 'ar'
    message: '',
  });

  // Function to simulate completing a step
  const handleCompleteStep = (step) => {
    alert(`Congratulations! You have completed the ${step}.`);
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
  };

  // The main logic for handling clicks on features
  const handleFeatureClick = (feature) => {
    if (feature === 'quiz') {
      alert("Starting the Style Quiz...");
      // In a real app, you would navigate to the quiz page.
      // For now, we'll just simulate completing it after a delay.
      setTimeout(() => handleCompleteStep('quiz'), 2000);
      return;
    }

    if (feature === 'visualizer') {
      if (!completedSteps.quiz) {
        setModalState({
          isOpen: true,
          targetFeature: 'visualizer',
          message: 'You have not completed the Style Quiz yet. Your experience will be better if you do it first. Do you want to continue anyway?',
        });
      } else {
        alert("Starting the AI Visualizer...");
        setTimeout(() => handleCompleteStep('visualizer'), 2000);
      }
      return;
    }

    if (feature === 'ar') {
      if (!completedSteps.visualizer) {
        setModalState({
          isOpen: true,
          targetFeature: 'ar',
          message: 'It looks like you haven\'t created a design with the AI Visualizer yet. AR works best with a saved design. Do you want to continue anyway?',
        });
      } else {
        alert("Starting the AR Experience...");
      }
      return;
    }
  };

  const handleModalConfirm = () => {
    alert(`Okay, proceeding to the ${modalState.targetFeature}...`);
    // Simulate completing the previous step if the user forces their way through
    if (modalState.targetFeature === 'visualizer') handleCompleteStep('quiz');
    if (modalState.targetFeature === 'ar') handleCompleteStep('visualizer');

    setModalState({ isOpen: false, targetFeature: null, message: '' }); // Close modal
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, targetFeature: null, message: '' });
  };
  
  // Dummy props for MainLayout since we are on the dashboard
  // In a real app, this would come from a global state/context
  const mockIsLoggedIn = true;
  const mockSetIsLoggedIn = () => {};


  return (
    <MainLayout isLoggedIn={mockIsLoggedIn} setIsLoggedIn={mockSetIsLoggedIn}>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        {/* The Feature Steps */}
        <div className="space-y-6">
          {/* Step 1: Style Quiz */}
          <div onClick={() => handleFeatureClick('quiz')} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">1. Find Your Style</h2>
              <p className="text-gray-600">Take our personalized Style Quiz to begin.</p>
            </div>
            {completedSteps.quiz ? <FaCheckCircle className="text-green-500 text-3xl" /> : <div className="w-[30px]"></div>}
          </div>

          {/* Step 2: AI Visualizer */}
          <div onClick={() => handleFeatureClick('visualizer')} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">2. Visualize Your Room</h2>
              <p className="text-gray-600">Use our AI tool to see your new design come to life.</p>
            </div>
            {completedSteps.quiz ? (completedSteps.visualizer ? <FaCheckCircle className="text-green-500 text-3xl" /> : <div className="w-[30px]"></div>) : <FaLock className="text-gray-400 text-3xl" />}
          </div>

          {/* Step 3: AR Experience */}
          <div onClick={() => handleFeatureClick('ar')} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">3. View in Your Space (AR)</h2>
              <p className="text-gray-600">Place 3D furniture in your actual room.</p>
            </div>
            {completedSteps.visualizer ? <div className="w-[30px]"></div> : <FaLock className="text-gray-400 text-3xl" />}
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        title="Are you sure?"
      >
        <p>{modalState.message}</p>
      </Modal>

    </MainLayout>
  );
};

export default DashboardPage;