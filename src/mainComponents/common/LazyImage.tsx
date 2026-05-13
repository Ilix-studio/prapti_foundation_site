// frontend/components/common/LazyImage.tsx
import React, { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

interface LazyImageProps {
  src?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallbackIconSize?: number;
  /** Use IntersectionObserver to defer src assignment. Default: false (native lazy is enough). */
  observeViewport?: boolean;
  /** Px margin around viewport that triggers the load. Default: "200px". */
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
  wrapperClassName = "w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center overflow-hidden",
  fallbackIconSize = 24,
  observeViewport = false,
  rootMargin = "200px",
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [inView, setInView] = useState(!observeViewport);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observeViewport || inView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [observeViewport, inView, rootMargin]);

  const showFallback = !src || errored;

  return (
    <div ref={ref} className={wrapperClassName}>
      {showFallback ? (
        <User
          className={`text-orange-500 w-${fallbackIconSize} h-${fallbackIconSize}`}
          aria-hidden='true'
        />
      ) : (
        <>
          {!loaded && (
            <div
              className='absolute inset-0 animate-pulse bg-orange-100'
              aria-hidden='true'
            />
          )}
          {inView && (
            <img
              src={src}
              alt={alt}
              loading='lazy'
              decoding='async'
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              className={`${className} transition-opacity duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </>
      )}
    </div>
  );
};

export default LazyImage;
