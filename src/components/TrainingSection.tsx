import { prisma } from "@/lib/prisma";
import { TrainingCard } from "./TrainingCard";
import Link from "next/link";

export async function TrainingSection() {
  const courses = await prisma.product.findMany({
    where: { published: true, type: "course" },
  });

  if (courses.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <span className="font-mono text-[10px] text-orange uppercase tracking-[0.1em] bg-orangedim border border-[rgba(255,85,0,0.22)] px-2.5 py-0.5 rounded-full">
          training
        </span>
        <div>
          <h2 className="text-[28px] font-semibold font-display">
            AI Agent &amp; Automation Training
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Hands-on training by Ibrahim Abdull — AI Agent &amp; Automation Master
          </p>
        </div>
        <Link
          href="/training"
          className="font-mono text-xs text-orange hover:underline ml-auto"
        >
          View all courses →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <TrainingCard key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}
