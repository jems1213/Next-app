"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => <div style={{ width: 320, height: 320 }} />,
});

export default function Hero3DClient({ src }: { src: string }) {
  return <Hero3D src={src} />;
}
