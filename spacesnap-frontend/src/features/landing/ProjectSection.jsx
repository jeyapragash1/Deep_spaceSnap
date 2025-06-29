import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaLaptopCode /* ... all other icons ... */ } from 'react-icons/fa';
import in1 from "../../assets/images/in1.jpg";
// ... all other image imports ...
import useOnScreen from '../../hooks/useOnScreen';
import useCountUp from '../../hooks/useCountUp';

const projects = [ /* ... */ ];
const ProjectCard = ({ project, index }) => { /* ... */ };
const StatsSection = () => { /* ... */ };
const InteriorGallery = () => { /* ... */ };
const ProjectSection = () => { /* ... Paste your ProjectSection code here ... */ };
export default ProjectSection;