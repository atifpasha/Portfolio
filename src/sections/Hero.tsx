import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { personalInfo } from '../data/portfolioData';

export const Hero = () => {
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
            href="/resume.pdf" 
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
        <Player
          autoplay
          loop
          src="/Developer.json"
           style={{ width: '100%', height: '400px', }}
        />
      </motion.div>
    </section>
  );
};