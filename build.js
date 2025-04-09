import { build } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

const options = [
  // popup
  {
    base: './',
    plugins: [react(), svgr()],
    build: {
      emptyOutDir: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    }
  },
  // service worker
  {
    build: {
      minify: false,
      sourcemap: false,
      emptyOutDir: false,
      lib: {
        entry: 'src/sw/index.ts',
        name: 'PAGESPY_EXTENSION_BACKGROUND_PLACEHOLDER',
        formats: ['iife'],
        fileName: (formats, entryName) => {
          return `sw/index.js`;
        }
      }
    }
  },
  // content - ISOLATED
  {
    build: {
      minify: false,
      sourcemap: false,
      emptyOutDir: false,
      lib: {
        entry: 'src/content/isolated.ts',
        name: 'PAGESPY_EXTENSION_CONTENT_PLACEHOLDER',
        formats: ['iife'],
        fileName: (formats, entryName) => {
          return `content/isolated.js`;
        }
      }
    }
  },
  // content - MAIN
  {
    build: {
      minify: false,
      sourcemap: false,
      emptyOutDir: false,
      lib: {
        entry: 'src/content/index.ts',
        name: 'PAGESPY_EXTENSION_CONTENT_PLACEHOLDER',
        formats: ['iife'],
        fileName: (formats, entryName) => {
          return `content/index.js`;
        }
      }
    }
  }
];

for (const option of options) {
  await build(option);
}
