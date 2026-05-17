'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import styles from './SkillsGraph2D.module.scss';

type Category = { label: string; items: string[] };

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SIMPLE  = 'https://cdn.simpleicons.org';

const ICON_MAP: Record<string, string> = {
  'Vue 3':        `${DEVICON}/vuejs/vuejs-original.svg`,
  'React':        `${DEVICON}/react/react-original.svg`,
  'Next.js':      `${DEVICON}/nextjs/nextjs-original.svg`,
  'TypeScript':   `${DEVICON}/typescript/typescript-original.svg`,
  'JavaScript':   `${DEVICON}/javascript/javascript-original.svg`,
  'SASS':         `${DEVICON}/sass/sass-original.svg`,
  'Vuetify':      `${DEVICON}/vuetify/vuetify-original.svg`,
  'Pinia':        `${DEVICON}/pinia/pinia-original.svg`,
  'Zustand':      `${DEVICON}/react/react-original.svg`,
  'Framer Motion':`${SIMPLE}/framer/05F`,
  'Vite':         `${DEVICON}/vitejs/vitejs-original.svg`,
  'Tailwind':     `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  'Node.js':      `${DEVICON}/nodejs/nodejs-original.svg`,
  'Laravel':      `${DEVICON}/laravel/laravel-original.svg`,
  'Go':           `${DEVICON}/go/go-original-wordmark.svg`,
  'PHP':          `${DEVICON}/php/php-original.svg`,
  'RabbitMQ':     `${SIMPLE}/rabbitmq/FF6600`,
  'Elasticsearch':`${DEVICON}/elasticsearch/elasticsearch-original.svg`,
  'MySQL':        `${DEVICON}/mysql/mysql-original.svg`,
  'MongoDB':      `${DEVICON}/mongodb/mongodb-original.svg`,
  'PostgreSQL':   `${DEVICON}/postgresql/postgresql-original.svg`,
  'Docker':       `${DEVICON}/docker/docker-original.svg`,
  'GCP':          `${DEVICON}/googlecloud/googlecloud-original.svg`,
  'Git':          `${DEVICON}/git/git-original.svg`,
  'GitLab':       `${DEVICON}/gitlab/gitlab-original.svg`,
  'Jira':         `${DEVICON}/jira/jira-original.svg`,
  'Notion':       `${SIMPLE}/notion/000000`,
};

const COLORS_DARK  = ['#FFD600', '#c084fc', '#60a5fa', '#34d399'];
const COLORS_LIGHT = ['#4B2462', '#7c3aed', '#2563eb', '#059669'];

export function SkillsGraph2D({ categories }: { categories: Category[] }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const themeRef     = useRef(resolvedTheme);

  useEffect(() => { themeRef.current = resolvedTheme; }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.offsetWidth  || 800;
    const H = canvas.offsetHeight || 500;
    const DPR = window.devicePixelRatio || 1;
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);

    // ── Build node layout ──────────────────────────────
    type Node = {
      x: number; y: number; vx: number; vy: number;
      label: string; isHub: boolean; catIndex: number;
      baseX: number; baseY: number;
    };
    const nodes: Node[] = [];
    const connections: [number, number][] = [];

    const cx = W / 2;
    const cy = H / 2;
    const clusterR = Math.min(W, H) * 0.28;

    categories.forEach((cat, ci) => {
      const angle   = (ci / categories.length) * Math.PI * 2 - Math.PI / 2;
      const hubX    = cx + Math.cos(angle) * clusterR;
      const hubY    = cy + Math.sin(angle) * clusterR;
      const hubIdx  = nodes.length + cat.items.length;

      cat.items.forEach((label, k) => {
        const spread   = 60;
        const itemAngle = (k / cat.items.length) * Math.PI * 2;
        const ix = hubX + Math.cos(itemAngle) * spread * 0.7 + (Math.random() - 0.5) * 20;
        const iy = hubY + Math.sin(itemAngle) * spread * 0.7 + (Math.random() - 0.5) * 20;
        connections.push([nodes.length, hubIdx]);
        nodes.push({ x: ix, y: iy, vx: 0, vy: 0, label, isHub: false, catIndex: ci, baseX: ix, baseY: iy });
      });

      nodes.push({ x: hubX, y: hubY, vx: 0, vy: 0, label: cat.label, isHub: true, catIndex: ci, baseX: hubX, baseY: hubY });
    });

    // ── Pre-load icons ─────────────────────────────────
    const loadedIcons: Record<string, HTMLImageElement> = {};
    const allLabels = nodes.map(n => n.label);

    allLabels.forEach(label => {
      const url = ICON_MAP[label];
      if (!url) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => { loadedIcons[label] = img; };
    });

    // ── Animation loop ─────────────────────────────────
    let animId: number;
    let t = 0;
    const mouse = { x: cx, y: cy };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.007;

      const isDark = themeRef.current !== 'light';
      const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

      ctx.clearRect(0, 0, W, H);

      // Connections
      connections.forEach(([a, b]) => {
        const na = nodes[a]; const nb = nodes[b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = COLORS[na.catIndex] + '30';
        ctx.lineWidth   = 1;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        // Gentle float around base position
        node.x = node.baseX + Math.sin(t + node.catIndex * 1.3 + (node.isHub ? 0 : node.baseX * 0.01)) * (node.isHub ? 4 : 8);
        node.y = node.baseY + Math.cos(t * 0.8 + node.catIndex * 0.7 + (node.isHub ? 0 : node.baseY * 0.01)) * (node.isHub ? 3 : 6);

        // Mouse repulsion
        const dx   = node.x - mouse.x;
        const dy   = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90 && dist > 0) {
          node.x += (dx / dist) * (90 - dist) * 0.12;
          node.y += (dy / dist) * (90 - dist) * 0.12;
        }

        const color    = COLORS[node.catIndex];
        const iconSize = node.isHub ? 28 : 20;
        const radius   = node.isHub ? 22 : 16;

        // Glow
        const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 1.6);
        grd.addColorStop(0, color + (node.isHub ? '40' : '28'));
        grd.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Circle bg
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(26,9,51,0.7)' : 'rgba(255,255,255,0.75)';
        ctx.fill();
        ctx.strokeStyle = color + (node.isHub ? 'AA' : '55');
        ctx.lineWidth   = node.isHub ? 1.5 : 1;
        ctx.stroke();

        // Icon or text fallback
        const icon = loadedIcons[node.label];
        if (icon) {
          const half = iconSize / 2;
          ctx.drawImage(icon, node.x - half, node.y - half, iconSize, iconSize);
        } else {
          ctx.font      = `${node.isHub ? 600 : 400} ${node.isHub ? 10 : 8}px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label.slice(0, 3), node.x, node.y);
        }

        // Hub label underneath
        if (node.isHub) {
          ctx.font      = `700 10px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.9;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(node.label.toUpperCase(), node.x, node.y + radius + 4);
          ctx.globalAlpha = 1;
          ctx.textBaseline = 'alphabetic';
        }
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [categories]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
