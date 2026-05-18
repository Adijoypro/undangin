"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial,
  Environment,
  PresentationControls,
  ContactShadows
} from "@react-three/drei";
import * as THREE from "three";

function GoldenTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animasi rotasi tambahan lewat frame loop
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 4) / 8;
    meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, Math.PI / 4]}>
      <torusGeometry args={[1.5, 0.4, 64, 128]} />
      <meshStandardMaterial 
        color="#D4AF37" 
        metalness={0.9} 
        roughness={0.1} 
        emissive="#D4AF37"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function ThreeDExperiment() {
  return (
    <div className="w-full h-[500px] bg-transparent cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        
        {/* Pencahayaan Studio */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Lingkungan buat efek refleksi metalik */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
              <GoldenTorus />
            </Float>
          </PresentationControls>

          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
          />
        </Suspense>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
