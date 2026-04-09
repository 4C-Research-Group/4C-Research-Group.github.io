"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A";

const SNAPSHOTS = [
  {
    src: "/images/lab-images/20240423_095244.jpg",
    alt: "Researchers collaborating in the lab",
  },
  {
    src: "/images/lab-images/20230214_194648.jpg",
    alt: "Lab workspace and equipment",
  },
  {
    src: "/images/lab-images/20230613_093841.jpg",
    alt: "Team discussion during research",
  },
] as const;

export function HeroLabSnapshots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 w-full max-w-md"
    >
      <Link
        href="/gallery/"
        className="group relative mx-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-2xl"
        aria-label="View full lab gallery"
      >
        <div className="flex items-end justify-center gap-2 sm:gap-3">
          {SNAPSHOTS.map((item, i) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 16, rotate: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: i === 0 ? -4 : i === 2 ? 4 : 0,
              }}
              transition={{
                duration: 0.45,
                delay: 0.45 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={[
                "relative aspect-[4/5] w-[28%] max-w-[7.5rem] overflow-hidden rounded-xl bg-muted shadow-md ring-1 ring-black/8 transition-transform duration-300",
                "group-hover:-translate-y-1 group-hover:shadow-lg",
                i === 1 ? "z-[2] w-[32%] max-w-[8.25rem] -mb-1 scale-[1.02] sm:scale-105" : "z-[1]",
              ].join(" ")}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 28vw, 132px"
                placeholder="blur"
                blurDataURL={BLUR}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-80" />
            </motion.div>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-brand">
          Lab gallery →
        </p>
      </Link>
    </motion.div>
  );
}
