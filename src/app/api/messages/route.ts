import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  let userId: number;
  try {
    const payload = verifyToken(token);
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { content, authorId } = await req.json();

  if (!content || !authorId) {
    return NextResponse.json(
      { error: "Missing content or authorId" },
      { status: 400 },
    );
  }

  if (authorId !== userId) {
    return NextResponse.json(
      { error: "Cannot send message as another user" },
      { status: 403 },
    );
  }

  const message = await prisma.message.create({
    data: { content, authorId },
    include: {
      author: true,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = auth.split(" ")[1];
    const payload = verifyToken(token); // your function returns user id etc.

    // --- Extract query params ---
    const url = new URL(req.url);
    const fromParam = url.searchParams.get("from");
    const toParam = url.searchParams.get("to");

    if (!fromParam || !toParam) {
      return NextResponse.json(
        { error: "Missing query parameters" },
        { status: 400 },
      );
    }

    const from = parseInt(fromParam, 10);
    const to = parseInt(toParam, 10);

    if (isNaN(from) || isNaN(to)) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    // --- Fetch messages ---
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      skip: from,
      take: to - from + 1,
      include: {
        author: true,
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
