import BackgroundEffect from './BackgroundEffect';

// Minimal Effect
export default class MinimalEffect extends BackgroundEffect {
  initialize() {
    this.container.style.background =
      'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)';
  }

  update() {}

  cleanup() {
    if (this.container) {
      this.container.style.background = '';
    }
  }
}
