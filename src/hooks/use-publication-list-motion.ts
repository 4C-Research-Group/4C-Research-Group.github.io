import { useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo } from "react";

const EASE: [number, number, number, number] = [0.2, 0.82, 0.28, 1];

/**
 * Container + item variants for publication lists (Framer Motion “staggerChildren”).
 * Respects prefers-reduced-motion: no stagger, shorter tweens.
 */
export function usePublicationListMotion() {
  const reduce = useReducedMotion() ?? false;

  return useMemo(() => {
    const stagger = reduce ? 0 : 0.052;
    const delayChildren = reduce ? 0 : 0.06;

    const container: Variants = {
      hidden: {},
      show: {
        transition: {
          staggerChildren: stagger,
          delayChildren,
        },
      },
    };

    const item: Variants = {
      hidden: {
        opacity: 0,
        y: reduce ? 0 : 18,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduce ? 0.12 : 0.4,
          ease: EASE,
        },
      },
    };

    return { container, item, reduceMotion: reduce };
  }, [reduce]);
}
