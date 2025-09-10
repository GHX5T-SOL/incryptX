import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { AnimationMixer, Clock } from 'three';

// Avatar Model Component
const AvatarModel = ({ mixerRef, actionsRef, onAnimationReady }) => {
  const modelRef = useRef();
  
  // Load the base avatar model
  const { scene, animations } = useGLTF('https://models.readyplayer.me/68c01a8b8c3845189b12570c.glb');
  
  // Load individual animation clips with exact names from inspection
  const { animations: idleAnimations } = useGLTF('/avatars/rpm-animations/animation-library-master/masculine/glb/idle/M_Standing_Idle_001.glb');
  const { animations: danceAnimations } = useGLTF('/avatars/rpm-animations/animation-library-master/masculine/glb/dance/M_Dances_001.glb');
  const { animations: expressionAnimations } = useGLTF('/avatars/rpm-animations/animation-library-master/masculine/glb/expression/M_Standing_Expressions_001.glb');

  useEffect(() => {
    if (modelRef.current && animations.length > 0) {
      // Create mixer for the model
      const mixer = new AnimationMixer(modelRef.current);
      mixerRef.current = mixer;
      
      // Create actions for all animations
      const actions = {};
      
      // Add base model animations
      animations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });
      
      // Add idle animations
      idleAnimations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });
      
      // Add dance animations  
      danceAnimations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });
      
      // Add expression animations
      expressionAnimations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
      });
      
      actionsRef.current = actions;
      
      // Start with idle animation
      if (actions['M_Standing_Idle_001']) {
        actions['M_Standing_Idle_001'].play();
        console.log('🎭 Started idle animation: M_Standing_Idle_001');
      }
      
      onAnimationReady(mixer, actions);
      console.log('🎭 Avatar model loaded with animations:', Object.keys(actions));
    }
  }, [animations, idleAnimations, danceAnimations, expressionAnimations, mixerRef, actionsRef, onAnimationReady]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return <primitive ref={modelRef} object={scene} scale={[1, 1, 1]} position={[-0.3, -1.0, 0]} />;
};

const ZyraAvatar = forwardRef(({
  emotion = 'idle',
  onGreeting,
  onAnimationEvent,
  className = '',
  style = {}
}, ref) => {
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('idle');

  // Animation mapping with exact clip names from inspection
  const animationClips = {
    idle: 'M_Standing_Idle_001',
    happy: 'M_Dances_001', 
    sad: 'M_Standing_Expressions_001',
    greeting: 'M_Dances_001' // Using dance for greeting
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    playAnimation: (animationName) => {
      console.log(`🎭 Playing ${animationName} animation`);

      if (mixerRef.current && actionsRef.current) {
        setCurrentEmotion(animationName);

        const clipName = animationClips[animationName] || animationClips.idle;
        
        try {
          const action = actionsRef.current[clipName];
          if (action) {
            // Stop all other animations
            Object.values(actionsRef.current).forEach(a => a.stop());
            
            // Play the requested animation
            action.reset().play();
            console.log(`🎭 Successfully playing ${animationName} animation (${clipName})`);
            
            // Auto-return to idle after animation (except for idle itself)
            if (animationName !== 'idle') {
              setTimeout(() => {
                if (mixerRef.current && actionsRef.current) {
                  const idleAction = actionsRef.current[animationClips.idle];
                  if (idleAction) {
                    Object.values(actionsRef.current).forEach(a => a.stop());
                    idleAction.reset().play();
                    console.log('🎭 Returned to idle animation');
                  }
                }
              }, 3000); // 3 seconds for dance animations
            }
          } else {
            console.warn(`🎭 Animation clip '${clipName}' not found in actions`);
          }
        } catch (error) {
          console.error(`🎭 Error playing animation ${animationName}:`, error);
        }

        // Trigger animation event callback
        if (onAnimationEvent) {
          onAnimationEvent(animationName);
        }
      } else {
        console.warn(`🎭 Mixer not available for animation '${animationName}'`);
      }
    },
    stopAnimation: () => {
      console.log('🎭 Stopping animation');
      setCurrentEmotion('idle');
      
      if (mixerRef.current && actionsRef.current) {
        try {
          Object.values(actionsRef.current).forEach(action => action.stop());
          const idleAction = actionsRef.current[animationClips.idle];
          if (idleAction) {
            idleAction.reset().play();
          }
        } catch (error) {
          console.error('🎭 Error stopping animation:', error);
        }
      }
    }
  }));

  // Handle animation ready
  const handleAnimationReady = (mixer, actions) => {
    console.log('🎭 Animation system ready');
    setIsLoaded(true);
    
    // Play greeting animation if requested
    if (onGreeting) {
      console.log('🎭 Playing greeting animation on load');
      setTimeout(() => {
        const greetingAction = actions[animationClips.greeting];
        if (greetingAction) {
          Object.values(actions).forEach(a => a.stop());
          greetingAction.reset().play();
          console.log('🎭 Started greeting animation');
        }
      }, 1000); // Wait 1 second for model to be ready
    }
  };

  // Handle emotion changes
  useEffect(() => {
    if (isLoaded && emotion && emotion !== currentEmotion && mixerRef.current && actionsRef.current) {
      console.log(`🎭 Emotion changed to: ${emotion}`);
      
      const clipName = animationClips[emotion] || animationClips.idle;
      const action = actionsRef.current[clipName];
      
      if (action) {
        Object.values(actionsRef.current).forEach(a => a.stop());
        action.reset().play();
        console.log(`🎭 Started ${emotion} animation (${clipName})`);
        setCurrentEmotion(emotion);
      }

      if (onAnimationEvent) {
        onAnimationEvent(emotion);
      }
    }
  }, [emotion, isLoaded, currentEmotion, onAnimationEvent]);

  // Handle greeting
  useEffect(() => {
    if (onGreeting && isLoaded && currentEmotion !== 'greeting' && mixerRef.current && actionsRef.current) {
      console.log('🎭 Playing greeting animation');
      
      const greetingAction = actionsRef.current[animationClips.greeting];
      if (greetingAction) {
        Object.values(actionsRef.current).forEach(a => a.stop());
        greetingAction.reset().play();
        console.log('🎭 Started greeting animation');
        setCurrentEmotion('greeting');
      }

      if (onAnimationEvent) {
        onAnimationEvent('greeting');
      }
    }
  }, [onGreeting, isLoaded, currentEmotion, onAnimationEvent]);

  return (
    <div className={`relative ${className}`} style={style}>
      <Canvas
        camera={{ position: [0, 0.8, 2.5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <AvatarModel
          mixerRef={mixerRef}
          actionsRef={actionsRef}
          onAnimationReady={handleAnimationReady}
        />

        <Environment preset="studio" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
});

ZyraAvatar.displayName = 'ZyraAvatar';

export default ZyraAvatar;