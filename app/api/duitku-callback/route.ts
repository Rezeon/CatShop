import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("DUITKU CALLBACK:", data);

    const merchantOrderId = data.merchantOrderId;
    const resultCode = data.resultCode; 

    if (!merchantOrderId) {
      return NextResponse.json({ error: "No order ID" }, { status: 400 });
    }

    const updated = await prisma.order.updateMany({
      where: { id: merchantOrderId },
      data: {
        status: resultCode === "00" ? "PAID" : "FAILED",
      },
    });

    console.log("Updated rows:", updated);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
