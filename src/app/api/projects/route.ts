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
  const projects = await prisma.project.findMany({
    orderBy: { year: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
        tagline: data.tagline || "",
        description: data.description || "",
        content: data.content || "",
        tech: data.tech || "",
        status: data.status || "Active",
        color: data.color || "#00D9FF",
        year: data.year || new Date().getFullYear(),
        featured: data.featured ?? false,
        published: data.published ?? true,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
