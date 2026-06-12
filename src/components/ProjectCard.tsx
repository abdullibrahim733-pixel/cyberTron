const statusColors: Record<string, string> = {
  Active: "#00D9FF",
  Dev: "#F59E0B",
  Live: "#00FF88",
  Built: "#A855F7",
  Beta: "#FF5500",
};

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  tech: string;
  status: string;
  color: string;
  year: number;
}

export function ProjectCard({
  name,
  tagline,
  description,
  tech,
  status,
  color,
  year,
}: ProjectCardProps) {
  const sc = statusColors[status] || color;
  const techs = tech.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div
      className="glass p-5 flex-shrink-0 w-[300px] transition-transform duration-200 hover:-translate-y-1"
      style={{ borderColor: `${color}25` }}
    >
      <div className="flex justify-between items-start mb-2.5">
        <span
          className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
          style={{
            background: `${sc}18`,
            color: sc,
            borderColor: `${sc}40`,
          }}
        >
          {status}
        </span>
        <span className="font-mono text-[11px] text-dim">{year}</span>
      </div>
      <h3 className="font-display text-xl font-bold mb-0.5" style={{ color }}>
        {name}
      </h3>
      <p className="text-xs text-muted mb-3">{tagline}</p>
      <p className="text-xs text-muted leading-[1.6] mb-4">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {techs.map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-[#8099b0] px-2 py-0.5 rounded"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
