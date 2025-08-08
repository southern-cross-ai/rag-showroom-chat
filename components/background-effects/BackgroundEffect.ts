 // Base Effect Class
  export default class BackgroundEffect {
    container: HTMLElement;
    isActive: boolean;
    animationId: number | null;
    elements: HTMLElement[];

    constructor(container: HTMLElement) {
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