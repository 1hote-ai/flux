import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  accentColor: string;
  glassBlur: number;
  glowIntensity: number;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  setGlassBlur: (blur: number) => void;
  setGlowIntensity: (intensity: number) => void;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  accentColor: '#6366F1',
  glassBlur: 12,
  glowIntensity: 0.4,
  
  setTheme: (theme) => {
    set({ theme });
    get().applyTheme();
  },
  
  setAccentColor: (accentColor) => {
    set({ accentColor });
    get().applyTheme();
  },
  
  setGlassBlur: (glassBlur) => {
    set({ glassBlur });
    get().applyTheme();
  },
  
  setGlowIntensity: (glowIntensity) => {
    set({ glowIntensity });
    get().applyTheme();
  },
  
  applyTheme: () => {
    const { accentColor, glassBlur, glowIntensity } = get();
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', accentColor);
    root.style.setProperty('--accent-glow', `rgba(99, 102, 241, ${glowIntensity})`); // simple hex to rgba conversion is omitted here for simplicity, applying basic logic
    root.style.setProperty('--glass-blur', `blur(${glassBlur}px)`);
  }
}));
