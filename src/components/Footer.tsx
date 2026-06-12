import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] py-9 px-6 text-center">
      <div className="flex gap-4 justify-center mb-3 flex-wrap">
        <Link
          href="https://github.com"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          GitHub
        </Link>
        <a
          href="mailto:ibrahim@umgafrica.com"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          Email
        </a>
        <Link
          href="/projects"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          Projects
        </Link>
        <Link
          href="/blog"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          Blog
        </Link>
        <Link
          href="/shop"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          Shop
        </Link>
        <Link
          href="/admin"
          className="font-mono text-xs text-muted hover:text-cyan transition-colors"
        >
          Admin
        </Link>
      </div>
      <p className="text-xs text-dim">
        &copy; {new Date().getFullYear()} Ibrahim Abdull (Cyborg) &mdash; UMG
        Africa Ltd, Arusha, Tanzania
      </p>
    </footer>
  );
}
