"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const technologies = ["React", "Next.js", "TypeScript", "GSAP", "Three.js"];

export function AnimatedRibbons() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 4, -4, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const ribbonColors = [0xc8784d, 0x879a82, 0xe7dac7];
    const ribbonMeshes: THREE.Mesh[] = [];
    const ribbonState = ribbonColors.map((_, index) => ({
      phase: index * 1.7,
      amplitude: 0.12 + index * 0.035,
      speed: 0.7 + index * 0.12,
    }));

    for (let ribbonIndex = 0; ribbonIndex < ribbonColors.length; ribbonIndex += 1) {
      const segments = 240;
      const positions = new Float32Array((segments + 1) * 2 * 3);
      const indices: number[] = [];
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      for (let segment = 0; segment <= segments; segment += 1) {
        const progress = segment / segments;
        const x = progress * 16 - 8;
        const baseY = (ribbonIndex - 1) * 0.75;
        const width = 0.12 + Math.sin(progress * Math.PI) * 0.14;
        const left = (segment * 2) * 3;
        const right = left + 3;
        positions[left] = x;
        positions[left + 1] = baseY - width;
        positions[right] = x;
        positions[right + 1] = baseY + width;
        if (segment < segments) {
          const next = (segment + 1) * 2;
          indices.push(segment * 2, segment * 2 + 1, next, segment * 2 + 1, next + 1, next);
        }
      }

      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const material = new THREE.MeshBasicMaterial({
        color: ribbonColors[ribbonIndex],
        transparent: true,
        opacity: 0.82 - ribbonIndex * 0.12,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = (ribbonIndex - 1) * 0.08;
      scene.add(mesh);
      ribbonMeshes.push(mesh);
    }

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      const aspect = bounds.width / Math.max(bounds.height, 1);
      const height = 4.2;
      const width = Math.max(8, height * aspect);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    resize();

    const context = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll("[data-ribbon-label]"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse",
          },
        },
      );

      gsap.to(scene.rotation, {
        z: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    let frame = 0;
    const startedAt = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      ribbonMeshes.forEach((mesh, ribbonIndex) => {
        const positions = mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
        const state = ribbonState[ribbonIndex];
        for (let segment = 0; segment <= 240; segment += 1) {
          const progress = segment / 240;
          const left = (segment * 2) * 3;
          const right = left + 3;
          const wave = Math.sin(elapsed * state.speed + progress * 4 + state.phase) * state.amplitude;
          const sweep = Math.cos(elapsed * 0.45 + progress * 4 + state.phase) * 0.12;
          positions.setY(left + 1, (ribbonIndex - 1) * 0.75 - 0.2 + wave + sweep);
          positions.setY(right + 1, (ribbonIndex - 1) * 0.75 + 0.2 + wave + sweep);
        }
        positions.needsUpdate = true;
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      context.revert();
      resizeObserver.disconnect();
      ribbonMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={sectionRef} className="ribbon-canvas-wrap relative mt-16 h-64 w-full overflow-hidden border-y border-border sm:h-72 lg:mt-24 lg:h-80">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,var(--background)_100%)] opacity-40" />
      <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-4 sm:inset-x-8 sm:bottom-7 lg:inset-x-12">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
          The stack in motion
        </span>
        <div className="flex flex-wrap justify-end gap-x-5 gap-y-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              data-ribbon-label
              className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-foreground/75"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
