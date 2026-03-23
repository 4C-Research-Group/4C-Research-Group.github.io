"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Download } from "lucide-react";

const labImages = [
  "20190209_222837.jpg",
  "20221123_174846.jpg",
  "20221124_125920.jpg",
  "20230103_155143.jpg",
  "20230214_194648.jpg",
  "20230215_151430.jpg",
  "20230428_103744.jpg",
  "20230613_093841.jpg",
  "20230630_110220.jpg",
  "20230920_143235.jpg",
  "20230920_143242.jpg",
  "20231003_153807.jpg",
  "20231110_125703.jpg",
  "20231110_132456.jpg",
  "20231110_132517.jpg",
  "20231117_162032.jpg",
  "20231130_152318.jpg",
  "20231201_183456.jpg",
  "20231213_053036.jpg",
  "20231213_053149.jpg",
  "20240111_093804.jpg",
  "20240229_185533.jpg",
  "20240301_205509.jpg",
  "20240320_175807.jpg",
  "20240408_120719.jpg",
  "20240410_132550.jpg",
  "20240423_095235.jpg",
  "20240423_095244.jpg",
  "20240423_095306.jpg",
  "20240503_105805(0).jpg",
  "20241003_193406.jpg",
  "20241003_193407.jpg",
  "20241016_105355.jpg",
  "20241016_112253.jpg",
  "20241016_114145.jpg",
  "20241118_122504.jpg",
  "20241118_184017.jpg",
  "20241120_091145.jpg",
  "20241120_091644.jpg",
  "20241120_091800.jpg",
  "20241211_134812.jpg",
  "20250326_135854.jpg",
  "20250407_092707.jpg",
  "20250408_094337.jpg",
  "20250410_135214.jpg",
  "20250520_181054.jpg",
  "20250520_184141.jpg",
  "20250520_184211.jpg",
  "20250520_184722.jpg",
  "20250520_185536.jpg",
  "20250520_185538.jpg",
  "20250624_133644.jpg",
  "20250805_122745.jpg",
  "20250907_200044.jpg",
  "20250912_125149.jpg",
  "20250912_125201.jpg",
  "20250916_215154.jpg",
  "20250918_121951 2.jpg",
  "20250918_121951.jpg",
  "20250919_161320.jpg",
  "20250919_162034.jpg",
  "20250920_132341.jpg",
  "IMG-20191018-WA0005.jpg",
  "IMG-20191018-WA0006.jpg",
  "IMG-20240829-WA0010.jpg",
  "IMG-20240829-WA0035.jpg",
  "IMG-20240829-WA0038.jpg",
  "IMG-20240829-WA0057.jpg",
  "IMG-20240829-WA0059.jpg",
  "IMG-20240829-WA0060.jpg",
  "IMG-20240829-WA0063.jpg",
  "IMG-20240829-WA0068.jpg",
  "IMG-20240829-WA0069.jpg",
  "IMG-20240829-WA0070.jpg",
  "IMG-20240829-WA0072.jpg",
  "IMG-20240829-WA0074.jpg",
  "IMG-20241016-WA0006.jpg",
  "IMG-20241120-WA0016.jpg",
  "IMG-20241120-WA0017.jpg",
  "IMG-20241120-WA0019.jpg",
  "IMG-20241120-WA0027.jpg",
  "IMG_59721.jpg",
  "IMG_59731.jpg",
  "IMG_59751.jpg",
  "Screenshot 2025-07-15 001423.png",
];

export default function LabGalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = useCallback((img: string, i: number) => {
    setSelectedImage(img);
    setSelectedIndex(i);
  }, []);

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedIndex(null);
  };

  const downloadImage = (imageName: string) => {
    const link = document.createElement("a");
    link.href = `/images/lab-images/${imageName}`;
    link.download = imageName;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-gray-900">
      {/* 🔥 HERO */}
      <section className="relative h-[60vh] flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg')",
            }}
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        {/* Glow blobs */}
        <div className="absolute w-[500px] h-[500px] bg-purple-500/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="text-sm text-white/70 uppercase mb-2">
            Research • Innovation • Discovery
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Lab Gallery
          </h1>

          <p className="mt-4 text-white/80 max-w-xl mx-auto">
            A visual journey through our research, experiments, and innovation.
          </p>
        </motion.div>
      </section>

      {/* 🖼️ GALLERY */}
      <section className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {labImages.map((img, i) => (
          <motion.div
            key={img}
            whileHover={{ scale: 1.05 }}
            onClick={() => openLightbox(img, i)}
            className="relative group cursor-pointer rounded-2xl overflow-hidden 
            bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-2xl transition"
          >
            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-xl"></div>

            <div className="relative aspect-square">
              <Image
                src={`/images/lab-images/${img}`}
                alt=""
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            {/* Hover Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/70 p-3 rounded-full">
                <ZoomIn />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 🔍 LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-4xl w-full p-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-0 right-0 m-4 bg-white/10 p-2 rounded-full"
              >
                <X />
              </button>

              {/* Download */}
              <button
                onClick={() => downloadImage(selectedImage)}
                className="absolute top-0 left-0 m-4 bg-white/10 p-2 rounded-full"
              >
                <Download />
              </button>

              <Image
                src={`/images/lab-images/${selectedImage}`}
                alt=""
                width={1200}
                height={800}
                className="rounded-xl object-contain max-h-[80vh]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
