import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function Rings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: "#D4AF37",
    metalness: 1,
    roughness: 0.15,
    envMapIntensity: 2,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Ring 1 */}
        <mesh position={[-0.6, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.2, 0.08, 64, 128]} />
          <primitive object={goldMaterial} />
        </mesh>
        {/* Ring 2 */}
        <mesh position={[0.6, 0.4, -0.2]} rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[1.2, 0.08, 64, 128]} />
          <primitive object={goldMaterial} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeDRings() {
  return (
    <div className="w-full h-48 md:h-64 relative pointer-events-none mix-blend-screen opacity-80">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" penumbra={1} />
        <spotLight position={[-5, 5, -5]} intensity={1.5} color="#D4AF37" penumbra={1} />
        <Environment preset="city" />
        <Rings />
      </Canvas>
    </div>
  );
}
