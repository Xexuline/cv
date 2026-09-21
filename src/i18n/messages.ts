import type { Locale } from './locale';

export interface UiStrings {
  htmlTitle: string;
  description: string;
  skipToContent: string;
  sections: {
    about: string;
    experience: string;
    skills: string;
    languages: string;
    education: string;
    contact: string;
  };
  aria: {
    inPage: string;
    socialMedia: string;
    linkedin: string;
    email: string;
    cvPdf: string;
    technologies: string;
    language: string;
    /**
     * A theme-independent name ("change", not "switch to dark").
     *
     * The accessible name is rendered before the active theme is known: an inline
     * script applies the theme after this markup exists, so a name advertising a
     * direction would briefly describe a switch that had already been made. The
     * icon carries the state instead.
     */
    theme: string;
    tailwind: string;
    react: string;
  };
  productLabel: string;
  additionalTraining: string;
  emailMe: string;
  linkedin: string;
  cvPdf: string;
  footerIntro: string;
  footerAnd: string;
  footerOutro: string;
  notFound: {
    heading: string;
    body: string;
    home: string;
    otherLanguage: string;
  };
}

export const uiStrings: Record<Locale, UiStrings> = {
  en: {
    htmlTitle: 'Jesús Sabroso Centella - Portfolio',
    description:
      'Jesús Sabroso Centella - Senior Front-End & Mobile Engineer portfolio',
    skipToContent: 'Skip to content',
    sections: {
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      languages: 'Languages',
      education: 'Education',
      contact: 'Contact',
    },
    aria: {
      inPage: 'In-page',
      socialMedia: 'Social media',
      linkedin: 'LinkedIn profile (opens in a new tab)',
      email: 'Send an email',
      cvPdf: 'Download my CV as a PDF (opens in a new tab)',
      technologies: 'Technologies used',
      language: 'Language',
      theme: 'Change colour theme',
      tailwind: 'Tailwind CSS (opens in a new tab)',
      react: 'React (opens in a new tab)',
    },
    productLabel: 'Product:',
    additionalTraining: 'Additional training: Advanced JavaScript',
    emailMe: 'Email me',
    linkedin: 'LinkedIn',
    cvPdf: 'CV (PDF)',
    footerIntro: 'Designed and coded by yours truly. Built with',
    footerAnd: 'and',
    footerOutro: ', set in the Inter typeface.',
    notFound: {
      heading: '404 Not Found',
      body: 'The page you are looking for does not exist.',
      home: 'Go back home',
      otherLanguage: 'Esta página en español',
    },
  },
  es: {
    htmlTitle: 'Jesús Sabroso Centella - Portafolio',
    description:
      'Portafolio de Jesús Sabroso Centella - Ingeniero Senior Front-End y Móvil',
    skipToContent: 'Saltar al contenido',
    sections: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      skills: 'Habilidades',
      languages: 'Idiomas',
      education: 'Formación',
      contact: 'Contacto',
    },
    aria: {
      inPage: 'Secciones de la página',
      socialMedia: 'Redes sociales',
      linkedin: 'Perfil de LinkedIn (se abre en una pestaña nueva)',
      email: 'Enviar un correo',
      cvPdf: 'Descargar mi CV en PDF (se abre en una pestaña nueva)',
      technologies: 'Tecnologías utilizadas',
      language: 'Idioma',
      theme: 'Cambiar el tema',
      tailwind: 'Tailwind CSS (se abre en una pestaña nueva)',
      react: 'React (se abre en una pestaña nueva)',
    },
    productLabel: 'Producto:',
    additionalTraining: 'Formación adicional: JavaScript avanzado',
    emailMe: 'Escríbeme',
    linkedin: 'LinkedIn',
    cvPdf: 'CV (PDF)',
    footerIntro: 'Diseñado y desarrollado por mí mismo. Hecho con',
    footerAnd: 'y',
    footerOutro: ', con la tipografía Inter.',
    notFound: {
      heading: 'Página no encontrada',
      body: 'La página que buscas no existe.',
      home: 'Volver al inicio',
      // Intentionally Spanish on the English 404: GitHub Pages serves one static
      // 404 page, and a reader who landed on a Spanish path needs that link.
      otherLanguage: 'This page in English',
    },
  },
};
