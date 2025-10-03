"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div style={{ width: 320, height: 320 }} />,
});

export default function Hero3DClient({ src, fallbackImage }: { src: string, fallbackImage?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    if (inView) return;

    const el = ref.current;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  return (
    <div ref={ref} style={{ width: '100%', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {inView ? <Hero3D src={src} fallbackImage={fallbackImage} /> : (
        <img src={fallbackImage || '/next.svg'} alt="hero placeholder" style={{ width: 320, height: 320, objectFit: 'contain', borderRadius: 12 }} />
      )}
    </div>
  );
}
