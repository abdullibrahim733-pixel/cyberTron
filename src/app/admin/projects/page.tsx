"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  content: string;
  tech: string;
  status: string;
  color: string;
  year: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    content: "",
    tech: "",
    status: "Active",
    color: "#00D9FF",
    year: new Date().getFullYear(),
    featured: false,
    published: true,
  });

  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (p: Project) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      content: p.content,
      tech: p.tech,
      status: p.status,
      color: p.color,
      year: p.year,
      featured: p.featured,
      published: p.published,
    });
  };

  const handleNew = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      content: "",
      tech: "",
      status: "Active",
      color: "#00D9FF",
      year: new Date().getFullYear(),
      featured: false,
      published: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    loadProjects();
  };

  const handleSave = async () => {
    const body = { ...form, year: Number(form.year) };
    if (editing) {
      await fetch(`/api/projects/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setEditing(null);
    loadProjects();
  };

  if (editing !== null) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">
          {editing ? "Edit Project" : "New Project"}
        </h1>
        <div className="glass p-6 max-w-3xl space-y-4">
          {(["name", "slug", "tagline", "tech"] as const).map((field) => (
            <div key={field}>
              <label className="font-mono text-xs text-muted block mb-1 capitalize">
                {field}
              </label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
          ))}

          <div>
            <label className="font-mono text-xs text-muted block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
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
              rows={8}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              >
                {["Active", "Dev", "Live", "Built", "Beta"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Color
              </label>
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-[38px] bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Year
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: Number(e.target.value) })
                }
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="flex gap-6">
            {(["published", "featured"] as const).map((field) => (
              <label
                key={field}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.checked })
                  }
                  className="accent-cyan"
                />
                <span className="font-mono text-xs text-muted capitalize">
                  {field}
                </span>
              </label>
            ))}
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
        <h1 className="font-display text-2xl font-semibold">Projects</h1>
        <button
          onClick={handleNew}
          className="bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-muted">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted">No projects yet.</p>
          <button
            onClick={handleNew}
            className="mt-4 bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: p.color }}
                />
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="font-mono text-xs text-muted mt-0.5">
                    /{p.slug} · {p.status}
                    {!p.published && (
                      <span className="text-orange ml-2">Draft</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="font-mono text-xs text-muted hover:text-cyan border border-[rgba(255,255,255,0.07)] hover:border-[rgba(0,217,255,0.3)] rounded-lg px-3 py-1.5 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
