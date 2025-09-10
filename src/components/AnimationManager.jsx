import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer } from 'three';

/**
 * AnimationManager - Manages local RPM GLB animations using Three.js Fiber/Drei
 * Loads animation clips from local GLB files and provides centralized animation control
 */
const AnimationManager = ({ 
  avatarRef, 
  onAnimationReady, 
  onAnimationEvent,
  className = "w-full h-full" 
}) => {
  const mixerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);

  // Local GLB file paths for RPM animations
  const animationPaths = useMemo(() => ({
    idle: '/avatars/rpm-animations/animation-library-master/masculine/glb/idle/M_Standing_Idle_001.glb',
    dance: '/avatars/rpm-animations/animation-library-master/masculine/glb/dance/M_Dances_001.glb',
    expression: '/avatars/rpm-animations/animation-library-master/masculine/glb/expression/M_Standing_Expressions_001.glb',
    // Fallback to custom animations if available
    greeting: '/avatars/rpm-animations/greeting.glb',
    sad: '/avatars/rpm-animations/sad_pose.glb',
    victory: '/avatars/rpm-animations/rumba.glb'
  }), []);

  // Load idle animation as default
  const { scene: idleScene, animations: idleAnimations } = useGLTF(animationPaths.idle);
  
  // Load dance animation for happy/victory
  const { scene: danceScene, animations: danceAnimations } = useGLTF(animationPaths.dance);
  
  // Load expression animation for sad
  const { scene: expressionScene, animations: expressionAnimations } = useGLTF(animationPaths.expression);

  // Initialize mixer when avatar is ready
  useEffect(() => {
    if (avatarRef.current && idleAnimations.length > 0) {
      console.log('🎭 Initializing AnimationManager with mixer');
      
      mixerRef.current = new AnimationMixer(avatarRef.current);
      
      // Start with idle animation
      const idleClip = idleAnimations[0];
      if (idleClip) {
        const idleAction = mixerRef.current.clipAction(idleClip);
        idleAction.reset().play();
        setCurrentAnimation('idle');
        console.log(`🎭 Started idle animation: ${idleClip.name}`);
      }
      
      setIsReady(true);
      
      if (onAnimationReady) {
        onAnimationReady(mixerRef.current);
      }
    }
  }, [avatarRef, idleAnimations, onAnimationReady]);

  // Animation control methods
  const playAnimation = (animationType) => {
    if (!mixerRef.current || !isReady) {
      console.warn('🎭 AnimationManager not ready');
      return;
    }

    console.log(`🎭 Playing ${animationType} animation`);

    let targetAnimations = [];
    let clipName = '';

    switch (animationType) {
      case 'idle':
        targetAnimations = idleAnimations;
        clipName = 'idle';
        break;
      case 'happy':
      case 'victory':
      case 'dance':
        targetAnimations = danceAnimations;
        clipName = 'dance';
        break;
      case 'sad':
      case 'expression':
        targetAnimations = expressionAnimations;
        clipName = 'expression';
        break;
      default:
        console.warn(`🎭 Unknown animation type: ${animationType}`);
        return;
    }

    if (targetAnimations.length > 0) {
      // Stop current animation
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }

      // Play new animation
      const clip = targetAnimations[0];
      const action = mixerRef.current.clipAction(clip);
      action.reset().play();
      setCurrentAnimation(animationType);

      console.log(`🎭 Successfully playing ${animationType} animation: ${clip.name}`);

      // Auto-return to idle after animation (except for idle itself)
      if (animationType !== 'idle') {
        setTimeout(() => {
          if (mixerRef.current && idleAnimations.length > 0) {
            const idleAction = mixerRef.current.clipAction(idleAnimations[0]);
            idleAction.reset().play();
            setCurrentAnimation('idle');
            console.log('🎭 Returned to idle animation');
          }
        }, 3000); // 3 second timeout
      }

      // Trigger animation event callback
      if (onAnimationEvent) {
        onAnimationEvent(animationType);
      }
    } else {
      console.warn(`🎭 No animations found for type: ${animationType}`);
    }
  };

  // Expose methods to parent component
  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.playAnimation = playAnimation;
      avatarRef.current.stopAnimation = () => playAnimation('idle');
      avatarRef.current.isReady = isReady;
    }
  }, [avatarRef, isReady]);

  // Animation loop
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      if (mixerRef.current) {
        mixerRef.current.update(0.016); // ~60fps
      }
      animationId = requestAnimationFrame(animate);
    };
    
    if (isReady) {
      animate();
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isReady]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);

  return (
    <group>
      {/* Hidden scenes to keep them loaded */}
      <primitive object={idleScene} visible={false} />
      <primitive object={danceScene} visible={false} />
      <primitive object={expressionScene} visible={false} />
    </group>
  );
};

export default AnimationManager;
