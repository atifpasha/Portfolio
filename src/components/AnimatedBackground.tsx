import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

export const AnimatedBackground = ({ darkMode }: { darkMode: boolean }) => {
  const mouseX = useMotionValue(0); // -1 to 1
  const mouseY = useMotionValue(0); // -1 to 1
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Smooth values for premium trailing/parallax feel
  const springX = useSpring(mouseX, { stiffness: 80, damping: 24, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 24, mass: 0.6 });
  const cursorSpringX = useSpring(cursorX, { stiffness: 140, damping: 28, mass: 0.4 });
  const cursorSpringY = useSpring(cursorY, { stiffness: 140, damping: 28, mass: 0.4 });

  // Multi-layer parallax motion
  const gridX = useTransform(springX, [-1, 1], [-14, 14]);
  const gridY = useTransform(springY, [-1, 1], [-10, 10]);
  const orbOneX = useTransform(springX, [-1, 1], [-120, 120]);
  const orbOneY = useTransform(springY, [-1, 1], [-90, 90]);
  const orbTwoX = useTransform(springX, [-1, 1], [100, -100]);
  const orbTwoY = useTransform(springY, [-1, 1], [70, -70]);

  const lightCursorHaloX = useTransform(cursorSpringX, (v) => v - 230);
  const lightCursorHaloY = useTransform(cursorSpringY, (v) => v - 230);
  const lightCursorCoreX = useTransform(cursorSpringX, (v) => v - 56);
  const lightCursorCoreY = useTransform(cursorSpringY, (v) => v - 56);
  const darkCursorHaloX = useTransform(cursorSpringX, (v) => v - 260);
  const darkCursorHaloY = useTransform(cursorSpringY, (v) => v - 260);
  const darkCursorCoreX = useTransform(cursorSpringX, (v) => v - 48);
  const darkCursorCoreY = useTransform(cursorSpringY, (v) => v - 48);

  // Interactive spotlight follows cursor
  const spotlightX = useTransform(springX, [-1, 1], ["12%", "88%"]);
  const spotlightY = useTransform(springY, [-1, 1], ["12%", "88%"]);
  const spotlight = useMotionTemplate`radial-gradient(650px circle at ${spotlightX} ${spotlightY}, rgba(59,130,246,0.22), rgba(14,165,233,0.14) 24%, rgba(168,85,247,0.10) 42%, transparent 72%)`;
  const lightSpotlight = useMotionTemplate`radial-gradient(560px circle at ${spotlightX} ${spotlightY}, rgba(59,130,246,0.18), rgba(56,189,248,0.14) 28%, rgba(139,92,246,0.10) 48%, transparent 74%)`;

  const particleCount = prefersReducedMotion ? 0 : isMobile ? 8 : 16;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.35 + 0.15,
        driftX: Math.random() * 18 - 9,
        driftY: Math.random() * 30 + 20,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 6,
      })),
    [particleCount]
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(nx);
        mouseY.set(ny);
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        rafId = 0;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, mouseX, mouseY, prefersReducedMotion]);

  if (!darkMode) {
    return (
      <div className="fixed inset-0 z-[-1] bg-[#f8fbff] overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_35%,rgba(125,211,252,0.35),transparent_72%)]" />

        <motion.div
          className="absolute inset-0 opacity-35"
          style={{
            x: gridX,
            y: gridY,
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.09) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.09) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 90% 85% at 50% 50%, black 32%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 85% at 50% 50%, black 32%, transparent 100%)",
          }}
        />

        <motion.div className="absolute inset-0" style={{ background: lightSpotlight }} />

        {!isMobile && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute w-[460px] h-[460px] rounded-full blur-[85px] opacity-70 mix-blend-multiply"
              style={{
                x: lightCursorHaloX,
                y: lightCursorHaloY,
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.34) 0%, rgba(59,130,246,0.22) 40%, rgba(168,85,247,0.16) 62%, transparent 74%)",
              }}
            />
            <motion.div
              className="absolute w-28 h-28 rounded-full blur-2xl opacity-80"
              style={{
                x: lightCursorCoreX,
                y: lightCursorCoreY,
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(186,230,253,0.55) 48%, transparent 72%)",
              }}
            />
          </>
        )}

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="absolute top-[8%] left-[5%] w-[38rem] h-[38rem] rounded-full mix-blend-multiply pointer-events-none blur-[90px] opacity-65"
          style={{
            x: orbOneX,
            y: orbOneY,
            background:
              "conic-gradient(from 140deg, rgba(59,130,246,0.28), rgba(6,182,212,0.24), rgba(139,92,246,0.18), rgba(59,130,246,0.28))",
          }}
        />

        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-16%] right-[-10%] w-[45rem] h-[45rem] rounded-full mix-blend-multiply pointer-events-none blur-[100px] opacity-55"
          style={{
            x: orbTwoX,
            y: orbTwoY,
            background:
              "conic-gradient(from 220deg, rgba(14,165,233,0.22), rgba(56,189,248,0.20), rgba(168,85,247,0.16), rgba(14,165,233,0.22))",
          }}
        />

        <div className="absolute inset-0">
          {particles.map((p) => (
            <motion.span
              key={`light-${p.id}`}
              className="absolute rounded-full bg-blue-500/30"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity * 0.85,
              }}
              animate={{
                x: [0, p.driftX, 0],
                y: [0, -p.driftY, 0],
                opacity: [p.opacity * 0.45, p.opacity * 0.9, p.opacity * 0.45],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_35%,rgba(59,130,246,0.10)_100%)]" />
      </div>
    );
  }

  return (
      <div className="fixed inset-0 z-[-1] bg-[#020617] overflow-hidden pointer-events-none select-none">
      {/* Base vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_40%,rgba(30,64,175,0.18),transparent_70%)]" />

      {/* Parallax mesh grid */}
      <motion.div
        className="absolute inset-0 opacity-35"
        style={{
          x: gridX,
          y: gridY,
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.10) 1px, transparent 1px)
          `,
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Interactive spotlight */}
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />

      {!isMobile && !prefersReducedMotion && (
        <>
          <motion.div
            className="absolute w-[520px] h-[520px] rounded-full blur-[95px] opacity-70 mix-blend-screen"
            style={{
              x: darkCursorHaloX,
              y: darkCursorHaloY,
              background:
                "radial-gradient(circle, rgba(34,211,238,0.34) 0%, rgba(59,130,246,0.28) 36%, rgba(168,85,247,0.18) 58%, transparent 74%)",
            }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full blur-xl opacity-85 mix-blend-screen"
            style={{
              x: darkCursorCoreX,
              y: darkCursorCoreY,
              background:
                "radial-gradient(circle, rgba(125,211,252,0.95) 0%, rgba(56,189,248,0.48) 48%, transparent 72%)",
            }}
          />
        </>
      )}

      {/* Mouse-reactive aurora blob 1 */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[12%] left-[8%] w-[44rem] h-[44rem] rounded-full mix-blend-screen pointer-events-none blur-[95px] opacity-80"
        style={{
          x: orbOneX,
          y: orbOneY,
          background:
            "conic-gradient(from 120deg, rgba(59,130,246,0.30), rgba(14,165,233,0.38), rgba(168,85,247,0.28), rgba(59,130,246,0.30))",
        }}
      />

      {/* Mouse-reactive aurora blob 2 */}
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-18%] right-[-10%] w-[52rem] h-[52rem] rounded-full mix-blend-screen pointer-events-none blur-[110px] opacity-75"
        style={{
          x: orbTwoX,
          y: orbTwoY,
          background:
            "conic-gradient(from 220deg, rgba(14,165,233,0.30), rgba(99,102,241,0.25), rgba(236,72,153,0.20), rgba(14,165,233,0.30))",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-blue-200/40"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
            }}
            animate={{
              x: [0, p.driftX, 0],
              y: [0, -p.driftY, 0],
              opacity: [p.opacity * 0.7, p.opacity, p.opacity * 0.7],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Final soft depth overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_40%,rgba(2,6,23,0.55)_100%)]" />
      </div>
  );
};
