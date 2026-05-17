'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import styles from './NodeGraph3D.module.scss';

const SKILL_NODES = [
  { label: 'Vue 3', x: 0, y: 0.8, z: 0.2 },
  { label: 'TypeScript', x: 1.4, y: 0.2, z: -0.3 },
  { label: 'Node.js', x: -1.2, y: 0.4, z: 0.5 },
  { label: 'MySQL', x: 0.6, y: -1.0, z: 0.1 },
  { label: 'Docker', x: -0.8, y: -0.8, z: -0.4 },
  { label: 'Go', x: 1.8, y: -0.5, z: 0.6 },
  { label: 'GCP', x: -1.8, y: 0.1, z: -0.2 },
  { label: 'Pinia', x: 0.3, y: 1.6, z: -0.5 },
  { label: 'Laravel', x: -0.4, y: -1.5, z: 0.3 },
  { label: 'MongoDB', x: 1.2, y: 1.0, z: 0.4 },
  { label: 'RabbitMQ', x: -1.4, y: -0.3, z: 0.8 },
  { label: 'SASS', x: 0.9, y: -0.2, z: -1.0 },
  { label: 'Vuetify', x: -0.2, y: 0.5, z: 1.2 },
  { label: 'Git', x: 1.6, y: 0.9, z: -0.7 },
  { label: 'PHP', x: -0.9, y: 1.3, z: 0.1 },
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 7], [0, 12],
  [1, 3], [1, 9], [1, 13],
  [2, 5], [2, 10], [2, 8],
  [3, 5], [3, 8],
  [4, 6], [4, 10],
  [5, 6], [6, 2],
  [7, 12], [9, 13],
  [11, 1], [14, 0],
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
    camera.position.set(0, 0, 5);

    const getAccent = () => themeRef.current === 'light' ? 0x4B2462 : 0xFFD600;
    const getEdge = () => themeRef.current === 'light' ? 0x4B2462 : 0xFFD600;

    // Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo = new THREE.SphereGeometry(0.08, 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: getAccent() });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Glow rings around nodes
    const glowMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo = new THREE.SphereGeometry(0.14, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: getAccent(),
        transparent: true,
        opacity: 0.12,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      glowMeshes.push(mesh);
    });

    // Edges
    const lineMats: THREE.LineBasicMaterial[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      const posA = SKILL_NODES[a];
      const posB = SKILL_NODES[b];
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(posA.x, posA.y, posA.z),
        new THREE.Vector3(posB.x, posB.y, posB.z),
      ]);
      const mat = new THREE.LineBasicMaterial({ color: getEdge(), transparent: true, opacity: 0.2 });
      lineMats.push(mat);
      scene.add(new THREE.Line(geo, mat));
    });

    // Label elements
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
      return {
        x: (v.x * 0.5 + 0.5) * w,
        y: (-v.y * 0.5 + 0.5) * h,
      };
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;

      // Slow auto-rotation
      scene.rotation.y = t * 0.5;
      scene.rotation.x = Math.sin(t * 0.3) * 0.15;

      // Mouse parallax
      targetCam.x += (mouse.x * 0.6 - targetCam.x) * 0.05;
      targetCam.y += (-mouse.y * 0.4 - targetCam.y) * 0.05;
      camera.position.x = targetCam.x;
      camera.position.y = targetCam.y;
      camera.lookAt(scene.position);

      // Update theme colors
      const accentHex = getAccent();
      nodeMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(accentHex));
      glowMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(accentHex));
      lineMats.forEach(m => m.color.setHex(getEdge()));

      renderer.render(scene, camera);

      // Sync label positions
      nodeMeshes.forEach((mesh, i) => {
        const worldPos = mesh.getWorldPosition(new THREE.Vector3());
        const screen = projectToScreen(worldPos);
        const el = labelEls[i];
        el.style.left = `${screen.x}px`;
        el.style.top = `${screen.y - 18}px`;
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
