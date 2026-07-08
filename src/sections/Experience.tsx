import { motion } from 'framer-motion';
import { experiences } from '../data/portfolioData';
import { Player } from '@lottiefiles/react-lottie-player';

export const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24 px-6 sm:px-8 md:px-10 max-w-7xl mx-auto border-t border-gray-200/20 dark:border-white/5 relative z-10" style={{ perspective: '1000px' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 30, rotateX: 20 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 flex items-center gap-4 text-gray-900 dark:text-gray-100 transition-colors origin-bottom"
      >
        <span className="whitespace-nowrap shrink-0">Where I've Worked</span>
        <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow ml-2 sm:ml-4 transition-colors"></div>
      </motion.h2>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20">
      <div className="flex-1 space-y-8 lg:space-y-12 w-full lg:max-w-2xl">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: index * 0.15, type: "spring", bounce: 0.3 }}
            className="border-l-2 border-gray-300 dark:border-gray-700 pl-6 relative transition-colors origin-top"
          >
            <div className="absolute w-4 h-4 bg-white dark:bg-[#020617] border-2 border-blue-500 rounded-full -left-[9px] top-1"></div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors flex flex-col sm:flex-row sm:gap-2">
              <span>{exp.role}</span>
              <span className="text-blue-500 text-base sm:text-xl relative inline-flex items-center gap-1 group/link w-fit">
                @ 
                <a 
                  href={exp.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline decoration-blue-500/50 underline-offset-4"
                >
                  {exp.company}
                </a>
              </span>
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1 mb-4 transition-colors">{exp.duration}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
              {exp.description}
            </p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="flex-1 w-full max-w-[500px] flex justify-center lg:justify-end lg:mt-0"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Player
          autoplay
          loop
          src="/exper.json"
          style={{ width: '100%', height: '400px' }}
          className="h-[250px] sm:h-[300px] lg:h-[400px] opacity-90 drop-shadow-2xl"
        />
      </motion.div>
      </div>
    </section>
  );
};