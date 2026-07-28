import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Moon, Sun, Menu, X, ChevronRight } from 'lucide-react';

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
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      
      if (isScrollingToSection.current) return;
      // If user scrolled to the absolute bottom of the page, activate the last section (Contact)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveSection('contact');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
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

  const mobileOverlayVariants = {
    closed: { opacity: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
    open: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' as const } }
  };

  const mobilePanelVariants = {
    closed: { y: 30, opacity: 0, scale: 0.98, transition: { duration: 0.22, ease: 'easeOut' as const } },
    open: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.32, ease: 'easeOut' as const } }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 18, filter: 'blur(6px)' },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { delay: 0.1 + (i * 0.07), type: 'spring' as const, stiffness: 260, damping: 22 }
    })
  };

  return (
    <>
      <motion.nav 
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-70 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-white/60 dark:bg-[#020617]/65 backdrop-blur-2xl border-b border-white/30 dark:border-cyan-400/15 shadow-[0_20px_60px_-24px_rgba(30,64,175,0.45)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => scrollToSection('home')}
          >
            <div className="font-display font-extrabold text-2xl md:text-3xl tracking-tighter whitespace-nowrap">
              <motion.span
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className="text-transparent bg-clip-text bg-size-[200%_auto] bg-linear-to-r from-blue-600 via-cyan-400 to-violet-500"
              >
                Ateef Pasha
              </motion.span>
              <span className="text-gray-900 dark:text-white transition-colors duration-300">.</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative rounded-full p-px bg-linear-to-r from-blue-500/45 via-cyan-400/35 to-violet-500/35 shadow-[0_10px_40px_-20px_rgba(59,130,246,0.8)]">
              <div className="flex bg-white/65 dark:bg-[#081225]/80 p-1.5 rounded-full border border-white/60 dark:border-cyan-400/20 backdrop-blur-xl relative">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button 
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`relative px-5 lg:px-6 py-2 rounded-full font-mono text-sm font-medium transition-colors z-10 w-28 lg:w-30 text-center ${
                      isActive 
                        ? 'text-white dark:text-[#020617]' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-linear-to-r from-blue-600 via-cyan-500 to-violet-500 dark:from-cyan-300 dark:via-cyan-400 dark:to-blue-400 rounded-full shadow-[0_0_25px_rgba(34,211,238,0.45)] z-[-1]"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                      />
                    )}
                    {link.name}
                  </button>
                );
              })}
              </div>
            </div>
            
          

            {/* Theme Toggle */}
            <motion.button 
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-white/70 dark:bg-[#0f1b35]/90 text-gray-800 dark:text-cyan-200 hover:bg-white dark:hover:bg-[#152242] shadow-[0_10px_30px_-15px_rgba(56,189,248,0.8)] transition-colors border border-gray-200/60 dark:border-cyan-400/20"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-70">
            <motion.button 
              whileHover={{ rotate: 180, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-white/75 dark:bg-[#0f1b35]/85 text-gray-800 dark:text-cyan-200 backdrop-blur-xl border border-white/70 dark:border-cyan-400/20"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              className={`p-2.5 rounded-full backdrop-blur-xl border transition-colors ${
                mobileMenuOpen
                  ? 'bg-cyan-500/15 border-cyan-400/30 text-cyan-500 dark:text-cyan-300'
                  : 'bg-white/75 dark:bg-[#0f1b35]/85 border-white/70 dark:border-cyan-400/20 text-gray-900 dark:text-white'
              }`}
            >
              <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Scroll progress line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-75 origin-left bg-linear-to-r from-blue-500 via-cyan-400 to-violet-500"
        style={{ scaleX: progressScaleX }}
      />

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileOverlayVariants}
            className="fixed inset-0 z-90 bg-white/92 dark:bg-[#020617]/92 backdrop-blur-xl px-4 py-5"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-[-22%] right-[-22%] w-[75vw] h-[75vw] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.2),transparent_70%)] rounded-full blur-[90px]" />
              <div className="absolute bottom-[-22%] left-[-22%] w-[75vw] h-[75vw] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.2),transparent_70%)] rounded-full blur-[90px]" />
            </div>

            <motion.div
              variants={mobilePanelVariants}
              className="relative z-10 h-full w-full max-w-md mx-auto rounded-3xl border border-white/60 dark:border-cyan-400/20 bg-white/70 dark:bg-[#07142b]/75 backdrop-blur-2xl shadow-[0_30px_90px_-30px_rgba(6,182,212,0.35)] p-4 flex flex-col"
            >
              <div className="flex items-center justify-between px-2 pt-2 pb-3 border-b border-gray-200/70 dark:border-white/10">
                <div>
                  <p className="font-display text-lg font-bold text-gray-900 dark:text-white">Explore Sections</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2.5 rounded-full bg-white/80 dark:bg-[#0f1b35]/90 border border-gray-200/70 dark:border-cyan-400/20 text-gray-800 dark:text-cyan-200"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <ul className="flex flex-col gap-3 mt-4">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      custom={index}
                      variants={itemVariants}
                      className="w-full"
                    >
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => scrollToSection(link.id)}
                        className={`group relative w-full text-left rounded-2xl p-4 border transition-all duration-300 ${
                          isActive
                            ? 'bg-linear-to-r from-blue-600/90 via-cyan-500/90 to-violet-500/90 border-transparent text-white shadow-[0_14px_35px_-18px_rgba(59,130,246,0.9)]'
                            : 'bg-white/60 dark:bg-white/5 border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-cyan-400/35 hover:bg-white/80 dark:hover:bg-cyan-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono ${
                              isActive ? 'bg-white/25 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-cyan-300/80'
                            }`}>
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="font-display font-bold text-xl tracking-tight">{link.name}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'translate-x-1 text-white' : 'text-gray-400 dark:text-cyan-200/70 group-hover:translate-x-1'}`} />
                        </div>
                      </motion.button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
