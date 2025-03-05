import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    sourcemap: false,
    emptyOutDir: false,
    lib: {
      entry: 'background/index.ts',
      name: 'PAGESPY_EXTENSION_BACKGROUND_PLACEHOLDER',
      formats: ['iife'],
      fileName: (formats, entryName) => {
        return `background.js`;
      }
    }
  }
});
