import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengesOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET: Obtener una opción de desafío por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) {
  const { challengeOptionId } = await params;
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const challengeOption = await db.query.challengesOptions.findFirst({
    where: eq(challengesOptions.id, parseInt(challengeOptionId)),
  });

  if (!challengeOption) {
    return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
  }

  return NextResponse.json(challengeOption);
}

// PUT: Actualizar una opción de desafío por ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) {
  const { challengeOptionId } = await params;
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const updated = await db
    .update(challengesOptions)
    .set({ ...body })
    .where(eq(challengesOptions.id, parseInt(challengeOptionId)))
    .returning();

  if (!updated[0]) {
    return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

// DELETE: Eliminar una opción de desafío por ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ challengeOptionId: string }> }
) {
  const { challengeOptionId } = await params;
  const { userId } = await auth();

  if (!isAdmin(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await db
    .delete(challengesOptions)
    .where(eq(challengesOptions.id, parseInt(challengeOptionId)))
    .returning();

  if (!deleted[0]) {
    return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
  }

  return NextResponse.json(deleted[0]);
}
