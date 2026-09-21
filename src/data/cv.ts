import type { Locale } from '~/i18n/locale';

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

/** Locale-independent values (name and contact details are the same in every language). */
export const cvStatic = {
  name: 'Jesús Sabroso Centella',
  location: 'Málaga, Spain',
  email: 'jscentella@gmail.com',
  linkedin: 'linkedin.com/in/jesus-sabroso',
  cvHref: '/cv.pdf',
};

/** Translatable content, per locale. */
export interface CvContent {
  title: string;
  tagline: string;
  about: string[];
  contact: { intro: string };
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  languages: LanguageEntry[];
}

const en: CvContent = {
  title: 'Senior Front-End & Mobile Engineer | Freelance',
  tagline: 'I build accessible, well-crafted experiences for the web and mobile.',
  about: [
    "Hi there! I'm Jesús, and I like building things. I'm a senior front-end and mobile engineer with more than a decade of experience crafting accessible, well-tested user interfaces for the web and mobile platforms. I take pride in the little details that separate a good product from an exceptional one, and I work best at the intersection of design and engineering, where thoughtful user experience meets clean, scalable code.",
    "I started on the back end with Java and Oracle, which gave me a solid understanding of how whole products work and a healthy respect for the people behind the APIs. Since then I've shipped enterprise web applications with Angular, React and Next.js at One Beyond, The Cocktail and ONCE Group, where I first built accessible applications aligned with WCAG for users with visual and other disabilities.",
    "Today I'm freelancing, owning front-end architecture end to end: React + TypeScript portals built with TanStack, React Native apps with Expo, and a strong testing culture with Cypress, Playwright and Jest. I care deeply about accessibility, performance and code quality, and I enjoy mentoring developers along the way.",
  ],
  contact: {
    intro: "I'm currently available for freelance projects and new opportunities. If you'd like to talk, my inbox is always open.",
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

/**
 * Spanish content. Mirrors `en` field for field: same array lengths, same order,
 * same tech names. Product/company/institution names stay untranslated; only the
 * `ONCE Group` official name is rendered as `Grupo ONCE`, which is how the
 * organisation is referred to in Spanish.
 *
 * If you add a field to `en`, TypeScript will not catch a missing mirror here
 * unless it is added to `CvContent`, so keep both objects side by side when editing.
 */
const es: CvContent = {
  title: 'Ingeniero Front-End y Móvil Senior | Freelance',
  tagline: 'Creo experiencias accesibles y bien cuidadas para web y móvil.',
  about: [
    '¡Hola! Soy Jesús y me gusta construir cosas. Soy ingeniero senior de front-end y móvil con más de una década creando interfaces de usuario accesibles y bien probadas para plataformas web y móviles. Cuido esos pequeños detalles que separan un buen producto de uno excepcional, y trabajo mejor en la intersección entre diseño e ingeniería, donde la experiencia de usuario bien pensada se encuentra con un código limpio y escalable.',
    'Empecé en el back-end con Java y Oracle, lo que me dio una base sólida de cómo funcionan los productos de punta a punta y un sano respeto por las personas que hay detrás de las APIs. Desde entonces he publicado aplicaciones web empresariales con Angular, React y Next.js en One Beyond, The Cocktail y Grupo ONCE, donde desarrollé por primera vez aplicaciones accesibles conforme a WCAG, para personas con discapacidad visual o de otro tipo.',
    'Hoy trabajo como freelance: llevo la arquitectura de front-end de principio a fin, con portales en React y TypeScript sobre TanStack, aplicaciones en React Native con Expo y una cultura de testing sólida con Cypress, Playwright y Jest. Me importan mucho la accesibilidad, el rendimiento y la calidad del código, y disfruto ayudando a otros desarrolladores a crecer.',
  ],
  contact: {
    intro: 'Ahora mismo estoy disponible para proyectos freelance y nuevas oportunidades. Si quieres charlar, mi bandeja de entrada está siempre abierta.',
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
      name: 'Móvil',
      items: [
        'React Native',
        'Expo',
        'NativeWind',
        'Integraciones con Swift y Kotlin',
        'EAS',
      ],
    },
    {
      name: 'Lenguajes y APIs',
      items: ['TypeScript', 'JavaScript', 'APIs REST'],
    },
    {
      name: 'Testing',
      items: ['Cypress', 'Playwright', 'Jest', 'React Testing Library'],
    },
    {
      name: 'Prácticas y herramientas',
      items: [
        'Git',
        'Agile/Scrum',
        'accesibilidad (WCAG)',
        'revisión de código',
        'mentoría',
      ],
    },
    {
      name: 'Otra experiencia',
      items: ['Node.js', 'Express', 'NestJS', 'SQL', 'Oracle', 'Java/J2EE'],
    },
  ],
  experience: [
    {
      role: 'Ingeniero Front-End y Móvil Freelance',
      company: 'Autónomo',
      period: 'Sep 2025 - Actualidad',
      product: 'holiday.com (portal.holiday.com)',
      details: [
        'Desarrollo de la app móvil y del portal de usuario de holiday.com, con una migración en curso a XVmobile. Trabajé en un equipo de tres desarrolladores de front-end y tres de back-end.',
        'Construí el portal de usuario desde cero como único ingeniero de front-end: diseñé su arquitectura y trabajé mano a mano con un desarrollador de back-end. Usé React, TypeScript, TanStack y Tailwind CSS, con un stack que eligimos entre los equipos.',
        'Desarrollé funcionalidades en la app móvil existente con React Native, Expo, TypeScript y NativeWind; ayudé a entregar la app rediseñada en menos de un mes.',
        'Colaboré en las integraciones nativas con Swift y Kotlin para iniciar sesión automáticamente al reabrir la app, a partir de la sesión anterior del usuario.',
        'Implementé en solitario la gestión del modo sin conexión y migré los assets estáticos a una red de distribución de contenido (CDN).',
        'Contribuí a llevar la cobertura de tests automatizados a cerca del 98% en las aplicaciones y participé en los despliegues móviles con el flujo de trabajo de EAS que ya existía.',
      ],
      tech: ['React', 'TypeScript', 'TanStack', 'Tailwind CSS', 'React Native', 'Expo', 'NativeWind', 'EAS'],
    },
    {
      role: 'Ingeniero Front-End',
      company: 'One Beyond',
      period: 'Jun 2021 - Sep 2025',
      location: 'Málaga, España',
      details: [
        'Diseñé e implementé soluciones de front-end escalables con Angular, React y Next.js, dando respuesta a requisitos empresariales y a las necesidades cambiantes del producto.',
        'Participé en una plataforma de mensajería de marca blanca con identidad visual personalizable, desplegada en varios clientes.',
        'Acompañé a otros desarrolladores mediante revisión de código, pair programming y orientación profesional, apoyando su crecimiento técnico y su progresión interna.',
        'Desarrollé y mantuve tests automatizados con Cypress, Playwright, Jest y React Testing Library, en colaboración con los equipos de UX/UI, QA y back-end en entornos Agile.',
      ],
      tech: ['Angular', 'React', 'Next.js', 'TypeScript', 'Cypress', 'Playwright', 'Jest', 'React Testing Library'],
    },
    {
      role: 'Desarrollador Front-End',
      company: 'The Cocktail',
      period: 'dic 2018 - jun 2021',
      location: 'Málaga, España',
      details: [
        'Construí y optimicé aplicaciones web empresariales con React, Vue.js, Redux y Vuex.',
        'Implementé interfaces accesibles y responsivas siguiendo las guías de diseño, e integré APIs REST.',
        'Participé en la planificación de sprints, la estimación y las retrospectivas dentro de equipos Scrum Agile.',
      ],
      tech: ['React', 'Vue.js', 'Redux', 'Vuex', 'TypeScript', 'APIs REST'],
    },
    {
      role: 'Desarrollador Front-End',
      company: 'Grupo ONCE',
      period: 'ago 2017 - dic 2018',
      location: 'Málaga, España',
      details: [
        'Desarrollé aplicaciones accesibles conforme a los estándares WCAG, orientadas a personas con discapacidad visual o de otro tipo.',
        'Construí interfaces responsivas con Angular 5, Bootstrap y SCSS, e integré APIs REST junto a los desarrolladores de back-end con Node.js y Express.',
        'Participé en ciclos de QA para validar la accesibilidad y el rendimiento de las aplicaciones.',
      ],
      tech: ['Angular', 'Bootstrap', 'SCSS', 'Node.js', 'Express', 'WCAG'],
    },
    {
      role: 'Desarrollador Back-End',
      company: 'GlobalTMS',
      period: '2014 - 2016',
      location: 'Madrid, España',
      details: [
        'Desarrollé funcionalidades y resolví defectos en aplicaciones Java/J2EE con Oracle, WebSphere Application Server, Struts, Spring y Hibernate.',
        'Administré bases de datos Oracle y SQL, cuidando la integridad de los datos, el rendimiento y la disponibilidad.',
      ],
      tech: ['Java', 'J2EE', 'Oracle', 'SQL', 'Spring', 'Hibernate'],
    },
  ],
  education: [
    {
      title: 'Técnico Superior en Desarrollo de Aplicaciones Web',
      institution: 'IES Virgen de la Paz (2013-2014), IES Marqués de Comares (2016-2017)',
      period: '2013 - 2017',
    },
    {
      title: 'Técnico Superior en Administración de Sistemas Informáticos',
      institution: 'IES San Juan de la Cruz',
      period: '2009 - 2011',
    },
  ],
  languages: [
    { language: 'Español', level: 'Nativo' },
    { language: 'Inglés', level: 'Nivel profesional' },
  ],
};

export const cv: Record<Locale, CvContent> = {
  en,
  es,
};
