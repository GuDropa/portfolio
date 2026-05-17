'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import styles from './SkillsGraph2D.module.scss';

type Category = { label: string; items: string[] };

const COLORS_DARK = ['#FFD600', '#8E82A1', '#c084fc', '#60a5fa'];
const COLORS_LIGHT = ['#4B2462', '#8E82A1', '#7c3aed', '#2563eb'];

export function SkillsGraph2D({ categories }: { categories: Category[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);

  useEffect(() => { themeRef.current = resolvedTheme; }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Build nodes
    type Node = { x: number; y: number; vx: number; vy: number; label: string; radius: number; catIndex: number; };
    const nodes: Node[] = [];

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const cx = W / 2;
    const cy = H / 2;
    const clusterR = Math.min(W, H) * 0.3;

    categories.forEach((cat, ci) => {
      const angle = (ci / categories.length) * Math.PI * 2 - Math.PI / 2;
      const clusterX = cx + Math.cos(angle) * clusterR;
      const clusterY = cy + Math.sin(angle) * clusterR;

      cat.items.forEach((label) => {
        const spread = 55;
        nodes.push({
          x: clusterX + (Math.random() - 0.5) * spread,
          y: clusterY + (Math.random() - 0.5) * spread,
          vx: 0, vy: 0,
          label,
          radius: 5,
          catIndex: ci,
        });
      });

      // Cluster center (larger hub node)
      nodes.push({
        x: clusterX,
        y: clusterY,
        vx: 0, vy: 0,
        label: cat.label,
        radius: 10,
        catIndex: ci,
      });
    });

    // Connections: hub to each item in same cluster
    const connections: [number, number][] = [];
    let idx = 0;
    categories.forEach((cat, ci) => {
      const hubIdx = idx + cat.items.length;
      cat.items.forEach((_, itemOffset) => {
        connections.push([idx + itemOffset, hubIdx]);
      });
      idx += cat.items.length + 1;
    });

    let animId: number;
    let t = 0;
    let mouse = { x: cx, y: cy };

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.008;

      const isDark = themeRef.current !== 'light';
      const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
      const bgAlpha = isDark ? 'rgba(26,9,51,0)' : 'rgba(248,247,252,0)';

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgAlpha;
      ctx.fillRect(0, 0, W, H);

      // Draw connections
      connections.forEach(([a, b]) => {
        const na = nodes[a]; const nb = nodes[b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = COLORS[na.catIndex] + '33';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const color = COLORS[node.catIndex];
        const isHub = node.radius > 6;

        // Mouse repulsion
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          node.vx += (dx / dist) * 0.6;
          node.vy += (dy / dist) * 0.6;
        }

        // Gentle float
        node.x += Math.sin(t + node.catIndex) * 0.12;
        node.y += Math.cos(t + node.catIndex * 0.7) * 0.10;

        // Dampen velocity
        node.vx *= 0.85;
        node.vy *= 0.85;
        node.x += node.vx;
        node.y += node.vy;

        // Glow
        if (isHub) {
          const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 24);
          grd.addColorStop(0, color + '55');
          grd.addColorStop(1, color + '00');
          ctx.beginPath();
          ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = isHub ? `600 11px 'Space Grotesk', sans-serif` : `400 10px 'Space Grotesk', sans-serif`;
        ctx.fillStyle = isHub ? color : (isDark ? '#F8F7FC' : '#1A0933');
        ctx.globalAlpha = isHub ? 1 : 0.75;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
        ctx.globalAlpha = 1;
      });
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [categories]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
