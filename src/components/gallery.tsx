"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * 1. ANIMATION VARIANTS
 * Defined outside the component to prevent re-allocation on every render.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays each image's entrance for a "wave" effect
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1 },
};

const labelVariants = {
  initial: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0, transition: { delay: 0.1 } },
};

const IMAGES = [
  { img: "20240423_095244.jpg", span: "col-span-2 row-span-2" },
  { img: "20230214_194648.jpg", span: "" },
  { img: "20230613_093841.jpg", span: "" },
  { img: "20231110_125703.jpg", span: "row-span-2" },
  { img: "20240408_120719.jpg", span: "" },
  { img: "20250520_184141.jpg", span: "col-span-2" },
  { img: "IMG-20240829-WA0035.jpg", span: "" },
];

export default function OptimizedGallery() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">
              Gallery
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Moments from our lab.</p>
          </motion.div>

          <Link
            href="/gallery"
            className="group flex items-center gap-2 font-semibold text-blue-600"
          >
            View all{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-5"
        >
          {IMAGES.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover="hover" // This triggers "hover" variant in ALL children automatically
              className={`relative overflow-hidden rounded-3xl bg-slate-200 transform-gpu ${item.span}`}
            >
              <Image
                src={`/images/lab-images/${item.img}`}
                alt="Lab interior"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
                loading="lazy"
              />

              {/* Gradient Overlay - Optimized via Variants */}
              <motion.div
                variants={overlayVariants}
                className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
              />

              {/* Label - Optimized via Variants */}
              <motion.div
                variants={labelVariants}
                className="absolute bottom-4 left-4"
              >
                <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                  Lab Moment
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
