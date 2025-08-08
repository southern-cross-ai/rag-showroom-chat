import React from 'react';

interface SettingsPanelProps {
  showSettings: boolean;
  toggleSettings: () => void;
  EFFECTS_ENABLED: boolean;
  setEffectsEnabled: (enabled: boolean) => void;
  currentEffect: string;
  handleEffectChange: (effect: string) => void;
  backgroundEffectOptions: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  showSettings,
  toggleSettings,
  EFFECTS_ENABLED,
  setEffectsEnabled,
  currentEffect,
  handleEffectChange,
  backgroundEffectOptions
}) => {
  return (
    <>
      {/* Settings Panel */}
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

      {/* Settings Overlay */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={toggleSettings}
        ></div>
      )}
    </>
  );
};

export default SettingsPanel;
