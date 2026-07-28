import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';
import { LazyLottie } from '../components/LazyLottie';

export const Hero = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const [showHeroLottie, setShowHeroLottie] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHeroLottie(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="min-h-[100svh] flex flex-col lg:flex-row items-center justify-between px-6 sm:px-8 md:px-20 max-w-7xl mx-auto gap-12 lg:gap-8 pt-32 pb-16 lg:pt-20">
      <div className="flex-1 mt-10 md:mt-0 w-full">
        <motion.p 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-blue-500 font-mono mb-4 text-sm sm:text-base md:text-lg"
        >
          Hi, my name is
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 tracking-tighter drop-shadow-lg transition-colors duration-300"
        >
          {personalInfo.name}.
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800 dark:from-gray-400 dark:to-gray-600 mb-6 leading-tight"
        >
          {personalInfo.tagline}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed transition-colors duration-300"
        >
          {personalInfo.about}
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.6 }}
           className="mt-10"
        >
          <a 
            href={`${baseUrl}resume.pdf`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-transparent border-2 border-blue-400 text-blue-400 font-mono rounded overflow-hidden relative group hover:bg-blue-400/10 transition-colors duration-300"
          >
            Check out my work!
          </a>
        </motion.div>
      </div>

      <motion.div 
        className="flex-1 w-full max-w-[500px] flex justify-center lg:justify-end mt-12 lg:mt-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {showHeroLottie ? (
          <LazyLottie
            src={`${baseUrl}codings.json`}
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] transform scale-110 sm:scale-125 lg:scale-100"
            placeholderClassName="w-full h-full rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.2),transparent_65%)]"
          />
        ) : (
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.2),transparent_65%)]" />
        )}
      </motion.div>
    </section>
  );
};