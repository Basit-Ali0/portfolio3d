
import { Camera, EventDispatcher, Object3D, WebGLRenderer, WebGLRenderTarget, Scene, Material, Color, Vector2 } from 'three';

// ── Controls ──────────────────────────────────────────────

declare module 'three/examples/jsm/controls/PointerLockControls' {
    export class PointerLockControls extends EventDispatcher {
        constructor(camera: Camera, domElement?: HTMLElement);
        isLocked: boolean;
        minPolarAngle: number;
        maxPolarAngle: number;
        pointerSpeed: number;

        connect(): void;
        disconnect(): void;
        dispose(): void;
        getObject(): Object3D;
        getDirection(v: Object3D): Object3D;
        moveForward(distance: number): void;
        moveRight(distance: number): void;
        lock(): void;
        unlock(): void;

        addEventListener(type: string, listener: (event: any) => void): void;
        hasEventListener(type: string, listener: (event: any) => void): boolean;
        removeEventListener(type: string, listener: (event: any) => void): void;
        dispatchEvent(event: { type: string;[attachment: string]: any }): void;
    }
}

// ── Post Processing ───────────────────────────────────────

declare module 'three/examples/jsm/postprocessing/Pass' {
    export class Pass {
        constructor();
        enabled: boolean;
        needsSwap: boolean;
        clear: boolean;
        renderToScreen: boolean;

        setSize(width: number, height: number): void;
        render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;
        dispose(): void;
    }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
    import { Pass } from 'three/examples/jsm/postprocessing/Pass';

    export class EffectComposer {
        constructor(renderer: WebGLRenderer, renderTarget?: WebGLRenderTarget);
        renderer: WebGLRenderer;
        renderTarget1: WebGLRenderTarget;
        renderTarget2: WebGLRenderTarget;
        writeBuffer: WebGLRenderTarget;
        readBuffer: WebGLRenderTarget;
        passes: Pass[];

        addPass(pass: Pass): void;
        insertPass(pass: Pass, index: number): void;
        removePass(pass: Pass): void;
        render(deltaTime?: number): void;
        reset(renderTarget?: WebGLRenderTarget): void;
        setSize(width: number, height: number): void;
        setPixelRatio(pixelRatio: number): void;
        dispose(): void;
    }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
    import { Pass } from 'three/examples/jsm/postprocessing/Pass';

    export class RenderPass extends Pass {
        constructor(scene: Scene, camera: Camera, overrideMaterial?: Material, clearColor?: Color, clearAlpha?: number);
        scene: Scene;
        camera: Camera;
        overrideMaterial: Material | undefined;
        clearColor: Color | undefined;
        clearAlpha: number | undefined;
        clearDepth: boolean;
    }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
    import { Pass } from 'three/examples/jsm/postprocessing/Pass';

    export class UnrealBloomPass extends Pass {
        constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
        resolution: Vector2;
        strength: number;
        radius: number;
        threshold: number;
        clearColor: Color;
    }
}

declare module 'three/examples/jsm/postprocessing/OutputPass' {
    import { Pass } from 'three/examples/jsm/postprocessing/Pass';
    export class OutputPass extends Pass {
        constructor();
    }
}
