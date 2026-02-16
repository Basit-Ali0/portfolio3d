# 3D Portfolio Gallery — Complete Build Guide
> A grand, cinematic, recruiter-stopping Three.js gallery portfolio. This document is your single source of truth for building it. Follow it top to bottom.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [User Flow — The Full Experience](#4-user-flow--the-full-experience)
5. [Scene Architecture](#5-scene-architecture)
6. [Lighting Setup](#6-lighting-setup)
7. [Materials & Color Palette](#7-materials--color-palette)
8. [Camera & Movement](#8-camera--movement)
9. [Post-Processing](#9-post-processing)
10. [Project Frames & Interaction](#10-project-frames--interaction)
11. [UI Overlays](#11-ui-overlays)
12. [Audio Design](#12-audio-design)
13. [Mobile Strategy](#13-mobile-strategy)
14. [Performance Optimisation](#14-performance-optimisation)
15. [Content Sections](#15-content-sections)
16. [The Resume Door](#16-the-resume-door)
17. [Loading Screen](#17-loading-screen)
18. [Anti-Roblox Checklist](#18-anti-roblox-checklist)
19. [Build Order](#19-build-order)
20. [Exact Numbers Reference](#20-exact-numbers-reference)

---

## 1. Project Overview

A first-person 3D art gallery built entirely in Three.js where each "painting" is one of your projects. The visitor walks through a warm, cinematic space lit by spotlights, leans into project frames to read about them, and exits through a door that downloads your resume.

**The goal is not to impress with complexity. The goal is to create a physical memory in the recruiter's mind.** They should walk away thinking "the candidate with the gallery" — not "the candidate with the cool website."

### Core Design Principles
- Minimal geometry, maximum lighting craft
- Every interaction has a smooth camera animation — nothing snaps
- UI is invisible until needed, then disappears
- Mobile degrades gracefully, never breaks
- Load time under 4 seconds on a fast connection, under 8 on mobile

---

## 2. Tech Stack

| Layer | Tool | Why |
|---|---|---|
| 3D Rendering | Three.js (r160+) | WebGL abstraction, massive ecosystem |
| Post-Processing | `@react-three/postprocessing` or raw `EffectComposer` | Bloom, Vignette |
| Controls | Custom — do NOT use PointerLockControls directly | Need custom damping |
| Device Detection | `detect-gpu` npm package | GPU tier-based fallback |
| Asset Loading | `GLTFLoader` + `KTXLoader` | Compressed textures |
| Bundler | Vite | Fast HMR, easy asset handling |
| Language | Vanilla JS or TypeScript (TS preferred) | Type safety on complex scene logic |
| Textures | KTX2 / Basis compressed | Up to 75% size reduction |

### What NOT to use
- React Three Fiber — adds abstraction overhead you don't need for a single-scene portfolio
- A-Frame — too opinionated, Roblox-adjacent defaults
- Raw WebGL — no benefit over Three.js for this use case
- BabylonJS — heavier bundle, different ecosystem

---

## 3. Folder Structure

```
/src
  /core
    scene.ts          ← Three.js scene, renderer, camera init
    controls.ts       ← Custom first-person controls with damping
    loader.ts         ← Asset preloading manager
    postprocessing.ts ← EffectComposer setup
  /gallery
    room.ts           ← Walls, floor, ceiling geometry
    frames.ts         ← Project frame meshes + placards
    lighting.ts       ← All SpotLights and AmbientLight
    door.ts           ← Entrance door + resume door
    pedestal.ts       ← About section pedestal
  /ui
    loading.ts        ← Loading screen DOM
    overlay.ts        ← Project detail card (HTML over canvas)
    hud.ts            ← Controls hint, minimal UI
  /data
    projects.ts       ← Your project data (title, desc, image, links)
    constants.ts      ← All magic numbers in one place (from Section 20)
  /utils
    device.ts         ← Mobile/GPU detection
    math.ts           ← Lerp helpers, easing functions
  main.ts             ← Entry point
/public
  /textures
    /projects         ← Your project screenshots (KTX2 format)
    floor_wood.ktx2
    wall_plaster.ktx2
  /models
    bench.glb         ← Optional: single Blender accent piece
  /audio
    ambient.mp3       ← Very quiet gallery ambience
    door_open.mp3     ← Entrance door creak
```

---

## 4. User Flow — The Full Experience

### Phase 1: Loading Screen
- Black background, your name centered in clean serif or geometric sans font
- Subtitle fades in 600ms after name: your title ("Full Stack Developer" etc.)
- Thin progress bar at bottom fills as assets load
- No spinner. No percentage number. Just the bar.
- When loading hits 100%, bar completes, then 400ms pause, then fade to black

### Phase 2: The Entrance (Cinematic — User Does Nothing)
- Camera starts 2 units outside the closed gallery doors, slightly low angle looking up
- Doors swing open inward over 1.2 seconds with ease-out curve
- Subtle door-creak audio plays (0.3 volume max)
- Camera automatically glides forward into the gallery over 2.5 seconds, smooth ease-in-out
- Camera settles just inside the entrance, facing the first project wall
- Total cinematic duration: ~4 seconds

### Phase 3: Orientation
- 500ms after camera settles, a small control hint card fades in (bottom-left corner)
- Desktop: "WASD to walk · Mouse to look · Click a frame to view"
- Mobile: "Drag to look · Tap a frame to view"
- Card auto-disappears after 5 seconds OR as soon as the user starts moving
- Never show it again in that session

### Phase 4: Free Exploration
- User walks the gallery at their own pace
- As they approach a project frame within 3 units, the frame's spotlight subtly brightens (lerp from base intensity to highlight intensity over 500ms)
- Placard text beneath the frame becomes fully opaque (was at 0.6 opacity at distance)
- This draws them forward without any UI prompt

### Phase 5: Project Interaction
- User clicks / taps a frame
- Camera glides toward that frame and stops 1.2 units in front of it over 600ms
- Project detail overlay slides in from the right (HTML/CSS layer over the canvas)
- 3D scene remains visible but blurred via `backdrop-filter: blur(8px)` on the overlay background
- Overlay contains: project title, your role, problem solved (2-3 sentences), tech stack tags, live demo link, GitHub link
- Pressing Escape or clicking X: overlay slides out, camera glides back to previous position

### Phase 6: The About Section
- Far end of the gallery has a raised platform with a pedestal
- On the pedestal: floating panel with your photo (as a texture), name, one-line bio
- Walking up to it triggers the panel to gently face toward the camera (billboard effect, very slow)
- Clicking it opens the same style overlay with your full about content

### Phase 7: The Resume Door
- Back wall has a door labeled "Download Résumé" on a placard
- Clicking it: door swings open animation (same as entrance door), then your PDF downloads
- This is the last thing in the gallery — reward for completing the walk

---

## 5. Scene Architecture

### The Room
Build entirely in Three.js — no Blender needed for the structure.

```
Room dimensions:
  Width:  14 units
  Length: 28 units  (long enough to require walking)
  Height: 5 units

Wall thickness: 0.3 units (use BoxGeometry, not just a plane — gives realistic door reveals)

Layout:
  Entrance:    Z = 0
  Project walls: Z = 2 to Z = 22 (left and right walls)
  About pedestal: Center of room at Z = 20
  Resume door: Back wall at Z = 27
```

### Wall Layout — Project Frame Positions
```
Left wall  (X = -7):  3 frames at Z = 5, 11, 17
Right wall (X =  7):  3 frames at Z = 5, 11, 17

Each frame:
  Width:  2.4 units
  Height: 1.6 units
  Mounted at Y = 2.2 (eye level when camera is at Y = 1.7)
  Depth from wall: 0.05 units (slight protrusion)
```

### Geometry Components
```
Floor:     PlaneGeometry(14, 28) — wood texture, receives shadows
Ceiling:   PlaneGeometry(14, 28) — near black, no texture needed
Walls:     BoxGeometry with thickness — plaster texture
Baseboard: BoxGeometry(14, 0.15, 0.05) — dark, slightly metallic
Frames:    BoxGeometry for outer frame + PlaneGeometry for the art inside
Placards:  PlaneGeometry with canvas texture (rendered text)
Door:      BoxGeometry hinged at edge, animated via rotation.y
Pedestal:  CylinderGeometry(0.4, 0.5, 1.1) — marble-ish material
```

### Blender — Optional Accent Only
If you want one Blender model, make it a simple gallery bench centered in the room at Z = 14. Export as `.glb`, compress with `gltf-pipeline`. Keep it under 80KB. Everything else stays in Three.js.

---

## 6. Lighting Setup

This section is the most important. Wrong lighting = Roblox. Right lighting = gallery.

### The Rule
Almost zero ambient light. All drama comes from spotlights.

### Ambient Light
```js
const ambient = new THREE.AmbientLight(0xfff5e6, 0.08)
// Warm white, extremely low intensity
// This is just to prevent pure black shadows — not to illuminate
```

### Spotlights — One Per Frame (6 total)
```js
// For each project frame, create one spotlight above it
const spot = new THREE.SpotLight(0xfff5e0, 2.8)
spot.position.set(frameX, 4.5, frameZ)    // Just below ceiling
spot.target.position.set(frameX, 2.2, frameZ)  // Aimed at frame center
spot.angle = Math.PI / 9                   // ~20 degree cone
spot.penumbra = 0.45                       // CRITICAL — soft shadow edge
spot.decay = 2                             // Physically correct falloff
spot.castShadow = true
spot.shadow.mapSize.width = 512            // Don't go higher — performance
spot.shadow.mapSize.height = 512
spot.shadow.camera.near = 0.5
spot.shadow.camera.far = 8
```

### Floor Reflection Lights
```js
// Small, very dim point lights near the floor to fake light bounce
// One per spotlight, positioned 0.1 units above the floor directly below
const bounce = new THREE.PointLight(0xffe8cc, 0.15, 3)
bounce.position.set(frameX, 0.1, frameZ)
```

### Entrance Accent Light
```js
// Subtle blue-ish light near the entrance door for contrast
const entrance = new THREE.SpotLight(0xc8d8ff, 0.6)
entrance.position.set(0, 4.5, 1)
entrance.target.position.set(0, 0, 0)
entrance.angle = Math.PI / 6
entrance.penumbra = 0.8
```

### About Pedestal Light
```js
const pedestalSpot = new THREE.SpotLight(0xfff5e0, 3.2)
pedestalSpot.position.set(0, 4.5, 20)
pedestalSpot.target = pedestalMesh
pedestalSpot.angle = Math.PI / 10
pedestalSpot.penumbra = 0.5
```

### Renderer Shadow Settings
```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap  // Soft shadows, not PCFShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.1
renderer.outputColorSpace = THREE.SRGBColorSpace
```

### Frame Hover — Spotlight Intensity Animation
```js
// In your animation loop, lerp spotlight intensity on proximity
const dist = camera.position.distanceTo(framePosition)
const targetIntensity = dist < 3 ? 4.2 : 2.8
spot.intensity = THREE.MathUtils.lerp(spot.intensity, targetIntensity, 0.05)
```

---

## 7. Materials & Color Palette

### Scene Colors
```
Background / ceiling:  #0d0d0d  (near black — not pure black)
Walls:                 #f0ece4  (warm off-white — not pure white)
Floor wood (base):     #8B6914  (dark oak — actual texture over this)
Baseboards:            #1a1a1a
Frame outer:           #111111  (matte black metal)
Frame inner (art):     your project screenshot texture
Placard:               #f5f0e8
Pedestal:              #c8bfb0  (warm stone/marble)
```

### Wall Material
```js
const wallMat = new THREE.MeshStandardMaterial({
  color: 0xf0ece4,
  roughness: 0.92,
  metalness: 0.0,
  // Optional: add a subtle normal map for plaster texture
})
```

### Floor Material
```js
const floorMat = new THREE.MeshStandardMaterial({
  map: woodTexture,           // KTX2 compressed wood texture
  roughness: 0.68,
  metalness: 0.0,
  envMapIntensity: 0.4,       // Subtle spotlight reflection on floor
})
```

### Frame Outer (Metal)
```js
const frameMat = new THREE.MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.18,
  metalness: 0.85,            // This catches light beautifully
})
```

### Frame Art (Project Screenshot)
```js
const artMat = new THREE.MeshStandardMaterial({
  map: projectTexture,
  roughness: 0.9,
  metalness: 0.0,
  // No emissive — the spotlight does the illumination
})
```

### Ceiling
```js
const ceilingMat = new THREE.MeshStandardMaterial({
  color: 0x0d0d0d,
  roughness: 1.0,
  metalness: 0.0,
})
```

---

## 8. Camera & Movement

### Camera Setup
```js
const camera = new THREE.PerspectiveCamera(
  58,                                    // FOV — not 75 (that's a shooter)
  window.innerWidth / window.innerHeight,
  0.1,
  50
)
camera.position.set(0, 1.7, -1)          // Eye height 1.7 units
```

### Custom Controls — Do Not Use Default PointerLockControls

Build your own with damping. This is what separates elegant from janky.

```js
// State
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
const keys = { w: false, a: false, s: false, d: false }

// Settings
const WALK_SPEED = 3.2          // units per second — slower than a game
const DAMPING = 8.0             // higher = snappier stop
const MOUSE_SENSITIVITY = 0.0018
const HEAD_BOB_AMPLITUDE = 0.028
const HEAD_BOB_FREQUENCY = 1.8

// In animation loop (delta = time since last frame)
function updateMovement(delta) {
  // Direction from keys
  direction.z = Number(keys.s) - Number(keys.w)
  direction.x = Number(keys.d) - Number(keys.a)
  direction.normalize()

  // Apply to velocity with damping
  if (keys.w || keys.s) {
    velocity.z -= direction.z * WALK_SPEED * delta
  }
  if (keys.a || keys.d) {
    velocity.x -= direction.x * WALK_SPEED * delta
  }

  // Damping (this creates the deceleration feel)
  velocity.x -= velocity.x * DAMPING * delta
  velocity.z -= velocity.z * DAMPING * delta

  // Move
  controls.moveRight(-velocity.x * delta)
  controls.moveForward(-velocity.z * delta)

  // Head bob (only when moving)
  const isMoving = Math.abs(velocity.x) > 0.01 || Math.abs(velocity.z) > 0.01
  if (isMoving) {
    const bob = Math.sin(Date.now() * 0.001 * HEAD_BOB_FREQUENCY) * HEAD_BOB_AMPLITUDE
    camera.position.y = 1.7 + bob
  } else {
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.7, 0.1)
  }
}
```

### Collision — Keep User In Room
```js
// Simple AABB — clamp camera position after each move
camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6.2, 6.2)
camera.position.z = THREE.MathUtils.clamp(camera.position.z, 0.5, 26.5)
```

### Camera Cinematic Animations
```js
// Use a simple lerp approach for all camera transitions
// Store target position and lerp toward it each frame

let cameraTarget = null

function setCameraTarget(pos, lookAt, onComplete) {
  cameraTarget = { pos, lookAt, onComplete }
}

function updateCinematicCamera(delta) {
  if (!cameraTarget) return
  camera.position.lerp(cameraTarget.pos, 4 * delta)
  // Use a quaternion lerp for rotation
  const dist = camera.position.distanceTo(cameraTarget.pos)
  if (dist < 0.05) {
    cameraTarget.onComplete?.()
    cameraTarget = null
  }
}
```

---

## 9. Post-Processing

Two effects only. Do not add more.

```js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

// Bloom — only affects very bright spots (spotlight reflections, frame edges)
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.35,    // strength — subtle
  0.4,     // radius
  0.88     // threshold — only very bright pixels bloom
)
composer.addPass(bloom)

// Vignette — darkens screen edges, cinematic feel
const vignette = new ShaderPass(VignetteShader)
vignette.uniforms['offset'].value = 0.95
vignette.uniforms['darkness'].value = 1.4
composer.addPass(vignette)

// In your render loop: use composer.render() instead of renderer.render()
```

### Mobile — Disable Post-Processing
```js
// On mobile or low GPU tier, skip the composer entirely
if (isMobile || gpuTier < 2) {
  renderer.render(scene, camera)  // Direct render, no effects
} else {
  composer.render()
}
```

---

## 10. Project Frames & Interaction

### Frame Data Structure
```ts
interface Project {
  id: string
  title: string
  role: string
  summary: string          // 2-3 sentences max
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  imagePath: string        // path to KTX2 texture
  wallSide: 'left' | 'right'
  zPosition: number
}
```

### Building a Frame
```js
function createFrame(project) {
  const group = new THREE.Group()

  // Outer frame (metal border)
  const outerGeo = new THREE.BoxGeometry(2.6, 1.8, 0.06)
  const outer = new THREE.Mesh(outerGeo, frameMat)

  // Art surface (project screenshot)
  const artGeo = new THREE.PlaneGeometry(2.4, 1.6)
  const art = new THREE.Mesh(artGeo, new THREE.MeshStandardMaterial({
    map: loadTexture(project.imagePath),
    roughness: 0.9,
  }))
  art.position.z = 0.04

  // Placard below frame
  const placard = createPlacard(project.title, project.techStack)
  placard.position.y = -1.1
  placard.position.z = 0.02

  group.add(outer, art, placard)
  return group
}
```

### Placard (Canvas Texture)
```js
function createPlacard(title, techStack) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f5f0e8'
  ctx.fillRect(0, 0, 512, 128)

  ctx.fillStyle = '#1a1a1a'
  ctx.font = 'bold 32px "Inter", sans-serif'
  ctx.fillText(title, 20, 45)

  ctx.fillStyle = '#666'
  ctx.font = '20px "Inter", sans-serif'
  ctx.fillText(techStack.join('  ·  '), 20, 90)

  const texture = new THREE.CanvasTexture(canvas)
  const geo = new THREE.PlaneGeometry(1.2, 0.3)
  const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 1 })
  return new THREE.Mesh(geo, mat)
}
```

### Click Detection
```js
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(frameObjects, true)

  if (hits.length > 0) {
    const frame = hits[0].object.userData.project
    openProjectOverlay(frame)
  }
})
```

---

## 11. UI Overlays

All overlays are HTML/CSS positioned absolutely over the canvas. Do not try to build UI inside Three.js.

### Project Detail Card — CSS
```css
.project-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  height: 100vh;
  background: rgba(10, 10, 10, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255,255,255,0.08);
  padding: 48px 36px;
  color: #f0ece4;
  font-family: 'Inter', sans-serif;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 100;
}

.project-overlay.open {
  transform: translateX(0);
}

.project-overlay h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.project-overlay .role {
  color: rgba(240,236,228,0.5);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 24px;
}

.project-overlay .summary {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(240,236,228,0.8);
  margin-bottom: 28px;
}

.tech-tag {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 999px;
  font-size: 0.78rem;
  margin: 4px 4px 4px 0;
  color: rgba(240,236,228,0.7);
}

.overlay-links {
  margin-top: 36px;
  display: flex;
  gap: 16px;
}

.overlay-link {
  padding: 10px 24px;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 4px;
  color: #f0ece4;
  text-decoration: none;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.overlay-link:hover {
  background: rgba(255,255,255,0.08);
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  color: rgba(240,236,228,0.4);
  font-size: 1.4rem;
  cursor: pointer;
}
```

### Controls Hint
```css
.controls-hint {
  position: fixed;
  bottom: 32px;
  left: 32px;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 12px 20px;
  border-radius: 6px;
  color: rgba(240,236,228,0.6);
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  opacity: 1;
  transition: opacity 1s ease;
}

.controls-hint.hidden {
  opacity: 0;
  pointer-events: none;
}
```

---

## 12. Audio Design

Audio must enhance immersion without ever being annoying.

```js
// All audio at very low volume. User can mute.
const audioLoader = new THREE.AudioLoader()
const listener = new THREE.AudioListener()
camera.add(listener)

// Ambient — quiet gallery atmosphere (low hum, subtle reverb)
const ambient = new THREE.Audio(listener)
audioLoader.load('/audio/ambient.mp3', (buffer) => {
  ambient.setBuffer(buffer)
  ambient.setLoop(true)
  ambient.setVolume(0.06)     // Very quiet
  ambient.play()
})

// Door open — plays during entrance cinematic
const doorSound = new THREE.Audio(listener)
audioLoader.load('/audio/door_open.mp3', (buffer) => {
  doorSound.setBuffer(buffer)
  doorSound.setVolume(0.25)
})

// Footsteps — subtle, plays while moving
// Use a short loop tied to movement state
```

### Mute Button
Always provide a mute toggle in the top corner. Many recruiters are in open offices.

---

## 13. Mobile Strategy

### Detection
```js
import { getGPUTier } from 'detect-gpu'

const gpuTier = await getGPUTier()
const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
const isLowEnd = gpuTier.tier < 2 || isMobile

// Pass this flag to all systems
```

### Mobile Scene Simplifications
```js
if (isLowEnd) {
  // Lighting
  renderer.shadowMap.enabled = false    // Biggest win
  bloom.enabled = false                 // Skip post-processing
  // Fewer lights — remove bounce lights, keep only main spotlights at 50% intensity

  // Geometry
  // Use lower segment counts on any curved geometry

  // Pixel ratio
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))  // Not 2

  // Textures
  // Load half-size textures on mobile (provide @2x and @1x versions)
}
```

### Mobile Controls — Touch
```js
let touchStart = { x: 0, y: 0 }
let isPointerLocked = false

// On desktop: Pointer Lock API for mouse look
// On mobile: touch drag for look, virtual joystick or swipe for movement

canvas.addEventListener('touchstart', (e) => {
  touchStart.x = e.touches[0].clientX
  touchStart.y = e.touches[0].clientY
})

canvas.addEventListener('touchmove', (e) => {
  const dx = e.touches[0].clientX - touchStart.x
  const dy = e.touches[0].clientY - touchStart.y
  // Apply to camera yaw and pitch with sensitivity factor
  yaw -= dx * 0.003
  pitch -= dy * 0.003
  touchStart.x = e.touches[0].clientX
  touchStart.y = e.touches[0].clientY
})
```

### Mobile Layout
- Overlay cards go full-screen on mobile (not the 420px side panel)
- Controls hint uses tap-specific instructions
- Resume door downloads work on mobile browsers (test this)

---

## 14. Performance Optimisation

### Renderer
```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))  // Cap at 2x
renderer.setSize(window.innerWidth, window.innerHeight)

// Only render when there's something to update
// For idle moments (overlay open, no movement) — lower frame rate
let fps = 60
if (overlayOpen && !isMoving) fps = 20
```

### Texture Compression
```
Tool: Basis Universal (basisu CLI or squoosh)
Format: KTX2 with ETC1S for diffuse textures, UASTC for normal maps
Size: Project screenshots should be 1024x768 max, compressed to ~80-120KB each
Wood floor texture: 1024x1024, compressed ~150KB
```

### Geometry
- Merge static geometries into a single buffer where possible (`BufferGeometryUtils.mergeGeometries`)
- Room walls, ceiling, baseboards can be merged into one mesh
- Dispose of geometries and materials when not needed (not applicable here since scene is static)

### Frustum Culling
Three.js handles this automatically but ensure you do not disable it.

### Shadow Map Count
Limit to 6 shadow-casting lights maximum. Each shadow map costs GPU memory and draw calls.

---

## 15. Content Sections

### Projects Data Template
```ts
const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Your Project Name',
    role: 'Full Stack Developer',
    summary: 'A brief, compelling 2-3 sentence description. Focus on the problem it solves, not the features it has. Recruiters read this in 8 seconds.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://yourproject.com',
    githubUrl: 'https://github.com/you/project',
    imagePath: '/textures/projects/project-1.ktx2',
    wallSide: 'left',
    zPosition: 5,
  },
  // ... 5 more projects
]
```

### About Pedestal Content
Keep it very short. The gallery is not a place for essays.
- Photo (circular crop recommended)
- Name
- One line: what you do and what makes you different
- Link to LinkedIn (opens in new tab, does NOT break the 3D experience)

### Frame Order Strategy
Put your strongest project at Z=5 on the RIGHT wall — it's the first thing users see when they enter because they naturally look right. Put your second strongest at Z=5 on the LEFT wall. Third strongest at Z=11 right, and so on. Save the weakest for Z=17.

---

## 16. The Resume Door

```js
function createResumeDoor() {
  // Door geometry
  const doorGeo = new THREE.BoxGeometry(1.4, 2.6, 0.08)
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.3,
    metalness: 0.6,
  })
  const door = new THREE.Mesh(doorGeo, doorMat)

  // Hinge is on the left edge — pivot at x = -0.7
  door.geometry.translate(0.7, 0, 0)  // Offset geometry so pivot is at edge
  door.position.set(-0.7, 1.3, 27)    // Position hinge at left side of doorway

  // Placard above door
  const placard = createPlacard('Download Résumé', [])
  placard.position.set(0, 3, 27.05)

  // Click handler
  door.userData.isResumeDoor = true

  return door
}

function openResumeDoor(door) {
  // Animate door open
  const targetRotation = -Math.PI / 2
  const animate = () => {
    door.rotation.y = THREE.MathUtils.lerp(door.rotation.y, targetRotation, 0.05)
    if (Math.abs(door.rotation.y - targetRotation) > 0.01) {
      requestAnimationFrame(animate)
    } else {
      // Door fully open — trigger download
      const a = document.createElement('a')
      a.href = '/resume.pdf'
      a.download = 'YourName_Resume.pdf'
      a.click()
    }
  }
  doorSound.play()
  animate()
}
```

---

## 17. Loading Screen

```html
<!-- HTML structure -->
<div id="loading-screen">
  <div class="loading-content">
    <h1 class="your-name">Your Name</h1>
    <p class="title">Full Stack Developer</p>
    <div class="progress-bar">
      <div class="progress-fill" id="progress-fill"></div>
    </div>
  </div>
</div>
```

```css
#loading-screen {
  position: fixed;
  inset: 0;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.6s ease;
}

.your-name {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 300;
  color: #f0ece4;
  letter-spacing: -0.03em;
  margin: 0 0 8px;
  animation: fadeIn 0.8s ease forwards;
}

.title {
  font-size: 0.9rem;
  color: rgba(240,236,228,0.4);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 48px;
  animation: fadeIn 0.8s 0.6s ease both;
}

.progress-bar {
  width: 200px;
  height: 1px;
  background: rgba(255,255,255,0.1);
}

.progress-fill {
  height: 100%;
  background: rgba(240,236,228,0.6);
  width: 0%;
  transition: width 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

```js
// Track loading progress
const manager = new THREE.LoadingManager()
manager.onProgress = (url, loaded, total) => {
  const pct = (loaded / total) * 100
  document.getElementById('progress-fill').style.width = pct + '%'
}
manager.onLoad = () => {
  setTimeout(() => {
    document.getElementById('loading-screen').style.opacity = '0'
    setTimeout(() => {
      document.getElementById('loading-screen').remove()
      startCinematicEntrance()
    }, 600)
  }, 400)
}
```

---

## 18. Anti-Roblox Checklist

Before you call it done, go through every single item here.

### Lighting
- [ ] Ambient light intensity is 0.08 or below
- [ ] Every spotlight has `penumbra` of 0.4 or higher
- [ ] `PCFSoftShadowMap` is set on renderer
- [ ] `ACESFilmicToneMapping` is set on renderer
- [ ] Scene background is dark (`#0d0d0d` or similar)
- [ ] Ceiling is dark, not lit

### Materials
- [ ] Walls are off-white (`#f0ece4`) NOT pure `#ffffff`
- [ ] Floor has a real texture, not a flat color
- [ ] Frame outer material has `metalness` above 0.8
- [ ] No material has both high `metalness` AND high `roughness` — pick one
- [ ] No default `MeshBasicMaterial` anywhere in the final scene (it ignores lighting)

### Camera
- [ ] FOV is 58 or below (not 75)
- [ ] Movement has damping (not instant velocity)
- [ ] Head bob amplitude is 0.03 or below
- [ ] Walking speed feels slow and deliberate, not fast

### Post-Processing
- [ ] Bloom threshold is 0.85 or higher (so it's very selective)
- [ ] Bloom strength is 0.4 or below (subtle)
- [ ] Vignette is present but not oppressive

### UI
- [ ] No large colored buttons with visible borders in the 3D scene
- [ ] Overlay uses `backdrop-filter: blur()` not opaque background
- [ ] Typography is thin weight (300 or 400), not bold
- [ ] No hover color changes that are instant — all transitions are 200ms+

### Feel
- [ ] The entrance cinematic runs automatically, no click needed
- [ ] First project frame is visible and lit from the starting camera position
- [ ] Clicking a frame smoothly moves camera — does NOT snap
- [ ] Walking into a wall stops movement cleanly — no clipping or bouncing
- [ ] On mobile, the experience is usable — test on an actual phone

---

## 19. Build Order

Follow this sequence. Do not skip ahead.

1. **Renderer + scene + camera setup** — just a dark empty room, fog, tone mapping
2. **Basic room geometry** — floor, 4 walls, ceiling, correct dimensions
3. **Lighting** — get this right before adding anything else. Spend real time here.
4. **Materials** — apply all materials to the room, check colors
5. **Custom movement controls** — WASD + mouse look with damping, collision
6. **One project frame** — build the full frame + placard + spotlight system for one frame only
7. **Verify it looks right** — if the single frame looks cinematic, scale to 6
8. **All 6 frames** — place all projects, tune spotlight positions
9. **Click interaction** — raycaster + camera glide + overlay card
10. **Loading screen** — progress bar, name reveal, cinematic entrance
11. **About pedestal** — geometry, billboard panel, overlay
12. **Resume door** — geometry, animation, download trigger
13. **Controls hint UI** — small overlay, auto-hide
14. **Post-processing** — add Bloom and Vignette last, tune carefully
15. **Audio** — ambient sound, door sound, mute button
16. **Mobile pass** — test on a real device, apply all mobile simplifications
17. **Performance audit** — check frame rate on mid-range hardware
18. **Anti-Roblox checklist** — go through every item
19. **Deploy** — Vercel or Netlify, enable gzip/brotli compression

---

## 20. Exact Numbers Reference

All magic numbers in one place. When building, always reference this section.

```
ROOM
  Width:              14
  Length:             28
  Height:             5
  Wall thickness:     0.3

CAMERA
  FOV:                58
  Eye height:         1.7
  Near clip:          0.1
  Far clip:           50
  Walk speed:         3.2 units/sec
  Mouse sensitivity:  0.0018
  Damping:            8.0
  Head bob amplitude: 0.028
  Head bob frequency: 1.8 Hz

FRAMES
  Width:              2.4
  Height:             1.6
  Mount height:       2.2 (Y)
  Wall offset depth:  0.05
  Frame border:       0.1 (outer vs inner)
  Z positions:        5, 11, 17
  Left wall X:       -7
  Right wall X:       7

LIGHTING
  Ambient intensity:  0.08
  Ambient color:      0xfff5e6
  Spotlight angle:    PI / 9
  Spotlight penumbra: 0.45
  Spotlight decay:    2
  Spotlight height:   4.5
  Base intensity:     2.8
  Hover intensity:    4.2
  Lerp speed:         0.05
  Shadow map size:    512

POST-PROCESSING
  Bloom strength:     0.35
  Bloom radius:       0.4
  Bloom threshold:    0.88
  Vignette offset:    0.95
  Vignette darkness:  1.4

ANIMATIONS
  Door open duration: 1.2 sec
  Camera glide speed: 4 (lerp factor)
  Cinematic entry:    2.5 sec
  Overlay transition: 0.4 sec
  Controls hint show: 5 sec

COLORS
  Background:         #0d0d0d
  Walls:              #f0ece4
  Ceiling:            #0d0d0d
  Frame metal:        #111111
  Placard bg:         #f5f0e8
  Pedestal:           #c8bfb0

PERFORMANCE
  Max pixel ratio:    2.0 (desktop)  1.5 (mobile)
  Max shadow lights:  6
  Texture max size:   1024px
  Target frame rate:  60fps desktop, 30fps mobile
```

---

*Last updated for Three.js r160+. If using a later version, check the migration guide for any API changes to EffectComposer and shadow map settings.*
