export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full bg-accent-dim px-3 py-1 text-xs font-medium leading-5 text-accent">
      {children}
    </li>
  );
}
