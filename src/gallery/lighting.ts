// ─────────────────────────────────────────────────────────
//  lighting.ts — All SpotLights and AmbientLight
//  Reference: Section 6 (Lighting Setup) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import {
    AMBIENT_COLOR,
    AMBIENT_INTENSITY,
    SPOTLIGHT_COLOR,
    SPOTLIGHT_ANGLE,
    SPOTLIGHT_PENUMBRA,
    SPOTLIGHT_DECAY,
    SPOTLIGHT_HEIGHT,
    SPOTLIGHT_BASE_INTENSITY,
    SHADOW_MAP_SIZE,
    BOUNCE_LIGHT_COLOR,
    BOUNCE_LIGHT_INTENSITY,
    BOUNCE_LIGHT_DISTANCE,
    BOUNCE_LIGHT_HEIGHT,
    ENTRANCE_LIGHT_COLOR,
    ENTRANCE_LIGHT_INTENSITY,
    ENTRANCE_LIGHT_ANGLE,
    ENTRANCE_LIGHT_PENUMBRA,
    FRAME_Z_POSITIONS,
    LEFT_WALL_X,
    RIGHT_WALL_X,
    FRAME_MOUNT_Y,
    FRAME_WALL_OFFSET,
} from '@/data/constants';



/**
 * Creates all gallery lighting.
 * Returns a Group containing ambient, spots, and bounce lights.
 */
export function createLighting(): THREE.Group {
    const group = new THREE.Group();

    // ── 1. Ambient Light ──────────────────────────────────────
    // Minimal ambient just to prevent pure black shadows
    const ambient = new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY);
    group.add(ambient);

    // ── 2. Spotlights (One per frame) ─────────────────────────
    // Frames are at Z = 5, 11, 17 on both Left (-7) and Right (7) walls.

    // Helper to create a spot and its bounce light
    const createSpotSetup = (x: number, z: number, wallSide: 'left' | 'right') => {
        // Spot position: centered on frame X, but high up
        // Target position: centered on frame (Y=2.2)

        // Adjust target X slightly towards wall to hit the art perfectly?
        // Guide says: spot.position.set(frameX, 4.5, frameZ)
        // spot.target.position.set(frameX, 2.2, frameZ)

        const spot = new THREE.SpotLight(SPOTLIGHT_COLOR, SPOTLIGHT_BASE_INTENSITY);
        spot.position.set(x, SPOTLIGHT_HEIGHT, z);

        // We need to add the target to the scene for it to work, 
        // or just let the spot object manage it if we add spot to scene.
        // Actually SpotLight.target is a generic Object3D, it needs to be in scene graph.
        // We'll add it to the group.
        spot.target.position.set(x, FRAME_MOUNT_Y, z);
        group.add(spot.target);

        spot.angle = SPOTLIGHT_ANGLE;       // ~20 degrees
        spot.penumbra = SPOTLIGHT_PENUMBRA; // Soft edge
        spot.decay = SPOTLIGHT_DECAY;       // Physical falloff
        spot.distance = 20;                 // Sufficient range

        spot.castShadow = true;
        spot.shadow.mapSize.width = SHADOW_MAP_SIZE;
        spot.shadow.mapSize.height = SHADOW_MAP_SIZE;
        spot.shadow.camera.near = 0.5;
        spot.shadow.camera.far = 10;
        spot.shadow.bias = -0.0001; // Reduce shadow acne on walls

        // Store original intensity for hover effect later
        spot.userData.baseIntensity = SPOTLIGHT_BASE_INTENSITY;

        // Bounce light (PointLight near floor)
        // Guide: positioned 0.1 units above floor directly below
        const bounce = new THREE.PointLight(BOUNCE_LIGHT_COLOR, BOUNCE_LIGHT_INTENSITY, BOUNCE_LIGHT_DISTANCE);
        bounce.position.set(x, BOUNCE_LIGHT_HEIGHT, z);

        group.add(spot, bounce);
    };

    // Generate for all frame positions
    FRAME_Z_POSITIONS.forEach(z => {
        // Left Wall
        createSpotSetup(LEFT_WALL_X, z, 'left');
        // Right Wall
        createSpotSetup(RIGHT_WALL_X, z, 'right');
    });

    // ── 3. Entrance Accent Light ──────────────────────────────
    // Subtle blue-ish light near entrance
    const entranceSpot = new THREE.SpotLight(ENTRANCE_LIGHT_COLOR, ENTRANCE_LIGHT_INTENSITY);
    entranceSpot.position.set(0, 4.5, 1);
    entranceSpot.target.position.set(0, 0, 0);
    group.add(entranceSpot.target);

    entranceSpot.angle = ENTRANCE_LIGHT_ANGLE;
    entranceSpot.penumbra = ENTRANCE_LIGHT_PENUMBRA;
    entranceSpot.decay = 2;
    entranceSpot.distance = 15;

    group.add(entranceSpot);

    return group;
}
