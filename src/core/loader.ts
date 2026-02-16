// ─────────────────────────────────────────────────────────
//  loader.ts — Asset Loading Manager
//  Reference: Section 17 (Loading Screen) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';

export const manager = new THREE.LoadingManager();
export const textureLoader = new THREE.TextureLoader(manager);

// Track progress
let onProgressCallback: (progress: number) => void = () => { };
let onLoadCallback: () => void = () => { };

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    onProgressCallback(progress);
};

manager.onLoad = () => {
    onLoadCallback();
};

/**
 * Register callbacks for loading UI
 */
export function onLoadProgress(cb: (progress: number) => void) {
    onProgressCallback = cb;
}

export function onLoadComplete(cb: () => void) {
    onLoadCallback = cb;
}

/**
 * Start loading specific assets.
 * Currently we don't have external assets, so we simulate or load placeholder.
 * If we add a floor texture later, we request it here.
 */
export function loadAssets() {
    // Simulate loading delay if no real assets
    // Use setTimeout to fake a load process since we have no external textures yet
    let progress = 0;
    const interval = setInterval(() => {
        progress += 0.1;
        onProgressCallback(progress);
        if (progress >= 1) {
            clearInterval(interval);
            onLoadCallback();
        }
    }, 100);
}

// ── Floor Texture Generation ──────────────────────────────
// Guide says "Floor Texture" is desired.
// Let's create a procedural one so we have something to "load" 
// (even though canvas is sync, we can pretend or just return it).
export function createFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#8b6914'; // Base goldish
        ctx.fillRect(0, 0, 512, 512);

        // Noise / Grain
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = '#000';
        for (let i = 0; i < 5000; i++) {
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 8);
    return tex;
}
