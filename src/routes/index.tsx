import { cv } from '~/data/cv';
import { createFileRoute } from '@tanstack/react-router';
import { SectionHeading } from '~/components/SectionHeading';
import { TechBadge } from '~/components/TechBadge';
import { useTypewriter } from '~/components/useTypewriter';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
      <section
        id={id}
        className="mb-16 last:mb-0 scroll-mt-20 reveal"
        aria-labelledby={`${id}-heading`}
      >
        <SectionHeading id={id} title={title} />
        {children}
      </section>
    );
}

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

function Footer() {
    return (
      <footer className="mx-auto max-w-6xl px-6 pb-16 pt-4 text-sm text-muted">
        <p>
          Designed and coded by yours truly. Built with{' '}
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="TanStack Start (opens in a new tab)"
            className="font-medium text-text underline-offset-4 hover:text-accent hover:underline"
          >
            TanStack Start
          </a>{' '}
          and{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="React (opens in a new tab)"
            className="font-medium text-text underline-offset-4 hover:text-accent hover:underline"
          >
            React
          </a>
          , set in the Inter typeface.
        </p>
      </footer>
    );
}

function HomePage() {
  const typed = useTypewriter(cv.tagline);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:grid lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-14">
        {/* Skip to content link */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* Left column - sticky header */}
        <header className="lg:sticky lg:top-16 lg:self-start">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {cv.name}
          </h1>
          <h2 className="mt-3 text-lg font-medium text-muted sm:text-xl">
            {cv.title}
          </h2>
          {/* Invisible sizer reserves the tagline's final height so the sticky
              column never shifts while the typewriter is running */}
          <p className="relative mt-4 max-w-xs text-muted">
            <span aria-hidden="true" className="invisible">
              {cv.tagline}
            </span>
            <span aria-label={cv.tagline} className="absolute inset-x-0 top-0">
              <span aria-hidden="true">{typed}</span>
              <span aria-hidden="true" className="typewriter-caret text-accent">
                |
              </span>
            </span>
          </p>

          {/* In-page nav */}
          <nav aria-label="In-page" className="mt-16 hidden lg:block">
            <ul className="w-max space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className="group flex items-center py-3"
                    href={`#${item.id}`}
                  >
                    <span
                      aria-hidden="true"
                      className="mr-4 h-px w-8 bg-border transition-all group-hover:w-16 group-hover:bg-text group-focus-visible:w-16 group-focus-visible:bg-text motion-reduce:transition-none"
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text group-focus-visible:text-text">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links */}
          <ul
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm lg:block lg:space-y-2"
            aria-label="Social media"
          >
            <li>
              <a
                aria-label="LinkedIn profile (opens in a new tab)"
                className="text-muted underline-offset-4 hover:text-accent hover:underline"
                href="https://linkedin.com/in/jesus-sabroso"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                aria-label="Send an email"
                className="text-muted underline-offset-4 hover:text-accent hover:underline"
                href="mailto:jscentella@gmail.com"
              >
                Email
              </a>
            </li>
            <li>
              <a
                aria-label="Download my CV as a PDF (opens in a new tab)"
                className="text-muted underline-offset-4 hover:text-accent hover:underline"
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer noopener"
              >
                CV (PDF)
              </a>
            </li>
          </ul>
        </header>

        {/* Right column - main content */}
        <main id="main-content" className="mt-16 lg:mt-0">
          {/* About section */}
          <Section id="about" title="About">
            <div className="space-y-4 text-[15px] leading-normal text-muted">
              {cv.about.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Section>

          {/* Experience section */}
          <Section id="experience" title="Experience">
            <ol className="space-y-14">
              {cv.experience.map((exp) => (
                <li key={`${exp.company}-${exp.period}`}>
                  <div className="group relative grid gap-2 sm:grid-cols-8 sm:gap-8">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-x-4 -inset-y-3 z-0 hidden rounded-md transition motion-reduce:transition-none lg:group-hover:bg-surface/60 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)]"
                    />
                    <p className="z-10 text-xs font-semibold uppercase tracking-wide text-muted sm:col-span-2">
                      {exp.period}
                    </p>
                    <div className="z-10 sm:col-span-6">
                      <h3 className="text-base font-medium leading-snug sm:text-lg">
                        {exp.role} ·{' '}
                        <span className="text-accent">{exp.company}</span>
                      </h3>
                      <ul className="mt-3 list-inside list-disc space-y-2 text-[15px] text-muted" role="list">
                        {exp.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      {exp.product && (
                        <p className="mt-2 text-sm text-muted">
                          <span className="font-medium text-text">
                            Product:
                          </span>{' '}
                          {exp.product}
                        </p>
                      )}
                      {exp.tech && exp.tech.length > 0 && (
                        <ul
                          className="mt-3 flex flex-wrap gap-2"
                          role="list"
                          aria-label="Technologies used"
                        >
                          {exp.tech.map((t) => (
                            <TechBadge key={t}>{t}</TechBadge>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          {/* Skills section */}
          <Section id="skills" title="Skills">
            <div className="grid gap-6 sm:grid-cols-2">
              {cv.skills.map((category) => (
                <div key={category.name}>
                  <h3 className="text-sm font-semibold text-text">
                    {category.name}
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2" role="list">
                    {category.items.map((item) => (
                      <TechBadge key={item}>{item}</TechBadge>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Languages section */}
          <Section id="languages" title="Languages">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3">
              {cv.languages.map((lang) => (
                <div key={lang.language}>
                  <dt className="text-text font-medium">{lang.language}</dt>
                  <dd className="text-sm text-muted">{lang.level}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-sm text-muted">
              Additional training: Advanced JavaScript
            </p>
          </Section>

          {/* Education section */}
          <Section id="education" title="Education">
            <dl className="space-y-4">
              {cv.education.map((edu) => (
                <div key={edu.title}>
                  <dt className="text-text font-medium">{edu.title}</dt>
                  <dd className="text-sm text-muted">
                    {edu.institution}
                    <span className="ml-2">({edu.period})</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Contact section */}
          <Section id="contact" title="Contact">
            <p className="text-[15px] leading-normal text-muted">
              {cv.contact.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="mailto:jscentella@gmail.com"
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
              >
                Email me
              </a>
              <a
                aria-label="LinkedIn profile (opens in a new tab)"
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
                href="https://linkedin.com/in/jesus-sabroso"
                target="_blank"
                rel="noreferrer noopener"
              >
                LinkedIn
              </a>
              <a
                aria-label="Download my CV as a PDF (opens in a new tab)"
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer noopener"
              >
                CV (PDF)
              </a>
            </div>
          </Section>
        </main>
      </div>
      <Footer />
    </>
  );
}
