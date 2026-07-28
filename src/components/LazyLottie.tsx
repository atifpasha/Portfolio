import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ComponentType } from 'react';

type PlayerProps = {
  autoplay?: boolean;
  loop?: boolean;
  src: string;
  style?: CSSProperties;
  className?: string;
};

type LazyLottieProps = {
  src: string;
  mobileSrc?: string;
  className?: string;
  style?: CSSProperties;
  placeholderClassName?: string;
  rootMargin?: string;
};

export const LazyLottie = ({
  src,
  mobileSrc,
  className,
  style,
  placeholderClassName,
  rootMargin = '120px',
}: LazyLottieProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [PlayerComponent, setPlayerComponent] = useState<ComponentType<PlayerProps> | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  useEffect(() => {
    if (!inView || PlayerComponent) return;

    let mounted = true;
    import('@lottiefiles/react-lottie-player').then((mod) => {
      if (mounted) {
        setPlayerComponent(() => mod.Player as ComponentType<PlayerProps>);
      }
    });

    return () => {
      mounted = false;
    };
  }, [inView, PlayerComponent]);

  const resolvedSrc = useMemo(() => {
    if (isMobile && mobileSrc) return mobileSrc;
    return src;
  }, [isMobile, mobileSrc, src]);

  return (
    <div ref={wrapperRef} className={className}>
      {inView && PlayerComponent ? (
        <PlayerComponent autoplay loop src={resolvedSrc} style={{ width: '100%', ...style }} className="w-full h-full" />
      ) : (
        <div
          className={
            placeholderClassName ??
            'w-full h-full rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.16),transparent_68%)]'
          }
        />
      )}
    </div>
  );
};
