import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'Experience', id: 'experience' },
  { name: 'Projects', id: 'projects' },
  { name: 'Contact', id: 'contact' },
];


export const Navigation = ({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (d: boolean) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isScrollingToSection = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      if (isScrollingToSection.current) return;
      // If user scrolled to the absolute bottom of the page, activate the last section (Contact)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection('contact');
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer to magically track which section we are looking at
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToSection.current) return;
        // Find the most visible section
        const visibleSections = entries.filter(entry => entry.isIntersecting);
        if (visibleSections.length > 0) {
          // Quick heuristic: pick the first intersecting
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { threshold: 0.4, rootMargin: "-80px 0px 0px 0px" } 
    );
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);
    
    // Temporarily pause the observer so the pill doesn't bounce while smooth scrolling
    isScrollingToSection.current = true;
    
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
    
    // Re-enable observer after smooth scroll completes (approx 1000ms)
    setTimeout(() => {
      isScrollingToSection.current = false;
    }, 1000);
  };

  const mobileMenuVariants = {
    closed: { clipPath: "circle(0px at calc(100% - 40px) 40px)", transition: { duration: 0.5, ease: "easeInOut" as const } },
    open: { clipPath: "circle(150% at calc(100% - 40px) 40px)", transition: { duration: 0.5, ease: "easeInOut" as const } }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 50 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + (i * 0.1), type: "spring" as const, stiffness: 300, damping: 24 }
    })
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          scrolled ? 'py-4 bg-white/70 dark:bg-[#020617]/80 backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] border-b border-gray-200/50 dark:border-white/5' : 'py-6 bg-transparent tracking-wide'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => scrollToSection('home')}
          >
            <div className="font-display font-extrabold text-2xl md:text-3xl tracking-tighter whitespace-nowrap">
              <motion.span 
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
              >
                Ateef Pasha
              </motion.span>
              <span className="text-gray-900 dark:text-white transition-colors duration-300">.</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-full border border-gray-200/50 dark:border-white/10 backdrop-blur-md relative">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button 
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`relative px-6 py-2 rounded-full font-mono text-sm font-medium transition-colors z-10 w-[120px] text-center ${
                      isActive 
                        ? 'text-white dark:text-[#020617]' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-blue-600 dark:bg-cyan-400 rounded-full shadow-lg z-[-1]"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                      />
                    )}
                    {link.name}
                  </button>
                );
              })}
            </div>
            
          

            {/* Theme Toggle */}
            <motion.button 
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-white dark:hover:bg-white/20 shadow-sm transition-colors border border-gray-200/50 dark:border-white/5"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-[70]">
            <motion.button 
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-gray-100/80 dark:bg-white/10 text-gray-800 dark:text-white backdrop-blur-sm"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${
                mobileMenuOpen ? 'bg-blue-600/10 text-blue-600 dark:text-white' : 'bg-gray-100/80 dark:bg-white/10 text-gray-900 dark:text-white'
              }`}
            >
              <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-[60] bg-white/95 dark:bg-[#020617]/95 backdrop-blur-2xl flex flex-col items-start justify-center px-12 sm:px-20"
          >
            {/* Elegant glowing background element */}
            <div className="pointer-events-none absolute -top-[20%] -right-[20%] w-[70vw] h-[70vw] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] rounded-full blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-[20%] -left-[20%] w-[70vw] h-[70vw] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)] rounded-full blur-[80px]" />
            
            <ul className="flex flex-col gap-6 sm:gap-10 w-full relative z-10">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.id;
                return (
                <motion.li 
                  key={link.id}
                  custom={index}
                  variants={itemVariants}
                  className="w-full"
                >
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="group relative flex items-end gap-4 w-full text-left"
                  >
                    <span className={`font-display font-bold text-3xl max-[350px]:text-3xl sm:text-5xl md:text-6xl tracking-tight transition-all duration-300 ${
                      isActive 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 translate-x-4' 
                        : 'text-gray-500 dark:text-gray-600 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-400 group-hover:translate-x-4'
                    }`}>
                      {link.name}
                    </span>
                  </button>
                </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
