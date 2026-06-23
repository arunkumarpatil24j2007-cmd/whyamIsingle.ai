"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MorphingMesh from "./MorphingMesh";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Background Orbiting Particles component for Section 1 and ambient depth
function BackgroundStars({ count = 250 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute randomly in a shell around the center
      const r = 2.0 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2.0 - 1.0);

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      spd[i] = 0.05 + Math.random() * 0.15;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return [pos, spd, phs];
  }, [count]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Ambient rotation of background stars
      pointsRef.current.rotation.y = elapsed * 0.02;
      pointsRef.current.rotation.x = elapsed * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#F59E0B"
        transparent
        opacity={0.35}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Controls camera transitions synchronized with scrolling sections
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    // Initial camera placement
    camera.position.set(0, 0.25, 1.35);
    camera.lookAt(0, 0.15, 0);

    // Section 2: Zoom camera out as bust explodes into fibers
    const t2 = gsap.to(camera.position, {
      z: 2.1,
      y: 0.1,
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // Section 5: Adjust positioning as sphere morphs into funnel
    const t5 = gsap.to(camera.position, {
      z: 1.9,
      y: -0.05,
      scrollTrigger: {
        trigger: "#section-5",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // Section 7: Bring camera closer as funnel morphs back to bust
    const t7 = gsap.to(camera.position, {
      z: 1.3,
      y: 0.2,
      scrollTrigger: {
        trigger: "#section-7",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    return () => {
      t2.scrollTrigger?.kill();
      t2.kill();
      t5.scrollTrigger?.kill();
      t5.kill();
      t7.scrollTrigger?.kill();
      t7.kill();
    };
  }, [camera]);

  return null;
}

export default function CinematicCanvas() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 20 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 3, 4]} intensity={2.0} />
        <pointLight position={[-2, -1, -2]} color="#7C3AED" intensity={3.0} />
        <pointLight position={[2, 1, 2]} color="#DB2777" intensity={3.0} />
        <pointLight position={[0, -2, 1]} color="#F59E0B" intensity={1.5} />
        
        <MorphingMesh />
        <BackgroundStars />
        <CameraController />
      </Canvas>
    </div>
  );
}
