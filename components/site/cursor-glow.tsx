'use client';
import { useEffect, useState } from 'react';
export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute h-[400px] w-[400px] rounded-full blur-3xl opacity-20 transition-transform duration-100"
        style={{ background: 'radial-gradient(circle, #00FFCC 0%, transparent 60%)', transform: `translate(${pos.x - 200}px, ${pos.y - 200}px)` }}/>
    </div>
  );
}
