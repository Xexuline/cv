/// <reference types="vite/client" />
import {
  HeadContent,
    Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import '~/styles/app.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: 'Jesús Sabroso Centella - Senior Front-End & Mobile Engineer portfolio',
      },
      {
        name: 'theme-color',
        content: '#0f172a',
      },
    ],
    links: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    document.documentElement.classList.add('js');
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <html lang="en" className="bg-bg text-text antialiased">
      <head>
        <title>Jesús Sabroso Centella - Portfolio</title>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
