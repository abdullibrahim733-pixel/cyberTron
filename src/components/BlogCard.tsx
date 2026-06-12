import Link from "next/link";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  readTime: number;
  createdAt: Date;
}

export function BlogCard({
  title,
  slug,
  excerpt,
  tags,
  readTime,
  createdAt,
}: BlogCardProps) {
  const tagList = tags.split(",").filter(Boolean);

  return (
    <Link href={`/blog/${slug}`}>
      <div className="glass p-6 cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:border-[rgba(255,255,255,0.13)] h-full">
        <p className="font-mono text-[11px] text-dim mb-2">
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h3 className="text-base font-semibold mb-2 leading-[1.4]">{title}</h3>
        <p className="text-xs text-muted leading-[1.6] mb-3.5">{excerpt}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] text-dim">
            {readTime} min read
          </span>
          {tagList.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] bg-cyandim text-cyan border border-[rgba(0,217,255,0.18)] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
