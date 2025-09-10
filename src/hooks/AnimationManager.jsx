import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * AnimationManager Hook for Zyra Avatar
 * Manages loading and playing multiple GLB animation clips
 * 
 * @param {string} baseModelPath - Path to base avatar GLB
 * @param {Object} animationPaths - Object with animation names as keys and paths as values
 * @returns {Object} Animation manager with methods to control animations
 */
const useAnimationManager = (baseModelPath = '/avatars/incrypt_ai_avatar.glb', animationPaths = {}) => {
  const mixerRef = useRef(null);
  const currentActionRef = useRef(null);
  const baseModelRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedAnimations, setLoadedAnimations] = useState({});

  // Load base model
  const baseModel = useGLTF(baseModelPath);

  // Load animation clips with error handling
  const animationClips = {};
  Object.entries(animationPaths).forEach(([name, path]) => {
    try {
      animationClips[name] = useGLTF(path);
    } catch (error) {
      console.warn(`Failed to load animation ${name} from ${path}:`, error);
      // Create a fallback empty animation clip
      animationClips[name] = { animations: [] };
    }
  });

  // Debug: Log base model loading
  console.log('🎭 Base model path:', baseModelPath);
  console.log('🎭 Base model loaded:', baseModel);
  console.log('🎭 Base model scene:', baseModel.scene);
  console.log('🎭 Base model animations:', baseModel.animations);

  // Initialize mixer and animations when base model loads
  useEffect(() => {
    if (baseModel.scene && !mixerRef.current) {
      baseModelRef.current = baseModel.scene;
      mixerRef.current = new THREE.AnimationMixer(baseModel.scene);
      
      // Debug: Log base model info
      console.log('🎭 Base model loaded:', baseModel.scene);
      console.log('🎭 Base model animations:', baseModel.animations);
      
      // Load animations from clips with skeleton compatibility check
      const animations = {};
      Object.entries(animationClips).forEach(([name, clipData]) => {
        if (clipData.animations && clipData.animations.length > 0) {
          const clip = clipData.animations[0];
          console.log(`🎬 Processing animation '${name}':`, clip);
          
          // Check if the animation clip is compatible with the base model
          const isCompatible = checkSkeletonCompatibility(baseModel.scene, clip);
          
          if (isCompatible) {
            const action = mixerRef.current.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.setEffectiveWeight(1.0);
            animations[name] = action;
            console.log(`✅ Animation '${name}' loaded successfully`);
          } else {
            console.warn(`⚠️ Animation '${name}' has skeleton mismatch - using fallback`);
          }
        } else {
          console.warn(`❌ No animations found in '${name}' clip data:`, clipData);
        }
      });

      setLoadedAnimations(animations);
      setIsLoaded(true);
    }
  }, [baseModel.scene, animationClips]);

  // Check if animation clip is compatible with the base model skeleton
  const checkSkeletonCompatibility = (model, clip) => {
    if (!model || !clip) return false;
    
    // Get bone names from the model
    const modelBones = new Set();
    model.traverse((child) => {
      if (child.isBone) {
        modelBones.add(child.name);
      }
    });
    
    // Debug: Log available bones and animation tracks (only once)
    if (modelBones.size > 0 && !window.bonesLogged) {
      console.log('🔍 Available bones in base model:', Array.from(modelBones).sort());
      window.bonesLogged = true;
    }
    
    // Get animation track names
    const animationTracks = clip.tracks || [];
    const trackBones = new Set();
    animationTracks.forEach(track => {
      const boneName = track.name.split('.')[0];
      trackBones.add(boneName);
    });
    
    // Debug: Log animation track bones
    if (trackBones.size > 0 && !window.trackBonesLogged) {
      console.log('🎬 Animation track bones:', Array.from(trackBones).sort());
      window.trackBonesLogged = true;
    }
    
    // Check if animation tracks reference bones that exist in the model
    const hasCompatibleTracks = animationTracks.some(track => {
      const boneName = track.name.split('.')[0]; // Extract bone name from track name
      return modelBones.has(boneName);
    });
    
    // Debug: Log compatibility result
    if (!hasCompatibleTracks && animationTracks.length > 0) {
      console.warn(`❌ Skeleton mismatch detected for animation '${clip.name || 'unnamed'}'`);
      console.log('Model bones:', Array.from(modelBones));
      console.log('Track bones:', Array.from(trackBones));
    }
    
    return hasCompatibleTracks;
  };

  // Animation control methods
  const playIdle = () => {
    if (loadedAnimations.idle) {
      crossfadeToAction(loadedAnimations.idle, 0.5);
    } else {
      // Fallback: procedural idle animation
      console.log('No idle animation loaded, using procedural animation');
    }
  };

  const playEventClip = (clipName, loop = false, duration = 0.5) => {
    const action = loadedAnimations[clipName];
    if (action) {
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
      crossfadeToAction(action, duration);
      
      // Auto-return to idle after non-looping animations
      if (!loop) {
        action.clampWhenFinished = true;
        action.addEventListener('finished', () => {
          playIdle();
        });
      }
    } else {
      console.warn(`Animation clip '${clipName}' not found`);
    }
  };

  const crossfadeToAction = (targetAction, duration = 0.5) => {
    if (!mixerRef.current) return;

    const currentAction = currentActionRef.current;
    
    if (currentAction === targetAction) return;

    // Fade out current action
    if (currentAction) {
      currentAction.fadeOut(duration);
    }

    // Fade in target action
    targetAction.reset();
    targetAction.fadeIn(duration);
    targetAction.play();

    currentActionRef.current = targetAction;
  };

  const playGreeting = () => {
    playIdle(); // Use idle as greeting since we don't have a separate greeting animation
  };

  const playCelebration = () => {
    playEventClip('happy_dance', false, 0.4);
  };

  const playWalking = () => {
    playEventClip('walking', true, 0.3);
  };

  const playSad = () => {
    playEventClip('sad', false, 0.5);
  };

  const playExcited = () => {
    playEventClip('jump', false, 0.3);
  };

  const playFun = () => {
    playEventClip('gangnam_style', false, 0.4);
  };

  const playSamba = () => {
    playEventClip('samba_dancing', false, 0.4);
  };

  const playBackflip = () => {
    playEventClip('backflip', false, 0.3);
  };

  const playLeftTurn = () => {
    playEventClip('left_turn', false, 0.3);
  };

  const playRightTurn = () => {
    playEventClip('right_turn', false, 0.3);
  };

  const playRightStrafe = () => {
    playEventClip('right_strafe', true, 0.3);
  };

  // Sentiment-based animation selection
  const playSentimentAnimation = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'happy':
      case 'success':
      case 'celebration':
        playCelebration();
        break;
      case 'sad':
      case 'loss':
      case 'disappointed':
        playSad();
        break;
      case 'excited':
      case 'thrilled':
        playExcited();
        break;
      case 'fun':
      case 'playful':
        playFun();
        break;
      case 'dance':
      case 'samba':
        playSamba();
        break;
      case 'acrobatic':
      case 'backflip':
        playBackflip();
        break;
      case 'turn_left':
        playLeftTurn();
        break;
      case 'turn_right':
        playRightTurn();
        break;
      case 'strafe':
        playRightStrafe();
        break;
      case 'greeting':
      case 'hello':
        playGreeting();
        break;
      case 'walking':
      case 'moving':
        playWalking();
        break;
      default:
        playIdle();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, []);

  return {
    isLoaded,
    loadedAnimations,
    mixer: mixerRef.current,
    baseModel: baseModelRef.current,
    playIdle,
    playEventClip,
    playGreeting,
    playCelebration,
    playWalking,
    playSad,
    playExcited,
    playFun,
    playSamba,
    playBackflip,
    playLeftTurn,
    playRightTurn,
    playRightStrafe,
    playSentimentAnimation,
    crossfadeToAction
  };
};

export default useAnimationManager;
