import { defineConfig } from 'vite';

// Relative base ('./') so the built app works at any path:
// GitHub Pages project sites (/<repo>/), a custom domain root, etc.
//
// No Node shims are needed: the wallet layer (@hot-labs/near-connect)
// is plain browser code — no `global`, no `Buffer` polyfills.
export default defineConfig({
  base: './',
});
