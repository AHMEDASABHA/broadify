interface OverviewPropertyProps {
  label: string;
  children: React.ReactNode;
}

export function OverviewProperty({ label, children }: OverviewPropertyProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-24">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
