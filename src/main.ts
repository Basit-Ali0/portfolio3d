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

// ── Phase 9: All Frames ───────────────────────────────────
import { RIGHT_WALL_X } from '@/data/constants';

projects.forEach((project, index) => {
    const frame = createFrame(project);

    // First 3 on Left Wall, Next 3 on Right Wall
    const isLeft = index < 3;
    const zIndex = index % 3; // 0, 1, 2
    const z = FRAME_Z_POSITIONS[zIndex]; // 5, 11, 17

    if (isLeft) {
        // Left Wall (-X), Facing Right (+X)
        frame.position.set(LEFT_WALL_X, FRAME_MOUNT_Y, z);
        frame.rotation.y = Math.PI / 2;
    } else {
        // Right Wall (+X), Facing Left (-X)
        frame.position.set(RIGHT_WALL_X, FRAME_MOUNT_Y, z);
        frame.rotation.y = -Math.PI / 2;
    }

    scene.add(frame);
});

// ── Phase 6: Controls ─────────────────────────────────────
// Pass camera and renderer domElement to controls
setupControls(camera, renderer.domElement);

// Start the render loop
startLoop();

console.log('[portfolio3d] Phase 6 — Controls added (Click to lock, WASD to move).');
