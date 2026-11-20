interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="animate-fade-up space-y-1.5">
      <h1 className="font-display text-[1.75rem] font-semibold text-neutral-900">{title}</h1>
      <p className="text-neutral-500">{description}</p>
    </header>
  );
}
