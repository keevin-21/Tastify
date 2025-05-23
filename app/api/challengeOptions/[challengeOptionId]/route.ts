import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengesOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: { challengeOptionId: string } }
) {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challengeOption = await db.query.challengesOptions.findFirst({
        where: eq(challengesOptions.id, parseInt(params.challengeOptionId))
    });

    if (!challengeOption) {
        return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
    }

    return NextResponse.json(challengeOption);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { challengeOptionId: string } }
) {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const challengeOption = await db.update(challengesOptions)
        .set({
            ...body,
        })
        .where(eq(challengesOptions.id, parseInt(params.challengeOptionId)))
        .returning();

    if (!challengeOption[0]) {
        return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
    }

    return NextResponse.json(challengeOption[0]);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { challengeOptionId: string } }
) {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challengeOption = await db.delete(challengesOptions)
        .where(eq(challengesOptions.id, parseInt(params.challengeOptionId)))
        .returning();

    if (!challengeOption[0]) {
        return NextResponse.json({ error: "Challenge option not found" }, { status: 404 });
    }

    return NextResponse.json(challengeOption[0]);
} 