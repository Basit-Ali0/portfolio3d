// ─────────────────────────────────────────────────────────
//  main.ts — Entry point
//  Phase 2: Initialize scene, renderer, camera → dark empty room
// ─────────────────────────────────────────────────────────

import { mountCanvas, startLoop, scene } from '@/core/scene';
import { createRoom } from '@/gallery/room';
import { createLighting } from '@/gallery/lighting';

// Mount the Three.js canvas to the DOM
mountCanvas();

// ── Phase 3: Room Geometry ────────────────────────────────
const room = createRoom();
scene.add(room);

// ── Phase 4: Lighting ─────────────────────────────────────
const lighting = createLighting();
scene.add(lighting);

// Start the render loop
startLoop();

console.log('[portfolio3d] Phase 4 — Lighting added (Room should be visible now).');
