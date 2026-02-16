// ─────────────────────────────────────────────────────────
//  pedestal.ts — Central display pedestal
//  Reference: Section 12 (Pedestal) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';

const PEDESTAL_WIDTH = 0.8;
const PEDESTAL_HEIGHT = 1.1; // Waist height
const PEDESTAL_DEPTH = 0.8;
const PEDESTAL_COLOR = 0xc8bfb0; // Warm grey/beige

/**
 * Creates the pedestal mesh group.
 */
export function createPedestal(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'pedestal-group';

    // 1. Base Block
    const geo = new THREE.BoxGeometry(PEDESTAL_WIDTH, PEDESTAL_HEIGHT, PEDESTAL_DEPTH);
    const mat = new THREE.MeshStandardMaterial({
        color: PEDESTAL_COLOR,
        roughness: 0.2, // Slightly polished
        metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Box geometry origin is center, so move up by half height to sit on floor (y=0)
    mesh.position.y = PEDESTAL_HEIGHT / 2;

    // Add interaction data
    mesh.userData.id = 'about-me'; // Special ID for About Me

    group.add(mesh);

    // 2. "About Me" text on top
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#c8bfb0';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 60px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ABOUT ME', 256, 256);
    }

    const topTex = new THREE.CanvasTexture(canvas);
    topTex.colorSpace = THREE.SRGBColorSpace;

    const topGeo = new THREE.PlaneGeometry(0.6, 0.6);
    const topMat = new THREE.MeshStandardMaterial({
        map: topTex,
        roughness: 0.8,
    });

    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.rotation.x = -Math.PI / 2; // Flat on top
    topMesh.position.y = PEDESTAL_HEIGHT + 0.001;
    topMesh.userData.id = 'about-me';
    group.add(topMesh);

    return group;
}
