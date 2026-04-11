/**
 * When `gallery_photos` is empty, the public gallery fills from these files under
 * `public/images/lab-images/`. Add or rename files there, then update this list (or switch to CMS-only later).
 */

import type { GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";

/** Sorted like `ls` — order is the default layout until Supabase has rows. */
const LAB_IMAGE_FILES = [
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
  "IMG_59721.jpg",
  "IMG_59731.jpg",
  "IMG_59751.jpg",
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
  "Screenshot 2025-07-15 001423.png",
] as const;

function labImageSrc(file: string): string {
  const seg = encodeURIComponent(file);
  return `/images/lab-images/${seg}`;
}

export function labImagePlaceholderPhotos(): GalleryPhoto[] {
  return LAB_IMAGE_FILES.map((file, i) => ({
    id: `lab-local-${i}`,
    src: labImageSrc(file),
    alt: `Lab gallery: ${file}`,
    title: "",
    sort_order: i,
  }));
}

export function withLabPlaceholdersIfEmpty(photos: GalleryPhoto[]): GalleryPhoto[] {
  if (photos.length > 0) return photos;
  return labImagePlaceholderPhotos();
}
