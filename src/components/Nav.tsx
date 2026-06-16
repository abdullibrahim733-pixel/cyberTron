"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "./home" },
  { href: "/projects", label: "projects" },
  { href: "/training", label: "training" },
  { href: "/blog", label: "blog" },
  { href: "/shop", label: "shop" },
];

export function Nav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(6,11,18,0.93)] backdrop-blur-[24px] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between px-6 h-14">
      <Link
        href="/"
        className="font-mono text-xs text-muted flex items-center gap-1.5"
      >
        <span className="text-green">❯</span>
        <span className="text-cyan">cyborg</span>
        <span className="text-dim">@umg</span>
        <span className="text-dim">:~$</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-xs rounded px-3 py-1.5 transition-all duration-150 ${
                isActive
                  ? "text-cyan bg-cyandim border border-[rgba(0,217,255,0.28)]"
                  : "text-muted hover:text-text hover:border-[rgba(255,255,255,0.07)] border border-transparent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/shop"
        className="relative flex items-center gap-2 text-muted hover:text-text border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.13)] rounded-lg px-3.5 py-1.5 transition-all duration-150 text-xs"
      >
        <ShoppingCart size={15} />
        Cart
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange text-white w-4.5 h-4.5 rounded-full text-[10px] font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
