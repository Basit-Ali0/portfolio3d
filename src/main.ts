// ─────────────────────────────────────────────────────────
//  main.ts — Entry point
//  Phase 2: Initialize scene, renderer, camera → dark empty room
// ─────────────────────────────────────────────────────────

import { mountCanvas, startLoop } from '@/core/scene';

// Mount the Three.js canvas to the DOM
mountCanvas();

// Start the render loop — currently renders an empty dark room (#0d0d0d)
startLoop();

console.log('[portfolio3d] Phase 2 — Dark empty room rendering.');
