import React, { useState, useCallback, memo } from "react";
import styles from "./ResponsiveImage.module.css";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  width?: number;
  height?: number;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = memo(
  ({
    src,
    alt,
    className = "",
    sizes = "100vw",
    priority = false,
    placeholder,
    width,
    height,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
    }, []);

    const handleError = useCallback(() => {
      setHasError(true);
      setIsLoaded(true);
    }, []);

    // Generate responsive image sources
    const generateSrcSet = useCallback((baseSrc: string) => {
      const extension = baseSrc.split(".").pop();
      const baseName = baseSrc.replace(`.${extension}`, "");

      // For now, return the original image
      // In a real implementation, you'd have multiple sizes
      return `${baseSrc} 1x`;
    }, []);

    const imageClasses = `
    ${styles.responsiveImage}
    ${className}
    ${isLoaded ? styles.loaded : styles.loading}
    ${hasError ? styles.error : ""}
  `.trim();

    return (
      <div className={styles.imageContainer}>
        {!isLoaded && !hasError && placeholder && (
          <div className={styles.placeholder}>
            <img
              src={placeholder}
              alt=""
              className={styles.placeholderImage}
              aria-hidden="true"
            />
          </div>
        )}

        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          width={width}
          height={height}
        />

        {hasError && (
          <div className={styles.errorFallback}>
            <span>Image failed to load</span>
          </div>
        )}
      </div>
    );
  }
);

ResponsiveImage.displayName = "ResponsiveImage";

export default ResponsiveImage;
