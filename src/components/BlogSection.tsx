import { prisma } from "@/lib/prisma";
import { BlogCard } from "./BlogCard";
import Link from "next/link";

export async function BlogSection() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.1em] bg-cyandim border border-[rgba(0,217,255,0.22)] px-2.5 py-0.5 rounded-full">
          blog
        </span>
        <div>
          <h2 className="text-[28px] font-semibold font-display">
            Transmission Log
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Engineering, Islam, Africa, and building things that matter.
          </p>
        </div>
        <Link
          href="/blog"
          className="font-mono text-xs text-cyan hover:underline ml-auto"
        >
          View all posts →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((p) => (
          <BlogCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
