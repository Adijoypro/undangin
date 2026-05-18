"use client";

import React, { useRef, useState, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  PerspectiveCamera, 
  Environment, 
  Float, 
  ContactShadows, 
  Text,
  PresentationControls,
  Sparkles
} from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function EnvelopeScene({ bride, groom, onComplete, isOpen, onOpen }: any) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const flapRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const sealRef = useRef<THREE.Group>(null);
  const envelopeGroupRef = useRef<THREE.Group>(null);
  
  const { viewport } = useThree();
  const animState = useRef('IDLE');
  const triggered = useRef(false);
  const finished = useRef(false);

  const responsiveScale = Math.min(1.2, viewport.width / 5.5);

  const extrudeSettings = useMemo(() => ({ 
    depth: 0.015, 
    bevelEnabled: true, 
    bevelSegments: 2, 
    steps: 1, 
    bevelSize: 0.005, 
    bevelThickness: 0.005 
  }), []);
  
  const sideFlapLeft = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2, 1.5);
    shape.lineTo(-2, -1.5);
    shape.lineTo(0, 0);
    shape.lineTo(-2, 1.5);
    return shape;
  }, []);

  const sideFlapRight = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(2, 1.5);
    shape.lineTo(2, -1.5);
    shape.lineTo(0, 0);
    shape.lineTo(2, 1.5);
    return shape;
  }, []);

  const bottomFlapShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2, -1.5); 
    shape.lineTo(2, -1.5);  
    shape.lineTo(0, 0.2); 
    shape.lineTo(-2, -1.5);
    return shape;
  }, []);

  const topFlapShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2, 0);   
    shape.lineTo(2, 0);    
    shape.lineTo(0, -1.7); 
    shape.lineTo(-2, 0);
    return shape;
  }, []);

  const paperMaterialProps = {
    roughness: 0.9,
    clearcoat: 0.1,
    clearcoatRoughness: 0.8,
    sheen: 0.4,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color("#D4AF37")
  };

  useEffect(() => {
    if (isOpen) {
      animState.current = 'OPENING_FLAP';
    }
  }, [isOpen]);

  useFrame((state, delta) => {
    // 1. Efek Parallax (Gyroscope/Mouse Hover)
    if (animState.current === 'IDLE' && envelopeGroupRef.current) {
      const targetX = (state.pointer.x * Math.PI) / 15;
      const targetY = (state.pointer.y * Math.PI) / 15;
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.damp(envelopeGroupRef.current.rotation.y, targetX, 3, delta);
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.damp(envelopeGroupRef.current.rotation.x, -targetY, 3, delta);
    } else if (envelopeGroupRef.current) {
      // Kembalikan ke posisi lurus saat mulai terbuka
      envelopeGroupRef.current.rotation.y = THREE.MathUtils.damp(envelopeGroupRef.current.rotation.y, 0, 4, delta);
      envelopeGroupRef.current.rotation.x = THREE.MathUtils.damp(envelopeGroupRef.current.rotation.x, 0, 4, delta);
    }

    if (animState.current === 'OPENING_FLAP' && flapRef.current) {
      flapRef.current.rotation.x = THREE.MathUtils.damp(flapRef.current.rotation.x, Math.PI, 3, delta);
      
      if (flapRef.current.rotation.x > Math.PI * 0.8) {
        animState.current = 'CARD_RISING';
      }
    }

    if (animState.current === 'CARD_RISING' && cardRef.current) {
      cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, 3.5, 2.5, delta);
      cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, 0.5, 2, delta); 
      
      if (cardRef.current.position.y > 3.0) {
        animState.current = 'CARD_FLOATING_TO_CAMERA';
      }
    }

    if (animState.current === 'CARD_FLOATING_TO_CAMERA') {
      if (cardRef.current && cameraRef.current) {
        // Hitung jarak ideal agar kartu menutupi lebar layar tapi teks tetap presisi
        const finalZ = Math.min(5.5, 3.8 / responsiveScale);
        cardRef.current.position.z = THREE.MathUtils.damp(cardRef.current.position.z, finalZ, 2.5, delta);
        cardRef.current.position.y = THREE.MathUtils.damp(cardRef.current.position.y, 0, 2.5, delta); 
        
        // Jaga kartu tetap lurus sempurna (0 rotasi) agar teks tajam dan tidak distorsi
        cardRef.current.rotation.y = THREE.MathUtils.damp(cardRef.current.rotation.y, 0, 3, delta);
        cardRef.current.rotation.z = THREE.MathUtils.damp(cardRef.current.rotation.z, 0, 3, delta);
        cardRef.current.rotation.x = THREE.MathUtils.damp(cardRef.current.rotation.x, 0, 3, delta);

        // Threshold diperbesar menjadi finalZ - 1.0 agar lebih cepat memicu animasi full screen dan nggak stuck
        if (cardRef.current.position.z > finalZ - 1.0 && !triggered.current) {
          triggered.current = true;
          animState.current = 'CARD_FILLING_SCREEN';
        }
      }
    } 
    
    if (animState.current === 'CARD_FILLING_SCREEN') {
      // Smooth fade background 3D dari hitam menjadi warna kertas undangan agar menyatu tanpa batas!
      if (!state.scene.background) {
        state.scene.background = new THREE.Color('#000000');
      }
      (state.scene.background as THREE.Color).lerp(new THREE.Color('#FDFBF7'), delta * 4);
      
      // Pastikan kartu berhenti dengan sempurna di tengah biar saat di-zoom nggak miring
      if (envelopeGroupRef.current) {
        envelopeGroupRef.current.position.y = THREE.MathUtils.lerp(envelopeGroupRef.current.position.y, 0, delta * 5);
      }
      
      // Zoom kamera secara dramatis agar kertas nutupin seluruh layar secara penuh
      if (cameraRef.current) {
        cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, 5, delta * 4);
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (cameraRef.current && cameraRef.current.fov < 8 && !finished.current) {
        finished.current = true;
        setTimeout(() => {
          onComplete();
        }, 100);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[0, 5, 8]} angle={0.4} penumbra={1} intensity={1.5} castShadow color="#ffffff" />
      <spotLight position={[-5, -2, 5]} angle={0.8} penumbra={1} intensity={2} color="#D4AF37" />
      
      {/* Lampu khusus untuk background biar dapet efek vignette biru mewah */}
      <pointLight position={[0, 0, -8]} intensity={8} color="#1A2B50" />
      
      <Suspense fallback={null}>
        <Environment preset="city" />

        {/* Partikel Debu Emas Melayang (Ditingkatkan) */}
        <Sparkles count={300} scale={20} size={3} speed={0.4} opacity={0.6} color="#D4AF37" position={[0, 0, -2]} />
        
        <PresentationControls 
          global 
          snap 
          polar={[-0.1, 0.1]} 
          azimuth={[-0.4, 0.4]}
          enabled={!isOpen}
        >
          <Float speed={isOpen ? 0 : 1.5} rotationIntensity={isOpen ? 0 : 0.2} floatIntensity={isOpen ? 0 : 0.2}>
            <group ref={envelopeGroupRef} scale={responsiveScale} position={[0, 0.15, 0]}>
              
              <mesh position={[0, 0, -0.1]} receiveShadow>
                <boxGeometry args={[4, 3, 0.02]} />
                <meshPhysicalMaterial color="#E8E5DF" {...paperMaterialProps} />
              </mesh>

              <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
                <extrudeGeometry args={[sideFlapLeft, extrudeSettings]} />
                <meshPhysicalMaterial color="#F4F1EB" {...paperMaterialProps} />
              </mesh>
              <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
                <extrudeGeometry args={[sideFlapRight, extrudeSettings]} />
                <meshPhysicalMaterial color="#F4F1EB" {...paperMaterialProps} />
              </mesh>

              <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
                <extrudeGeometry args={[bottomFlapShape, extrudeSettings]} />
                <meshPhysicalMaterial color="#FDFBF7" {...paperMaterialProps} />
              </mesh>

              <group ref={flapRef} position={[0, 1.5, 0.03]}>
                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                   <extrudeGeometry args={[topFlapShape, extrudeSettings]} />
                   <meshPhysicalMaterial color="#FFFFFF" {...paperMaterialProps} />
                </mesh>

                {/* Wax Seal Emas dengan Emboss Inisial */}
                <group
                  ref={sealRef}
                  position={[0, -1.4, 0.03]} 
                  onClick={!isOpen ? onOpen : undefined}
                  onPointerOver={() => { if(!isOpen) document.body.style.cursor = 'pointer'; }}
                  onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.08, 32]} />
                    <meshPhysicalMaterial 
                      color="#D4AF37" 
                      metalness={0.9} 
                      roughness={0.1} 
                      clearcoat={1}
                      clearcoatRoughness={0.1}
                    />
                  </mesh>
                  {/* Monogram Timbul (Dipisah agar & lebih kecil) */}
                  <group position={[0, 0, 0.05]}>
                    <Text
                      position={[-0.14, 0, 0]}
                      fontSize={0.25}
                      font="https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf"
                      color="#FFDF73"
                      anchorX="center"
                      anchorY="middle"
                      outlineWidth={0.005}
                      outlineColor="#8A6300"
                    >
                      {bride ? bride.charAt(0) : 'A'}
                    </Text>
                    <Text
                      position={[0, 0, 0]}
                      fontSize={0.14}
                      font="https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf"
                      color="#FFDF73"
                      anchorX="center"
                      anchorY="middle"
                      outlineWidth={0.003}
                      outlineColor="#8A6300"
                    >
                      &
                    </Text>
                    <Text
                      position={[0.14, 0, 0]}
                      fontSize={0.25}
                      font="https://raw.githubusercontent.com/google/fonts/main/ofl/greatvibes/GreatVibes-Regular.ttf"
                      color="#FFDF73"
                      anchorX="center"
                      anchorY="middle"
                      outlineWidth={0.005}
                      outlineColor="#8A6300"
                    >
                      {groom ? groom.charAt(0) : 'B'}
                    </Text>
                  </group>
                  
                  {/* Partikel Magic Burst (Hanya muncul saat amplop terbuka) */}
                  {isOpen && (
                    <Sparkles count={40} scale={2} size={4} speed={2} opacity={0.8} color="#FFDF73" />
                  )}
                </group>
              </group>

              {/* Kartu Undangan di Dalem */}
              <mesh ref={cardRef} position={[0, 0, -0.05]} castShadow>
                <boxGeometry args={[3.8, 2.8, 0.03]} />
                <meshPhysicalMaterial color="#FDFBF7" {...paperMaterialProps} />
                
                {/* 1. Bingkai Emas Kartu */}
                <group position={[0, 0, 0.02]}>
                  {/* Top */}
                  <mesh position={[0, 1.2, 0]}>
                    <planeGeometry args={[3.4, 0.02]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                  </mesh>
                  {/* Bottom */}
                  <mesh position={[0, -1.2, 0]}>
                    <planeGeometry args={[3.4, 0.02]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                  </mesh>
                  {/* Left */}
                  <mesh position={[-1.7, 0, 0]}>
                    <planeGeometry args={[0.02, 2.4]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                  </mesh>
                  {/* Right */}
                  <mesh position={[1.7, 0, 0]}>
                    <planeGeometry args={[0.02, 2.4]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
                  </mesh>

                  {/* Ornamen Diamond di Atas */}
                  <mesh position={[0, 1.2, 0.01]} rotation={[0, 0, Math.PI / 4]}>
                    <planeGeometry args={[0.1, 0.1]} />
                    <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
                  </mesh>
                </group>

                {/* 2. Tipografi Elegan */}
                <Text
                  position={[0, 0.7, 0.02]}
                  fontSize={0.08}
                  color="#888888"
                  letterSpacing={0.2}
                  anchorY="middle"
                >
                  UNDANGAN PERNIKAHAN
                </Text>

                <Text
                  position={[0, 0.2, 0.02]}
                  fontSize={0.35}
                  color="#D4AF37"
                  maxWidth={3.5}
                  textAlign="center"
                  anchorY="middle"
                >
                  {`${bride} & ${groom}`}
                </Text>

                {/* Divider Line */}
                <mesh position={[0, -0.3, 0.02]}>
                  <planeGeometry args={[1.5, 0.01]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.8} />
                </mesh>

                <Text
                  position={[0, -0.6, 0.02]}
                  fontSize={0.06}
                  color="#555555"
                  letterSpacing={0.1}
                  maxWidth={2.8}
                  textAlign="center"
                  anchorY="middle"
                >
                  KAMI BERHARAP KEHADIRAN ANDA DI HARI BAHAGIA KAMI
                </Text>
              </mesh>
            </group>
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={15} blur={2.5} far={4} />

      </Suspense>
    </>
  );
}

function ThreeDEnvelope({ onComplete, bride, groom }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="w-full h-screen bg-[#02040A] relative overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <EnvelopeScene 
          bride={bride} 
          groom={groom} 
          isOpen={isOpen} 
          onComplete={onComplete}
          onOpen={handleOpen}
        />
      </Canvas>

      {!isOpen && (
        <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-end pointer-events-none z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="text-center pointer-events-auto cursor-pointer flex flex-col items-center group relative z-10"
            onClick={handleOpen}
          >
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] mb-2 font-light">
              Undangan Eksklusif
            </p>
            <h2 
              className="text-white text-3xl font-serif mb-4 tracking-wide animate-pulse" 
              style={{ textShadow: '0 0 12px rgba(212, 175, 55, 0.6), 0 0 2px rgba(255, 255, 255, 0.8)' }}
            >
              {bride} & {groom}
            </h2>
            <div className="flex items-center gap-3 text-white/60 text-[9px] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors duration-500">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/30 group-hover:to-[#D4AF37]/50"></span>
              <span>Sentuh amplop untuk membuka</span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/30 group-hover:to-[#D4AF37]/50"></span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default ThreeDEnvelope;
