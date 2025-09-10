import React, { useRef, useEffect, useState } from 'react';

/**
 * AnimationController - Manages Ready Player Me animation ID mapping and timing
 * Provides consistent animation handling across components
 */
class AnimationController {
  constructor() {
    // Ready Player Me animation library IDs (hyphenated format)
    this.animationIds = {
      idle: 'idle-loop',
      happy: 'victory-dance',
      sad: 'sad-pose',
      greeting: 'wave',
      excited: 'victory-dance', // Use victory-dance for excited
      fun: 'victory-dance',     // Use victory-dance for fun
      walking: 'idle-loop'      // Use idle-loop for walking
    };

    // Animation durations in milliseconds
    this.animationDurations = {
      'idle-loop': 0,      // Loop indefinitely
      'wave': 2000,        // 2 seconds
      'victory-dance': 3000, // 3 seconds
      'sad-pose': 2500     // 2.5 seconds
    };
  }

  /**
   * Get the RPM animation ID for a given emotion
   * @param {string} emotion - The emotion name
   * @returns {string} The RPM animation ID
   */
  getAnimationId(emotion) {
    return this.animationIds[emotion] || 'idle-loop';
  }

  /**
   * Get the duration for an animation
   * @param {string} animationId - The animation ID
   * @returns {number} Duration in milliseconds
   */
  getAnimationDuration(animationId) {
    return this.animationDurations[animationId] || 2000;
  }

  /**
   * Check if an animation should loop
   * @param {string} animationId - The animation ID
   * @returns {boolean} Whether the animation should loop
   */
  shouldLoop(animationId) {
    return animationId === 'idle-loop';
  }

  /**
   * Get all available emotions
   * @returns {string[]} Array of emotion names
   */
  getAvailableEmotions() {
    return Object.keys(this.animationIds);
  }

  /**
   * Validate if an emotion is supported
   * @param {string} emotion - The emotion to validate
   * @returns {boolean} Whether the emotion is supported
   */
  isValidEmotion(emotion) {
    return emotion in this.animationIds;
  }
}

// Create singleton instance
const animationController = new AnimationController();

/**
 * Hook for using the AnimationController
 * @returns {AnimationController} The animation controller instance
 */
export const useAnimationController = () => {
  return animationController;
};

/**
 * Hook for managing animation state
 * @param {Object} options - Configuration options
 * @returns {Object} Animation state and methods
 */
export const useAnimationState = (options = {}) => {
  const {
    initialEmotion = 'idle',
    autoReturnToIdle = true,
    returnDelay = 2000
  } = options;

  const [currentEmotion, setCurrentEmotion] = useState(initialEmotion);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mixerReady, setMixerReady] = useState(false);

  const playAnimation = (emotion, mixer) => {
    if (!mixer || !mixerReady) {
      console.warn('🎭 Mixer not ready for animation');
      return;
    }

    const animationId = animationController.getAnimationId(emotion);
    const duration = animationController.getAnimationDuration(animationId);

    try {
      const clipAction = mixer.clipAction(animationId);
      if (clipAction) {
        clipAction.reset().play();
        setCurrentEmotion(emotion);
        setIsAnimating(true);
        
        console.log(`🎭 Playing ${emotion} animation (${animationId})`);

        // Auto-return to idle if configured
        if (autoReturnToIdle && emotion !== 'idle' && duration > 0) {
          setTimeout(() => {
            const idleClip = mixer.clipAction('idle-loop');
            if (idleClip) {
              idleClip.reset().play();
              setCurrentEmotion('idle');
              setIsAnimating(false);
              console.log('🎭 Returned to idle animation');
            }
          }, duration);
        }
      } else {
        console.warn(`🎭 Animation clip '${animationId}' not found`);
      }
    } catch (error) {
      console.error(`🎭 Error playing animation ${emotion}:`, error);
    }
  };

  const setMixer = (mixer) => {
    if (mixer) {
      setMixerReady(true);
      console.log('🎭 Animation mixer ready');
    }
  };

  return {
    currentEmotion,
    isAnimating,
    mixerReady,
    playAnimation,
    setMixer,
    animationController
  };
};

export default animationController;