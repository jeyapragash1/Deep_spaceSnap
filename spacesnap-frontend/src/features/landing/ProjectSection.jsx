// src/features/landing/ProjectSection.jsx
import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import { FaLaptopCode, FaMobileAlt, FaPalette, FaProjectDiagram } from 'react-icons/fa';

const projects = [
  { id: 1, title: "AI-Powered Room Visualizer", description: "Upload your room photo and instantly preview how new wall colors, furniture, and decor look.", icon: FaLaptopCode, projectLink: "/dashboard", status: "Core Feature" },
  { id: 2, title: "Augmented Reality (AR) Preview", description: "Utilize your smartphone camera to place 3D furniture models directly into your real living space.", icon: FaMobileAlt, projectLink: "/dashboard", status: "Premium Feature" },
  { id: 3, title: "Personalized Style Quiz", description: "Discover your unique interior design aesthetic through an interactive quiz and get tailored recommendations.", icon: FaPalette, projectLink: "/dashboard", status: "Core Feature" },
  { id: 4, title: "User Dashboard & Management", description: "A secure and user-friendly personal dashboard to manage all your saved room designs and quiz results.", icon: FaProjectDiagram, projectLink: "/dashboard", status: "Core Feature" },
];

const ProjectCard = ({ project, index }) => (
  <motion.article initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
    <div className="p-5 flex flex-col flex-grow">
      {project.icon && <div className="mb-4 text-primary-teal text-4xl"><project.icon /></div>}
      <h3 className="text-xl font-semibold text-primary-teal mb-2">{project.title}</h3>
      <p className="text-gray-700 text-sm flex-grow mb-4">{project.description}</p>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === "Core Feature" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          {project.status}
        </span>
        <Link to={project.projectLink}><button className="px-4 py-2 bg-primary-teal text-white rounded-md font-semibold hover:bg-opacity-90 transition">Explore</button></Link>
      </div>
    </div>
  </motion.article>
);

const ProjectSection = () => (
  <section className="pt-16 pb-20 bg-neutral-light px-4 sm:px-8 text-neutral-dark">
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto text-center mb-16">
      <h2 className="text-5xl font-extrabold text-primary-teal mb-4">Our Innovative Solutions</h2>
      <p className="text-xl text-gray-700 max-w-4xl mx-auto">SpaceSnap brings cutting-edge AI and AR technologies to revolutionize interior design.</p>
    </motion.div>
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
    </div>
  </section>
);
export default ProjectSection;