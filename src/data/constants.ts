// ─────────────────────────────────────────────────────────
//  constants.ts — ALL magic numbers from Section 20
//  Single source of truth. Import from here everywhere.
// ─────────────────────────────────────────────────────────

// ── Room ──────────────────────────────────────────────────
export const ROOM_WIDTH = 14;
export const ROOM_LENGTH = 28;
export const ROOM_HEIGHT = 5;
export const WALL_THICKNESS = 0.3;

// ── Camera ────────────────────────────────────────────────
export const CAMERA_FOV = 58;
export const CAMERA_EYE_HEIGHT = 1.7;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 50;
export const WALK_SPEED = 3.2; // units per second
export const MOUSE_SENSITIVITY = 0.0018;
export const DAMPING = 8.0;
export const HEAD_BOB_AMPLITUDE = 0.028;
export const HEAD_BOB_FREQUENCY = 1.8; // Hz

// ── Frames ────────────────────────────────────────────────
export const FRAME_WIDTH = 2.4;
export const FRAME_HEIGHT = 1.6;
export const FRAME_MOUNT_Y = 2.2;
export const FRAME_WALL_OFFSET = 0.05;
export const FRAME_BORDER = 0.1;
export const FRAME_Z_POSITIONS = [5, 11, 17] as const;
export const LEFT_WALL_X = -7;
export const RIGHT_WALL_X = 7;

// Outer frame geometry (frame + border)
export const FRAME_OUTER_WIDTH = FRAME_WIDTH + FRAME_BORDER * 2; // 2.6
export const FRAME_OUTER_HEIGHT = FRAME_HEIGHT + FRAME_BORDER * 2; // 1.8
export const FRAME_OUTER_DEPTH = 0.06;

// ── Lighting ──────────────────────────────────────────────
export const AMBIENT_INTENSITY = 0.08;
export const AMBIENT_COLOR = 0xfff5e6;
export const SPOTLIGHT_ANGLE = Math.PI / 9; // ~20°
export const SPOTLIGHT_PENUMBRA = 0.45;
export const SPOTLIGHT_DECAY = 2;
export const SPOTLIGHT_HEIGHT = 4.5;
export const SPOTLIGHT_BASE_INTENSITY = 2.8;
export const SPOTLIGHT_HOVER_INTENSITY = 4.2;
export const SPOTLIGHT_LERP_SPEED = 0.05;
export const SHADOW_MAP_SIZE = 512;

// Bounce lights
export const BOUNCE_LIGHT_COLOR = 0xffe8cc;
export const BOUNCE_LIGHT_INTENSITY = 0.15;
export const BOUNCE_LIGHT_DISTANCE = 3;
export const BOUNCE_LIGHT_HEIGHT = 0.1;

// Entrance accent light
export const ENTRANCE_LIGHT_COLOR = 0xc8d8ff;
export const ENTRANCE_LIGHT_INTENSITY = 0.6;
export const ENTRANCE_LIGHT_ANGLE = Math.PI / 6;
export const ENTRANCE_LIGHT_PENUMBRA = 0.8;

// Pedestal light
export const PEDESTAL_LIGHT_INTENSITY = 3.2;
export const PEDESTAL_LIGHT_ANGLE = Math.PI / 10;
export const PEDESTAL_LIGHT_PENUMBRA = 0.5;

// ── Post-Processing ──────────────────────────────────────
export const BLOOM_STRENGTH = 0.35;
export const BLOOM_RADIUS = 0.4;
export const BLOOM_THRESHOLD = 0.88;
export const VIGNETTE_OFFSET = 0.95;
export const VIGNETTE_DARKNESS = 1.4;

// ── Animations ────────────────────────────────────────────
export const DOOR_OPEN_DURATION = 1.2; // seconds
export const CAMERA_GLIDE_SPEED = 4; // lerp factor
export const CINEMATIC_ENTRY_DURATION = 2.5; // seconds
export const OVERLAY_TRANSITION_DURATION = 0.4; // seconds
export const CONTROLS_HINT_DURATION = 5; // seconds

// ── Colors ────────────────────────────────────────────────
export const COLOR_BACKGROUND = 0x0d0d0d;
export const COLOR_WALLS = 0xf0ece4;
export const COLOR_CEILING = 0x0d0d0d;
export const COLOR_FRAME_METAL = 0x111111;
export const COLOR_PLACARD = 0xf5f0e8;
export const COLOR_PEDESTAL = 0xc8bfb0;
export const COLOR_BASEBOARD = 0x1a1a1a;
export const COLOR_FLOOR_BASE = 0x8b6914;

// ── Materials ─────────────────────────────────────────────
export const WALL_ROUGHNESS = 0.92;
export const WALL_METALNESS = 0.0;
export const FLOOR_ROUGHNESS = 0.68;
export const FLOOR_METALNESS = 0.0;
export const FLOOR_ENVMAP_INTENSITY = 0.4;
export const FRAME_METAL_ROUGHNESS = 0.18;
export const FRAME_METAL_METALNESS = 0.85;
export const ART_ROUGHNESS = 0.9;
export const ART_METALNESS = 0.0;
export const CEILING_ROUGHNESS = 1.0;
export const CEILING_METALNESS = 0.0;

// ── Renderer ──────────────────────────────────────────────
export const TONE_MAPPING_EXPOSURE = 1.1;

// ── Performance ───────────────────────────────────────────
export const MAX_PIXEL_RATIO_DESKTOP = 2.0;
export const MAX_PIXEL_RATIO_MOBILE = 1.5;
export const MAX_SHADOW_LIGHTS = 6;
export const TEXTURE_MAX_SIZE = 1024;
export const TARGET_FPS_DESKTOP = 60;
export const TARGET_FPS_MOBILE = 30;

// ── Collision ─────────────────────────────────────────────
export const COLLISION_MIN_X = -6.2;
export const COLLISION_MAX_X = 6.2;
export const COLLISION_MIN_Z = 0.5;
export const COLLISION_MAX_Z = 26.5;

// ── Interaction ───────────────────────────────────────────
export const FRAME_PROXIMITY_THRESHOLD = 3; // units — spotlight brightens
export const CAMERA_STOP_DISTANCE = 1.2; // units from frame on click

// ── Pedestal ──────────────────────────────────────────────
export const PEDESTAL_RADIUS_TOP = 0.4;
export const PEDESTAL_RADIUS_BOTTOM = 0.5;
export const PEDESTAL_HEIGHT = 1.1;
export const PEDESTAL_Z = 20;

// ── Resume Door ───────────────────────────────────────────
export const RESUME_DOOR_WIDTH = 1.4;
export const RESUME_DOOR_HEIGHT = 2.6;
export const RESUME_DOOR_DEPTH = 0.08;
export const RESUME_DOOR_Z = 27;

// ── Audio ─────────────────────────────────────────────────
export const AMBIENT_AUDIO_VOLUME = 0.06;
export const DOOR_AUDIO_VOLUME = 0.25;

// ── Placard ───────────────────────────────────────────────
export const PLACARD_CANVAS_WIDTH = 512;
export const PLACARD_CANVAS_HEIGHT = 128;
export const PLACARD_GEO_WIDTH = 1.2;
export const PLACARD_GEO_HEIGHT = 0.3;
export const PLACARD_OFFSET_Y = -1.1;
export const PLACARD_OFFSET_Z = 0.02;
