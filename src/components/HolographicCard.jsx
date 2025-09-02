import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const HolographicCard = ({ children, className = '', intensity = 12, variant = 'default' }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [ -0.5, 0.5 ], [ intensity, -intensity ]);
  const rotateY = useTransform(x, [ -0.5, 0.5 ], [ -intensity, intensity ]);

  const handleMouseMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0..1
    const py = (event.clientY - rect.top) / rect.height; // 0..1
    x.set(px - 0.5);
    y.set(py - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const borderClass = variant === 'hero'
    ? 'ring-fuchsia-400/25 shadow-[0_0_48px_rgba(255,0,204,0.18)]'
    : variant === 'cta'
      ? 'ring-cyan-400/20 shadow-[0_0_32px_rgba(0,255,255,0.14)]'
      : 'ring-cyan-400/15 shadow-[0_0_24px_rgba(0,255,255,0.1)]';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 900 }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass-card glass-card-hover p-6 rounded-2xl"
      >
        {/* Holographic sheen */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden" style={{ transform: 'translateZ(35px)' }}>
          <div
            className="absolute -inset-1 opacity-30"
            style={{
              background: 'conic-gradient(from 0deg, rgba(125,249,255,0.10), rgba(255,67,230,0.10), rgba(255,209,102,0.06), rgba(125,249,255,0.10))'
            }}
          />
        </div>

        {/* Neon border glow */}
        <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ${borderClass}`} style={{ transform: 'translateZ(10px)', borderImage: 'var(--holo-iridescent) 1' }} />

        <div style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HolographicCard;


