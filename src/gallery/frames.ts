// ─────────────────────────────────────────────────────────
//  frames.ts — Project frame meshes + placards
//  Reference: Section 10 (Project Frames & Interaction) & Section 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import { Project } from '@/data/projects';
import {
    FRAME_WIDTH,
    FRAME_HEIGHT,
    FRAME_OUTER_WIDTH,
    FRAME_OUTER_HEIGHT,
    FRAME_OUTER_DEPTH,
    FRAME_BORDER,
    PLACARD_GEO_WIDTH,
    PLACARD_GEO_HEIGHT,
    PLACARD_OFFSET_Y,
    PLACARD_OFFSET_Z,
    PLACARD_CANVAS_WIDTH,
    PLACARD_CANVAS_HEIGHT,
    COLOR_PLACARD,
    ART_ROUGHNESS,
} from '@/data/constants';
import { frameMat } from '@/gallery/materials';

/**
 * Creates a complete project frame group (frame, art, placard).
 */
export function createFrame(project: Project): THREE.Group {
    const group = new THREE.Group();
    group.userData.id = project.id; // For raycasting later

    // ── 1. Outer Frame (Metal) ────────────────────────────────
    const outerGeo = new THREE.BoxGeometry(FRAME_OUTER_WIDTH, FRAME_OUTER_HEIGHT, FRAME_OUTER_DEPTH);
    const outer = new THREE.Mesh(outerGeo, frameMat);
    outer.castShadow = true;
    outer.receiveShadow = true;
    group.add(outer);

    // ── 2. Art Surface (Placeholder Texture) ──────────────────
    const artMat = new THREE.MeshStandardMaterial({
        map: createPlaceholderTexture(project.title), // Generate runtime texture
        roughness: ART_ROUGHNESS,
        metalness: 0.0,
    });

    const artGeo = new THREE.PlaneGeometry(FRAME_WIDTH, FRAME_HEIGHT);
    const art = new THREE.Mesh(artGeo, artMat);
    // Position slightly forward to sit on top of frame backing
    // Frame depth is FRAME_OUTER_DEPTH (0.06). Half is 0.03.
    // Art should be slightly proud or flush? Guide says: "Depth from wall: 0.05".
    // "Art surface... position.z = 0.04" (relative to group center?)
    // If outer frame is 0.06 thick, Z extends from -0.03 to +0.03.
    // We want art at z = 0.03 + epsilon.
    art.position.z = FRAME_OUTER_DEPTH / 2 + 0.005;
    group.add(art);

    // ── 3. Placard (Text) ─────────────────────────────────────
    const placard = createPlacard(project.title, project.techStack);
    placard.position.y = PLACARD_OFFSET_Y; // -1.1
    placard.position.z = PLACARD_OFFSET_Z; // 0.02 (relative to wall? or frame center?)
    // If frame center is at wall + depth/2.
    // Placard is on the wall?
    // Guide says: "Placard position.z = 0.02".
    // If frame is at Z=0 relative to group, placard at 0.02 is slightly inside the frame plane?
    // Wait, if frame is mounted on wall, group position is at wall surface + offset.
    // Placard should be flush with wall or slightly proud.
    // Let's assume placard is part of the group and group is placed on wall.
    group.add(placard);

    return group;
}

/**
 * Generates a dark placeholder texture with centered text.
 */
function createPlaceholderTexture(text: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768; // 4:3 aspect like the frame 2.4:1.6 (which is 3:2 actually)
    // 2.4 / 1.6 = 1.5 (3:2). 1024/768 = 1.33. Close enough or should match?
    // Let's use 1200x800 for 3:2
    canvas.width = 1200;
    canvas.height = 800;

    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Background - Dark grey gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 800);
    grad.addColorStop(0, '#1a1a1a');
    grad.addColorStop(1, '#0d0d0d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Text
    ctx.fillStyle = '#f0ece4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 80px Inter, sans-serif';
    ctx.fillText(text, 600, 400);

    // Subtext
    ctx.fillStyle = '#666';
    ctx.font = '40px Inter, sans-serif';
    ctx.fillText('Project Placeholder', 600, 480);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

/**
 * Creates the small info placard below the frame.
 */
function createPlacard(title: string, techStack: string[]): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = PLACARD_CANVAS_WIDTH;  // 512
    canvas.height = PLACARD_CANVAS_HEIGHT; // 128

    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Bg
        ctx.fillStyle = '#f5f0e8'; // COLOR_PLACARD
        ctx.fillRect(0, 0, PLACARD_CANVAS_WIDTH, PLACARD_CANVAS_HEIGHT);

        // Title
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 36px Inter, sans-serif'; // Slightly larger for readability
        ctx.fillText(title, 20, 45);

        // Stack
        ctx.fillStyle = '#666';
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText(techStack.slice(0, 3).join(' · '), 20, 90);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 1,
        metalness: 0,
    });

    const geo = new THREE.PlaneGeometry(PLACARD_GEO_WIDTH, PLACARD_GEO_HEIGHT);
    const mesh = new THREE.Mesh(geo, mat);
    return mesh;
}
