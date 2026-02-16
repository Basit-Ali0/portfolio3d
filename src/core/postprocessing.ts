// ─────────────────────────────────────────────────────────
//  postprocessing.ts — EffectComposer setup (Bloom + Vignette)
//  Reference: Section 9 & 20
// ─────────────────────────────────────────────────────────

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import {
    renderer,
    scene,
    camera,
    setRenderFunction
} from '@/core/scene';
import {
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
} from '@/data/constants';

let composer: EffectComposer;

export function setupPostProcessing() {
    // 1. Init Composer
    // Use manually allocated targets if needed, but default is usually fine.
    composer = new EffectComposer(renderer);

    // 2. Render Pass (Base Scene)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 3. Bloom Pass
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        BLOOM_STRENGTH,
        BLOOM_RADIUS,
        BLOOM_THRESHOLD
    );
    composer.addPass(bloomPass);

    // 4. Output Pass (Tone Mapping & Color Space correction)
    // Essential since we used 'renderer.outputColorSpace = SRGB' but Composer disables it on renderer.
    // OutputPass applies tone mapping and color space conversion at the end.
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // 5. Take over the render loop
    setRenderFunction(() => {
        composer.render();
    });

    // 6. Handle Resize
    window.addEventListener('resize', () => {
        composer.setSize(window.innerWidth, window.innerHeight);
    });
}
