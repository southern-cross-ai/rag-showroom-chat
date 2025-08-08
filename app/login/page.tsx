'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NeuralNetworkEffect from '@/components/background-effects/NeuralNetworkEffect';
import MinimalEffect from '@/components/background-effects/MinimalEffect';
import Header from '@/components/Header';
import SettingsPanel from '@/components/SettingsPanel';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [EFFECTS_ENABLED, setEffectsEnabled] = useState(true);
  const [currentEffect, setCurrentEffect] = useState('random-cycle');
  const [activeEffectInstance, setActiveEffectInstance] = useState<
    NeuralNetworkEffect | MinimalEffect | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectContainerRef = useRef<HTMLDivElement>(null);

  const backgroundEffectOptions = [
    {
      value: 'random-cycle',
      label: 'Random Cycle',
      description: 'Automatically cycles through effects every 3-5 minutes',
    },
    {
      value: 'neural-network',
      label: 'Neural Network',
      description: 'Animated particle connections suggesting AI networks',
    },
    { value: 'minimal', label: 'Minimal', description: 'Clean solid/gradient background only' },
    { value: 'off', label: 'Off', description: 'Static background with no effects' },
  ];

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

  const transitionToEffect = useCallback(
    async (newEffectType: string) => {
      if (isTransitioning) return;
      if (!EFFECTS_ENABLED && newEffectType !== 'off') return;

      setIsTransitioning(true);

      if (effectContainerRef.current) {
        effectContainerRef.current.style.opacity = '0';
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

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
        effectContainerRef.current.style.opacity =
          EFFECTS_ENABLED && newEffectType !== 'off' ? '1' : '0';
      }

      setIsTransitioning(false);
    },
    [isTransitioning, EFFECTS_ENABLED, activeEffectInstance, createEffect],
  );

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

  const handleEffectChange = useCallback(
    (effectValue: string) => {
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

      if (window.innerWidth < 768) {
        setTimeout(() => setShowSettings(false), 300);
      }
    },
    [getRandomEffect, transitionToEffect, startRandomCycle],
  );

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
    if (effectContainerRef.current) {
      effectContainerRef.current.style.opacity = EFFECTS_ENABLED ? '1' : '0';
    }

    if (!EFFECTS_ENABLED && activeEffectInstance) {
      activeEffectInstance.stop();
      setActiveEffectInstance(null);
    } else if (EFFECTS_ENABLED && !activeEffectInstance && currentEffect !== 'off') {
      if (currentEffect === 'random-cycle') {
        const randomEffect = getRandomEffect();
        transitionToEffect(randomEffect);
        startRandomCycle();
      } else {
        transitionToEffect(currentEffect);
      }
    }
  }, [EFFECTS_ENABLED]);

  const handleLogin = () => {
    // Check for wrong credentials (for demo purposes)
    if (loginData.email === 'wrong' && loginData.password === 'wrong') {
      // Store current values to restore later
      const originalEmail = loginData.email;
      const originalPassword = loginData.password;

      // Trigger error state and clear fields to show error placeholders
      setLoginError(true);
      setLoginData({ email: '', password: '' });

      // Reset error state and restore values after 1 second
      setTimeout(() => {
        setLoginError(false);
        setLoginData({ email: originalEmail, password: originalPassword });
      }, 1000);

      return; // Don't proceed with login
    }

    setIsLoading(true);
    setTimeout(() => {
      // Redirect to main chat page after successful login
      router.push('/');
    }, 1500);
  };

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Redirect to main chat page after successful signup
      router.push('/');
    }, 1500);
  };

  const toggleAuth = () => setShowLogin(!showLogin);
  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-8px);
          }
          30% {
            transform: translateX(8px);
          }
          60% {
            transform: translateX(-4px);
          }
          90% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>

      {/* Background Effects Container */}
      <div
        ref={effectContainerRef}
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: EFFECTS_ENABLED ? 1 : 0 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-purple-900/25"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <Header
        toggleSettings={toggleSettings}
        activeEffectInstance={activeEffectInstance}
        EFFECTS_ENABLED={EFFECTS_ENABLED}
      />

      {/* Settings Panel */}
      <SettingsPanel
        showSettings={showSettings}
        toggleSettings={toggleSettings}
        EFFECTS_ENABLED={EFFECTS_ENABLED}
        setEffectsEnabled={setEffectsEnabled}
        currentEffect={currentEffect}
        handleEffectChange={handleEffectChange}
        backgroundEffectOptions={backgroundEffectOptions}
      />

      {/* Settings Overlay */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={toggleSettings}
        ></div>
      )}

      {/* Main Login Content */}
      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full relative z-20">
        <div className="flex items-center justify-center min-h-96">
          <div className="w-full max-w-md mx-4">
            <div className="bg-white/12 backdrop-blur-2xl border border-white/25 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>

              <div className="relative z-10">
                <h2
                  className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent"
                  style={{
                    textShadow:
                      EFFECTS_ENABLED &&
                      activeEffectInstance &&
                      activeEffectInstance.constructor.name === 'NeuralNetworkEffect'
                        ? '0 0 8px rgba(6, 182, 212, 0.5), 0 0 16px rgba(6, 182, 212, 0.3), 0 0 24px rgba(6, 182, 212, 0.2)'
                        : 'none',
                  }}
                >
                  {showLogin ? 'Sign In' : 'Create Account'}
                </h2>

                <div className="space-y-4">
                  {!showLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/8 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3 text-white placeholder-gray-400"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                    <input
                      type="email"
                      className={`w-full backdrop-blur-sm rounded-xl px-4 py-3 text-white transition-all duration-300 ${
                        loginError
                          ? 'bg-red-500/20 border-2 border-red-400 placeholder-red-300 shadow-lg shadow-red-500/25'
                          : 'bg-white/8 border border-white/25 placeholder-gray-400'
                      }`}
                      value={showLogin ? loginData.email : signupData.email}
                      onChange={(e) =>
                        showLogin
                          ? setLoginData({ ...loginData, email: e.target.value })
                          : setSignupData({ ...signupData, email: e.target.value })
                      }
                      placeholder={loginError ? 'Wrong' : 'Enter your email'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full backdrop-blur-sm rounded-xl px-4 py-3 pr-12 text-white transition-all duration-300 ${
                          loginError
                            ? 'bg-red-500/20 border-2 border-red-400 placeholder-red-300 shadow-lg shadow-red-500/25'
                            : 'bg-white/8 border border-white/25 placeholder-gray-400'
                        }`}
                        value={showLogin ? loginData.password : signupData.password}
                        onChange={(e) =>
                          showLogin
                            ? setLoginData({ ...loginData, password: e.target.value })
                            : setSignupData({ ...signupData, password: e.target.value })
                        }
                        placeholder={
                          loginError
                            ? 'Password'
                            : showLogin
                              ? 'Enter your password'
                              : 'Create a password'
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? '•••' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {!showLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-white/8 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3 text-white placeholder-gray-400"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({ ...signupData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm your password"
                      />
                    </div>
                  )}

                  <button
                    className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
                      isLoading
                        ? 'bg-gradient-to-r from-blue-600/50 to-cyan-600/50 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500'
                    }`}
                    onClick={showLogin ? handleLogin : handleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : showLogin ? 'Sign In' : 'Create Account'}
                  </button>

                  <p className="text-center text-sm text-gray-300">
                    {showLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                      onClick={toggleAuth}
                    >
                      {showLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
