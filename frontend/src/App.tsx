import React from 'react';
import Navbar from './components/Navbar';
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
  const features = [
    {
      title: "Blazing Fast",
      description: "We are working on optimizing DataSift to deliver fast results, aiming for significant improvements in speed and efficiency.",
      icon: <FaRocket className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
      title: "Bot Detection Bypass",
      description: "Our team is developing techniques to avoid bot detection, ensuring uninterrupted data extraction.",
      icon: <FaLock className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-green-500 to-teal-500",
    },
    {
      title: "Highly Scalable",
      description: "Future versions of DataSift will support massive parallel requests, handling large-scale operations with ease.",
      icon: <FaCogs className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
  ];

  const nextSteps = [
    {
      title: "Improved Speed",
      description: "We're fine-tuning the engine to bring you even faster scraping speeds in the next version.",
      icon: <FaTachometerAlt className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-red-500 to-pink-500",
    },
    {
      title: "Enhanced Bot Detection",
      description: "Our next update will focus on bypassing more sophisticated bot detection mechanisms.",
      icon: <FaEyeSlash className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      title: "Expanded API Features",
      description: "Expect new features, including customizable scraping rules and enhanced data output formats.",
      icon: <FaCodeBranch className="text-white text-5xl" />,
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
  ];

  // Make sure the testimonials array is defined
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO at TechStartup",
      testimony: "DataSift's early access version shows promise. We're excited to see how it evolves!",
    },
    {
      name: "Jane Smith",
      role: "Lead Developer at FinTechCo",
      testimony: "Looking forward to the full release. The current demo is already a game-changer.",
    },
  ];

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-white mt-16">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold"
          variants={fadeInUp}
          transition={{ duration: 0.3 }}
        >
          The Next Generation Web Scraping API
        </motion.h1>
        <motion.p 
          className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl mx-auto"
          variants={fadeInUp}
          transition={{ duration: 0.3 }}
        >
          DataSift is in development, but we are building towards an unparalleled experience in web scraping. 
          Try out our early access and let us know what you think.
        </motion.p>
        <motion.a 
          href="#api" 
          className="mt-8 inline-block text-white bg-primary py-3 px-8 rounded-full text-lg"
          variants={fadeInUp}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          Request Early Access
        </motion.a>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            Features We're Working On
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className={`p-8 rounded-lg shadow-lg flex flex-col items-center text-center ${feature.bgColor} hover:shadow-xl transition-shadow duration-300`}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  {feature.icon}  {/* Display the icon */}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12"
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            What's Next for DataSift?
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
          >
            {nextSteps.map((step, index) => (
              <motion.div 
                key={index} 
                className={`p-8 rounded-lg shadow-lg flex flex-col items-center text-center ${step.bgColor} hover:shadow-xl transition-shadow duration-300`}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">
                  {step.icon}  {/* Display the icon */}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-white">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            What Our Early Users Say
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-50 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-lg italic mb-4">"{testimonial.testimony}"</p>
                <p className="text-primary font-bold">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
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
