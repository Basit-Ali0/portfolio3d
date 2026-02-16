// ─────────────────────────────────────────────────────────
//  main.ts — Entry point
//  Phase 2: Initialize scene, renderer, camera → dark empty room
// ─────────────────────────────────────────────────────────

import { mountCanvas, startLoop, scene, camera, renderer } from '@/core/scene';
import { createRoom } from '@/gallery/room';
import { createLighting } from '@/gallery/lighting';
import { setupControls } from '@/core/controls';
import { createFrame } from '@/gallery/frames';
import { projects } from '@/data/projects';
import { LEFT_WALL_X, FRAME_MOUNT_Y, FRAME_Z_POSITIONS } from '@/data/constants';

// Mount the Three.js canvas to the DOM
mountCanvas();

// ── Phase 3: Room Geometry ────────────────────────────────
const room = createRoom();
scene.add(room);

// ── Phase 4: Lighting ─────────────────────────────────────
const lighting = createLighting();
scene.add(lighting);

// ── Phase 7: One Frame (Test) ─────────────────────────────
const project = projects[0]; // "Project One"
const frame = createFrame(project);
// Position: Left wall, first Z slot
frame.position.set(LEFT_WALL_X, FRAME_MOUNT_Y, FRAME_Z_POSITIONS[0]);
// Rotate to face inward (Right = +X direction)
frame.rotation.y = Math.PI / 2;
scene.add(frame);

// ── Phase 6: Controls ─────────────────────────────────────
// Pass camera and renderer domElement to controls
setupControls(camera, renderer.domElement);

// Start the render loop
startLoop();

console.log('[portfolio3d] Phase 6 — Controls added (Click to lock, WASD to move).');
