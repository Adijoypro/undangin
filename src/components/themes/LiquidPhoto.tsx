import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const liquidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const liquidFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uHover;
  uniform float uHoverState;
  uniform float uScaleX;
  uniform float uScaleY;
  
  varying vec2 vUv;

  void main() {
    // Basic mapping: vUv bounds depend on the bounding box of the ShapeGeometry
    // Since width is 2 and height is 3, from (-1, -1.5) to (1, 1.5)
    // We map it to (0, 0) to (1, 1)
    vec2 uv = vec2(vUv.x / 2.0 + 0.5, vUv.y / 3.0 + 0.5);
    
    // Apply object-fit: cover from the center
    uv = (uv - 0.5) * vec2(uScaleX, uScaleY) + 0.5;
    
    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 grayscaleColor = vec3(gray);
    
    // Smooth fade to color on hover (no ripple distortion)
    vec3 finalColor = mix(grayscaleColor, texColor.rgb, uHoverState);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function ArchPhotoAndFrame({ src }: { src: string }) {
  const { width: viewportWidth } = useThree((state) => state.viewport);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(src);
  
  // Set texture to cover the geometry without stretching
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const scale = useMemo(() => {
    // Our total frame width is 2.16. We want it to occupy at most 82% of the viewport width.
    const targetScale = (viewportWidth * 0.82) / 2.16;
    return Math.min(targetScale, 1.25);
  }, [viewportWidth]);

  const hoverState = useRef(0);
  
  // Calculate object-fit: cover scales
  const { uScaleX, uScaleY } = useMemo(() => {
    const meshAspect = 2.0 / 3.0;
    const img = texture.image as any;
    const imageAspect = img && img.width && img.height ? (img.width / img.height) : 1.0;
    
    let scaleX = 1.0;
    let scaleY = 1.0;
    
    if (imageAspect > meshAspect) {
      scaleX = meshAspect / imageAspect;
    } else {
      scaleY = imageAspect / meshAspect;
    }
    
    return { uScaleX: scaleX, uScaleY: scaleY };
  }, [texture]);

  const [archShape, frameShape] = useMemo(() => {
    const width = 2.0;
    const height = 3.0;
    const radius = width / 2;
    
    // Photo Shape (Inner)
    const shape = new THREE.Shape();
    shape.moveTo(-width/2, -height/2);
    shape.lineTo(width/2, -height/2);
    shape.lineTo(width/2, height/2 - radius);
    shape.absarc(0, height/2 - radius, radius, 0, Math.PI, false);
    shape.lineTo(-width/2, -height/2);
    
    // 3D Frame Shape (Outer border with inner hole)
    const frameThick = 0.08;
    const outerWidth = width + frameThick * 2;
    const outerHeight = height + frameThick * 2;
    const outerRadius = outerWidth / 2;
    
    const frame = new THREE.Shape();
    frame.moveTo(-outerWidth/2, -outerHeight/2);
    frame.lineTo(outerWidth/2, -outerHeight/2);
    frame.lineTo(outerWidth/2, outerHeight/2 - outerRadius);
    frame.absarc(0, outerHeight/2 - outerRadius, outerRadius, 0, Math.PI, false);
    frame.lineTo(-outerWidth/2, -outerHeight/2);
    
    const innerWidth = 1.94;
    const innerHeight = 2.94;
    const innerRadius = innerWidth / 2;

    const hole = new THREE.Path();
    hole.moveTo(-innerWidth/2, -innerHeight/2);
    hole.lineTo(innerWidth/2, -innerHeight/2);
    hole.lineTo(innerWidth/2, innerHeight/2 - innerRadius);
    hole.absarc(0, innerHeight/2 - innerRadius, innerRadius, 0, Math.PI, false);
    hole.lineTo(-innerWidth/2, -innerHeight/2);
    frame.holes.push(hole);

    return [shape, frame];
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      const isHovered = state.pointer.x !== 0 || state.pointer.y !== 0;
      const targetHover = isHovered ? 1 : 0;
      hoverState.current = THREE.MathUtils.lerp(hoverState.current, targetHover, delta * 2);
      materialRef.current.uniforms.uHoverState.value = hoverState.current;
    }
    
    if (groupRef.current) {
       // Gentle sway for the whole framed photo
       groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + (state.pointer.x * 0.1);
       groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.4) * 0.02 - (state.pointer.y * 0.1);
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

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015
  };

  return (
    <group ref={groupRef} scale={[scale, scale, 1]}>
      {/* 3D Gold Frame */}
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry args={[frameShape, extrudeSettings]} />
        <primitive object={goldMaterial} />
      </mesh>

      {/* The Liquid Photo */}
      <mesh position={[0, 0, 0.02]}>
        <shapeGeometry args={[archShape]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={liquidVertexShader}
          fragmentShader={liquidFragmentShader}
          uniforms={{
            uTexture: { value: texture },
            uTime: { value: 0 },
            uHover: { value: new THREE.Vector2(0.5, 0.5) },
            uHoverState: { value: 0 },
            uScaleX: { value: uScaleX },
            uScaleY: { value: uScaleY }
          }}
        />
      </mesh>
    </group>
  );
}

export default function LiquidPhoto({ src }: { src: string }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto cursor-pointer flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" penumbra={1} />
        <spotLight position={[-5, -5, 5]} intensity={1.5} color="#D4AF37" penumbra={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
            <ArchPhotoAndFrame src={src} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
