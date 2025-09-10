import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import useAnimationManager from '../hooks/AnimationManager';

// Cyberpunk environment with holographic effects
const CyberpunkEnvironment = () => {
  return (
    <>
      <Environment
        background={false}
        environmentIntensity={0.4}
        preset="night"
      />
      {/* Subtle floating particles instead of rings */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 6,
            Math.random() * 3 + 0.5,
            (Math.random() - 0.5) * 6
          ]}
        >
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial 
            color={['#ff00ff', '#00ffff', '#8b5cf6'][i % 3]} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
    </>
  );
};

// Avatar component with enhanced animations
const Avatar = ({ onGreeting, emotion = 'idle', onAnimationEvent }) => {
  // Animation paths configuration
  const animationPaths = {
    idle: '/avatars/avatar movements/idle.glb',
    sad: '/avatars/avatar movements/sad.glb',
    happy_dance: '/avatars/avatar movements/happy_dance.glb'
  };

  // Initialize animation manager
  const animationManager = useAnimationManager('/avatars/incrypt_ai_avatar.glb', animationPaths);
  
  const groupRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const [isWaving, setIsWaving] = React.useState(false);
  const [isIdle, setIsIdle] = React.useState(true);
  const [cameraAdjusted, setCameraAdjusted] = React.useState(false);

  // Enhanced animation system with GLB animations
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Update animation mixer
    if (animationManager.mixer) {
      animationManager.mixer.update(delta);
    }
    
    // Procedural animations for when GLB animations aren't available
    if (!animationManager.isLoaded || !animationManager.loadedAnimations.idle) {
      // Breathing animation - more realistic chest movement
      if (bodyRef.current) {
        bodyRef.current.scale.y = 1 + Math.sin(time * 1.2) * 0.02;
        bodyRef.current.scale.x = 1 + Math.sin(time * 1.2 + Math.PI/2) * 0.01;
      }
      
      // Head movement - subtle looking around
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.4) * 0.1;
        headRef.current.rotation.x = Math.sin(time * 0.6) * 0.05;
      }
      
      // Body sway - more natural movement
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.08;
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.03;
      
      // Occasional head nod or shake
      if (Math.random() < 0.001) {
        if (headRef.current) {
          headRef.current.rotation.x = Math.sin(time * 20) * 0.2;
        }
      }
    }
    
    // Wave animation when greeting
    if (isWaving && headRef.current && !animationManager.isLoaded) {
      headRef.current.rotation.z = Math.sin(time * 8) * 0.3;
      headRef.current.rotation.y = Math.sin(time * 6) * 0.2;
    }
  });

  // Trigger animations based on emotion and greeting
  useEffect(() => {
    if (onGreeting) {
      setIsWaving(true);
      animationManager.playIdle();
      const timer = setTimeout(() => setIsWaving(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [onGreeting]);

  // Handle emotion changes
  useEffect(() => {
    if (emotion && emotion !== 'idle') {
      animationManager.playSentimentAnimation(emotion);
    } else if (emotion === 'idle') {
      animationManager.playIdle();
    }
  }, [emotion]);

  // Initialize with idle animation when loaded
  useEffect(() => {
    if (animationManager.isLoaded) {
      animationManager.playIdle();
    }
  }, [animationManager.isLoaded]);

  // Add some random idle behaviors
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setIsIdle(false);
        setTimeout(() => setIsIdle(true), 2000);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Ensure materials are opaque when model loads
  useEffect(() => {
    if (animationManager.baseModel) {
      animationManager.baseModel.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.transparent = false;
              mat.opacity = 1.0;
              mat.needsUpdate = true;
            });
          } else {
            child.material.transparent = false;
            child.material.opacity = 1.0;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [animationManager.baseModel]);

  // Dynamic camera fitting when model loads
  useEffect(() => {
    if (animationManager.baseModel && groupRef.current && !cameraAdjusted) {
      const box = new THREE.Box3().setFromObject(animationManager.baseModel);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Calculate the distance needed to fit the entire avatar
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = 50 * (Math.PI / 180);
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.2; // Add 20% padding
      
      // Position avatar so feet align with bottom of container and head is fully visible
      // Move avatar down so feet are at the very bottom edge, with maximum space for head
      groupRef.current.position.set(-center.x, -center.y - size.y * 0.45, -center.z); // Move feet further down
      groupRef.current.scale.setScalar(0.6); // Smaller scale to ensure full head visibility
      
      setCameraAdjusted(true);
    }
  }, [animationManager.baseModel, cameraAdjusted]);

  return (
    <group ref={groupRef}>
      <group ref={bodyRef}>
        {animationManager.baseModel && (
          <primitive 
            object={animationManager.baseModel} 
            onUpdate={(self) => {
              // Ensure materials are opaque and properly lit
              self.traverse((child) => {
                if (child.isMesh && child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                      mat.transparent = false;
                      mat.opacity = 1.0;
                      mat.needsUpdate = true;
                    });
                  } else {
                    child.material.transparent = false;
                    child.material.opacity = 1.0;
                    child.material.needsUpdate = true;
                  }
                }
              });
            }}
          />
        )}
      </group>
      {/* Head reference for more detailed animations */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        {/* Invisible helper for head animations */}
      </group>
    </group>
  );
};

// Loading fallback
const AvatarLoader = () => (
  <mesh>
    <boxGeometry args={[1, 2, 0.5]} />
    <meshStandardMaterial color="#6366f1" wireframe />
  </mesh>
);

// Main Avatar3D component
const Avatar3D = ({ onGreeting = false, className = "", emotion = 'idle', onAnimationEvent }) => {
  const [dimensions, setDimensions] = React.useState({ width: 280, height: 400 });

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.ai-companion');
      if (container) {
        const rect = container.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ 
          position: [0, 0.5, 2.5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ 
          background: 'transparent',
          filter: 'drop-shadow(0 0 22px rgba(255,0,204,0.22)) drop-shadow(0 0 18px rgba(0,255,255,0.18))'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          clearColor: 0x000000,
          clearAlpha: 0
        }}
      >
        {/* Enhanced cyberpunk lighting setup */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={2.0}
          color="#ffffff"
          castShadow
        />
        <directionalLight 
          position={[-5, 5, -5]} 
          intensity={1.2}
          color="#8b5cf6"
        />
        <pointLight 
          position={[0, 3, 2]} 
          intensity={1.0}
          color="#f59e0b"
        />
        <pointLight 
          position={[2, 1, 1]} 
          intensity={0.8}
          color="#ff00ff"
        />

        {/* Environment */}
        <CyberpunkEnvironment />

        {/* Avatar with enhanced controls */}
        <Suspense fallback={<AvatarLoader />}>
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <Avatar onGreeting={onGreeting} emotion={emotion} onAnimationEvent={onAnimationEvent} />
          </PresentationControls>
        </Suspense>

        {/* Enhanced orbit controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          autoRotate={false}
          rotateSpeed={0.3}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default Avatar3D;
