// ─────────────────────────────────────────────────────────
//  hud.ts — Heads-Up Display (Controls Hint)
//  Reference: Section 14 (HUD)
// ─────────────────────────────────────────────────────────

let hudContainer: HTMLElement;
let messageEl: HTMLElement;
let subMessageEl: HTMLElement;

export function setupHUD() {
    hudContainer = document.createElement('div');
    Object.assign(hudContainer.style, {
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none', // Let clicks pass through
        zIndex: '50',
        transition: 'opacity 0.5s ease',
        opacity: '1',
    });

    messageEl = document.createElement('div');
    messageEl.textContent = 'CLICK TO START';
    Object.assign(messageEl.style, {
        fontFamily: '"Inter", sans-serif',
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#f0ece4',
        letterSpacing: '0.1em',
        marginBottom: '8px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    });
    hudContainer.appendChild(messageEl);

    subMessageEl = document.createElement('div');
    subMessageEl.textContent = 'WASD to Move · Mouse to Look';
    Object.assign(subMessageEl.style, {
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.9rem',
        color: 'rgba(240, 236, 228, 0.7)',
    });
    hudContainer.appendChild(subMessageEl);

    document.body.appendChild(hudContainer);
}

/**
 * Updates HUD based on control state.
 */
export function updateHUDState(isLocked: boolean) {
    if (!hudContainer) return;

    if (isLocked) {
        // Controls valid, user is playing.
        // Fade out after a few seconds.
        messageEl.textContent = '';
        subMessageEl.textContent = 'WASD to Move · ESC to Pause';

        // Fade out after 3s
        setTimeout(() => {
            hudContainer.style.opacity = '0';
        }, 3000);
    } else {
        // Controls unlocked (Pause menu)
        hudContainer.style.opacity = '1';
        messageEl.textContent = 'PAUSED';
        subMessageEl.textContent = 'Click to Resume';
    }
}
