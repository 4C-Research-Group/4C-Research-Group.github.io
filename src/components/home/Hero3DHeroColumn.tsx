"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { HeroGlassGlitterFrame } from "@/components/home/HeroGlassGlitterFrame";

const SPRING = { stiffness: 90, damping: 22, mass: 0.75 };

type Props = {
  children: ReactNode;
};

/**
 * Hero visual column: layered 3D-style frames + mouse-reactive tilt (CSS 3D + Framer Motion).
 * No WebGL — keeps bundle small and works with static export.
 */
export function Hero3DHeroColumn({ children }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, SPRING);
  const springY = useSpring(tiltY, SPRING);

  function onMove(e: React.MouseEvent) {
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 14);
    tiltX.set(py * -11);
  }

  function onLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  if (reduceMotion) {
    return (
      <div className="relative flex min-w-0 flex-col items-center justify-center">
        <HeroGlassGlitterFrame>{children}</HeroGlassGlitterFrame>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex min-w-0 flex-col items-center justify-center [perspective:1280px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] h-[min(22rem,88vw)] w-[min(22rem,88vw)] -translate-x-1/2 -translate-y-1/2 transform-gpu sm:h-[min(26rem,80vw)] sm:w-[min(26rem,80vw)] lg:top-[38%]"
        style={{ transformStyle: "preserve-3d" }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] border border-cognition/30 bg-linear-to-br from-cognition/[0.07] via-transparent to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
          style={{
            transform: "translateZ(-64px) scale(1.06)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [-14, 14, -14],
            rotateX: [3, -3, 3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-3 rounded-[2rem] border border-dashed border-consciousness/25 bg-consciousness/[0.03]"
          style={{
            transform: "translateZ(-120px) scale(1.12)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [12, -12, 12],
            rotateZ: [0, 5, 0],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-[2.75rem] border border-care/20 bg-care/[0.02]"
          style={{
            transform: "translateZ(-188px) scale(1.18)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: [-9, 9, -9],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="relative z-[1] w-full transform-gpu [transform-style:preserve-3d]"
        style={{
          rotateX: springX,
          rotateY: springY,
        }}
      >
        <HeroGlassGlitterFrame>{children}</HeroGlassGlitterFrame>
      </motion.div>
    </div>
  );
}
