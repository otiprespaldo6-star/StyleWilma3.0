import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppThemeConfig } from '../types';

export const DEFAULT_THEMES: AppThemeConfig[] = [
  {
    id: 'rose-gold',
    name: 'Elegancia Rose Gold',
    description: 'El estilo icónico de Wilma: rosa haute-couture con toques champán y calidez femenina.',
    category: 'light',
    primaryColor: '#E11D48',
    primaryHover: '#BE123C',
    accentColor: '#F59E0B',
    bgColor: '#FAF8F6',
    surfaceColor: '#FFFFFF',
    textColor: '#1C1917',
    textMutedColor: '#78716C',
    borderColor: '#E7E5E4',
    previewColors: ['#E11D48', '#FDA4AF', '#F59E0B', '#FAF8F6']
  },
  {
    id: 'lavender-glamour',
    name: 'Lavanda Glamour',
    description: 'Tonos orquídea y amatista pastel para una experiencia sofisticada y moderna.',
    category: 'light',
    primaryColor: '#7C3AED',
    primaryHover: '#6D28D9',
    accentColor: '#EC4899',
    bgColor: '#F8F7FF',
    surfaceColor: '#FFFFFF',
    textColor: '#1E1B4B',
    textMutedColor: '#6B7280',
    borderColor: '#E5E7EB',
    previewColors: ['#7C3AED', '#C4B5FD', '#EC4899', '#F8F7FF']
  },
  {
    id: 'emerald-luxury',
    name: 'Esmeralda & Oro Imperial',
    description: 'Verde esmeralda profundo combinado con detalles en oro cálido y frescura botánica.',
    category: 'light',
    primaryColor: '#059669',
    primaryHover: '#047857',
    accentColor: '#D97706',
    bgColor: '#F0FDF4',
    surfaceColor: '#FFFFFF',
    textColor: '#064E3B',
    textMutedColor: '#6B7280',
    borderColor: '#D1FAE5',
    previewColors: ['#059669', '#6EE7B7', '#D97706', '#F0FDF4']
  },
  {
    id: 'terracotta-sunset',
    name: 'Atardecer Terracota',
    description: 'Cálido, orgánico y vibrante, inspirado en arcillas, atardeceres y tonos tierra otoñales.',
    category: 'variety',
    primaryColor: '#EA580C',
    primaryHover: '#C2410C',
    accentColor: '#F59E0B',
    bgColor: '#FFFBF5',
    surfaceColor: '#FFFFFF',
    textColor: '#431407',
    textMutedColor: '#78716C',
    borderColor: '#FED7AA',
    previewColors: ['#EA580C', '#FDBA74', '#F59E0B', '#FFFBF5']
  },
  {
    id: 'royal-sapphire',
    name: 'Zafiro & Océano Real',
    description: 'Azul zafiro de alta costura, fresco, sereno y de alta fidelidad estética.',
    category: 'variety',
    primaryColor: '#2563EB',
    primaryHover: '#1D4ED8',
    accentColor: '#06B6D4',
    bgColor: '#F0F7FF',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    textMutedColor: '#64748B',
    borderColor: '#E2E8F0',
    previewColors: ['#2563EB', '#93C5FD', '#06B6D4', '#F0F7FF']
  },
  {
    id: 'burgundy-imperial',
    name: 'Burdeos & Terciopelo',
    description: 'Rojo vino tinto y cereza profunda con aire de lujo editorial parisino.',
    category: 'variety',
    primaryColor: '#9F1239',
    primaryHover: '#881337',
    accentColor: '#E11D48',
    bgColor: '#FFF8F8',
    surfaceColor: '#FFFFFF',
    textColor: '#4C0519',
    textMutedColor: '#78716C',
    borderColor: '#FFE4E6',
    previewColors: ['#9F1239', '#FDA4AF', '#E11D48', '#FFF8F8']
  },
  {
    id: 'nude-minimalist',
    name: 'Nude & Lino Minimalista',
    description: 'Paleta ultra pulcra, tonos arena, lino y beige neutro para máxima sobriedad.',
    category: 'light',
    primaryColor: '#57534E',
    primaryHover: '#44403C',
    accentColor: '#A8A29E',
    bgColor: '#FBF9F7',
    surfaceColor: '#FFFFFF',
    textColor: '#1C1917',
    textMutedColor: '#78716C',
    borderColor: '#E7E5E4',
    previewColors: ['#57534E', '#D6D3D1', '#A8A29E', '#FBF9F7']
  },
  {
    id: 'midnight-noir',
    name: 'Medianoche Noir (Modo Oscuro)',
    description: 'Tema oscuro de alto contraste, negro mate con acentos magenta neón y texto de alta visibilidad.',
    category: 'dark',
    primaryColor: '#F43F5E',
    primaryHover: '#FB7185',
    accentColor: '#F59E0B',
    bgColor: '#0F1117',
    surfaceColor: '#1A1D27',
    textColor: '#F9FAFB',
    textMutedColor: '#9CA3AF',
    borderColor: '#2D3345',
    previewColors: ['#0F1117', '#1A1D27', '#F43F5E', '#F59E0B']
  },
  {
    id: 'charcoal-slate',
    name: 'Charcoal & Titanio (Modo Oscuro)',
    description: 'Gris grafito suave, agradable a la vista para sesiones nocturnas con acentos dorados.',
    category: 'dark',
    primaryColor: '#F59E0B',
    primaryHover: '#D97706',
    accentColor: '#10B981',
    bgColor: '#18181B',
    surfaceColor: '#27272A',
    textColor: '#FAFAFA',
    textMutedColor: '#A1A1AA',
    borderColor: '#3F3F46',
    previewColors: ['#18181B', '#27272A', '#F59E0B', '#10B981']
  },
  {
    id: 'amethyst-dark',
    name: 'Amatista Neón (Modo Oscuro)',
    description: 'Púrpura espacial profundo y violeta vibrante con atmósfera de pasarela moderna.',
    category: 'dark',
    primaryColor: '#A855F7',
    primaryHover: '#9333EA',
    accentColor: '#EC4899',
    bgColor: '#130E26',
    surfaceColor: '#1E173D',
    textColor: '#F5F3FF',
    textMutedColor: '#A78BFA',
    borderColor: '#342B63',
    previewColors: ['#130E26', '#1E173D', '#A855F7', '#EC4899']
  }
];

const THEME_STORAGE_KEY = 'styled_by_wilma_active_theme';

interface ThemeContextType {
  currentTheme: AppThemeConfig;
  allThemes: AppThemeConfig[];
  selectTheme: (themeId: string) => void;
  updateThemeColors: (updates: Partial<AppThemeConfig>) => void;
  resetThemeToDefault: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<AppThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_THEMES[0];
  });

  // Apply theme variables dynamically to the document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.primaryColor);
    root.style.setProperty('--theme-primary-hover', currentTheme.primaryHover);
    root.style.setProperty('--theme-accent', currentTheme.accentColor);
    root.style.setProperty('--theme-bg', currentTheme.bgColor);
    root.style.setProperty('--theme-surface', currentTheme.surfaceColor);
    root.style.setProperty('--theme-text', currentTheme.textColor);
    root.style.setProperty('--theme-text-muted', currentTheme.textMutedColor);
    root.style.setProperty('--theme-border', currentTheme.borderColor);

    if (currentTheme.category === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Persist
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(currentTheme));
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }
  }, [currentTheme]);

  const selectTheme = (themeId: string) => {
    const found = DEFAULT_THEMES.find(t => t.id === themeId);
    if (found) {
      setCurrentTheme(found);
    }
  };

  const updateThemeColors = (updates: Partial<AppThemeConfig>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetThemeToDefault = () => {
    setCurrentTheme(DEFAULT_THEMES[0]);
  };

  const isDarkMode = currentTheme.category === 'dark';

  const toggleDarkMode = () => {
    if (isDarkMode) {
      // Switch to standard light
      selectTheme('rose-gold');
    } else {
      // Switch to dark
      selectTheme('midnight-noir');
    }
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      allThemes: DEFAULT_THEMES,
      selectTheme,
      updateThemeColors,
      resetThemeToDefault,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
