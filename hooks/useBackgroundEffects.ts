import { useState, useRef, useCallback, useEffect } from 'react';
import NeuralNetworkEffect from '@/components/background-effects/NeuralNetworkEffect';
import MinimalEffect from '@/components/background-effects/MinimalEffect';

export interface BackgroundEffectOption {
  value: string;
  label: string;
  description: string;
}

export const backgroundEffectOptions: BackgroundEffectOption[] = [
  { value: 'random-cycle', label: 'Random Cycle', description: 'Automatically cycles through effects every 3-5 minutes' },
  { value: 'neural-network', label: 'Neural Network', description: 'Animated particle connections suggesting AI networks' },
  { value: 'minimal', label: 'Minimal', description: 'Clean solid/gradient background only' },
  { value: 'off', label: 'Off', description: 'Static background with no effects' }
];

export function useBackgroundEffects() {
  const [EFFECTS_ENABLED, setEffectsEnabled] = useState(true);
  const [currentEffect, setCurrentEffect] = useState('random-cycle');
  const [activeEffectInstance, setActiveEffectInstance] = useState<NeuralNetworkEffect | MinimalEffect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectContainerRef = useRef<HTMLDivElement>(null);

  const createEffect = useCallback((effectType: string, container: HTMLDivElement) => {
    switch (effectType) {
      case 'neural-network':
        return new NeuralNetworkEffect(container);
      case 'minimal':
        return new MinimalEffect(container);
      case 'off':
        return null;
      default:
        return new MinimalEffect(container);
    }
  }, []);

  const getRandomEffect = useCallback(() => {
    return 'neural-network';
  }, []);

  const transitionToEffect = useCallback(async (newEffectType: string) => {
    if (isTransitioning) return;
    if (!EFFECTS_ENABLED && newEffectType !== 'off') return;
    
    setIsTransitioning(true);
    
    if (effectContainerRef.current) {
      effectContainerRef.current.style.opacity = '0';
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (activeEffectInstance) {
      activeEffectInstance.stop();
      setActiveEffectInstance(null);
    }
    
    if (newEffectType !== 'off' && effectContainerRef.current) {
      const newEffect = createEffect(newEffectType, effectContainerRef.current);
      if (newEffect) {
        newEffect.start();
        setActiveEffectInstance(newEffect);
      }
    }
    
    if (effectContainerRef.current) {
      effectContainerRef.current.style.opacity = EFFECTS_ENABLED && newEffectType !== 'off' ? '1' : '0';
    }
    
    setIsTransitioning(false);
  }, [isTransitioning, EFFECTS_ENABLED, activeEffectInstance, createEffect]);

  const startRandomCycle = useCallback(() => {
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
    }
    
    cycleTimerRef.current = setInterval(() => {
      if (currentEffect === 'random-cycle' && EFFECTS_ENABLED) {
        const randomEffect = getRandomEffect();
        transitionToEffect(randomEffect);
      }
    }, 30000);
  }, [currentEffect, EFFECTS_ENABLED, getRandomEffect, transitionToEffect]);

  const handleEffectChange = useCallback((effectValue: string) => {
    setCurrentEffect(effectValue);
    
    if (cycleTimerRef.current) {
      clearInterval(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
    
    if (effectValue === 'random-cycle') {
      const randomEffect = getRandomEffect();
      transitionToEffect(randomEffect);
      startRandomCycle();
    } else {
      transitionToEffect(effectValue);
    }
  }, [getRandomEffect, transitionToEffect, startRandomCycle]);

  useEffect(() => {
    if (effectContainerRef.current) {
      const effectToStart = currentEffect === 'random-cycle' ? 'neural-network' : currentEffect;
      transitionToEffect(effectToStart);
      
      if (currentEffect === 'random-cycle') {
        startRandomCycle();
      }
    }
    
    return () => {
      if (cycleTimerRef.current) {
        clearInterval(cycleTimerRef.current);
      }
      if (activeEffectInstance) {
        activeEffectInstance.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (activeEffectInstance) {
      activeEffectInstance.stop();
      setActiveEffectInstance(null);
    }
    
    if (effectContainerRef.current) {
      effectContainerRef.current.style.opacity = EFFECTS_ENABLED ? '1' : '0';
    }
  }, [EFFECTS_ENABLED]);

  return {
    EFFECTS_ENABLED,
    setEffectsEnabled,
    currentEffect,
    activeEffectInstance,
    effectContainerRef,
    handleEffectChange,
    backgroundEffectOptions
  };
}
