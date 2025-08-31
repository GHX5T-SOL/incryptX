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

    const STAR_COUNT = 220; // balanced for performance
    const stars = [];
    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.8 + 0.2, // depth 0.2..1.0
          r: randomBetween(0.4, 1.8),
          twinkle: randomBetween(0.2, 1),
          hue: Math.random() < 0.7 ? 190 : 300 // cyan or magenta bias
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

      // subtle vignette/space glow
      const gradient = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );
      gradient.addColorStop(0, 'rgba(0, 10, 25, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        const tw = (Math.sin(t * 0.002 + i) + 1) * 0.5; // 0..1
        const alpha = 0.5 + 0.5 * tw * s.twinkle;
        const size = s.r + tw * 0.8 * s.z;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 100%, ${70 + s.z * 20}%, ${alpha})`;
        ctx.shadowBlur = 8 + s.z * 8;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 60%, ${alpha})`;
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // slow parallax drift
      for (let i = 0; i < stars.length; i += 1) {
        const s = stars[i];
        s.x += 0.02 * (1.5 - s.z);
        s.y += 0.01 * (1.5 - s.z);
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


