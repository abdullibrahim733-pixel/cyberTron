import { prisma } from "@/lib/prisma";
import { ProjectCard } from "./ProjectCard";
import Link from "next/link";

export async function ProjectsSection() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { year: "desc" },
  });

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.1em] bg-cyandim border border-[rgba(0,217,255,0.22)] px-2.5 py-0.5 rounded-full">
            gallery
          </span>
          <div>
            <h2 className="text-[28px] font-semibold font-display">
              Projects
            </h2>
            <p className="text-sm text-muted mt-0.5">
              Compilers, robots, platforms — built for Africa.
            </p>
          </div>
        </div>
        <Link
          href="/projects"
          className="font-mono text-xs text-cyan hover:underline"
        >
          View all projects →
        </Link>
      </div>

      <div
        className="flex gap-4 pb-5 px-6 overflow-x-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#111E2D transparent",
        }}
      >
        {projects.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
