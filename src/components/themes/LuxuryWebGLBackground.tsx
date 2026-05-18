import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function GoldDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 300;
  
  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5; // z
      sc[i] = Math.random() * 1.5;
    }
    return [pos, sc];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4AF37"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

const silkVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const silkFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.15;
    
    float noise1 = snoise(vec2(uv.x * 2.0 + time, uv.y * 2.0 - time));
    float noise2 = snoise(vec2(uv.x * 1.5 - time, uv.y * 1.5 + time));
    float finalNoise = (noise1 + noise2) * 0.5;
    
    vec3 baseColor = vec3(0.008, 0.016, 0.039); // #02040A
    vec3 highlight = vec3(0.83, 0.68, 0.21);    // #D4AF37
    
    vec3 color = mix(baseColor, highlight * 0.08, finalNoise * 0.5 + 0.5);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function SilkBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -10]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={silkVertexShader}
        fragmentShader={silkFragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function LuxuryWebGLBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0, animation: 'fadeIn 3s ease forwards 1s' }}>
      <style>{`@keyframes fadeIn { to { opacity: 1; } }`}</style>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1.5]}>
        <SilkBackground />
        <GoldDust />
      </Canvas>
    </div>
  );
}
