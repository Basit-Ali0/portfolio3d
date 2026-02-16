// ─────────────────────────────────────────────────────────
//  controls.ts — Custom first-person controls with damping
//  Reference: Section 8 (Camera & Movement) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import {
    WALK_SPEED,
    DAMPING,
    HEAD_BOB_AMPLITUDE,
    HEAD_BOB_FREQUENCY,
    COLLISION_MIN_X,
    COLLISION_MAX_X,
    COLLISION_MIN_Z,
    COLLISION_MAX_Z,
    CAMERA_EYE_HEIGHT,
} from '@/data/constants';
import { onFrame } from '@/core/scene';

// State for movement
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const keys = { w: false, a: false, s: false, d: false };

let controls: PointerLockControls;
let isLocked = false;

/**
 * Initialize custom first-person controls.
 */
export function setupControls(camera: THREE.Camera, domElement: HTMLElement): PointerLockControls {
    controls = new PointerLockControls(camera, domElement);

    // Click to lock
    domElement.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        isLocked = true;
    });

    controls.addEventListener('unlock', () => {
        isLocked = false;
    });

    // Keyboard listeners
    window.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'KeyW': keys.w = true; break;
            case 'KeyA': keys.a = true; break;
            case 'KeyS': keys.s = true; break;
            case 'KeyD': keys.d = true; break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch (e.code) {
            case 'KeyW': keys.w = false; break;
            case 'KeyA': keys.a = false; break;
            case 'KeyS': keys.s = false; break;
            case 'KeyD': keys.d = false; break;
        }
    });

    // Register update loop
    onFrame((delta, elapsed) => {
        if (!isLocked) return;
        updateMovement(delta, elapsed);
    });

    return controls;
}

/**
 * Physics update loop
 */
function updateMovement(delta: number, elapsed: number): void {
    // 1. Calculate direction from inputs
    // z > 0 is backwards, z < 0 is forwards in Three.js standard
    const moveForward = Number(keys.w) - Number(keys.s);
    const moveRight = Number(keys.d) - Number(keys.a);

    // 2. Apply acceleration/velocity
    // Determine target velocity based on input
    // Actually guide says: apply to velocity with damping

    direction.z = moveForward;
    direction.x = moveRight;
    direction.normalize();

    if (keys.w || keys.s) {
        velocity.z -= direction.z * WALK_SPEED * delta;
    }
    if (keys.a || keys.d) {
        velocity.x -= direction.x * WALK_SPEED * delta;
    }

    // 3. Apply Damping (deceleration)
    velocity.x -= velocity.x * DAMPING * delta;
    velocity.z -= velocity.z * DAMPING * delta;

    // 4. Move Camera
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    // 5. Collision Detection (Clamp Position)
    const cameraFn = controls.getObject(); // This is the camera
    cameraFn.position.x = Math.max(COLLISION_MIN_X, Math.min(COLLISION_MAX_X, cameraFn.position.x));
    cameraFn.position.z = Math.max(COLLISION_MIN_Z, Math.min(COLLISION_MAX_Z, cameraFn.position.z));

    // 6. Head Bob
    const speed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2);
    const isMoving = speed > 0.1;

    if (isMoving) {
        // Guide: Math.sin(Date.now() * ...) 
        const bob = Math.sin(elapsed * HEAD_BOB_FREQUENCY * 5) * HEAD_BOB_AMPLITUDE;
        // * 5 to roughly match Hz if elapsed is seconds? 
        // Guide says Freq 1.8. 
        // sin(t * freq * 2π). 1.8 * 2π ≈ 11.
        // Let's use elapsed * HEAD_BOB_FREQUENCY * 2 * Math.PI
        const bobOffset = Math.sin(elapsed * HEAD_BOB_FREQUENCY * Math.PI * 2) * HEAD_BOB_AMPLITUDE;
        cameraFn.position.y = CAMERA_EYE_HEIGHT + bobOffset;
    } else {
        // Smooth return to resting height
        cameraFn.position.y = THREE.MathUtils.lerp(cameraFn.position.y, CAMERA_EYE_HEIGHT, 0.1);
    }
}
