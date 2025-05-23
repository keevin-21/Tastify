import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const GET = async (
    request: Request,
    { params }: { params: { lessonId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, parseInt(params.lessonId))
    });

    if (!lesson) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
};

export const PUT = async (
    request: Request,
    { params }: { params: { lessonId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const lesson = await db.update(lessons)
        .set({
            ...body,
        })
        .where(eq(lessons.id, parseInt(params.lessonId)))
        .returning();

    if (!lesson[0]) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson[0]);
};

export const DELETE = async (
    request: Request,
    { params }: { params: { lessonId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lesson = await db.delete(lessons)
        .where(eq(lessons.id, parseInt(params.lessonId)))
        .returning();

    if (!lesson[0]) {
        return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson[0]);
}; 