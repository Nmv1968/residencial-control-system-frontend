import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    this.initTheme();

    // Save to localStorage whenever persistence changes
    effect(() => {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      this.updateClass();
    });
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Default to dark if running in evening maybe? For now just default to light or system
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // Check system preference
      this.isDarkMode.set(
        window.matchMedia('(prefers-color-scheme: dark)').matches,
      );
    }
    this.updateClass();
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }

  private updateClass() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
