import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

    const STAR_COUNT = 240; // slight increase for richness
    const stars = [];
    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.2, // depth 0.2..1.0
          r: randomBetween(0.4, 1.6),
          twinkle: randomBetween(0.1, 0.5), // reduce twinkle amplitude to avoid flashing
          tone: Math.random() < 0.85 ? 'white' : 'cyan' // mostly white stars, occasional cyan
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * deviceRatio);
      canvas.height = Math.floor(height * deviceRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
      createStars();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);

      // keep background fully black; no vignette to avoid any color flashing

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        const tw = (Math.sin(t * 0.0012 + i) + 1) * 0.5; // slower twinkle
        const alpha = 0.35 + 0.35 * tw * s.twinkle; // lower peak alpha
        const size = s.r + tw * 0.4 * s.z; // smaller size change
        ctx.beginPath();
        const color = s.tone === 'white' ? `rgba(255,255,255,${alpha})` : `rgba(125,249,255,${alpha})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 6 + s.z * 6;
        ctx.shadowColor = s.tone === 'white' ? `rgba(255,255,255,${alpha})` : `rgba(125,249,255,${alpha})`;
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // faster parallax drift (Chumchon-like)
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.x += 0.14 * (1.5 - s.z);
        s.y += 0.06 * (1.5 - s.z);
        if (s.x > width) s.x = 0;
        if (s.y > height) s.y = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    animationRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default Starfield;


