"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

type Cell = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  alpha: number;
};

export function BloodField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = prefersReducedMotion();
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999 };
    const cells: Cell[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    const seed = () => {
      const { width, height } = resize();
      cells.length = 0;
      const count = Math.round((width * height) / 28000);
      for (let i = 0; i < Math.max(18, Math.min(count, 42)); i += 1) {
        cells.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 6 + Math.random() * 16,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.28,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.008,
          alpha: 0.12 + Math.random() * 0.22,
        });
      }
    };

    const draw = () => {
      if (!running) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const cell of cells) {
        if (!reduce) {
          const dx = cell.x - pointer.x;
          const dy = cell.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 140) {
            const force = (140 - dist) / 140;
            cell.vx += (dx / dist) * force * 0.35;
            cell.vy += (dy / dist) * force * 0.35;
          }
          cell.vx *= 0.98;
          cell.vy *= 0.98;
          cell.x += cell.vx;
          cell.y += cell.vy;
          cell.rot += cell.vr;
          if (cell.x < -30) cell.x = width + 30;
          if (cell.x > width + 30) cell.x = -30;
          if (cell.y < -30) cell.y = height + 30;
          if (cell.y > height + 30) cell.y = -30;
        }

        ctx.save();
        ctx.translate(cell.x, cell.y);
        ctx.rotate(cell.rot);
        ctx.scale(1, 0.62);
        ctx.beginPath();
        ctx.ellipse(0, 0, cell.r, cell.r, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(185, 28, 44, ${cell.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-cell.r * 0.25, -cell.r * 0.2, cell.r * 0.35, cell.r * 0.22, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 249, 244, ${cell.alpha * 0.35})`;
        ctx.fill();
        ctx.restore();
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    seed();
    draw();

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    window.addEventListener("resize", seed);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !reduce) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", seed);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
