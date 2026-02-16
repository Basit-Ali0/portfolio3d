// ─────────────────────────────────────────────────────────
//  projects.ts — Placeholder project data (6 entries)
//  Replace with real content later. Structure per Section 10.
// ─────────────────────────────────────────────────────────

export interface Project {
    id: string;
    title: string;
    role: string;
    summary: string;     // Short for placard
    description: string; // Long for overlay
    techStack: string[];
    link: string;        // Live URL
    githubUrl?: string;
    imagePath: string;
    wallSide: 'left' | 'right'; // Optional hint, though main.ts logic overrides
    zPosition: number;          // Optional hint
}

export const projects: Project[] = [
    {
        id: 'project-1',
        title: 'Project One',
        role: 'Full Stack Developer',
        summary: 'Architectural visualization platform.',
        description: 'A stunning 3D visualization platform for architectural rendering, featuring real-time lighting and material editing.',
        techStack: ['React', 'Three.js', 'GSAP'],
        link: 'https://example.com/project1',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 5,
    },
    {
        id: 'project-2',
        title: 'Project Two',
        role: 'Frontend Developer',
        summary: 'E-commerce analytics dashboard.',
        description: 'Comprehensive e-commerce dashboard with real-time analytics, dark mode, and responsive data visualization.',
        techStack: ['Next.js', 'Tailwind', 'Framer Motion'],
        link: 'https://example.com/project2',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'right',
        zPosition: 5,
    },
    {
        id: 'project-3',
        title: 'Project Three',
        role: 'Backend Developer',
        summary: 'Enterprise social tool.',
        description: 'Scalable social media management tool designed for enterprise clients, handling thousands of concurrent users.',
        techStack: ['Vue', 'Nuxt', 'Pinia'],
        link: 'https://example.com/project3',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 11,
    },
    {
        id: 'project-4',
        title: 'Project Four',
        role: 'Full Stack Developer',
        summary: 'High-performance blog.',
        description: 'A lightning-fast blog platform built with Islands architecture, achieving perfect Lighthouse scores.',
        techStack: ['Svelte', 'SvelteKit', 'Vercel'],
        link: 'https://example.com/project4',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'right',
        zPosition: 11,
    },
    {
        id: 'project-5',
        title: 'Project Five',
        role: 'Mobile Developer',
        summary: 'Backend API service.',
        description: 'Robust backend API service optimized for high throughput and low latency, powering multiple client applications.',
        techStack: ['TypeScript', 'Node.js', 'PostgreSQL'],
        link: 'https://example.com/project5',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 17,
    },
    {
        id: 'project-6',
        title: 'Project Six',
        role: 'DevOps Engineer',
        summary: 'Experimental graphics engine.',
        description: 'An experimental graphics engine running in the browser using WebGPU, demonstrating next-gen web capabilities.',
        techStack: ['WebGPU', 'Rust', 'WASM'],
        link: 'https://example.com/project6',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'right',
        zPosition: 17,
    },
];

// ── Personal details (placeholder) ───────────────────────
export const personalDetails = {
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'A short placeholder bio. This will be replaced later.',
    resumePath: '/resume.pdf',
};
