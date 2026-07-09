import React from 'react';
import { X, Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Modo Claro',
      description: 'Tema claro para ambientes iluminados',
      icon: Sun,
    },
    {
      value: 'dark' as const,
      label: 'Modo Oscuro',
      description: 'Tema oscuro para reducir la fatiga visual',
      icon: Moon,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Configuracion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Theme Section */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
            Apariencia
          </h3>

          <div className="space-y-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-800'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Vista previa:</span> El tema se aplica inmediatamente a toda la aplicacion.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
