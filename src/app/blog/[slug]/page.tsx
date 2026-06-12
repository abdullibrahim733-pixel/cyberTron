import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  const tags = post.tags.split(",").filter(Boolean);

  return (
    <div className="pt-20 pb-16 px-6 max-w-[720px] mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-text border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.13)] rounded-lg px-3 py-1.5 mb-8 transition-all"
      >
        ← Back to Blog
      </Link>

      <article>
        <p className="font-mono text-[11px] text-dim mb-2">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readTime} min read
        </p>

        <h1 className="font-display text-[26px] font-bold mb-3 leading-[1.3]">
          {post.title}
        </h1>

        <div className="flex gap-1.5 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] bg-cyandim text-cyan border border-[rgba(0,217,255,0.18)] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none text-sm leading-[1.8] [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted [&_p]:mb-3 [&_code]:font-mono [&_code]:text-xs [&_code]:bg-s2 [&_code]:border [&_code]:border-[rgba(255,255,255,0.07)] [&_code]:rounded [&_code]:px-2 [&_code]:py-0.5 [&_pre]:bg-s2 [&_pre]:border [&_pre]:border-[rgba(255,255,255,0.07)] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:border-none [&_pre_code]:p-0 [&_pre_code]:text-green [&_ul]:text-muted [&_ul]:mb-3 [&_li]:mb-1">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
