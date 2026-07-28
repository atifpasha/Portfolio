import { useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { projects } from '../data/portfolioData';
import { ExternalLink } from 'lucide-react';

interface Project {
  id: string | number;
  title: string;
  description: string;
  tech: string[];
  link: string;
}

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDescriptionWheel = (e: React.WheelEvent<HTMLParagraphElement>) => {
    const el = e.currentTarget;
    const isScrollingDown = e.deltaY > 0;
    const isScrollingUp = e.deltaY < 0;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    // Keep wheel interaction isolated to description area
    e.stopPropagation();

    // Prevent scroll-chaining to page at boundaries
    if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
      e.preventDefault();
    }
  };
  
  // Custom 3D Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Keep springs for glow interaction only (no 3D text tilt)

  // Calculate generic percentages for the dynamic glow effect
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 300, damping: 30 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to relative coordinates centering at 0
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    // Snap back to 0 on exit
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="snap-start w-full min-w-0 h-[420px] md:h-[480px] relative rounded-2xl group cursor-default transform-gpu"
    >
      {/* Background card plane */}
      <div 
        className="absolute inset-0 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Default border */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 dark:border-white/5 group-hover:border-transparent transition-colors duration-500 z-10 pointer-events-none" />

        {/* Animated Rotating Gradient Border */}
        <div className="absolute inset-[-100%] top-[-100%] left-[-100%] right-[-100%] bottom-[-100%] w-[300%] h-[300%] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-[spin_4s_linear_infinite]" />
        
        {/* Inner Card Background (covers the gradient except for edges) */}
        <div className="absolute inset-[1px] bg-white dark:bg-[#112240] rounded-[15px] z-10 transition-colors duration-300" />

        {/* Dynamic Interactive Glow Mask */}
        <motion.div 
           className="absolute inset-[1px] rounded-[15px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply dark:mix-blend-screen pointer-events-none"
           style={{
             background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)`
           }}
        />
      </div>

      {/* Foreground Content Plane - keep text on a stable plane to avoid spacing jitter */}
      <div 
        className="p-6 md:p-8 relative z-10 h-full min-h-0 flex flex-col pointer-events-none overflow-hidden antialiased"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}
      >
        <div className="flex justify-between items-center mb-6 md:mb-8 text-gray-500 dark:text-gray-400 pointer-events-auto shrink-0">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-2 md:p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] shrink-0"
          >
             <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, y: -2 }} className="flex gap-4 shrink-0">
            <a href={project.link} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors bg-gray-100 dark:bg-white/5 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-blue-500/20 shadow-sm dark:shadow-lg"><ExternalLink className="w-4 h-4 md:w-5 md:h-5" /></a>
          </motion.div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 md:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 drop-shadow-sm dark:drop-shadow-md pointer-events-auto line-clamp-2">
          {project.title}
        </h3>
        
        <p
          onWheel={handleDescriptionWheel}
          className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2 md:mb-6 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors duration-300 pointer-events-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {project.description}
        </p>
        
        <ul className="flex flex-wrap gap-2 pt-2 mt-auto pointer-events-auto">
          {project.tech.map((tech: string) => (
            <li key={tech} className="font-mono text-[11px] px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-500/20 backdrop-blur-sm shadow-sm group-hover:border-blue-400 dark:group-hover:border-blue-500/40 transition-colors">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export const Projects = () => {
  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 max-w-[1600px] mx-auto relative">
      <motion.h2 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 sm:mb-16 flex items-center gap-4 sm:gap-6 text-gray-900 dark:text-white transition-colors"
      >
        <span className="whitespace-nowrap shrink-0">Featured Projects</span>
        <div className="h-px bg-gradient-to-r from-gray-700 via-blue-500/50 to-transparent flex-grow ml-2 sm:ml-4 border-none shrink"></div>
      </motion.h2>

      <div className="relative">
        <div 
          className="overflow-x-auto lg:overflow-visible pb-4 md:pb-8 pt-4 md:pt-8 grid grid-flow-col auto-cols-[85vw] sm:auto-cols-[320px] md:auto-cols-[360px] lg:grid-flow-row lg:[grid-template-columns:repeat(auto-fit,minmax(360px,360px))] lg:justify-center gap-6 sm:gap-8 snap-x snap-mandatory lg:snap-none items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ perspective: "1500px" }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        
        </div>
      </div>
    </section>
  );
};
