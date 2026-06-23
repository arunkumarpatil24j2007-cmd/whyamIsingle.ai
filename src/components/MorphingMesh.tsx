"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Particle Count (generous but optimized for 60fps)
const PARTICLE_COUNT = 32000;

export default function MorphingMesh() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Tracks scroll velocity to affect particle rotation speed
  const velocityRef = useRef(0);
  
  // Generate procedural point targets for all 4 states on the CPU once
  const { positionsBust, positionsFibers, positionsSphere, positionsFunnel, randoms } = useMemo(() => {
    const bust = new Float32Array(PARTICLE_COUNT * 3);
    const fibers = new Float32Array(PARTICLE_COUNT * 3);
    const sphere = new Float32Array(PARTICLE_COUNT * 3);
    const funnel = new Float32Array(PARTICLE_COUNT * 3);
    const rnd = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // --- RANDOM JITTER ATTRIBUTES ---
      rnd[i3] = Math.random() * 2.0 - 1.0;     // Orbit direction/speed modifier
      rnd[i3 + 1] = Math.random();             // Size modifier
      rnd[i3 + 2] = Math.random() * Math.PI * 2; // Phase offset

      // --- 1. BUST SHAPE ---
      // We partition points: 45% Face/Skull, 25% Neck, 30% Shoulders
      const randType = Math.random();
      
      if (randType < 0.45) {
        // Face & Skull: points on a sphere, shaped into a head
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        let r = 0.38;
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta) + 0.4; // shift up
        let z = r * Math.cos(phi);
        
        // Shape skull and jaw tapering
        if (y < 0.4) {
          // Jaw tapering
          const jawFactor = (y - 0.05) / 0.35; // 0 to 1
          x *= (0.6 + 0.4 * jawFactor);
          z *= (0.7 + 0.3 * jawFactor);
        } else {
          // Skull roundness
          x *= 0.95;
          z *= 0.95;
        }

        // Pull face forward
        if (z > 0.0) {
          // Nose bridge
          if (Math.abs(x) < 0.06 && y > 0.28 && y < 0.48) {
            z += 0.08 * (1.0 - Math.abs(x) / 0.06) * Math.sin((y - 0.28) / 0.2 * Math.PI);
          }
          // Face flattening slightly
          z += 0.02;
          
          // Eye socket indentations
          if (y > 0.42 && y < 0.52 && Math.abs(x) > 0.08 && Math.abs(x) < 0.18) {
            z -= 0.04 * (1.0 - (Math.abs(x) - 0.13) * (Math.abs(x) - 0.13) / 0.0025);
          }
        }

        bust[i3] = x;
        bust[i3 + 1] = y;
        bust[i3 + 2] = z;
      } else if (randType < 0.70) {
        // Neck: cylindrical tube
        const h = Math.random(); // 0 to 1
        const theta = Math.random() * Math.PI * 2;
        const radius = 0.15 * (1.0 - h * 0.1); // Slightly tapered neck
        
        bust[i3] = radius * Math.cos(theta);
        bust[i3 + 1] = -0.22 + h * 0.32; // spans y in [-0.22, 0.1]
        bust[i3 + 2] = radius * Math.sin(theta) - 0.02; // slide slightly back
      } else {
        // Shoulders: wide horizontal ellipse
        const h = Math.random(); // y-span
        const theta = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        const width = 0.78 * (1.0 - h * 0.4);
        const depth = 0.26 * (1.0 - h * 0.3);
        
        bust[i3] = width * r * Math.cos(theta);
        bust[i3 + 1] = -0.5 + h * 0.28; // y in [-0.5, -0.22]
        bust[i3 + 2] = depth * r * Math.sin(theta);
      }

      // --- 2. FIBERS SHAPE ---
      // Explode points outward along their bust coordinate vectors with wave/turbulence
      const bx = bust[i3];
      const by = bust[i3 + 1];
      const bz = bust[i3 + 2];
      
      const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
      const dx = bx / len;
      const dy = by / len;
      const dz = bz / len;
      
      // Extent multiplier (long fibers)
      const fiberLength = 1.6 + Math.random() * 2.2;
      fibers[i3] = bx * 0.6 + dx * fiberLength + Math.sin(by * 8.0) * 0.2;
      fibers[i3 + 1] = by * 0.6 + dy * fiberLength + Math.cos(bx * 8.0) * 0.15;
      fibers[i3 + 2] = bz * 0.6 + dz * fiberLength + Math.sin(bz * 8.0) * 0.2;

      // --- 3. SPHERE SHAPE ---
      // Fibonacci lattice distribution for clean living spherical appearance
      const phiAngle = Math.acos(1 - 2 * (i / PARTICLE_COUNT));
      const thetaAngle = Math.PI * (1 + Math.sqrt(5)) * i; // golden angle
      const sRadius = 0.48 + (Math.random() * 0.04 - 0.02); // slight thickness variation
      
      sphere[i3] = sRadius * Math.sin(phiAngle) * Math.cos(thetaAngle);
      sphere[i3 + 1] = sRadius * Math.sin(phiAngle) * Math.sin(thetaAngle);
      sphere[i3 + 2] = sRadius * Math.cos(phiAngle);

      // --- 4. FUNNEL SHAPE ---
      // Sleek cone/funnel structure expanding upwards
      const h = Math.random(); // 0 to 1 (bottom to top)
      const theta = Math.random() * Math.PI * 2;
      const fRadius = 0.08 + 0.45 * Math.pow(h, 1.5); // flared top
      
      funnel[i3] = fRadius * Math.cos(theta);
      funnel[i3 + 1] = -0.45 + h * 1.15; // y in [-0.45, 0.7]
      funnel[i3 + 2] = fRadius * Math.sin(theta);
    }

    return {
      positionsBust: bust,
      positionsFibers: fibers,
      positionsSphere: sphere,
      positionsFunnel: funnel,
      randoms: rnd
    };
  }, []);

  // Hook up GSAP ScrollTriggers
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;

    // Reset values
    mat.uniforms.uProgress1.value = 0;
    mat.uniforms.uProgress2.value = 0;
    mat.uniforms.uProgress3.value = 0;
    mat.uniforms.uProgress4.value = 0;

    // ScrollTrigger 1: Section 2 (Bust -> Fibers)
    // Starts morphing as Section 2 enters viewport
    const t1 = gsap.to(mat.uniforms.uProgress1, {
      value: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // ScrollTrigger 2: Section 3 (Fibers -> Sphere)
    const t2 = gsap.to(mat.uniforms.uProgress2, {
      value: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#section-3",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // ScrollTrigger 3: Section 5 (Sphere -> Funnel)
    const t3 = gsap.to(mat.uniforms.uProgress3, {
      value: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#section-5",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // ScrollTrigger 4: Section 7 (Funnel -> Bust)
    const t4 = gsap.to(mat.uniforms.uProgress4, {
      value: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: "#section-7",
        start: "top bottom",
        end: "center center",
        scrub: 1.0,
      }
    });

    // Connect Lenis ScrollTrigger updates if available
    const lenis = (window as any).lenis;
    const handleScroll = (e: any) => {
      velocityRef.current = Math.min(Math.abs(e.velocity || 0) / 10, 5);
      ScrollTrigger.update();
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    return () => {
      t1.scrollTrigger?.kill();
      t1.kill();
      t2.scrollTrigger?.kill();
      t2.kill();
      t3.scrollTrigger?.kill();
      t3.kill();
      t4.scrollTrigger?.kill();
      t4.kill();
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  // Frame tick: update time and decay scroll velocity
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
      // Decay velocity back to 0
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0, 0.05);
      materialRef.current.uniforms.uScrollVelocity.value = velocityRef.current;
    }

    // Apply slow ambient yaw rotation to Points based on scroll velocity
    if (meshRef.current) {
      const scrollRotation = elapsed * 0.08 + (velocityRef.current * 0.05);
      meshRef.current.rotation.y = scrollRotation;
    }
  });

  // Custom Shader Code definition
  const shaderArgs = useMemo(() => {
    return {
      uniforms: {
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uProgress1: { value: 0.0 }, // Bust -> Fibers
        uProgress2: { value: 0.0 }, // Fibers -> Sphere
        uProgress3: { value: 0.0 }, // Sphere -> Funnel
        uProgress4: { value: 0.0 }, // Funnel -> Bust
      },
      vertexShader: `
        uniform float uProgress1;
        uniform float uProgress2;
        uniform float uProgress3;
        uniform float uProgress4;
        uniform float uTime;
        uniform float uScrollVelocity;

        attribute vec3 aBust;
        attribute vec3 aFibers;
        attribute vec3 aSphere;
        attribute vec3 aFunnel;
        attribute vec3 aRandom;

        varying vec3 vPosition;
        varying float vRadius;

        void main() {
          // Linear interpolation between the shapes based on the progress parameters
          vec3 pos = aBust;
          
          // Phase 1: Morph to Fibers
          pos = mix(pos, aFibers, uProgress1);
          
          // Phase 2: Collapse into Sphere
          pos = mix(pos, aSphere, uProgress2);
          
          // Phase 3: Morph to Funnel
          pos = mix(pos, aFunnel, uProgress3);
          
          // Phase 4: Reset back to Face/Bust
          pos = mix(pos, aBust, uProgress4);

          // Subtle harmonic breathing & floating offset (disabled in Fibers phase)
          float breathing = sin(uTime * 1.5 + pos.y * 3.0) * 0.012;
          float stateMultiplier = (1.0 - uProgress1) + (uProgress2 * 0.5);
          
          pos.x += breathing * stateMultiplier;
          pos.y += cos(uTime * 1.1) * 0.016 * stateMultiplier;
          pos.z += sin(uTime * 0.9) * 0.012 * stateMultiplier;

          // Spherical Orbiting effect when in Sphere or Funnel phase
          if (uProgress2 > 0.0 && uProgress3 < 1.0) {
            float speed = uTime * 0.15 * (1.0 + uScrollVelocity * 4.0) * aRandom.x;
            float c = cos(speed);
            float s = sin(speed);
            float nx = pos.x * c - pos.z * s;
            float nz = pos.x * s + pos.z * c;
            
            // Apply rotation proportionally
            float rotBlend = uProgress2 * (1.0 - uProgress3);
            pos.x = mix(pos.x, nx, rotBlend);
            pos.z = mix(pos.z, nz, rotBlend);
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Adjust Point Size based on morph phase
          float baseSize = 4.2;
          if (uProgress1 > 0.0 && uProgress2 < 1.0) {
            baseSize = mix(4.2, 1.8, uProgress1); // Make fibers very thin and wirey
          } else if (uProgress2 > 0.0 && uProgress3 < 1.0) {
            baseSize = mix(1.8, 3.2, uProgress2); // Medium size for living sphere
          }
          
          // Apply size jitter based on random attribute
          baseSize += aRandom.y * 1.0;

          // Standard distance attenuation for perspective canvas
          gl_PointSize = baseSize * (350.0 / -mvPosition.z);

          // Pass coords to fragment shader
          vPosition = pos;
          vRadius = length(pos);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying float vRadius;

        uniform float uProgress1;
        uniform float uProgress2;
        uniform float uProgress3;
        uniform float uProgress4;

        void main() {
          // Circular particle shape crop
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (dot(coord, coord) > 0.25) discard;

          // Default styling: white points for the bust face
          vec3 finalColor = vec3(1.0);

          // --- FIBERS GRADIENT COLORING ---
          // White core fading to a warm amber orange and pink tips
          if (uProgress1 > 0.0 && uProgress2 < 1.0) {
            float dist = length(vPosition);
            float tipBlend = smoothstep(0.3, 1.8, dist);
            
            vec3 orange = vec3(0.96, 0.62, 0.04); // #F59E0B (Amber orange)
            vec3 pink = vec3(0.86, 0.15, 0.47);   // #DB2777 (Hot pink)
            
            vec3 fiberColor = mix(vec3(1.0), orange, tipBlend);
            fiberColor = mix(fiberColor, pink, smoothstep(1.2, 2.6, dist) * 0.45);
            
            finalColor = mix(finalColor, fiberColor, uProgress1);
          }

          // --- SPHERE & FUNNEL GRADIENT COLORING ---
          // Apple Vision Pro style purple-pink fluid gradient
          if (uProgress2 > 0.0) {
            vec3 purple = vec3(0.48, 0.22, 0.93); // #7C3AED
            vec3 pink = vec3(0.86, 0.15, 0.47);   // #DB2777
            
            // Mix color based on the vertical height of the particle (Y axis)
            float verticalBlend = smoothstep(-0.45, 0.6, vPosition.y);
            vec3 gradient = mix(purple, pink, verticalBlend);
            
            // Transition between grayscale and color depending on active phase
            float activeGradientBlend = uProgress2;
            if (uProgress4 > 0.0) {
              activeGradientBlend = 1.0 - uProgress4; // Blend back to grayscale bust
            }
            
            finalColor = mix(finalColor, gradient, activeGradientBlend * 0.85);
          }

          // Anti-aliased circular border blending
          float alpha = 1.0 - smoothstep(0.38, 0.5, length(coord));

          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    };
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsBust, 3]}
        />
        <bufferAttribute
          attach="attributes-aBust"
          args={[positionsBust, 3]}
        />
        <bufferAttribute
          attach="attributes-aFibers"
          args={[positionsFibers, 3]}
        />
        <bufferAttribute
          attach="attributes-aSphere"
          args={[positionsSphere, 3]}
        />
        <bufferAttribute
          attach="attributes-aFunnel"
          args={[positionsFunnel, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={shaderArgs.uniforms}
        vertexShader={shaderArgs.vertexShader}
        fragmentShader={shaderArgs.fragmentShader}
      />
    </points>
  );
}
