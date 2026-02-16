// ─────────────────────────────────────────────────────────
//  materials.ts — Shared material definitions
//  Reference: Section 7 (Materials & Color Palette) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import {
    COLOR_WALLS,
    COLOR_FLOOR_BASE,
    COLOR_CEILING,
    COLOR_BASEBOARD,
    COLOR_FRAME_METAL,
    WALL_ROUGHNESS,
    WALL_METALNESS,
    FLOOR_ROUGHNESS,
    FLOOR_METALNESS,
    CEILING_ROUGHNESS,
    CEILING_METALNESS,
    FRAME_METAL_ROUGHNESS,
    FRAME_METAL_METALNESS,
} from '@/data/constants';

// ── Room Materials ────────────────────────────────────────

export const wallMat = new THREE.MeshStandardMaterial({
    color: COLOR_WALLS,       // #f0ece4
    roughness: WALL_ROUGHNESS,
    metalness: WALL_METALNESS,
});

export const floorMat = new THREE.MeshStandardMaterial({
    color: COLOR_FLOOR_BASE,  // #8b6914
    roughness: FLOOR_ROUGHNESS,
    metalness: FLOOR_METALNESS,
    // map: woodTexture (Phase 11 loader)
});

export const ceilingMat = new THREE.MeshStandardMaterial({
    color: COLOR_CEILING,     // #0d0d0d
    roughness: CEILING_ROUGHNESS,
    metalness: CEILING_METALNESS,
    side: THREE.BackSide,
});

export const baseboardMat = new THREE.MeshStandardMaterial({
    color: COLOR_BASEBOARD,   // #1a1a1a
    roughness: 0.8,
    metalness: 0.1,
});

// ── Frame Materials ───────────────────────────────────────

export const frameMat = new THREE.MeshStandardMaterial({
    color: COLOR_FRAME_METAL, // #111111
    roughness: FRAME_METAL_ROUGHNESS,
    metalness: FRAME_METAL_METALNESS,
});
