import BackgroundEffect from "./BackgroundEffect";

// Enhanced Neural Network Effect with Lightning
  export default class NeuralNetworkEffect extends BackgroundEffect {
    particles: any[] = [];
    microParticles: any[] = [];
    lightningArcs: any[] = [];
    time: number = 0;
    resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    lastLightningTime: number = 0;
    handleResize?: () => void;

    initialize() {
      this.particles = [];
      this.microParticles = [];
      this.lightningArcs = [];
      this.time = 0;
      this.resizeTimeout = null;
      this.lastLightningTime = 0;
      
      const baseCount = Math.floor(window.innerWidth / 60);
      const particleCount = Math.min(40, Math.max(12, baseCount));
      const microCount = Math.floor(particleCount * 2) + 10;
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(this.createMainParticle());
      }
      
      for (let i = 0; i < microCount; i++) {
        this.microParticles.push(this.createMicroParticle());
      }

      this.handleResize = () => {
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          const canvas = this.getCanvas();
          if (canvas) {
            const ctxCanvas = canvas as HTMLCanvasElement;
            ctxCanvas.width = window.innerWidth;
            ctxCanvas.height = window.innerHeight;
          }
        }, 250);
      };

      window.addEventListener('resize', this.handleResize);
    }

    createMainParticle() {
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
      const edge = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      
      const speed = 0.15 + Math.random() * 0.2;
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
        size: Math.random() * 1.5 + 0.8,
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
      
      if (this.time - this.lastLightningTime > 3 + Math.random() * 6) {
        this.generateLightning();
        this.lastLightningTime = this.time;
      }
      
      this.lightningArcs = this.lightningArcs.filter(arc => {
        arc.life -= 0.026;
        arc.intensity = Math.max(0, arc.life);
        arc.flashLife -= 0.035;
        arc.flashIntensity = Math.max(0, arc.flashLife);
        return arc.life > 0;
      });
      
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
          flashLife: 1.0,
          centerX: (selection.particle1.x + selection.particle2.x) / 2,
          centerY: (selection.particle1.y + selection.particle2.y) / 2,
          flashRadius: Math.min(200, Math.sqrt(Math.pow(selection.particle2.x - selection.particle1.x, 2) + Math.pow(selection.particle2.y - selection.particle1.y, 2)) * 1.5)
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
      
      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      if (this.particles.length === 0) return;
      
      const maxConnectionDistance = Math.min(150, window.innerWidth / 8);
      
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
      
      this.lightningArcs.forEach(arc => {
        if (arc.flashIntensity <= 0) return;
        
        const flashOpacity = arc.flashIntensity * 0.15;
        
        const radialGradient = ctx.createRadialGradient(
          arc.centerX, arc.centerY, 0,
          arc.centerX, arc.centerY, arc.flashRadius
        );
        
        const flashColor = arc.color === 'electric-blue' ? '59, 130, 246' : '6, 182, 212';
        radialGradient.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity * 0.8})`);
        radialGradient.addColorStop(0.3, `rgba(${flashColor}, ${flashOpacity * 0.6})`);
        radialGradient.addColorStop(0.7, `rgba(${flashColor}, ${flashOpacity * 0.3})`);
        radialGradient.addColorStop(1, `rgba(${flashColor}, 0)`);
        
        ctx.fillStyle = radialGradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(arc.centerX, arc.centerY, arc.flashRadius, 0, Math.PI * 2);
        ctx.fill();
        
        if (arc.segments.length >= 2) {
          const pathWidth = 25 + (arc.flashIntensity * 15);
          
          ctx.strokeStyle = `rgba(${flashColor}, ${flashOpacity * 0.4})`;
          ctx.lineWidth = pathWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.globalAlpha = 1;
          
          ctx.beginPath();
          ctx.moveTo(arc.segments[0].x, arc.segments[0].y);
          for (let i = 1; i < arc.segments.length; i++) {
            ctx.lineTo(arc.segments[i].x, arc.segments[i].y);
          }
          ctx.stroke();
          
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
      
      this.particles.forEach(particle => {
        const excitementBoost = particle.excitement;
        const glowSize = (particle.size * 4) + (excitementBoost * 6);
        
        const colorPhase = Math.sin(this.time * 0.008 + particle.pulsePhase) * 0.5 + 0.5;
        const excitementPhase = excitementBoost * 2;
        const totalPhase = Math.min(1, colorPhase * 0.7 + excitementPhase);
        
        const r = Math.floor(6 + (totalPhase * 249));
        const g = Math.floor(182 + (totalPhase * 73));
        const b = Math.floor(212 + (totalPhase * 43));
        
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
        
        const centerPhase = Math.min(1, totalPhase * 1.5);
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
      
      this.microParticles.forEach(particle => {
        const coreSize = particle.size;
        const glowSize = particle.size * 2;
        
        const colorPhase = Math.sin(this.time * 0.01 + particle.flickerPhase) * 0.6 + 0.4;
        
        const r = Math.floor(6 + (colorPhase * 180));
        const g = Math.floor(182 + (colorPhase * 50));
        const b = Math.floor(212 + (colorPhase * 35));
        
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
        const canvasEl = canvas as HTMLCanvasElement;
        canvasEl.style.position = 'fixed';
        canvasEl.style.top = '0';
        canvasEl.style.left = '0';
        canvasEl.style.width = '100vw';
        canvasEl.style.height = '100vh';
        canvasEl.style.pointerEvents = 'none';
        canvasEl.style.zIndex = '12';
        canvasEl.style.opacity = '1';
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
        this.container.appendChild(canvasEl);
        this.elements.push(canvasEl);
      }
      return canvas;
    }

    cleanup() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      if (this.handleResize) {
        window.removeEventListener('resize', this.handleResize);
      }
      super.cleanup();
    }
  }