"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

function AIChatInterface() {
  const [EFFECTS_ENABLED, setEffectsEnabled] = useState(true);
  const [currentEffect, setCurrentEffect] = useState('random-cycle');
  const [activeEffectInstance, setActiveEffectInstance] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '' 
  });
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]); // New: store chat history
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Current conversation', messages: [], lastUpdated: new Date() }
  ]); // New: conversation management
  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [showConversationDropdown, setShowConversationDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loginError, setLoginError] = useState(false); // New: login error state
  const [showPassword, setShowPassword] = useState(false); // New: password visibility toggle
  
  // Connection Status - Hook this to your API connectivity
  // TODO: Replace with actual API connection monitoring
  const [isConnected, setIsConnected] = useState(true); // Currently hardcoded to true
  const [connectionStatus, setConnectionStatus] = useState('Connected'); // Status text for UI

  const cycleTimerRef = useRef(null);
  const effectContainerRef = useRef(null);

  const backgroundEffectOptions = [
    { value: 'random-cycle', label: 'Random Cycle', description: 'Automatically cycles through effects every 3-5 minutes' },
    { value: 'neural-network', label: 'Neural Network', description: 'Animated particle connections suggesting AI networks' },
    { value: 'minimal', label: 'Minimal', description: 'Clean solid/gradient background only' },
    { value: 'off', label: 'Off', description: 'Static background with no effects' }
  ];

  // Base Effect Class
  class BackgroundEffect {
    constructor(container) {
      this.container = container;
      this.isActive = false;
      this.animationId = null;
      this.elements = [];
    }

    start() {
      if (this.isActive) return;
      this.isActive = true;
      this.initialize();
      this.animate();
    }

    stop() {
      if (!this.isActive) return;
      this.isActive = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.cleanup();
    }

    initialize() {}
    
    animate() {
      if (!this.isActive) return;
      this.update();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    update() {}
    
    cleanup() {
      this.elements.forEach(el => el.remove());
      this.elements = [];
    }
  }

  // Enhanced Neural Network Effect with Lightning
  class NeuralNetworkEffect extends BackgroundEffect {
    initialize() {
      this.particles = [];
      this.microParticles = []; // Add micro particles array
      this.lightningArcs = [];
      this.time = 0;
      this.resizeTimeout = null;
      this.lastLightningTime = 0;
      
      const baseCount = Math.floor(window.innerWidth / 60);
      const particleCount = Math.min(40, Math.max(12, baseCount));
      
      // Add micro particles - more count
      const microCount = Math.floor(particleCount * 2) + 10; // Added 10 more
      
      console.log(`Initializing neural network with ${particleCount} main particles and ${microCount} micro particles`);
      
      // Create main particles (exactly like version 24)
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(this.createMainParticle());
      }
      
      // Create micro particles
      for (let i = 0; i < microCount; i++) {
        this.microParticles.push(this.createMicroParticle());
      }

      this.handleResize = () => {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          const canvas = this.getCanvas();
          if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
        }, 250);
      };

      window.addEventListener('resize', this.handleResize);
    }

    createMainParticle() {
      // Exactly the same as version 24
      const edge = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      const speed = 0.21 + Math.random() * 0.28;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      switch (edge) {
        case 0:
          x = Math.random() * window.innerWidth;
          y = -20;
          vx = (centerX - x) * 0.0008 + (Math.random() - 0.5) * 0.6;
          vy = speed * (0.7 + Math.random() * 0.6);
          break;
        case 1:
          x = window.innerWidth + 20;
          y = Math.random() * window.innerHeight;
          vx = -speed * (0.7 + Math.random() * 0.6);
          vy = (centerY - y) * 0.0008 + (Math.random() - 0.5) * 0.6;
          break;
        case 2:
          x = Math.random() * window.innerWidth;
          y = window.innerHeight + 20;
          vx = (centerX - x) * 0.0008 + (Math.random() - 0.5) * 0.6;
          vy = -speed * (0.7 + Math.random() * 0.6);
          break;
        case 3:
          x = -20;
          y = Math.random() * window.innerHeight;
          vx = speed * (0.7 + Math.random() * 0.6);
          vy = (centerY - y) * 0.0008 + (Math.random() - 0.5) * 0.6;
          break;
      }
      
      return {
        x, y, vx, vy,
        baseOpacity: Math.random() * 0.4 + 0.5,
        opacity: 0,
        maxOpacity: Math.random() * 0.4 + 0.5,
        size: Math.random() * 3 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        excitement: 0,
        excitementDecay: 0.95,
        life: 1.0,
        fadeIn: true,
        fadeOut: false
      };
    }

    createMicroParticle() {
      // Similar to main but smaller and different properties
      const edge = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      const speed = 0.15 + Math.random() * 0.2; // Slower
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      switch (edge) {
        case 0:
          x = Math.random() * window.innerWidth;
          y = -20;
          vx = (centerX - x) * 0.0008 + (Math.random() - 0.5) * 0.6;
          vy = speed * (0.7 + Math.random() * 0.6);
          break;
        case 1:
          x = window.innerWidth + 20;
          y = Math.random() * window.innerHeight;
          vx = -speed * (0.7 + Math.random() * 0.6);
          vy = (centerY - y) * 0.0008 + (Math.random() - 0.5) * 0.6;
          break;
        case 2:
          x = Math.random() * window.innerWidth;
          y = window.innerHeight + 20;
          vx = (centerX - x) * 0.0008 + (Math.random() - 0.5) * 0.6;
          vy = -speed * (0.7 + Math.random() * 0.6);
          break;
        case 3:
          x = -20;
          y = Math.random() * window.innerHeight;
          vx = speed * (0.7 + Math.random() * 0.6);
          vy = (centerY - y) * 0.0008 + (Math.random() - 0.5) * 0.6;
          break;
      }
      
      return {
        x, y, vx, vy,
        baseOpacity: Math.random() * 0.3 + 0.2,
        opacity: 0,
        maxOpacity: Math.random() * 0.3 + 0.2,
        size: Math.random() * 1.5 + 0.8, // Much smaller
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.02,
        life: 1.0,
        fadeIn: true,
        fadeOut: false,
        flickerPhase: Math.random() * Math.PI * 2,
        flickerSpeed: Math.random() * 0.05 + 0.02
      };
    }

    update() {
      if (!this.container) return;
      
      this.time += 0.016;
      
      // Generate lightning arcs occasionally - HALVED frequency for subtlety
      if (this.time - this.lastLightningTime > 3 + Math.random() * 6) { // Was 1.5-4.5, now 3-9 seconds
        this.generateLightning();
        this.lastLightningTime = this.time;
      }
      
      // Update lightning arcs - fade 30% faster, update flash effects
      this.lightningArcs = this.lightningArcs.filter(arc => {
        arc.life -= 0.026;
        arc.intensity = Math.max(0, arc.life);
        
        // Flash effects fade faster than the main lightning
        arc.flashLife -= 0.035; // Faster fade for flash effects
        arc.flashIntensity = Math.max(0, arc.flashLife);
        
        return arc.life > 0;
      });
      
      // Update main particles (exactly like version 24)
      this.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.fadeIn) {
          particle.opacity = Math.min(particle.maxOpacity, particle.opacity + 0.02);
          if (particle.opacity >= particle.maxOpacity) {
            particle.fadeIn = false;
          }
        } else if (particle.fadeOut) {
          particle.opacity = Math.max(0, particle.opacity - 0.03);
          particle.life = Math.max(0, particle.life - 0.02);
        } else {
          const margin = 100;
          const nearEdge = particle.x < margin || particle.x > window.innerWidth - margin ||
                          particle.y < margin || particle.y > window.innerHeight - margin;
          
          if (nearEdge) {
            particle.fadeOut = true;
          }
        }
        
        if (particle.opacity <= 0 || particle.life <= 0) {
          this.particles[index] = this.createMainParticle();
          return;
        }
        
        particle.vx += (Math.random() - 0.5) * 0.002;
        particle.vy += (Math.random() - 0.5) * 0.002;
        
        const maxSpeed = 0.84;
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (currentSpeed > maxSpeed) {
          particle.vx = (particle.vx / currentSpeed) * maxSpeed;
          particle.vy = (particle.vy / currentSpeed) * maxSpeed;
        }
        
        const pulseOpacity = particle.maxOpacity + 
          Math.sin(this.time * particle.pulseSpeed + particle.pulsePhase) * 0.1;
        particle.baseOpacity = pulseOpacity + (particle.excitement * 0.4);
        
        if (!particle.fadeOut) {
          particle.opacity = Math.min(particle.opacity, particle.baseOpacity);
        }
        
        particle.excitement *= particle.excitementDecay;
      });

      // Update micro particles (similar but simpler)
      this.microParticles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.fadeIn) {
          particle.opacity = Math.min(particle.maxOpacity, particle.opacity + 0.02);
          if (particle.opacity >= particle.maxOpacity) {
            particle.fadeIn = false;
          }
        } else if (particle.fadeOut) {
          particle.opacity = Math.max(0, particle.opacity - 0.03);
          particle.life = Math.max(0, particle.life - 0.02);
        } else {
          const margin = 100;
          const nearEdge = particle.x < margin || particle.x > window.innerWidth - margin ||
                          particle.y < margin || particle.y > window.innerHeight - margin;
          
          if (nearEdge) {
            particle.fadeOut = true;
          }
        }
        
        if (particle.opacity <= 0 || particle.life <= 0) {
          this.microParticles[index] = this.createMicroParticle();
          return;
        }
        
        particle.vx += (Math.random() - 0.5) * 0.002;
        particle.vy += (Math.random() - 0.5) * 0.002;
        
        const maxSpeed = 0.6;
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (currentSpeed > maxSpeed) {
          particle.vx = (particle.vx / currentSpeed) * maxSpeed;
          particle.vy = (particle.vy / currentSpeed) * maxSpeed;
        }
        
        // Flickering behavior
        const flickerIntensity = Math.sin(this.time * particle.flickerSpeed + particle.flickerPhase) * 0.3;
        const pulseOpacity = particle.maxOpacity + 
          Math.sin(this.time * particle.pulseSpeed + particle.pulsePhase) * 0.15;
        particle.baseOpacity = pulseOpacity + flickerIntensity;
        
        if (!particle.fadeOut) {
          particle.opacity = Math.min(particle.opacity, Math.max(0, particle.baseOpacity));
        }
      });

      this.render();
    }

    generateLightning() {
      const maxLightningDistance = Math.min(250, window.innerWidth / 5);
      const candidates = [];
      
      // Only use main particles for lightning
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const particle1 = this.particles[i];
          const particle2 = this.particles[j];
          
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxLightningDistance) {
            candidates.push({ particle1, particle2, distance });
          }
        }
      }
      
      const lightningCount = Math.min(candidates.length, Math.floor(Math.random() * 3) + 1);
      
      for (let i = 0; i < lightningCount; i++) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        const selection = candidates[randomIndex];
        
        const arc = {
          particle1: selection.particle1,
          particle2: selection.particle2,
          life: 1.0,
          intensity: 1.0,
          segments: this.createLightningPath(selection.particle1, selection.particle2),
          color: Math.random() > 0.7 ? 'electric-blue' : 'cyan',
          // Add flash effects
          flashLife: 1.0, // Separate life for flash effects
          centerX: (selection.particle1.x + selection.particle2.x) / 2, // Flash center point
          centerY: (selection.particle1.y + selection.particle2.y) / 2,
          flashRadius: Math.min(200, Math.sqrt(Math.pow(selection.particle2.x - selection.particle1.x, 2) + Math.pow(selection.particle2.y - selection.particle1.y, 2)) * 1.5) // Radius based on lightning length
        };
        
        this.lightningArcs.push(arc);
        
        selection.particle1.excitement = Math.min(1, selection.particle1.excitement + 0.8);
        selection.particle2.excitement = Math.min(1, selection.particle2.excitement + 0.8);
        
        candidates.splice(randomIndex, 1);
      }
    }

    createLightningPath(particle1, particle2) {
      const segments = [];
      const numSegments = 8 + Math.floor(Math.random() * 6);
      
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const baseX = particle1.x + (particle2.x - particle1.x) * t;
        const baseY = particle1.y + (particle2.y - particle1.y) * t;
        
        const offsetStrength = Math.sin(t * Math.PI) * 15;
        const offsetX = (Math.random() - 0.5) * offsetStrength;
        const offsetY = (Math.random() - 0.5) * offsetStrength;
        
        segments.push({
          x: baseX + offsetX,
          y: baseY + offsetY
        });
      }
      
      return segments;
    }

    render() {
      const canvas = this.getCanvas();
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (this.particles.length === 0) return;
      
      const maxConnectionDistance = Math.min(150, window.innerWidth / 8);
      
      // Draw regular connections (only between main particles)
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const particle1 = this.particles[i];
          const particle2 = this.particles[j];
          
          const dx = particle1.x - particle2.x;
          const dy = particle1.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxConnectionDistance) {
            const opacity = (1 - distance / maxConnectionDistance) * 0.4;
            const avgOpacity = (particle1.opacity + particle2.opacity) / 2;
            
            const gradient = ctx.createLinearGradient(
              particle1.x, particle1.y, particle2.x, particle2.y
            );
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity * avgOpacity})`);
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * avgOpacity * 0.8})`);
            gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity * avgOpacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.max(1, opacity * 3);
            ctx.globalAlpha = 1;
            
            ctx.beginPath();
            ctx.moveTo(particle1.x, particle1.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        }
      }
      
      // Draw lightning flash effects FIRST (behind everything)
      this.lightningArcs.forEach(arc => {
        if (arc.flashIntensity <= 0) return;
        
        const flashOpacity = arc.flashIntensity * 0.15; // Very subtle
        
        // 1. Radial Flash Gradient (approach 1)
        const radialGradient = ctx.createRadialGradient(
          arc.centerX, arc.centerY, 0,
          arc.centerX, arc.centerY, arc.flashRadius
        );
        
        const flashColor = arc.color === 'electric-blue' ? '59, 130, 246' : '6, 182, 212';
        radialGradient.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity * 0.8})`); // Bright center
        radialGradient.addColorStop(0.3, `rgba(${flashColor}, ${flashOpacity * 0.6})`);
        radialGradient.addColorStop(0.7, `rgba(${flashColor}, ${flashOpacity * 0.3})`);
        radialGradient.addColorStop(1, `rgba(${flashColor}, 0)`);
        
        ctx.fillStyle = radialGradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(arc.centerX, arc.centerY, arc.flashRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 2. Lightning Path Illumination (approach 2)
        if (arc.segments.length >= 2) {
          const pathWidth = 25 + (arc.flashIntensity * 15); // Wider glow along path
          
          ctx.strokeStyle = `rgba(${flashColor}, ${flashOpacity * 0.4})`;
          ctx.lineWidth = pathWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = 1;
          
          // Draw the glow path
          ctx.beginPath();
          ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
          for (let i = 1; i < arc.segments.length; i++) {
            ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
          }
          ctx.stroke();
          
          // Add an inner brighter path
          ctx.strokeStyle = `rgba(255, 255, 255, ${flashOpacity * 0.6})`;
          ctx.lineWidth = pathWidth * 0.4;
          ctx.beginPath();
          ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
          for (let i = 1; i < arc.segments.length; i++) {
            ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
          }
          ctx.stroke();
        }
      });
      
      // Draw lightning arcs (main bolts on top of flash effects)
      this.lightningArcs.forEach(arc => {
        if (arc.segments.length < 2) return;
        
        const intensity = arc.intensity;
        const baseOpacity = intensity * 0.9;
        
        ctx.strokeStyle = arc.color === 'electric-blue' 
          ? `rgba(59, 130, 246, ${baseOpacity})` 
          : `rgba(6, 182, 212, ${baseOpacity})`;
        ctx.lineWidth = 2 + intensity * 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 1;
        
        ctx.beginPath();
        ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
        for (let i = 1; i < arc.segments.length; i++) {
          ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
        }
        ctx.stroke();
        
        ctx.strokeStyle = arc.color === 'electric-blue' 
          ? `rgba(59, 130, 246, ${baseOpacity * 0.3})` 
          : `rgba(6, 182, 212, ${baseOpacity * 0.3})`;
        ctx.lineWidth = 6 + intensity * 4;
        ctx.beginPath();
        ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
        for (let i = 1; i < arc.segments.length; i++) {
          ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
        }
        ctx.stroke();
      });
      
      // Draw main particles with more visible color transitions
      this.particles.forEach(particle => {
        const excitementBoost = particle.excitement;
        const glowSize = (particle.size * 4) + (excitementBoost * 6);
        
        // More dramatic color transition - larger range
        const colorPhase = Math.sin(this.time * 0.008 + particle.pulsePhase) * 0.5 + 0.5; // Slower, 0 to 1
        const excitementPhase = excitementBoost * 2; // Double excitement effect
        const totalPhase = Math.min(1, colorPhase * 0.7 + excitementPhase); // More noticeable base transition
        
        // Much more dramatic RGB shift from cyan to bright white
        const r = Math.floor(6 + (totalPhase * 249)); // 6 to 255 (full white range)
        const g = Math.floor(182 + (totalPhase * 73)); // 182 to 255
        const b = Math.floor(212 + (totalPhase * 43)); // 212 to 255
        
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        const glowOpacity = (particle.opacity * 0.6) + (excitementBoost * 0.4);
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowOpacity})`);
        glowGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${glowOpacity * 0.2})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        const coreSize = (particle.size * 1.5) + (excitementBoost * 2);
        const coreGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, coreSize
        );
        const coreOpacity = Math.min(1, particle.opacity + (excitementBoost * 0.5));
        
        // Much brighter white center with stronger transition
        const centerPhase = Math.min(1, totalPhase * 1.5); // Even more dramatic center
        const centerR = Math.floor(255 * centerPhase + r * (1 - centerPhase));
        const centerG = Math.floor(255 * centerPhase + g * (1 - centerPhase));
        const centerB = Math.floor(255 * centerPhase + b * (1 - centerPhase));
        
        coreGradient.addColorStop(0, `rgba(${centerR}, ${centerG}, ${centerB}, ${Math.min(1, coreOpacity * 1.4)})`);
        coreGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${coreOpacity})`);
        coreGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${coreOpacity * 0.5})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw micro particles with more visible color transitions
      this.microParticles.forEach(particle => {
        const coreSize = particle.size;
        const glowSize = particle.size * 2;
        
        // More visible color transition
        const colorPhase = Math.sin(this.time * 0.01 + particle.flickerPhase) * 0.6 + 0.4; // 0.4 to 1.0 (stronger range)
        
        // More dramatic RGB shift for micro particles
        const r = Math.floor(6 + (colorPhase * 180)); // 6 to 186 (bigger range)
        const g = Math.floor(182 + (colorPhase * 50)); // 182 to 232  
        const b = Math.floor(212 + (colorPhase * 35)); // 212 to 247
        
        // Blue glow with more visible color transition
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.6})`);
        glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Blue core with stronger transition
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, coreSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    getCanvas() {
      let canvas = this.container.querySelector('.effect-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'effect-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '12';
        canvas.style.opacity = '1';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.container.appendChild(canvas);
        this.elements.push(canvas);
      }
      return canvas;
    }

    cleanup() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      window.removeEventListener('resize', this.handleResize);
      super.cleanup();
    }
  }

  // Minimal Effect
  class MinimalEffect extends BackgroundEffect {
    initialize() {
      this.container.style.background = 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)';
    }

    update() {}

    cleanup() {
      if (this.container) {
        this.container.style.background = '';
      }
    }
  }

  const createEffect = useCallback((effectType, container) => {
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

  const transitionToEffect = useCallback(async (newEffectType) => {
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

  const handleEffectChange = useCallback((effectValue) => {
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
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignOut = () => setIsAuthenticated(false);
  const toggleAuth = () => setShowLogin(!showLogin);
  const toggleSettings = () => setShowSettings(!showSettings);
  
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: chatInput.trim(),
        timestamp: new Date()
      };
      
      const newMessages = [...chatMessages, userMessage];
      setChatMessages(newMessages);
      
      // Update current conversation
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: newMessages, lastUpdated: new Date() }
          : conv
      ));
      
      setChatInput('');
      
      // Simulate AI response after a brief delay
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: `I received your message: "${userMessage.content}". This is a simulated response from Southern Cross AI.`,
          timestamp: new Date()
        };
        const updatedMessages = [...newMessages, aiMessage];
        setChatMessages(updatedMessages);
        
        // Update conversation with AI response
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: updatedMessages, lastUpdated: new Date() }
            : conv
        ));
      }, 1000);
    }
  };

  // Switch to a different conversation
  const switchConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setChatMessages(conversation.messages);
      setShowConversationDropdown(false);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1;
    const newConversation = {
      id: newId,
      name: `Conversation ${newId}`,
      messages: [],
      lastUpdated: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setChatMessages([]);
    setShowConversationDropdown(false);
  };

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.querySelector('.chat-scroll-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showConversationDropdown && !event.target.closest('.conversation-dropdown')) {
        setShowConversationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showConversationDropdown]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
          10% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
      <div 
        ref={effectContainerRef}
        className="fixed inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: EFFECTS_ENABLED ? 1 : 0 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-purple-900/25"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <header className="h-16 bg-white/8 backdrop-blur-xl border-b border-white/15 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent" 
              style={{
                textShadow: (EFFECTS_ENABLED && activeEffectInstance && activeEffectInstance.constructor.name === 'NeuralNetworkEffect') ? 
                  '0 0 10px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.2)' : 
                  'none'
              }}>
            Southern Cross AI
          </h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-all duration-200"
              onClick={toggleSettings}
            >
              ⚙️ Settings
            </button>

            {isAuthenticated && (
              <button 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-all duration-200"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <div className={`fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-2xl border-l border-white/25 shadow-2xl shadow-black/50 transform transition-all duration-300 ease-in-out z-30 ${
        showSettings ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Settings
            </h2>
            <button 
              className="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-lg text-sm transition-all duration-200 flex items-center justify-center"
              onClick={toggleSettings}
            >
              ✕
            </button>
          </div>

          <div className="mb-8">
            <div className="bg-white/8 backdrop-blur-sm border border-white/25 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Visual Effects</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={EFFECTS_ENABLED}
                    onChange={(e) => setEffectsEnabled(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/10"
                  />
                  <span className={`text-sm font-medium transition-all duration-200 ${
                    EFFECTS_ENABLED ? 'text-cyan-300' : 'text-gray-400'
                  }`}>
                    {EFFECTS_ENABLED ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
              
              <p className="text-xs text-gray-400 leading-relaxed">
                Master control for all background visual effects and animations.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Background Effects</h3>
            
            <div className="space-y-3">
              {backgroundEffectOptions.map((option) => (
                <div key={option.value} className="group">
                  <button
                    className={`w-full text-left bg-white/8 hover:bg-white/15 backdrop-blur-sm border rounded-2xl p-4 transition-all duration-200 ${
                      currentEffect === option.value 
                        ? 'border-cyan-400/60 bg-cyan-500/15 shadow-lg shadow-cyan-500/10' 
                        : 'border-white/25 hover:border-white/40'
                    }`}
                    onClick={() => handleEffectChange(option.value)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium transition-colors duration-200 ${
                        currentEffect === option.value ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200'
                      }`}>
                        {option.label}
                      </span>
                      
                      {currentEffect === option.value && (
                        <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
                      )}
                    </div>
                    
                    <p className={`text-xs leading-relaxed transition-colors duration-200 ${
                      currentEffect === option.value ? 'text-cyan-100/80' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {option.description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15">
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  EFFECTS_ENABLED ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs font-medium text-gray-300">
                  Current Status
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Effects: <span className={EFFECTS_ENABLED ? 'text-green-400' : 'text-gray-400'}>
                  {EFFECTS_ENABLED ? 'Active' : 'Disabled'}
                </span>
                <br />
                Mode: <span className="text-cyan-400">
                  {backgroundEffectOptions.find(opt => opt.value === currentEffect)?.label}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={toggleSettings}
        ></div>
      )}

      <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full relative z-20">
        {!isAuthenticated ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="w-full max-w-md mx-4">
              <div className="bg-white/12 backdrop-blur-2xl border border-white/25 p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/40 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent"
                      style={{
                        textShadow: (EFFECTS_ENABLED && activeEffectInstance && activeEffectInstance.constructor.name === 'NeuralNetworkEffect') ? 
                          '0 0 8px rgba(6, 182, 212, 0.5), 0 0 16px rgba(6, 182, 212, 0.3), 0 0 24px rgba(6, 182, 212, 0.2)' : 
                          'none'
                      }}>
                    {showLogin ? 'Sign In' : 'Create Account'}
                  </h2>
                  
                  <div className="space-y-4">
                    {!showLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full bg-white/8 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3 text-white placeholder-gray-400"
                          value={signupData.name}
                          onChange={(e) => setSignupData({...signupData, name: e.target.value})}
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
                        onChange={(e) => showLogin 
                          ? setLoginData({...loginData, email: e.target.value})
                          : setSignupData({...signupData, email: e.target.value})
                        }
                        placeholder={loginError ? "Wrong" : "Enter your email"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`w-full backdrop-blur-sm rounded-xl px-4 py-3 pr-12 text-white transition-all duration-300 ${
                            loginError 
                              ? 'bg-red-500/20 border-2 border-red-400 placeholder-red-300 shadow-lg shadow-red-500/25' 
                              : 'bg-white/8 border border-white/25 placeholder-gray-400'
                          }`}
                          value={showLogin ? loginData.password : signupData.password}
                          onChange={(e) => showLogin 
                            ? setLoginData({...loginData, password: e.target.value})
                            : setSignupData({...signupData, password: e.target.value})
                          }
                          placeholder={loginError ? "Password" : (showLogin ? "Enter your password" : "Create a password")}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "•••" : "👁️"}
                        </button>
                      </div>
                    </div>

                    {!showLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          className="w-full bg-white/8 backdrop-blur-sm border border-white/25 rounded-xl px-4 py-3 text-white placeholder-gray-400"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
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
                      {isLoading ? 'Processing...' : (showLogin ? 'Sign In' : 'Create Account')}
                    </button>

                    <p className="text-center text-sm text-gray-300">
                      {showLogin ? "Don't have an account?" : "Already have an account?"}{' '}
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
        ) : (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            {/* Chat Messages Area */}
            <div className="bg-white/2 backdrop-blur-sm border border-white/15 rounded-3xl mb-6 h-96 shadow-2xl shadow-black/20 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
              
              {/* Conversation Selector */}
              <div className="relative p-4 border-b border-white/10">
                <button
                  className="flex items-center justify-between w-48 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/30 rounded-xl px-3 py-2 text-sm text-gray-300 hover:text-white transition-all duration-200"
                  onClick={() => setShowConversationDropdown(!showConversationDropdown)}
                >
                  <span className="truncate">{currentConversation?.name || 'Current conversation'}</span>
                  <span className={`ml-2 transition-transform duration-200 ${showConversationDropdown ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                {showConversationDropdown && (
                  <div className="absolute top-full left-4 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl shadow-black/50 z-30 max-h-64 overflow-hidden">
                    {/* New Conversation Button */}
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-cyan-400 hover:bg-white/10 transition-colors duration-200 border-b border-white/10"
                      onClick={createNewConversation}
                    >
                      + New Conversation
                    </button>
                    
                    {/* Conversation List */}
                    <div className="max-h-48 overflow-y-auto" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent'
                    }}>
                      {conversations.map((conversation) => (
                        <button
                          key={conversation.id}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 hover:bg-white/10 ${
                            conversation.id === currentConversationId 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : 'text-gray-300'
                          }`}
                          onClick={() => switchConversation(conversation.id)}
                        >
                          <div className="truncate">{conversation.name}</div>
                          <div className="text-xs opacity-60 mt-1">
                            {conversation.messages.length} messages • {conversation.lastUpdated.toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Container with Scroll */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 overflow-y-auto chat-scroll-container p-6" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent'
                }}>
                  <div className="space-y-4 pb-4">{/* Added bottom padding */}
                    {chatMessages.length === 0 ? (
                      /* Welcome Message */
                      <div className="text-center text-gray-300 p-8">
                        <div className="mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white/20 rounded-md animate-pulse"></div>
                          </div>
                          <p className="text-lg">Welcome to Southern Cross AI! Start a conversation below.</p>
                        </div>
                      </div>
                    ) : (
                      /* Chat Messages with Fade Effect */
                      chatMessages.map((message, index) => {
                        const totalMessages = chatMessages.length;
                        const isNearTop = index < 3; // Top 3 messages
                        const fadeIndex = index; // 0 = oldest (top), higher = newer
                        
                        let opacity = 1;
                        if (isNearTop && totalMessages > 6) { // Start fading when more than 6 messages
                          if (fadeIndex === 0) opacity = 0.1; // Top message: 90% fade (10% visible)
                          else if (fadeIndex === 1) opacity = 0.4; // Second: 60% fade (40% visible)  
                          else if (fadeIndex === 2) opacity = 0.7; // Third: 30% fade (70% visible)
                        }
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}
                            style={{ opacity }}
                          >
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              message.type === 'user' 
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white ml-auto' 
                                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-100'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                
                {/* Fade Gradient Overlay at Top */}
                {chatMessages.length > 6 && (
                  <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/50 via-black/30 to-transparent pointer-events-none z-10"></div>
                )}
              </div>
            </div>

            {/* Chat Input Area */}

            <div className="bg-white/6 backdrop-blur-2xl border border-white/25 rounded-3xl p-4 shadow-xl shadow-black/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex gap-3 items-end">
                  <textarea
                    className="flex-1 bg-white/8 backdrop-blur-sm border border-white/25 rounded-2xl p-3 min-h-12 max-h-32 resize-none text-white placeholder-gray-400"
                    placeholder="Type your message here..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <button 
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${
                      chatInput.trim() 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25' 
                        : 'bg-white/10 border border-white/20 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="h-12 bg-white/8 backdrop-blur-xl border-t border-white/15 px-4 sm:px-6 shadow-lg shadow-black/10">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Southern Cross AI © 2025 | Southern Cross Pty. Ltd. ACN 675 444 550
          </p>
          
          {/* Connection Status Indicator */}
          {/* TODO: Hook isConnected and connectionStatus to your API monitoring system */}
          {/* Example usage:
               - Monitor WebSocket connection: setIsConnected(websocket.readyState === WebSocket.OPEN)
               - Track API health: setIsConnected(lastApiCall.success && Date.now() - lastApiCall.timestamp < 30000)
               - Update status text: setConnectionStatus('Connecting...', 'Connected', 'Disconnected', 'Error')
          */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full shadow-sm transition-all duration-300 ${
              isConnected 
                ? 'bg-green-500 animate-pulse shadow-green-400/50' 
                : 'bg-red-500 animate-pulse shadow-red-400/50'
            }`}></div>
            <span className={`text-xs transition-colors duration-300 ${
              isConnected ? 'text-gray-400' : 'text-red-400'
            }`}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AIChatInterface;