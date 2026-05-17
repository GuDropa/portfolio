'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import styles from './NodeGraph3D.module.scss';

const SKILL_NODES = [
  // Core
  { label: 'Vue 3',      x:  0.0, y:  0.8, z:  0.2 },
  { label: 'React',      x:  1.6, y:  0.6, z: -0.2 },
  { label: 'TypeScript', x:  1.4, y: -0.4, z:  0.5 },
  { label: 'Node.js',    x: -1.2, y:  0.4, z:  0.5 },
  { label: 'Next.js',    x:  0.5, y:  1.6, z: -0.4 },
  // Frontend
  { label: 'SASS',       x: -0.3, y: -0.6, z: -1.0 },
  { label: 'Vuetify',    x: -0.2, y:  0.4, z:  1.2 },
  { label: 'Pinia',      x:  0.8, y:  1.1, z:  0.6 },
  { label: 'Zustand',    x:  2.0, y:  0.0, z:  0.3 },
  { label: 'Framer',     x:  1.1, y: -1.1, z: -0.5 },
  // Backend / DB
  { label: 'MySQL',      x:  0.6, y: -1.2, z:  0.2 },
  { label: 'MongoDB',    x:  1.2, y:  0.2, z:  1.1 },
  { label: 'Go',         x:  1.8, y: -0.8, z:  0.7 },
  { label: 'Laravel',    x: -0.4, y: -1.5, z:  0.4 },
  { label: 'PHP',        x: -1.0, y:  1.3, z:  0.1 },
  // DevOps / Tools
  { label: 'Docker',     x: -0.8, y: -0.9, z: -0.4 },
  { label: 'GCP',        x: -1.8, y:  0.1, z: -0.3 },
  { label: 'Git',        x:  1.6, y:  1.1, z: -0.6 },
  { label: 'RabbitMQ',   x: -1.4, y: -0.3, z:  0.9 },
  { label: 'Vite',       x:  0.0, y: -1.8, z: -0.3 },
];

const CONNECTIONS: [number, number][] = [
  // Vue ecosystem
  [0, 6], [0, 7], [0, 4],
  // React ecosystem
  [1, 8], [1, 9], [1, 4],
  // TS bridges Vue+React+Node
  [2, 0], [2, 1], [2, 3],
  // Node backend
  [3, 10], [3, 11], [3, 18],
  // Next
  [4, 1], [4, 5],
  // DB/backend
  [10, 13], [11, 12], [12, 16],
  // DevOps
  [15, 16], [15, 3],
  [17, 1], [17, 0],
  // Build tools
  [19, 9], [19, 1],
  [14, 3], [13, 3],
];

export function NodeGraph3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const labelsEl = labelsRef.current;
    if (!canvas || !labelsEl) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const getAccent = () => themeRef.current === 'light' ? 0x4B2462 : 0xFFD600;

    // Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo = new THREE.SphereGeometry(0.075, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: getAccent() });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Glow rings
    const glowMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo = new THREE.SphereGeometry(0.13, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: getAccent(), transparent: true, opacity: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      glowMeshes.push(mesh);
    });

    // Edges
    const lineMats: THREE.LineBasicMaterial[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      const pa = SKILL_NODES[a]; const pb = SKILL_NODES[b];
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(pa.x, pa.y, pa.z),
        new THREE.Vector3(pb.x, pb.y, pb.z),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: getAccent(), transparent: true, opacity: 0.18 });
      lineMats.push(mat);
      scene.add(new THREE.Line(geo, mat));
    });

    // Label DOM elements
    const labelEls: HTMLSpanElement[] = [];
    SKILL_NODES.forEach(({ label }) => {
      const el = document.createElement('span');
      el.textContent = label;
      el.className = styles.label;
      labelsEl.appendChild(el);
      labelEls.push(el);
    });

    let animId: number;
    let t = 0;
    const mouse = { x: 0, y: 0 };
    const targetCam = { x: 0, y: 0 };

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const resize = () => {
      const w = canvas.parentElement?.clientWidth ?? 500;
      const h = canvas.parentElement?.clientHeight ?? 500;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    const projectToScreen = (pos: THREE.Vector3) => {
      const v = pos.clone().project(camera);
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h };
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;

      scene.rotation.y = t * 0.45;
      scene.rotation.x = Math.sin(t * 0.3) * 0.12;

      targetCam.x += (mouse.x * 0.5 - targetCam.x) * 0.05;
      targetCam.y += (-mouse.y * 0.35 - targetCam.y) * 0.05;
      camera.position.x = targetCam.x;
      camera.position.y = targetCam.y;
      camera.lookAt(scene.position);

      const accentHex = getAccent();
      nodeMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(accentHex));
      glowMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(accentHex));
      lineMats.forEach(m => m.color.setHex(accentHex));

      renderer.render(scene, camera);

      nodeMeshes.forEach((mesh, i) => {
        const worldPos = mesh.getWorldPosition(new THREE.Vector3());
        const screen = projectToScreen(worldPos);
        const el = labelEls[i];
        el.style.left = `${screen.x}px`;
        el.style.top  = `${screen.y - 16}px`;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      ro.disconnect();
      renderer.dispose();
      labelEls.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={labelsRef} className={styles.labels} />
    </div>
  );
}
