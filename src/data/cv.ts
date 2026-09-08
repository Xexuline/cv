export interface CvData {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  tagline: string;
  about: string[];
  contact: ContactInfo;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  languages: LanguageEntry[];
}

export interface ContactInfo {
  intro: string;
  cvHref: string;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location?: string;
  product?: string;
  details: string[];
  tech: string[];
}

export interface Education {
  title: string;
  institution: string;
  period: string;
}

export interface LanguageEntry {
  language: string;
  level: string;
}

export const cv: CvData = {
  name: 'Jesús Sabroso Centella',
  title: 'Senior Front-End & Mobile Engineer | Freelance',
  location: 'Málaga, Spain',
  email: 'jscentella@gmail.com',
  linkedin: 'linkedin.com/in/jesus-sabroso',
  tagline: 'I build accessible, well-crafted experiences for the web and mobile.',
  about: [
    "Hi there! I'm Jesús, and I like building things. I'm a senior front-end and mobile engineer with more than a decade of experience crafting accessible, well-tested user interfaces for the web and mobile platforms. I take pride in the little details that separate a good product from an exceptional one, and I work best at the intersection of design and engineering, where thoughtful user experience meets clean, scalable code.",
    "I started on the back end with Java and Oracle, which gave me a solid understanding of how whole products work and a healthy respect for the people behind the APIs. Since then I've shipped enterprise web applications with Angular, React and Next.js at One Beyond, The Cocktail and ONCE Group, where I first built accessible applications aligned with WCAG for users with visual and other disabilities.",
    "Today I'm freelancing, owning front-end architecture end to end: React + TypeScript portals built with TanStack, React Native apps with Expo, and a strong testing culture with Cypress, Playwright and Jest. I care deeply about accessibility, performance and code quality, and I enjoy mentoring developers along the way.",
  ],
  contact: {
    intro: "I'm currently available for freelance projects and new opportunities. If you'd like to talk, my inbox is always open.",
    cvHref: '/cv.pdf',
  },
  skills: [
    {
      name: 'Web',
      items: [
        'React',
        'TanStack',
        'Next.js',
        'Angular',
        'Vue.js',
        'HTML',
        'CSS',
        'Tailwind CSS',
        'SCSS',
      ],
    },
    {
      name: 'Mobile',
      items: [
        'React Native',
        'Expo',
        'NativeWind',
        'Swift and Kotlin integrations',
        'EAS',
      ],
    },
    {
      name: 'Languages & APIs',
      items: ['TypeScript', 'JavaScript', 'REST APIs'],
    },
    {
      name: 'Testing',
      items: ['Cypress', 'Playwright', 'Jest', 'React Testing Library'],
    },
    {
      name: 'Practices & tools',
      items: [
        'Git',
        'Agile/Scrum',
        'accessibility (WCAG)',
        'code reviews',
        'mentoring',
      ],
    },
    {
      name: 'Additional experience',
      items: ['Node.js', 'Express', 'NestJS', 'SQL', 'Oracle', 'Java/J2EE'],
    },
  ],
  experience: [
    {
      role: 'Freelance Front-End & Mobile Engineer',
      company: 'Self-employed',
      period: 'Sep 2025 - Present',
      product: 'holiday.com (portal.holiday.com)',
      details: [
        'Development of the holiday.com mobile app and user portal, with ongoing migration to XVmobile. Worked within a team of three front-end and three back-end developers.',
        'Built the user portal from scratch as the sole front-end engineer, owning its architecture and working closely with a back-end developer. Used React, TypeScript, TanStack and Tailwind CSS, with the stack selected collaboratively across teams.',
        'Developed features across the existing mobile app using React Native, Expo, TypeScript and NativeWind; helped deliver the redesigned app in less than one month.',
        'Collaborated on native Swift and Kotlin integrations to automatically sign users in when reopening the app, based on their previous session.',
        'Independently implemented offline-mode handling and migrated static assets to a content delivery network (CDN).',
        'Contributed to increasing automated test coverage to approximately 98% across the applications and participated in mobile deployments through the existing EAS workflow.',
      ],
      tech: ['React', 'TypeScript', 'TanStack', 'Tailwind CSS', 'React Native', 'Expo', 'NativeWind', 'EAS'],
    },
    {
      role: 'Front-End Engineer',
      company: 'One Beyond',
      period: 'Jun 2021 - Sep 2025',
      location: 'Málaga, Spain',
      details: [
        'Designed and implemented scalable front-end solutions with Angular, React and Next.js, supporting enterprise requirements and evolving product needs.',
        'Contributed to a white-label messaging platform with customizable branding for deployment across multiple clients.',
        'Mentored developers through code reviews, pair programming and career guidance, supporting technical development and internal progression.',
        'Developed and maintained automated tests with Cypress, Playwright, Jest and React Testing Library, collaborating with UX/UI, QA and back-end teams in Agile environments.',
      ],
      tech: ['Angular', 'React', 'Next.js', 'TypeScript', 'Cypress', 'Playwright', 'Jest', 'React Testing Library'],
    },
    {
      role: 'Front-End Developer',
      company: 'The Cocktail',
      period: 'Dec 2018 - Jun 2021',
      location: 'Málaga, Spain',
      details: [
        'Built and optimized enterprise web applications using React, Vue.js, Redux and Vuex.',
        'Implemented accessible, responsive interfaces aligned with design guidelines and integrated REST APIs.',
        'Contributed to sprint planning, estimation and retrospectives within Agile Scrum teams.',
      ],
      tech: ['React', 'Vue.js', 'Redux', 'Vuex', 'TypeScript', 'REST APIs'],
    },
    {
      role: 'Front-End Developer',
      company: 'ONCE Group',
      period: 'Aug 2017 - Dec 2018',
      location: 'Málaga, Spain',
      details: [
        'Developed accessible applications aligned with WCAG standards, supporting users with visual and other disabilities.',
        'Built responsive interfaces with Angular 5, Bootstrap and SCSS; integrated REST APIs in collaboration with Node.js and Express back-end developers.',
        'Participated in QA cycles to validate accessibility and application performance.',
      ],
      tech: ['Angular', 'Bootstrap', 'SCSS', 'Node.js', 'Express', 'WCAG'],
    },
    {
      role: 'Back-End Developer',
      company: 'GlobalTMS',
      period: '2014 - 2016',
      location: 'Madrid, Spain',
      details: [
        'Developed features and resolved defects in Java/J2EE applications using Oracle, WebSphere Application Server, Struts, Spring and Hibernate.',
        'Managed Oracle and SQL databases, supporting data integrity, performance and availability.',
      ],
      tech: ['Java', 'J2EE', 'Oracle', 'SQL', 'Spring', 'Hibernate'],
    },
  ],
  education: [
    {
      title: 'Technician in Web Application Development',
      institution: 'IES Virgen de la Paz (2013-2014), IES Marqués de Comares (2016-2017)',
      period: '2013 - 2017',
    },
    {
      title: 'Technician in Computer Systems',
      institution: 'IES San Juan de la Cruz',
      period: '2009 - 2011',
    },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Professional working proficiency' },
  ],
};
