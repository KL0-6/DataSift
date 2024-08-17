import React from 'react';
import Navbar from './../components/Navbar';
import { motion } from 'framer-motion';
import { FaRocket, FaLock, FaCogs, FaTachometerAlt, FaEyeSlash, FaCodeBranch } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const App: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="grid place-items-center text-center py-24 px-6 bg-white mt-16">
        <iframe name="dummyframe" id="dummyframe" style={{display: "none"}}></iframe>
        <form className="flex flex-row" method="get" action="http://localhost:3000/api/scrape" target="dummyframe">
          <label form="website" className="text-4xl mr-4">Scrape!</label>
          <input name="website" className="border-2 p-1.5 rounded-xl" type="text" placeholder="https://google.com/"></input>
          <input type="submit" className="rounded-xl p-2 ml-2 text-white bg-purple-700"/>
        </form>
      </section>

      {/* Footer Section */}
      <footer className="bg-primary text-white py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            &copy; {new Date().getFullYear()} DataSift. All rights reserved.
          </motion.p>
          <motion.div 
            className="mt-4"
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            <a href="#privacy" className="hover:underline">Privacy Policy</a> | 
            <a href="#terms" className="hover:underline ml-2">Terms of Service</a>
          </motion.div>
        </div>
      </footer>
    </motion.div>
  );
};

export default App;
