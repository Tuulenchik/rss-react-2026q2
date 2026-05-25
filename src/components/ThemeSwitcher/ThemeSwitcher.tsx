import { useTheme } from '../../context/useTheme';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      {theme === 'dark' ? 'Light theme' : 'Dark theme'}
    </button>
  );
}
