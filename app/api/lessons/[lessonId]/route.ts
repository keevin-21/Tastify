import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET: Obtener una lección por ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, parseInt(lessonId))
    });

    if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
}

// PUT: Actualizar una lección por ID
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db
        .update(lessons)
        .set({ ...body })
        .where(eq(lessons.id, parseInt(lessonId)))
        .returning();

    if (!updated[0]) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
}

// DELETE: Eliminar una lección por ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await db
        .delete(lessons)
        .where(eq(lessons.id, parseInt(lessonId)))
        .returning();

    if (!deleted[0]) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(deleted[0]);
} 