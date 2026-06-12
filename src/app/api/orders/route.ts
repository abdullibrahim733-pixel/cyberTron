import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const order = await prisma.order.create({
      data: {
        items: JSON.stringify(data.items || []),
        total: data.total || 0,
        customerName: data.customerName || "Guest",
        customerEmail: data.customerEmail || "",
        status: "pending",
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
