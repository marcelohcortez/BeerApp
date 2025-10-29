import React, { memo, useCallback, useState, useEffect, useRef } from "react";
import styles from "./BackgroundImage.module.css";

interface BackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
  blur?: boolean;
}

const BackgroundImage: React.FC<BackgroundImageProps> = memo(
  ({
    src,
    alt = "",
    className = "",
    children,
    priority = false,
    blur = false,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const preloadImage = useCallback(() => {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        // Set background image via DOM manipulation to avoid inline styles
        if (containerRef.current) {
          containerRef.current.style.backgroundImage = `url(${src})`;
        }
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoaded(true);
      };
      img.src = src;
    }, [src]);

    useEffect(() => {
      if (priority) {
        preloadImage();
      } else {
        // Lazy load after a short delay
        const timer = setTimeout(preloadImage, 100);
        return () => clearTimeout(timer);
      }
    }, [preloadImage, priority]);

    const containerClasses = `
    ${styles.backgroundContainer}
    ${className}
    ${isLoaded ? styles.loaded : styles.loading}
    ${hasError ? styles.error : ""}
    ${blur ? styles.blur : ""}
  `.trim();

    return (
      <div
        ref={containerRef}
        className={containerClasses}
        aria-label={alt || undefined}
      >
        {!isLoaded && (
          <div className={styles.placeholder}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}

        {hasError && (
          <div className={styles.errorFallback}>
            <span>Background image failed to load</span>
          </div>
        )}

        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);

BackgroundImage.displayName = "BackgroundImage";

export default BackgroundImage;
