import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pipette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const swatches = [
  // Dark tones
  '#1a1a2e', '#16213e', '#0f3460', '#1e3a5f',
  '#14532d', '#064e3b', '#134e4a', '#0c4a6e',
  '#312e81', '#3730a3', '#4c1d95', '#533483',
  '#581c87', '#701a75', '#831843', '#881337',
  '#7c2d12', '#78350f', '#713f12', '#365314',
  // Medium tones
  '#374151', '#334155', '#3f3f46', '#404040',
  '#4b5563', '#475569', '#52525b', '#525252',
  // Light tones
  '#6b7280', '#64748b', '#71717a', '#737373',
  '#9ca3af', '#94a3b8', '#a1a1aa', '#a3a3a3',
];

export function ColorPicker({ value, onChange, onClose }: ColorPickerProps) {
  const [color, setColor] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor(value);
  }, [value]);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-gray-900 rounded-2xl p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Choose Color</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview */}
          <div 
            className="h-20 rounded-xl mb-4 transition-colors"
            style={{ backgroundColor: color }}
          />

          {/* Custom color input */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={color}
                onChange={e => handleChange(e.target.value)}
                className="w-full"
                placeholder="#000000"
              />
            </div>
            <label className="btn-secondary flex items-center gap-2 cursor-pointer">
              <Pipette className="w-4 h-4" />
              <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={e => handleChange(e.target.value)}
                className="sr-only"
              />
            </label>
          </div>

          {/* Swatches */}
          <div className="grid grid-cols-8 gap-2">
            {swatches.map((swatch) => (
              <button
                key={swatch}
                onClick={() => handleChange(swatch)}
                className={`
                  w-8 h-8 rounded-lg transition-transform hover:scale-110
                  ${color === swatch ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                `}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
