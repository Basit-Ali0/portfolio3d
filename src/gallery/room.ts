// ─────────────────────────────────────────────────────────
//  room.ts — Walls, floor, ceiling geometry
//  Reference: Section 5 (Scene Architecture) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import {
    ROOM_WIDTH,
    ROOM_LENGTH,
    ROOM_HEIGHT,
    WALL_THICKNESS,
    COLOR_WALLS,
    COLOR_CEILING,
    COLOR_FLOOR_BASE,
    COLOR_BASEBOARD,
    WALL_ROUGHNESS,
    WALL_METALNESS,
    FLOOR_ROUGHNESS,
    FLOOR_METALNESS,
    CEILING_ROUGHNESS,
    CEILING_METALNESS,
} from '@/data/constants';

/**
 * Creates the main gallery room geometry.
 * Returns a Group containing floor, ceiling, walls, and baseboards.
 */
export function createRoom(): THREE.Group {
    const roomGroup = new THREE.Group();

    // ── Materials (Base color only, no textures yet) ──────────
    // These will respond to light in Phase 4.
    const wallMat = new THREE.MeshStandardMaterial({
        color: COLOR_WALLS,       // #f0ece4
        roughness: WALL_ROUGHNESS,
        metalness: WALL_METALNESS,
    });

    const floorMat = new THREE.MeshStandardMaterial({
        color: COLOR_FLOOR_BASE,  // #8b6914
        roughness: FLOOR_ROUGHNESS,
        metalness: FLOOR_METALNESS,
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
        color: COLOR_CEILING,     // #0d0d0d
        roughness: CEILING_ROUGHNESS,
        metalness: CEILING_METALNESS,
        side: THREE.BackSide,     // Render inside face
    });

    const baseboardMat = new THREE.MeshStandardMaterial({
        color: COLOR_BASEBOARD,   // #1a1a1a
        roughness: 0.8,
        metalness: 0.1,
    });

    // ── 1. Floor ──────────────────────────────────────────────
    // PlaneGeometry(width, height)
    // Rotated -90deg to lie flat.
    const floorGeo = new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_LENGTH);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.name = 'floor';
    roomGroup.add(floor);

    // ── 2. Ceiling ────────────────────────────────────────────
    const ceilingGeo = new THREE.PlaneGeometry(ROOM_WIDTH, ROOM_LENGTH);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = ROOM_HEIGHT;
    ceiling.name = 'ceiling';
    // Ceiling doesn't strictly need to receive shadows in this setup, but good for correctness
    roomGroup.add(ceiling);

    // ── 3. Walls ──────────────────────────────────────────────
    // We use BoxGeometry with thickness to allow for door reveals
    // Room center is (0,0,roomLength/2) effectively, but let's stick to the guide's coordinates:
    // Layout: Entrance Z=0, Back Z=28
    // Center of room in Z is 14.

    // Left Wall (X = -7)
    const leftWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, ROOM_HEIGHT, ROOM_LENGTH);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-ROOM_WIDTH / 2 - WALL_THICKNESS / 2, ROOM_HEIGHT / 2, ROOM_LENGTH / 2);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    leftWall.name = 'wall-left';
    roomGroup.add(leftWall);

    // Right Wall (X = 7)
    const rightWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, ROOM_HEIGHT, ROOM_LENGTH);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(ROOM_WIDTH / 2 + WALL_THICKNESS / 2, ROOM_HEIGHT / 2, ROOM_LENGTH / 2);
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    rightWall.name = 'wall-right';
    roomGroup.add(rightWall);

    // Back Wall (Z = 28)
    const backWallGeo = new THREE.BoxGeometry(ROOM_WIDTH + WALL_THICKNESS * 2, ROOM_HEIGHT, WALL_THICKNESS);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, ROOM_HEIGHT / 2, ROOM_LENGTH + WALL_THICKNESS / 2);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    backWall.name = 'wall-back';
    roomGroup.add(backWall);

    // Front Wall (Entrance, Z = 0)
    // Contains the door opening. Implementation: two partial walls or a shape with hole.
    // For simplicity based on guide: BoxGeometry.
    // We'll leave a gap for the door (width 1.4 + frame).
    // Let's make it two segments: Left of door, Right of door, and simple Lintel above.
    // Or just one big wall and we place the door *in* it? 
    // Guide says: "Entrance: Z=0".
    // Let's put a simplified front wall for now.
    const frontWallGeo = new THREE.BoxGeometry(ROOM_WIDTH + WALL_THICKNESS * 2, ROOM_HEIGHT, WALL_THICKNESS);
    const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
    frontWall.position.set(0, ROOM_HEIGHT / 2, -WALL_THICKNESS / 2);
    frontWall.receiveShadow = true;
    frontWall.name = 'wall-front';
    roomGroup.add(frontWall);

    // ── 4. Baseboards ─────────────────────────────────────────
    // Run along the base of the walls. Height 0.15, Depth 0.05
    // Same positioning logic as walls.

    const BASE_H = 0.15;
    const BASE_D = 0.05;

    // Left Baseboard
    const bbLeft = new THREE.Mesh(
        new THREE.BoxGeometry(BASE_D, BASE_H, ROOM_LENGTH),
        baseboardMat
    );
    bbLeft.position.set(-ROOM_WIDTH / 2 + BASE_D / 2, BASE_H / 2, ROOM_LENGTH / 2);
    roomGroup.add(bbLeft);

    // Right Baseboard
    const bbRight = new THREE.Mesh(
        new THREE.BoxGeometry(BASE_D, BASE_H, ROOM_LENGTH),
        baseboardMat
    );
    bbRight.position.set(ROOM_WIDTH / 2 - BASE_D / 2, BASE_H / 2, ROOM_LENGTH / 2);
    roomGroup.add(bbRight);

    // Back Baseboard
    const bbBack = new THREE.Mesh(
        new THREE.BoxGeometry(ROOM_WIDTH, BASE_H, BASE_D),
        baseboardMat
    );
    bbBack.position.set(0, BASE_H / 2, ROOM_LENGTH - BASE_D / 2);
    roomGroup.add(bbBack);

    return roomGroup;
}
