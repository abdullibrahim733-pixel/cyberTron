import { prisma } from "@/lib/prisma";
import { TrainingCard } from "@/components/TrainingCard";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const courses = await prisma.product.findMany({
    where: { published: true, type: "course" },
  });

  return (
    <div className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-10 mt-8">
        <span className="font-mono text-[10px] text-orange uppercase tracking-[0.1em] bg-orangedim border border-[rgba(255,85,0,0.22)] px-2.5 py-0.5 rounded-full">
          training
        </span>
        <div>
          <h1 className="text-[32px] font-semibold font-display">
            AI Agent &amp; Automation Training
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Hands-on training by Ibrahim Abdull — AI Agent &amp; Automation Master
          </p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-sm text-muted">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <TrainingCard key={c.id} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
