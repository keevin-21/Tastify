import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET: Obtener un desafío por ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ challengeId: string }> }
) {
    const { challengeId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, parseInt(challengeId))
    });

    if (!challenge) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge);
}

// PUT: Actualizar un desafío por ID
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ challengeId: string }> }
) {
    const { challengeId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db
        .update(challenges)
        .set({ ...body })
        .where(eq(challenges.id, parseInt(challengeId)))
        .returning();

    if (!updated[0]) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
}

// DELETE: Eliminar un desafío por ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ challengeId: string }> }
) {
    const { challengeId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await db
        .delete(challenges)
        .where(eq(challenges.id, parseInt(challengeId)))
        .returning();

    if (!deleted[0]) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(deleted[0]);
} 