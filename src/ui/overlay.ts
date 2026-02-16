// ─────────────────────────────────────────────────────────
//  overlay.ts — Project details modal
//  Reference: Section 11 (UI Overlays) & Section 20
// ─────────────────────────────────────────────────────────

import { Project } from '@/data/projects';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

// DOM Elements (created at runtime to avoid HTML clutter)
let overlayContainer: HTMLElement | null = null;
let titleEl: HTMLElement;
let descriptionEl: HTMLElement;
let techStackEl: HTMLElement;
let linkEl: HTMLAnchorElement;
let closeBtn: HTMLElement;
let activeControls: PointerLockControls | null = null;

/**
 * Initialize the overlay UI in the DOM.
 * Hidden by default.
 */
export function setupOverlay() {
    if (overlayContainer) return; // Already setup

    // Create Container
    overlayContainer = document.createElement('div');
    overlayContainer.id = 'project-overlay';
    Object.assign(overlayContainer.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(13, 13, 13, 0.95)', // Backdrop
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#f0ece4',
        fontFamily: '"Inter", sans-serif',
        zIndex: '100',
        opacity: '0',
        transition: 'opacity 0.4s ease',
    });

    // Content Box
    const content = document.createElement('div');
    Object.assign(content.style, {
        maxWidth: '800px',
        textAlign: 'center',
        padding: '40px',
        border: '1px solid #333',
        backgroundColor: '#1a1a1a',
    });

    // Title
    titleEl = document.createElement('h1');
    titleEl.style.fontSize = '3rem';
    titleEl.style.marginBottom = '1rem';
    content.appendChild(titleEl);

    // Description
    descriptionEl = document.createElement('p');
    descriptionEl.style.fontSize = '1.2rem';
    descriptionEl.style.lineHeight = '1.6';
    descriptionEl.style.color = '#ccc';
    descriptionEl.style.marginBottom = '2rem';
    content.appendChild(descriptionEl);

    // Tech Stack
    techStackEl = document.createElement('div');
    techStackEl.style.marginBottom = '2rem';
    techStackEl.style.color = '#8b6914'; // Gold accent
    techStackEl.style.fontWeight = 'bold';
    content.appendChild(techStackEl);

    // Buttons Container
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '20px';
    btnGroup.style.justifyContent = 'center';

    // Visit Link
    linkEl = document.createElement('a');
    linkEl.textContent = 'Visit Project';
    linkEl.target = '_blank';
    styleButton(linkEl);
    btnGroup.appendChild(linkEl);

    // Close Button
    closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    styleButton(closeBtn);
    closeBtn.onclick = hideOverlay;
    btnGroup.appendChild(closeBtn);

    content.appendChild(btnGroup);
    overlayContainer.appendChild(content);
    document.body.appendChild(overlayContainer);
}

/**
 * Helper to style buttons uniformly.
 */
function styleButton(el: HTMLElement) {
    Object.assign(el.style, {
        padding: '12px 24px',
        fontSize: '1rem',
        cursor: 'pointer',
        border: '1px solid #f0ece4',
        backgroundColor: 'transparent',
        color: '#f0ece4',
        textDecoration: 'none',
        transition: 'all 0.2s',
    });

    el.onmouseenter = () => {
        el.style.backgroundColor = '#f0ece4';
        el.style.color = '#0d0d0d';
    };
    el.onmouseleave = () => {
        el.style.backgroundColor = 'transparent';
        el.style.color = '#f0ece4';
    };
}

/**
 * Show the overlay for a specific project.
 * Unlocks controls so cursor is visible.
 */
export function showOverlay(project: Project, controls: PointerLockControls) {
    if (!overlayContainer) setupOverlay();

    activeControls = controls;
    controls.unlock(); // Release mouse

    titleEl.textContent = project.title;
    descriptionEl.textContent = project.description;
    techStackEl.textContent = project.techStack.join(' · ');
    linkEl.href = project.link;

    if (overlayContainer) {
        overlayContainer.style.display = 'flex';
        // Small timeout to allow display:flex to apply before opacity transition
        setTimeout(() => {
            if (overlayContainer) overlayContainer.style.opacity = '1';
        }, 10);
    }
}

/**
 * Hide the overlay and resume controls.
 */
export function hideOverlay() {
    if (overlayContainer) {
        overlayContainer.style.opacity = '0';
        setTimeout(() => {
            if (overlayContainer) overlayContainer.style.display = 'none';
            if (activeControls) activeControls.lock(); // Re-lock mouse
        }, 400); // Match transition duration
    }
}
