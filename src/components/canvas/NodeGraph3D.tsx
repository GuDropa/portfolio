'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import styles from './NodeGraph3D.module.scss';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SIMPLE  = 'https://cdn.simpleicons.org';

const SKILL_NODES: { label: string; icon: string; x: number; y: number; z: number }[] = [
  { label: 'Vue 3',      icon: `${DEVICON}/vuejs/vuejs-original.svg`,             x:  0.0, y:  0.8, z:  0.2 },
  { label: 'React',      icon: `${DEVICON}/react/react-original.svg`,              x:  1.6, y:  0.6, z: -0.2 },
  { label: 'TypeScript', icon: `${DEVICON}/typescript/typescript-original.svg`,    x:  1.4, y: -0.4, z:  0.5 },
  { label: 'Node.js',    icon: `${DEVICON}/nodejs/nodejs-original.svg`,            x: -1.2, y:  0.4, z:  0.5 },
  { label: 'Next.js',    icon: `${DEVICON}/nextjs/nextjs-original.svg`,            x:  0.5, y:  1.6, z: -0.4 },
  { label: 'SASS',       icon: `${DEVICON}/sass/sass-original.svg`,                x: -0.3, y: -0.6, z: -1.0 },
  { label: 'Vuetify',    icon: `${DEVICON}/vuetify/vuetify-original.svg`,          x: -0.2, y:  0.4, z:  1.2 },
  { label: 'Pinia',      icon: `${SIMPLE}/pinia/42B883`,                           x:  0.8, y:  1.1, z:  0.6 },
  { label: 'Zustand',    icon: `${DEVICON}/react/react-original.svg`,              x:  2.0, y:  0.0, z:  0.3 },
  { label: 'Framer',     icon: `${SIMPLE}/framer/05F`,                             x:  1.1, y: -1.1, z: -0.5 },
  { label: 'MySQL',      icon: `${DEVICON}/mysql/mysql-original.svg`,              x:  0.6, y: -1.2, z:  0.2 },
  { label: 'MongoDB',    icon: `${DEVICON}/mongodb/mongodb-original.svg`,          x:  1.2, y:  0.2, z:  1.1 },
  { label: 'Go',         icon: `${DEVICON}/go/go-original-wordmark.svg`,           x:  1.8, y: -0.8, z:  0.7 },
  { label: 'Laravel',    icon: `${DEVICON}/laravel/laravel-original.svg`,          x: -0.4, y: -1.5, z:  0.4 },
  { label: 'PHP',        icon: `${DEVICON}/php/php-original.svg`,                  x: -1.0, y:  1.3, z:  0.1 },
  { label: 'Docker',     icon: `${DEVICON}/docker/docker-original.svg`,            x: -0.8, y: -0.9, z: -0.4 },
  { label: 'GCP',        icon: `${DEVICON}/googlecloud/googlecloud-original.svg`,  x: -1.8, y:  0.1, z: -0.3 },
  { label: 'Git',        icon: `${DEVICON}/git/git-original.svg`,                  x:  1.6, y:  1.1, z: -0.6 },
  { label: 'RabbitMQ',   icon: `${SIMPLE}/rabbitmq/FF6600`,                        x: -1.4, y: -0.3, z:  0.9 },
  { label: 'Vite',       icon: `${DEVICON}/vitejs/vitejs-original.svg`,            x:  0.0, y: -1.8, z: -0.3 },
  { label: 'Angular',    icon: `${DEVICON}/angular/angular-original.svg`,          x: -0.6, y:  1.9, z: -0.5 },
  { label: 'Oracle',     icon: `${DEVICON}/oracle/oracle-original.svg`,            x:  0.4, y: -0.9, z:  1.5 },
  { label: 'Java',       icon: `${DEVICON}/java/java-original.svg`,                x: -1.7, y: -1.1, z:  0.3 },
  { label: 'SQL Server', icon: `${DEVICON}/microsoftsqlserver/microsoftsqlserver-plain.svg`, x:  1.1, y: -1.6, z: -0.7 },
];

const CONNECTIONS: [number, number][] = [
  [0, 6], [0, 7], [0, 4],
  [1, 8], [1, 9], [1, 4],
  [2, 0], [2, 1], [2, 3],
  [3, 10],[3, 11],[3, 18],
  [4, 1], [4, 5],
  [10,13],[11,12],[12,16],
  [15,16],[15, 3],
  [17, 1],[17, 0],
  [19, 9],[19, 1],
  [14, 3],[13, 3],
  [20, 2],[20,14],
  [21,10],[21, 3],
  [22,15],[22,16],
  [23,21],[23,10],
];

export function NodeGraph3D() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const labelsRef  = useRef<HTMLDivElement>(null);
  const { theme }  = useTheme();
  const themeRef   = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas   = canvasRef.current;
    const labelsEl = labelsRef.current;
    if (!canvas || !labelsEl) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const getAccent = () => themeRef.current === 'light' ? 0x4B2462 : 0xFFD600;

    // Nodes (small spheres)
    const nodeMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo  = new THREE.SphereGeometry(0.06, 16, 16);
      const mat  = new THREE.MeshBasicMaterial({ color: getAccent() });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Glow rings
    const glowMeshes: THREE.Mesh[] = [];
    SKILL_NODES.forEach(({ x, y, z }) => {
      const geo  = new THREE.SphereGeometry(0.11, 16, 16);
      const mat  = new THREE.MeshBasicMaterial({ color: getAccent(), transparent: true, opacity: 0.08 });
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
      const mat = new THREE.LineBasicMaterial({ color: getAccent(), transparent: true, opacity: 0.15 });
      lineMats.push(mat);
      scene.add(new THREE.Line(geo, mat));
    });

    // Icon + tooltip overlay elements
    const iconEls: HTMLDivElement[] = [];
    SKILL_NODES.forEach(({ label, icon }) => {
      const wrap = document.createElement('div');
      wrap.className = styles.iconWrap;

      const img = document.createElement('img');
      img.src   = icon;
      img.alt   = label;
      img.className = styles.iconImg;
      img.crossOrigin = 'anonymous';

      const tip = document.createElement('span');
      tip.textContent = label;
      tip.className   = styles.tooltip;

      wrap.appendChild(img);
      wrap.appendChild(tip);
      labelsEl.appendChild(wrap);
      iconEls.push(wrap);
    });

    let animId: number;
    let t = 0;
    const mouse     = { x: 0, y: 0 };
    const targetCam = { x: 0, y: 0 };

    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const resize = () => {
      const w = canvas.parentElement?.clientWidth  ?? 500;
      const h = canvas.parentElement?.clientHeight ?? 500;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    const project = (pos: THREE.Vector3) => {
      const v = pos.clone().project(camera);
      const w = canvas.width  / window.devicePixelRatio;
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

      const hex = getAccent();
      nodeMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(hex));
      glowMeshes.forEach(m => (m.material as THREE.MeshBasicMaterial).color.setHex(hex));
      lineMats.forEach(m => m.color.setHex(hex));

      renderer.render(scene, camera);

      nodeMeshes.forEach((mesh, i) => {
        const worldPos = mesh.getWorldPosition(new THREE.Vector3());
        const screen   = project(worldPos);
        const el = iconEls[i];
        el.style.left = `${screen.x}px`;
        el.style.top  = `${screen.y}px`;
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      ro.disconnect();
      renderer.dispose();
      iconEls.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={labelsRef} className={styles.labels} />
    </div>
  );
}
