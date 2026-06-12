"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  subtitle: string;
  description: string;
  price: number;
  level: string;
  pages: number;
  emoji: string;
  color: string;
  features: string;
  published: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "ebook",
    subtitle: "",
    description: "",
    price: 0,
    level: "Beginner",
    pages: 0,
    emoji: "",
    color: "#00D9FF",
    features: "[]",
    published: true,
  });

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      type: p.type,
      subtitle: p.subtitle,
      description: p.description,
      price: p.price,
      level: p.level,
      pages: p.pages,
      emoji: p.emoji,
      color: p.color,
      features: p.features,
      published: p.published,
    });
  };

  const handleNew = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      type: "ebook",
      subtitle: "",
      description: "",
      price: 0,
      level: "Beginner",
      pages: 0,
      emoji: "",
      color: "#00D9FF",
      features: "[]",
      published: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleSave = async () => {
    const body = { ...form, price: Number(form.price), pages: Number(form.pages) };
    if (editing) {
      await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }
    setEditing(null);
    loadProducts();
  };

  if (editing !== null) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6">
          {editing ? "Edit Product" : "New Product"}
        </h1>
        <div className="glass p-6 max-w-3xl space-y-4">
          {(["name", "slug", "subtitle", "emoji"] as const).map((field) => (
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
              Features (JSON array)
            </label>
            <input
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              >
                <option value="ebook">E-Book</option>
                <option value="kit">DIY Kit</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Level
              </label>
              <input
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs text-muted block mb-1">
                Pages
              </label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) =>
                  setForm({ ...form, pages: Number(e.target.value) })
                }
                className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-cyan"
              />
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
          </div>

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
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <button
          onClick={handleNew}
          className="bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
        >
          + New Product
        </button>
      </div>

      {loading ? (
        <p className="font-mono text-xs text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted">No products yet.</p>
          <button
            onClick={handleNew}
            className="mt-4 bg-cyan text-bg border-none rounded-lg px-4 py-2 font-mono text-xs font-medium hover:opacity-85"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="glass p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <span>{p.emoji}</span>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="font-mono text-xs text-muted mt-0.5">
                    ${p.price.toFixed(2)} · {p.type}
                    {!p.published && (
                      <span className="text-orange ml-2">Hidden</span>
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
