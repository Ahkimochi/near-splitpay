import { defineConfig } from 'vite';

// Relative base ('./') so the built app works at any path:
// GitHub Pages project sites (/<repo>/), a custom domain root, etc.
//
// `global: 'globalThis'` is the standard near-api-js + Vite shim:
// @near-js/providers references `global.fetch` in its RPC transport
// (in a browser it finds window.fetch and never loads its node-fetch
// fallback). The Buffer global that borsh needs is set in src/main.ts.
export default defineConfig({
  base: './',
  define: {
    global: 'globalThis',
  },
});
