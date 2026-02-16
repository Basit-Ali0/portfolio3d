declare module 'three/examples/jsm/controls/PointerLockControls' {
    import { Camera, EventDispatcher, Object3D, Vector3 } from 'three';

    export class PointerLockControls extends EventDispatcher {
        constructor(camera: Camera, domElement?: HTMLElement);
        isLocked: boolean;
        domElement: HTMLElement;
        object: Camera;
        minPolarAngle: number;
        maxPolarAngle: number;
        pointerSpeed: number;

        connect(): void;
        disconnect(): void;
        dispose(): void;
        getObject(): Object3D;
        getDirection(v: Vector3): Vector3;
        lock(): void;
        unlock(): void;

        moveForward(distance: number): void;
        moveRight(distance: number): void;

        // Explicitly declare event listener overloads to suppress TS errors
        addEventListener(type: 'lock' | 'unlock' | 'change', listener: (event: any) => void): void;
        addEventListener(type: string, listener: (event: any) => void): void;
    }
}
