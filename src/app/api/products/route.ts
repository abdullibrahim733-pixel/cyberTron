import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token || !verifyToken(token)) return false;
  return true;
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type || "ebook",
        subtitle: data.subtitle || "",
        description: data.description || "",
        price: data.price || 0,
        level: data.level || "Beginner",
        pages: data.pages || 0,
        emoji: data.emoji || "",
        color: data.color || "#00D9FF",
        features: data.features || "[]",
        published: data.published ?? true,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
