// // src/pages/AboutPage.jsx
// import React from 'react';
// import MainLayout from '../components/layout/MainLayout';
// import { motion } from 'framer-motion';
// import { FaUsers, FaLightbulb, FaRocket, FaFlagCheckered } from 'react-icons/fa';

// // --- LOCAL IMAGE IMPORTS ---
// import aboutHeroImg from '../assets/images/17.jpg'; // An inspiring, wide image
// import teamImage from '../assets/images/18.jpg'; // An image representing collaboration

// const AboutPage = () => {
//     // Animation variants for Framer Motion
//     const fadeIn = {
//         hidden: { opacity: 0, y: 20 },
//         visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
//     };

//     const timelineItem = {
//         hidden: { opacity: 0, x: -50 },
//         visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
//     };

//     return (
//         <MainLayout>
//             <motion.div initial="hidden" animate="visible" variants={fadeIn}>
//                 {/* --- HEADER SECTION --- */}
//                 <header className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${aboutHeroImg})` }}>
//                     <div className="absolute inset-0 bg-neutral-dark bg-opacity-60 flex items-center justify-center">
//                         <div className="text-center text-white">
//                             <h1 className="text-5xl md:text-7xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>Our Story</h1>
//                             <p className="text-xl mt-2">Bridging Imagination and Reality</p>
//                         </div>
//                     </div>
//                 </header>
                
//                 <div className="bg-white">
//                     <div className="container mx-auto px-4 py-20">

//                         {/* --- OUR MISSION SECTION --- */}
//                         <section className="text-center max-w-4xl mx-auto mb-20">
//                             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
//                                 <FaRocket className="text-primary-teal text-6xl mx-auto mb-4" />
//                                 <h2 className="text-4xl font-bold text-neutral-dark mb-4">Our Mission</h2>
//                                 <p className="text-lg text-gray-700 leading-relaxed">
//                                     At SpaceSnap, our mission is to democratize interior design. We empower everyone to visualize and create their dream living spaces with intuitive, powerful tools. By leveraging cutting-edge AI and AR, we turn design ideas into tangible realities, making the process accessible, exciting, and risk-free.
//                                 </p>
//                             </motion.div>
//                         </section>

//                         {/* --- OUR JOURNEY (TIMELINE) SECTION --- */}
//                         <section className="mb-20">
//                             <h2 className="text-4xl font-bold text-neutral-dark text-center mb-12">Our Journey</h2>
//                             <div className="relative max-w-2xl mx-auto">
//                                 {/* The vertical line */}
//                                 <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                                
//                                 <motion.div variants={timelineItem} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative mb-8 pl-12">
//                                     <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 bg-primary-teal rounded-full text-white"><FaLightbulb /></div>
//                                     <h3 className="font-bold text-xl">The Idea</h3>
//                                     <p className="text-gray-600">Born from the frustration of "will this fit?", SpaceSnap was conceived to solve the common problem of design visualization.</p>
//                                 </motion.div>

//                                 <motion.div variants={timelineItem} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative mb-8 pl-12">
//                                     <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 bg-primary-teal rounded-full text-white"><FaUsers /></div>
//                                     <h3 className="font-bold text-xl">The Team</h3>
//                                     <p className="text-gray-600">Group No: 10, a passionate team of Industrial Information Technology students from Uva Wellassa University, came together to build the solution.</p>
//                                 </motion.div>

//                                 <motion.div variants={timelineItem} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative mb-8 pl-12">
//                                     <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 bg-primary-teal rounded-full text-white"><FaFlagCheckered /></div>
//                                     <h3 className="font-bold text-xl">The Launch</h3>
//                                     <p className="text-gray-600">After months of development and supervised guidance, SpaceSnap is launched to help users everywhere design better spaces.</p>
//                                 </motion.div>
//                             </div>
//                         </section>

//                         {/* --- MEET THE TEAM SECTION --- */}
//                         <section className="py-20 bg-neutral-light rounded-lg flex flex-col md:flex-row items-center gap-12">
//                             <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="md:w-1/2">
//                                 <img src={teamImage} alt="A team working together" className="rounded-lg shadow-xl w-full" />
//                             </motion.div>
//                             <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="md:w-1/2 text-center md:text-left">
//                                 <h2 className="text-3xl font-bold text-neutral-dark mb-4">A Note of Thanks</h2>
//                                 <p className="text-lg text-gray-700 leading-relaxed mb-6">
//                                     This project would not have been possible without the invaluable guidance of our supervisors, Mr. H.P.D.P. Pathirana and Mr. S.S. Prajish. Their expertise and support have been instrumental at every stage of development.
//                                 </p>
//                             </motion.div>
//                         </section>
//                     </div>
//                 </div>
//             </motion.div>
//         </MainLayout>
//     );
// };

// export default AboutPage;

// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';
// REMOVED: import MainLayout from '../components/layout/MainLayout';

const AboutPage = () => {
  return (
    // The <MainLayout> wrapper has been removed from here.
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
    >
        <h1 className="text-4xl md:text-5xl font-bold text-primary-teal text-center mb-10">About SpaceSnap</h1>
        {/* ... The rest of your About Us page content ... */}
    </motion.div>
  );
};
export default AboutPage;