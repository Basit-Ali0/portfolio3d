// ─────────────────────────────────────────────────────────
//  scene.ts — Three.js scene, renderer, camera init
//  Reference: Sections 5, 6, 8, 20 of the build guide
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import {
    CAMERA_FOV,
    CAMERA_EYE_HEIGHT,
    CAMERA_NEAR,
    CAMERA_FAR,
    COLOR_BACKGROUND,
    TONE_MAPPING_EXPOSURE,
    MAX_PIXEL_RATIO_DESKTOP,
} from '@/data/constants';

// ── Scene ─────────────────────────────────────────────────
export const scene = new THREE.Scene();
scene.background = new THREE.Color(COLOR_BACKGROUND); // #0d0d0d

// ── Camera ────────────────────────────────────────────────
export const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,                                        // 58 — NOT 75
    window.innerWidth / window.innerHeight,
    CAMERA_NEAR,                                       // 0.1
    CAMERA_FAR,                                        // 50
);
camera.position.set(0, CAMERA_EYE_HEIGHT, -1);       // Eye height 1.7, just outside entrance

// ── Renderer ──────────────────────────────────────────────
export const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO_DESKTOP)); // Cap at 2.0
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;    // Soft shadows — NOT BasicShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping;  // Cinematic tone mapping
renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE; // 1.1
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Mount canvas to DOM
export function mountCanvas(): void {
    document.body.appendChild(renderer.domElement);
}

// ── Resize handler ────────────────────────────────────────
function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// ── Clock ─────────────────────────────────────────────────
export const clock = new THREE.Clock();

// ── Animation loop ────────────────────────────────────────
type FrameCallback = (delta: number, elapsed: number) => void;
const frameCallbacks: FrameCallback[] = [];

/**
 * Register a callback to run every frame.
 * Callbacks receive delta time (seconds) and elapsed time (seconds).
 */
export function onFrame(callback: FrameCallback): void {
    frameCallbacks.push(callback);
}

/**
 * Start the render loop.
 * By default renders with renderer.render(). 
 * Phase 15 will swap this to composer.render().
 */
let renderFn: (() => void) | null = null;

export function setRenderFunction(fn: () => void): void {
    renderFn = fn;
}

function animate(): void {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Run all registered per-frame callbacks
    for (const cb of frameCallbacks) {
        cb(delta, elapsed);
    }

    // Render
    if (renderFn) {
        renderFn();
    } else {
        renderer.render(scene, camera);
    }
}

/**
 * Initialize and start the scene.
 */
export function startLoop(): void {
    animate();
}
