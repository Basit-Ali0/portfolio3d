// ─────────────────────────────────────────────────────────
//  projects.ts — Placeholder project data (6 entries)
//  Replace with real content later. Structure per Section 10.
// ─────────────────────────────────────────────────────────

export interface Project {
    id: string;
    title: string;
    role: string;
    summary: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    imagePath: string;
    wallSide: 'left' | 'right';
    zPosition: number;
}

export const projects: Project[] = [
    {
        id: 'project-1',
        title: 'Project One',
        role: 'Full Stack Developer',
        summary:
            'A placeholder description for the first project. This will be replaced with real content later. Focus on the problem it solves.',
        techStack: ['React', 'Node.js', 'PostgreSQL'],
        liveUrl: '#',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 5,
    },
    {
        id: 'project-2',
        title: 'Project Two',
        role: 'Frontend Developer',
        summary:
            'A placeholder description for the second project. This will be replaced with real content later.',
        techStack: ['Vue', 'TypeScript', 'Firebase'],
        liveUrl: '#',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'right',
        zPosition: 5,
    },
    {
        id: 'project-3',
        title: 'Project Three',
        role: 'Backend Developer',
        summary:
            'A placeholder description for the third project. This will be replaced with real content later.',
        techStack: ['Python', 'Django', 'Redis'],
        liveUrl: '#',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 11,
    },
    {
        id: 'project-4',
        title: 'Project Four',
        role: 'Full Stack Developer',
        summary:
            'A placeholder description for the fourth project. This will be replaced with real content later.',
        techStack: ['Next.js', 'Prisma', 'AWS'],
        liveUrl: '#',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'right',
        zPosition: 11,
    },
    {
        id: 'project-5',
        title: 'Project Five',
        role: 'Mobile Developer',
        summary:
            'A placeholder description for the fifth project. This will be replaced with real content later.',
        techStack: ['React Native', 'Expo', 'GraphQL'],
        liveUrl: '#',
        githubUrl: '#',
        imagePath: '/textures/projects/placeholder.png',
        wallSide: 'left',
        zPosition: 17,
    },
    {
        id: 'project-6',
        title: 'Project Six',
        role: 'DevOps Engineer',
        summary:
            'A placeholder description for the sixth project. This will be replaced with real content later.',
        techStack: ['Docker', 'Kubernetes', 'CI/CD'],
        liveUrl: '#',
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
