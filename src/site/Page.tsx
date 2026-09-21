import { SectionHeading } from '~/components/SectionHeading';
import { TechBadge } from '~/components/TechBadge';
import { ThemeToggle } from '~/components/ThemeToggle';
import { LanguageSwitcher } from '~/components/LanguageSwitcher';
import { cv, cvStatic } from '~/data/cv';
import type { Locale } from '~/i18n/locale';
import { uiStrings } from '~/i18n/messages';
import { withBase } from '~/site/site';

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
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

// Every section rendered by Page, in document order. Adding a <Section> without
// listing it here silently drops it from the in-page nav.
const navItems = [
  'about',
  'experience',
  'skills',
  'languages',
  'education',
  'contact',
] as const;

function Footer({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-16 pt-4 text-sm text-muted">
      <p>
        {t.footerIntro}{' '}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t.aria.tailwind}
          className="font-medium text-text underline underline-offset-4 hover:text-accent"
        >
          Tailwind CSS
        </a>{' '}
        {t.footerAnd}{' '}
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t.aria.react}
          className="font-medium text-text underline underline-offset-4 hover:text-accent"
        >
          React
        </a>
        {t.footerOutro}
      </p>
    </footer>
  );
}

export function Page({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const content = cv[locale];

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:grid lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-14">
        {/* Skip to content link */}
        <a href="#main-content" className="skip-link">
          {t.skipToContent}
        </a>

        {/* Left column - sticky header */}
        <header className="lg:sticky lg:top-16 lg:self-start">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {cvStatic.name}
          </h1>
          {/* Body copy, not a heading: the section <h2>s are the outline. */}
          <p className="mt-3 text-lg font-medium text-muted sm:text-xl">
            {content.title}
          </p>
          {/* The tagline sits in the tree exactly once. Its reveal is a CSS
              animation, so the text is readable with JavaScript off, with CSS
              animations unsupported and to assistive tech alike — `opacity-0` or a
              duplicated `aria-hidden` copy are not needed when nothing rewrites it.
              An aria-label on a plain <span> is prohibited by ARIA, so the real text
              has to be the thing that is visible. */}
          <p className="mt-4 max-w-xs text-muted">
            <span className="tagline-reveal">{content.tagline}</span>
            <span aria-hidden="true" className="typewriter-caret text-accent">
              |
            </span>
          </p>
          {/* In-page nav */}
          <nav aria-label={t.aria.inPage} className="mt-16 hidden lg:block">
            <ul className="w-max space-y-1">
              {navItems.map((id) => (
                <li key={id}>
                  <a className="group flex items-center py-3" href={`#${id}`}>
                    <span
                      aria-hidden="true"
                      className="mr-4 h-px w-8 bg-border transition-all group-hover:w-16 group-hover:bg-text group-focus-visible:w-16 group-focus-visible:bg-text motion-reduce:transition-none"
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted group-hover:text-text group-focus-visible:text-text">
                      {t.sections[id]}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
            <ul
              className="flex flex-wrap gap-x-5 gap-y-2 text-sm lg:flex-col lg:gap-x-0 lg:gap-y-2"
              aria-label={t.aria.socialMedia}
            >
              <li>
                <a
                  aria-label={t.aria.linkedin}
                  className="text-muted underline-offset-4 hover:text-accent hover:underline"
                  href="https://linkedin.com/in/jesus-sabroso"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.linkedin}
                </a>
              </li>
              <li>
                <a
                  aria-label={t.aria.email}
                  className="text-muted underline-offset-4 hover:text-accent hover:underline"
                  href={`mailto:${cvStatic.email}`}
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  aria-label={t.aria.cvPdf}
                  className="text-muted underline-offset-4 hover:text-accent hover:underline"
                  href={withBase(cvStatic.cvHref)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t.cvPdf}
                </a>
              </li>
            </ul>

            <ThemeToggle label={t.aria.theme} />
            <LanguageSwitcher current={locale} label={t.aria.language} />
          </div>
        </header>

        {/* Right column - main content */}
        {/* tabIndex=-1 lets the skip link move focus here rather than merely
            scrolling to an anchor: browsers are not reliable about focusing a plain
            container, and smooth scrolling makes it worse. */}
        <main id="main-content" tabIndex={-1} className="mt-16 lg:mt-0">
          {/* About section */}
          <Section id="about" title={t.sections.about}>
            <div className="space-y-4 text-[15px] leading-normal text-muted">
              {content.about.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Section>

          {/* Experience section */}
          <Section id="experience" title={t.sections.experience}>
            <ol className="space-y-14">
              {content.experience.map((exp) => (
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
                      <ul
                        className="mt-3 list-inside list-disc space-y-2 text-[15px] text-muted"
                        role="list"
                      >
                        {exp.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                      {exp.product && (
                        <p className="mt-3 text-sm text-muted">
                          <span className="font-semibold text-text">
                            {t.productLabel}
                          </span>{' '}
                          {exp.product}
                        </p>
                      )}
                      {exp.location && (
                        <p className="mt-1 text-sm text-muted">{exp.location}</p>
                      )}
                      {exp.tech.length > 0 && (
                        <ul
                          className="mt-4 flex flex-wrap gap-2"
                          role="list"
                          aria-label={t.aria.technologies}
                        >
                          {exp.tech.map((tech) => (
                            <TechBadge key={tech}>{tech}</TechBadge>
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
          <Section id="skills" title={t.sections.skills}>
            <div className="grid gap-6 sm:grid-cols-2">
              {content.skills.map((category) => (
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
          <Section id="languages" title={t.sections.languages}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3">
              {content.languages.map((lang) => (
                <div key={lang.language}>
                  <dt className="text-text font-medium">{lang.language}</dt>
                  <dd className="text-sm text-muted">{lang.level}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-sm text-muted">{t.additionalTraining}</p>
          </Section>

          {/* Education section */}
          <Section id="education" title={t.sections.education}>
            <dl className="space-y-4">
              {content.education.map((edu) => (
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
          <Section id="contact" title={t.sections.contact}>
            <p className="text-[15px] leading-normal text-muted">
              {content.contact.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href={`mailto:${cvStatic.email}`}
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
              >
                {t.emailMe}
              </a>
              <a
                aria-label={t.aria.linkedin}
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
                href="https://linkedin.com/in/jesus-sabroso"
                target="_blank"
                rel="noreferrer noopener"
              >
                {t.linkedin}
              </a>
              <a
                aria-label={t.aria.cvPdf}
                className="rounded-md border-2 border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent motion-reduce:transition-none"
                href={withBase(cvStatic.cvHref)}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t.cvPdf}
              </a>
            </div>
          </Section>
        </main>
      </div>
      <Footer locale={locale} />
    </>
  );
}
