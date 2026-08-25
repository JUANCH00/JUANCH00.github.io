import type { Profile } from '@domain/profile'
import { asset } from './asset'

const EMAIL = 'jues377@gmail.com'
const GITHUB_URL = 'https://github.com/JUANCH00'
const LINKEDIN_URL = 'https://www.linkedin.com/in/juan-esteban-moreno99'

/**
 * Single source of truth for every word on the site.
 *
 * Content lives here as typed data instead of inside JSX, which means the
 * compiler catches a missing field, tests can assert invariants across all of
 * it at once (see `staticProfile.test.ts`), and editing a project description
 * never risks breaking a component.
 */
export const staticProfile: Profile = {
  identity: {
    firstName: 'Juan Esteban',
    lastName: 'Moreno',
    displayLines: ['Juan', 'Esteban', 'Moreno'],
    title: 'Systems Engineering student · ML and backend',
    location: 'Tunja, Colombia',
    timeZone: 'America/Bogota',
  },

  summary: [
    'Systems Engineering student and AI Trainer at Outlier. I train models, wrap them in an API and put them in front of a user. That last part is the one almost nobody does.',
  ],

  leadHighlight: 'AI Trainer at Outlier',

  kicker: [
    'I have ranked and corrected 1,000+ language model completions, documenting recurring error patterns to guide RLHF iterations. Before that, two seasons working in English in the United States.',
  ],

  stackTicker: [
    'Python',
    'XGBoost',
    'FastAPI',
    'Docker',
    'React',
    'PostgreSQL',
    'MongoDB',
    'Redis',
  ],

  projects: [
    {
      id: 'goalpredict',
      name: 'GoalPredict',
      metric: '54% validation accuracy',
      context: 'Personal project · 2026',
      summary:
        'Freemium web app that predicts 2026 World Cup matches. XGBoost classifier trained on four historical football datasets, served through a FastAPI REST backend to a React frontend and fully containerized with Docker.',
      tags: ['Python', 'XGBoost', 'FastAPI', 'React', 'Docker'],
      repositoryUrl: 'https://github.com/JUANCH00/GoalPredict2026',
    },
    {
      id: 'goalquest',
      name: 'GoalQuest',
      metric: 'University capstone',
      context: 'UPTC · 2025 — present',
      summary:
        'Gamified goal-management platform on a microservices architecture. I built the Python microservice exposing REST APIs backed by PostgreSQL, plus the React Native (Expo) interface, in two-week Agile sprints on a feature-branch workflow.',
      tags: ['Microservices', 'React Native', 'PostgreSQL', 'Scrum'],
      repositoryUrl: 'https://github.com/fredylopez01/GoalQuest',
    },
    {
      id: 'temuviator',
      name: 'Temuviator',
      metric: '3 nodes · fault tolerant',
      context: 'Distributed systems · 2025',
      summary:
        'Distributed system with a MongoDB ReplicaSet, three backend nodes over WebSockets, Redis for caching and messaging and a load balancer in front: horizontal scaling and real-time communication that survives a node going down.',
      tags: ['Node.js', 'MongoDB', 'Redis', 'WebSockets'],
      repositoryUrl: 'https://github.com/JUANCH00/Temuviator',
    },
  ],

  experience: [
    {
      id: 'outlier',
      organization: 'Outlier AI',
      role: 'AI Trainer — LLM evaluation & prompt engineering',
      location: 'Remote',
      period: 'Apr 2025 — Aug 2026',
      highlights: [
        'Improved LLM response quality across 500+ evaluations by designing and A/B-testing structured prompts, documenting recurring error patterns to guide RLHF iterations.',
        'Ranked and corrected 1,000+ model completions feeding human-feedback datasets, contributing to measurable gains in model alignment and factual consistency.',
      ],
    },
    {
      id: 'work-and-travel',
      organization: 'Cultural Exchange Program (Work & Travel)',
      role: 'International team member',
      location: 'United States',
      period: 'Jun—Aug 2024 · Jun—Aug 2026',
      highlights: [
        'Selected twice for a competitive international work program, returning in 2026 after a strong first season.',
        'Worked in a high-pressure, English-speaking environment alongside a team of 7+ nationalities — the same English I use today in technical documentation and async collaboration.',
      ],
    },
  ],

  skillGroups: [
    {
      id: 'languages',
      title: 'Languages',
      skills: ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'Go'],
    },
    {
      id: 'ml-data',
      title: 'ML & data',
      skills: ['scikit-learn', 'XGBoost', 'pandas', 'Prompt engineering', 'RLHF'],
    },
    {
      id: 'web-mobile',
      title: 'Web & mobile',
      skills: ['FastAPI', 'Spring Boot', 'React', 'React Native (Expo)', 'REST APIs'],
    },
    {
      id: 'infra',
      title: 'Infra',
      skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Docker', 'Git / GitHub', 'Agile / Scrum'],
    },
  ],

  notes: [
    {
      id: 'note-model-ceiling',
      category: 'ML',
      title: 'Why my World Cup model stalled at 54%',
      status: 'writing',
    },
    {
      id: 'note-vector-clocks',
      category: 'Distributed',
      title: 'Vector clocks, explained with a chat app',
      status: 'writing',
    },
    {
      id: 'note-thousand-evals',
      category: 'RLHF',
      title: 'What 1,000 LLM evaluations taught me about prompts',
      status: 'writing',
    },
  ],

  contactChannels: [
    {
      id: 'phone',
      kind: 'phone',
      label: 'Phone',
      links: [{ id: 'phone-link', text: '+57 310 233 2100', href: 'tel:+573102332100' }],
    },
    {
      id: 'social',
      kind: 'social',
      label: 'Social',
      links: [
        { id: 'github', text: 'GitHub', href: GITHUB_URL },
        { id: 'linkedin', text: 'LinkedIn', href: LINKEDIN_URL },
      ],
    },
    {
      id: 'availability',
      kind: 'plain',
      label: 'Availability',
      links: [{ id: 'availability-text', text: 'January 2027 · remote or hybrid' }],
    },
  ],

  availability: {
    status: 'Open to internships',
    startsOn: 'January 2027',
    arrangement: 'Remote or hybrid',
  },

  email: EMAIL,
  cvUrl: asset('cv/juan-esteban-moreno-cv.pdf'),

  links: {
    github: GITHUB_URL,
    linkedin: LINKEDIN_URL,
    repositories: `${GITHUB_URL}?tab=repositories`,
    sourceRepository: `${GITHUB_URL}/JUANCH00.github.io`,
  },

  lab: {
    modelAccuracy: 54,
    clusterSize: 3,
  },
}
