// ─────────────────────────────────────────────────────────
//  main.ts — Entry point
//  Phase 2: Initialize scene, renderer, camera → dark empty room
// ─────────────────────────────────────────────────────────

import { mountCanvas, startLoop, scene } from '@/core/scene';
import { createRoom } from '@/gallery/room';

// Mount the Three.js canvas to the DOM
mountCanvas();

// ── Phase 3: Room Geometry ────────────────────────────────
const room = createRoom();
scene.add(room);

// Start the render loop
startLoop();

console.log('[portfolio3d] Phase 3 — Room geometry added (Dark view expected until lighting Phase 4).');
