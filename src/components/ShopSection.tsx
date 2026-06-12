import { prisma } from "@/lib/prisma";
import { ProductCard } from "./ProductCard";

export async function ShopSection() {
  const products = await prisma.product.findMany({
    where: { published: true },
  });

  if (products.length === 0) return null;

  const ebooks = products.filter((p) => p.type === "ebook");
  const kits = products.filter((p) => p.type === "kit");

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.1em] bg-cyandim border border-[rgba(0,217,255,0.22)] px-2.5 py-0.5 rounded-full">
          shop
        </span>
        <div>
          <h2 className="text-[28px] font-semibold font-display">
            E-Books &amp; DIY Kits
          </h2>
          <p className="text-sm text-muted mt-0.5">
            Learn embedded engineering. Build real hardware.
          </p>
        </div>
      </div>

      {ebooks.length > 0 && (
        <>
          <h3 className="font-mono text-xs text-muted mb-4">📖 E-Books</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {ebooks.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </>
      )}

      {kits.length > 0 && (
        <>
          <h3 className="font-mono text-xs text-muted mb-4">⚡ DIY Kits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kits.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
