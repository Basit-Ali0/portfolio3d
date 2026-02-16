// ─────────────────────────────────────────────────────────
//  loading.ts — Loading Screen UI
//  Reference: Section 17
// ─────────────────────────────────────────────────────────

let loadingScreen: HTMLElement;
let progressBar: HTMLElement;
let progressText: HTMLElement;

export function setupLoadingScreen() {
    if (loadingScreen) return;

    loadingScreen = document.createElement('div');
    Object.assign(loadingScreen.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '200',
        transition: 'opacity 1s ease',
    });

    const title = document.createElement('h1');
    title.textContent = 'PORTFOLIO 3D';
    Object.assign(title.style, {
        fontFamily: '"Inter", sans-serif',
        fontSize: '2rem',
        color: '#f0ece4',
        letterSpacing: '0.2em',
        marginBottom: '20px',
    });
    loadingScreen.appendChild(title);

    // Bar Container
    const barContainer = document.createElement('div');
    Object.assign(barContainer.style, {
        width: '200px',
        height: '4px',
        backgroundColor: '#333',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
    });
    loadingScreen.appendChild(barContainer);

    // Bar
    progressBar = document.createElement('div');
    Object.assign(progressBar.style, {
        width: '0%',
        height: '100%',
        backgroundColor: '#f0ece4',
        transition: 'width 0.1s linear',
    });
    barContainer.appendChild(progressBar);

    // Text
    progressText = document.createElement('div');
    progressText.textContent = '0%';
    Object.assign(progressText.style, {
        marginTop: '10px',
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.8rem',
        color: '#666',
    });
    loadingScreen.appendChild(progressText);

    document.body.appendChild(loadingScreen);
}

export function updateLoadingProgress(progress: number) {
    if (progressBar) {
        const pct = Math.floor(progress * 100);
        progressBar.style.width = `${pct}%`;
        progressText.textContent = `${pct}%`;
    }
}

export function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
        }, 1000);
    }
}
