import { useState, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from './components/Navigation'
import { AnimatedBackground } from './components/AnimatedBackground'
import { Hero } from './sections/Hero'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Contact } from './sections/Contact'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle the highly visual page wipe transition when changing themes
  const toggleTheme = () => {
    setIsTransitioning(true);
    // Switch the logical theme right in the middle of the geometric wipe
    setTimeout(() => {
      setDarkMode(!darkMode);
    }, 400); // Wait until the geometric wipe covers the screen
    
    // Clear transition state after wipe finishes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200); 
  };

  useLayoutEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <>
      {/* High-end Geometric Circle Wipe Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 10%)" }}
            animate={{ clipPath: "circle(150% at 90% 10%)" }}
            exit={{ clipPath: "circle(0% at 90% 10%)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`fixed inset-0 z-100 ${!darkMode ? 'bg-[#0a192f]' : 'bg-slate-50'}`}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div className="bg-transparent min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-0 overflow-x-hidden w-full relative">
        <AnimatedBackground />
        <Navigation darkMode={darkMode} setDarkMode={toggleTheme} />
        
        <main>
          <Hero />
          <Experience />
          <Projects />
          <Contact />
        </main>
        
        <footer className="text-center py-8 text-slate-500 font-mono text-sm border-t border-gray-200 dark:border-white/5 transition-colors duration-0">
          <p>Built by Ateef with React, Tailwind & Framer Motion</p>
        </footer>
      </div>
    </>
  )
}

export default App
