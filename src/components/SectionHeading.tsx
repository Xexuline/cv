export function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2
      id={`${id}-heading`}
      className="mb-4 text-sm font-bold uppercase tracking-widest text-text"
    >
      {title}
    </h2>
  );
}
