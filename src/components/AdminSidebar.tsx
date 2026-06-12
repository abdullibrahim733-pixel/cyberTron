"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/products", label: "Products" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/check", { method: "DELETE" });
    document.cookie = "token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <div className="w-56 bg-s1 border-r border-[rgba(255,255,255,0.07)] min-h-screen flex flex-col">
      <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
        <Link
          href="/"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          ← Back to site
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {links.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block font-mono text-xs rounded-lg px-3.5 py-2 transition-all ${
                isActive
                  ? "text-cyan bg-cyandim border border-[rgba(0,217,255,0.28)]"
                  : "text-muted hover:text-text hover:bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2">
        <button
          onClick={handleLogout}
          className="w-full text-left font-mono text-xs text-muted hover:text-orange rounded-lg px-3.5 py-2 hover:bg-orangedim transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
