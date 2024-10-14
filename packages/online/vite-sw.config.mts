import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['chrome100'],
    minify: false,
    sourcemap: true,
    emptyOutDir: false,
    lib: {
      entry: 'src/background.ts',
      name: 'PAGESPY_EXTENSION_BACKGROUND_PLACEHOLDER',
      formats: ['iife'],
      fileName: (formats, entryName) => {
        return `background.js`;
      }
    }
  }
});
