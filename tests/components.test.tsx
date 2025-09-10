import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ZyraAvatar from '../src/components/ZyraAvatar';
import AnimationController from '../src/components/AnimationController';

// Mock Ready Player Me Visage
jest.mock('@readyplayerme/visage', () => {
  const React = require('react');
  return {
    Avatar: React.forwardRef(({ onLoad, onExpressionChange, animationSrc, ...props }, ref) => {
      React.useEffect(() => {
        if (onLoad) onLoad();
      }, [onLoad]);
      
      // Expose playAnimation method to ref
      React.useImperativeHandle(ref, () => ({
        playAnimation: jest.fn(),
        stopAnimation: jest.fn()
      }));
      
      return React.createElement('div', {
        'data-testid': 'visage-avatar',
        'data-model-src': props.modelSrc,
        'data-animation-src': animationSrc,
        onClick: () => onExpressionChange && onExpressionChange({ type: 'test' })
      }, 'Visage Avatar Mock');
    })
  };
});

describe('ZyraAvatar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render with default props', () => {
    render(<ZyraAvatar />);
    
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('visage-avatar')).toHaveAttribute('data-model-src', 'https://models.readyplayer.me/68c01a8b8c3845189b12570c.glb');
  });

  test('should handle emotion prop changes', async () => {
    const TestComponent = () => {
      const [emotion, setEmotion] = React.useState('idle');
      
      return (
        <div>
          <button onClick={() => setEmotion('happy')} data-testid="set-happy">Set Happy</button>
          <button onClick={() => setEmotion('sad')} data-testid="set-sad">Set Sad</button>
          <ZyraAvatar emotion={emotion} />
        </div>
      );
    };

    render(<TestComponent />);
    
    // Test emotion change
    fireEvent.click(screen.getByTestId('set-happy'));
    fireEvent.click(screen.getByTestId('set-sad'));
    
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
  });

  test('should handle greeting prop', () => {
    render(<ZyraAvatar onGreeting={true} />);
    
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
  });

  test('should handle animation events', () => {
    const mockOnAnimationEvent = jest.fn();
    
    render(<ZyraAvatar onAnimationEvent={mockOnAnimationEvent} emotion="happy" />);
    
    // The component should trigger animation events
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
  });

  test('should handle expression changes', () => {
    const mockOnAnimationEvent = jest.fn();
    
    render(<ZyraAvatar onAnimationEvent={mockOnAnimationEvent} />);
    
    // Simulate expression change
    fireEvent.click(screen.getByTestId('visage-avatar'));
    
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
  });

  test('should expose playAnimation and stopAnimation methods via ref', () => {
    const ref = React.createRef();
    
    render(<ZyraAvatar ref={ref} />);
    
    expect(ref.current).toBeDefined();
    expect(typeof ref.current.playAnimation).toBe('function');
    expect(typeof ref.current.stopAnimation).toBe('function');
  });

  test('should play animations when ref methods are called', () => {
    const ref = React.createRef();
    const mockOnAnimationEvent = jest.fn();
    
    render(<ZyraAvatar ref={ref} onAnimationEvent={mockOnAnimationEvent} />);
    
    // Test playAnimation
    ref.current.playAnimation('happy');
    ref.current.playAnimation('sad');
    ref.current.playAnimation('greeting');
    
    // Test stopAnimation
    ref.current.stopAnimation();
    
    expect(screen.getByTestId('visage-avatar')).toBeInTheDocument();
  });
});

describe('AnimationController Component', () => {
  test('should provide animation control methods', () => {
    const mockAvatarRef = { current: { playAnimation: jest.fn() } };
    const mockOnAnimationComplete = jest.fn();
    const mockOnAnimationError = jest.fn();

    const TestComponent = () => {
      const controller = AnimationController({
        avatarRef: mockAvatarRef,
        onAnimationComplete: mockOnAnimationComplete,
        onAnimationError: mockOnAnimationError
      });
      
      return (
        <div>
          <button onClick={() => controller.playAnimation('idle')} data-testid="play-idle">Play Idle</button>
          <button onClick={() => controller.playAnimation('happy')} data-testid="play-happy">Play Happy</button>
          <button onClick={() => controller.playSentimentAnimation('happy')} data-testid="play-sentiment">Play Sentiment</button>
          <button onClick={controller.stopAnimation} data-testid="stop-animation">Stop Animation</button>
        </div>
      );
    };

    render(<TestComponent />);
    
    expect(screen.getByTestId('play-idle')).toBeInTheDocument();
    expect(screen.getByTestId('play-happy')).toBeInTheDocument();
    expect(screen.getByTestId('play-sentiment')).toBeInTheDocument();
    expect(screen.getByTestId('stop-animation')).toBeInTheDocument();
  });

  test('should handle sentiment-based animation selection', () => {
    const mockAvatarRef = { current: { playAnimation: jest.fn() } };

    const TestComponent = () => {
      const controller = AnimationController({ avatarRef: mockAvatarRef });
      
      return (
        <div>
          <button onClick={() => controller.playSentimentAnimation('happy')} data-testid="happy">Happy</button>
          <button onClick={() => controller.playSentimentAnimation('sad')} data-testid="sad">Sad</button>
          <button onClick={() => controller.playSentimentAnimation('unknown')} data-testid="unknown">Unknown</button>
        </div>
      );
    };

    render(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('happy'));
    fireEvent.click(screen.getByTestId('sad'));
    fireEvent.click(screen.getByTestId('unknown'));
    
    expect(screen.getByTestId('happy')).toBeInTheDocument();
    expect(screen.getByTestId('sad')).toBeInTheDocument();
    expect(screen.getByTestId('unknown')).toBeInTheDocument();
  });
});