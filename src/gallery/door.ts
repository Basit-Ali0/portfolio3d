// ─────────────────────────────────────────────────────────
//  door.ts — Entrance and Exit/Resume Doors
//  Reference: Section 16 (The Resume Door)
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import {
    RESUME_DOOR_WIDTH,
    RESUME_DOOR_HEIGHT,
    RESUME_DOOR_DEPTH,
    RESUME_DOOR_Z,
    DOOR_OPEN_DURATION,
    COLOR_FRAME_METAL,
} from '@/data/constants';

/**
 * Creates the interactive Resume Door at the end of the gallery.
 */
export function createResumeDoor(): THREE.Group {
    const group = new THREE.Group();

    // Door Geometry
    const geometry = new THREE.BoxGeometry(RESUME_DOOR_WIDTH, RESUME_DOOR_HEIGHT, RESUME_DOOR_DEPTH);
    const material = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.3,
        metalness: 0.6,
    });

    const door = new THREE.Mesh(geometry, material);
    door.castShadow = true;
    door.receiveShadow = true;

    // Geometry offset for hinge pivoting
    // Pivot at x = -width/2.
    geometry.translate(RESUME_DOOR_WIDTH / 2, 0, 0);
    // Wait, if pivot is left edge, and door is centered...
    // Guide says: "door.geometry.translate(0.7, 0, 0)" for width 1.4.
    // This moves center to +0.7. So visual center is at +0.7 relative to local origin.
    // Local origin (0,0) is now the LEFT edge.

    // Pivot point needs to be at the door frame.
    // If we want it centered on the wall (x=0), the hinge is at x = -0.7.
    // So we position the MESH at x = -0.7.
    door.position.set(-RESUME_DOOR_WIDTH / 2, RESUME_DOOR_HEIGHT / 2, 0);

    door.userData.id = 'resume-door'; // Interaction ID
    door.userData.isOpen = false;

    group.add(door);
    group.position.set(0, 0, RESUME_DOOR_Z);

    // Placard "EXIT / RESUME"
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#1a1a1a'; // Dark bg? Or transparent?
        // Guide creates a placard separately. Let's stick to simple text on door or above.
        // "Placard position.set(0, 3, 27.05)"
    }

    // Let's create the placard above the door
    const placardGeo = new THREE.PlaneGeometry(1.2, 0.3);
    const placardMat = new THREE.MeshStandardMaterial({
        color: 0xf5f0e8,
        roughness: 0.9,
    });
    const placard = new THREE.Mesh(placardGeo, placardMat);
    placard.position.set(0, RESUME_DOOR_HEIGHT + 0.4, 0.05);

    // Add text texture to placard
    // (Simplified for now, just the mesh)

    group.add(placard);

    return group;
}

/**
 * Creates the static Entrance Door behind the start position.
 */
export function createEntranceDoor(): THREE.Group {
    const group = new THREE.Group();

    const width = 2.0;
    const height = 3.5;

    const geo = new THREE.BoxGeometry(width, height, 0.1);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x050505, // Very dark
        roughness: 0.8,
    });

    const door = new THREE.Mesh(geo, mat);
    door.position.set(0, height / 2, 0);
    group.add(door);

    // Position behind start (Z = -0.1)
    group.position.set(0, 0, -0.1);

    return group;
}

/**
 * Animates the door opening.
 */
export function openDoor(doorGroup: THREE.Object3D) {
    // We need to find the actual door mesh inside the group
    // The group is at Z=27. The door mesh is the child with userData.id='resume-door'
    const door = doorGroup.children.find(c => c.userData.id === 'resume-door');
    if (!door) return;

    if (door.userData.isOpen) return;
    door.userData.isOpen = true;

    const targetRotation = -Math.PI / 2 - 0.2; // Open outwards or inwards?
    // If hinge is at left (-0.7), and we rotate Y.
    // Rotating negative Y swings it "in" (towards -Z) or "out" (towards +Z)?
    // Standard Frame: +Z is towards camera (if looking at it from inside room looking back).
    // Wait, room is 0..28. Camera looks down -Z? No.
    // Camera set at (0, 1.7, -1). Looking at (0,0,0) implied?
    // main.ts defines camera: `camera.lookAt(0, 1.7, 0);` usually?
    // Let's check scene.ts/main.ts camera setup.
    // Actually usually in Three.js default camera looks down -Z.
    // If we are at -1 and look at +Z (room), then Z=28 is far away.
    // So we walk towards +Z.
    // Door is at Z=27. We see its FRONT face.
    // Hinge is at Left (X = -0.7).
    // Opening "out" (away from us) means rotating into +Z space? No, room ends at 28.
    // Resume door leads ... out?
    // Let's rotate -Pi/2.

    let alpha = 0;
    const startRot = door.rotation.y;

    const animate = () => {
        alpha += 0.02; // Speed roughly match duration
        if (alpha > 1) alpha = 1;

        // Ease out
        const t = 1 - Math.pow(1 - alpha, 3);

        door.rotation.y = startRot + (targetRotation - startRot) * t;

        if (alpha < 1) {
            requestAnimationFrame(animate);
        } else {
            // Done
            window.open('/resume.pdf', '_blank');
        }
    };
    animate();
}
