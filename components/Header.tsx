export default function Header({ toggleSettings, activeEffectInstance, EFFECTS_ENABLED }) {
  return (
    <header className="h-16 bg-white/8 backdrop-blur-xl border-b border-white/15 sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        <h1
          className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent"
          style={{
            textShadow:
              EFFECTS_ENABLED &&
              activeEffectInstance &&
              activeEffectInstance.constructor.name === 'NeuralNetworkEffect'
                ? '0 0 10px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.2)'
                : 'none',
          }}
        >
          Southern Cross AI
        </h1>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-all duration-200"
            onClick={toggleSettings}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </header>
  );
}
