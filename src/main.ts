// ─────────────────────────────────────────────────────────
//  main.ts — Entry point
//  Phase 2: Initialize scene, renderer, camera → dark empty room
// ─────────────────────────────────────────────────────────

import { mountCanvas, startLoop, scene, camera, renderer } from '@/core/scene';
import { createRoom } from '@/gallery/room';
import { createLighting } from '@/gallery/lighting';
import { setupControls } from '@/core/controls';

// Mount the Three.js canvas to the DOM
mountCanvas();

// ── Phase 3: Room Geometry ────────────────────────────────
const room = createRoom();
scene.add(room);

// ── Phase 4: Lighting ─────────────────────────────────────
const lighting = createLighting();
scene.add(lighting);

// ── Phase 6: Controls ─────────────────────────────────────
// Pass camera and renderer domElement to controls
setupControls(camera, renderer.domElement);

// Start the render loop
startLoop();

console.log('[portfolio3d] Phase 6 — Controls added (Click to lock, WASD to move).');
