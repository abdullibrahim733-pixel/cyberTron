"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  readTime: number;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    readTime: 5,
    published: false,
    featured: false,
  });
  const router = useRouter();

  const loadPosts = async () => {
    const res = await fetch("/api/posts");
    if (res.ok) {
      setPosts(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      readTime: post.readTime,
      published: post.published,
      featured: post.featured,
    });
  };

  const handleNew = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      readTime: 5,
      published: true,
      featured: false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    loadPosts();
  };

  const handleSave = async () => {
    const body = { ...form, readTime: Number(form.readTime) };
    if (editing) {
      await fetch(`/api/posts/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setEditing(null);
    loadPosts();
  };

  const handleSlugGenerate = () => {
    setForm((f) => ({
      ...f,
      slug: f.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
    }));
  };

  if (editing !== null || posts.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">
          {editing ? "Edit Post" : "New Post"}
        </h1>

        <div className="glass p-6 max-w-3xl space-y-4">
          <div>
            <label className="font-mono text-xs text-muted block mb-1">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted block mb-1">
              Slug
            </label>
            <div className="flex gap-2">
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="flex-1 bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
              <button
                onClick={handleSlugGenerate}
                className="font-mono text-xs bg-cyandim text-cyan border border-[rgba(0,217,255,0.28)] rounded-lg px-3 hover:opacity-80"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="font-mono text-xs text-muted block mb-1">
              Excerpt
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted block mb-1">
              Content (Markdown)
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Tags (comma separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={form.readTime}
                onChange={(e) =>
                  setForm({ ...form, readTime: Number(e.target.value) })
                }
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="accent-cyan"
              />
              <span className="font-mono text-xs text-muted">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="accent-cyan"
              />
              <span className="font-mono text-xs text-muted">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="bg-cyan text-bg border-none rounded-lg px-5 py-2 font-mono text-xs font-medium hover:opacity-85"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="bg-transparent text-muted border border-[rgba(255,255,255,0.07)] rounded-lg px-5 py-2 font-mono text-xs hover:text-text"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Posts</h1>
        <button
          onClick={handleNew}
          className="bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-muted">Loading...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted">No posts yet.</p>
          <button
            onClick={handleNew}
            className="mt-4 bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{post.title}</p>
                  {!post.published && (
                    <span className="font-mono text-[10px] text-orange bg-orangedim border border-[rgba(255,85,0,0.3)] px-1.5 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                  {post.featured && (
                    <span className="font-mono text-[10px] text-amber bg-[rgba(245,158,11,0.14)] border border-[rgba(245,158,11,0.3)] px-1.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">
                  /blog/{post.slug} · {post.readTime} min
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="font-mono text-xs text-muted hover:text-cyan border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,217,255,0.3)] rounded-lg px-3 py-1.5 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="font-mono text-xs text-muted hover:text-orange border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,85,0,0.3)] rounded-lg px-3 py-1.5 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
