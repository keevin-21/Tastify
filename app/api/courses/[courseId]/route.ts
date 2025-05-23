import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET: Obtener un curso por ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, parseInt(courseId))
    });

    if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
}

// PUT: Actualizar un curso por ID
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db
        .update(courses)
        .set({ ...body })
        .where(eq(courses.id, parseInt(courseId)))
        .returning();

    if (!updated[0]) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
}

// DELETE: Eliminar un curso por ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await db
        .delete(courses)
        .where(eq(courses.id, parseInt(courseId)))
        .returning();

    if (!deleted[0]) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(deleted[0]);
}