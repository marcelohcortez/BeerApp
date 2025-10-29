/**
 * Image optimization utilities
 */

export interface ImageSize {
  width: number;
  height?: number;
  quality?: number;
}

export interface ResponsiveImageSizes {
  small: ImageSize;
  medium: ImageSize;
  large: ImageSize;
  original: ImageSize;
}

/**
 * Generate responsive image URLs for different screen sizes
 * In a real implementation, this would connect to an image CDN or optimization service
 */
export const generateResponsiveImageUrls = (
  baseSrc: string,
  sizes: ResponsiveImageSizes
): Record<string, string> => {
  // For now, return the original image for all sizes
  // In production, you would use a service like Cloudinary, ImageKit, or similar
  return {
    small: baseSrc,
    medium: baseSrc,
    large: baseSrc,
    original: baseSrc,
  };
};

/**
 * Generate srcSet string for responsive images
 */
export const generateSrcSet = (
  baseSrc: string,
  sizes: ResponsiveImageSizes
): string => {
  const urls = generateResponsiveImageUrls(baseSrc, sizes);

  return [
    `${urls.small} ${sizes.small.width}w`,
    `${urls.medium} ${sizes.medium.width}w`,
    `${urls.large} ${sizes.large.width}w`,
    `${urls.original} ${sizes.original.width}w`,
  ].join(", ");
};

/**
 * Common responsive sizes for different image types
 */
export const commonImageSizes = {
  avatar: {
    small: { width: 40, height: 40, quality: 80 },
    medium: { width: 80, height: 80, quality: 85 },
    large: { width: 120, height: 120, quality: 90 },
    original: { width: 200, height: 200, quality: 95 },
  },

  hero: {
    small: { width: 480, height: 270, quality: 75 },
    medium: { width: 768, height: 432, quality: 80 },
    large: { width: 1200, height: 675, quality: 85 },
    original: { width: 1920, height: 1080, quality: 90 },
  },

  card: {
    small: { width: 200, height: 150, quality: 75 },
    medium: { width: 300, height: 225, quality: 80 },
    large: { width: 400, height: 300, quality: 85 },
    original: { width: 600, height: 450, quality: 90 },
  },

  thumbnail: {
    small: { width: 100, height: 100, quality: 70 },
    medium: { width: 150, height: 150, quality: 75 },
    large: { width: 200, height: 200, quality: 80 },
    original: { width: 300, height: 300, quality: 85 },
  },
} as const;

/**
 * Get appropriate sizes attribute for responsive images
 */
export const getSizesAttribute = (breakpoints: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
}): string => {
  const { mobile = "100vw", tablet = "50vw", desktop = "33vw" } = breakpoints;

  return [
    `(max-width: 480px) ${mobile}`,
    `(max-width: 768px) ${tablet}`,
    desktop,
  ].join(", ");
};

/**
 * Check if browser supports modern image formats
 */
export const checkImageFormatSupport = (): {
  webp: boolean;
  avif: boolean;
} => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return {
    webp: canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0,
    avif: canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0,
  };
};

/**
 * Preload critical images
 */
export const preloadImage = (
  src: string,
  priority: "high" | "low" = "low"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Set priority using non-standard property (when supported)
    if (priority === "high" && "fetchPriority" in img) {
      (img as any).fetchPriority = "high";
    }

    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Image compression utility (for client-side compression)
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

export default {
  generateResponsiveImageUrls,
  generateSrcSet,
  commonImageSizes,
  getSizesAttribute,
  checkImageFormatSupport,
  preloadImage,
  compressImage,
};
