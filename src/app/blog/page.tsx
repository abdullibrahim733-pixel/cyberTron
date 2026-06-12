import { prisma } from "@/lib/prisma";
import { BlogCard } from "@/components/BlogCard";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-10 mt-8">
        <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.1em] bg-cyandim border border-[rgba(0,217,255,0.22)] px-2.5 py-0.5 rounded-full">
          blog
        </span>
        <div>
          <h1 className="text-[32px] font-semibold font-display">
            Transmission Log
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Engineering, Islam, Africa, and building things that matter.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted">No posts yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((p) => (
            <BlogCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
}
