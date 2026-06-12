import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [postCount, projectCount, productCount, orderCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.project.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Posts", value: postCount, color: "#00D9FF" },
          { label: "Projects", value: projectCount, color: "#00FF88" },
          { label: "Products", value: productCount, color: "#A855F7" },
          { label: "Orders", value: orderCount, color: "#FF5500" },
        ].map((stat) => (
          <div key={stat.label} className="glass p-5">
            <p className="font-mono text-xs text-muted mb-1">{stat.label}</p>
            <p
              className="font-display text-3xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">
        Recent Posts
      </h2>

      {recentPosts.length === 0 ? (
        <p className="font-mono text-xs text-muted">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {recentPosts.map((post) => (
            <div
              key={post.id}
              className="glass p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">{post.title}</p>
                <p className="font-mono text-xs text-muted mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString()}
                  {!post.published && (
                    <span className="text-orange ml-2">Draft</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
