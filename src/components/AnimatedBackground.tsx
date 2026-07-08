import { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const AnimatedBackground = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse to give the aura a fluid, trailing effect
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] hidden dark:block bg-[#020617] overflow-hidden pointer-events-none">
      
      {/* Heavy Mesh Grid */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '3rem 3rem',
          maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, black 20%, transparent 100%)'
        }}
      />

      {/* Primary Interactive Mouse Tracking Aura - BRIGHT CYAN & PURPLE */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] rounded-full mix-blend-screen pointer-events-none filter blur-[100px]"
        style={{
          x: springX,
          y: springY,
          marginLeft: "-20rem", 
          marginTop: "-20rem",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 70%)"
        }}
      />

      {/* Sweeping Ambient Aurora 1 - PINK/PURPLE */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-[conic-gradient(from_0deg,rgba(168,85,247,0.3),rgba(236,72,153,0.3),transparent,rgba(168,85,247,0.3))] rounded-full mix-blend-screen filter blur-[100px] opacity-80"
      />

      {/* Sweeping Ambient Aurora 2 - DEEP BLUE / CYAN */}
      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-[conic-gradient(from_180deg,rgba(59,130,246,0.4),rgba(6,182,212,0.3),transparent,rgba(59,130,246,0.4))] rounded-full mix-blend-screen filter blur-[100px] opacity-80"
      />

      {/* Static Deep Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
