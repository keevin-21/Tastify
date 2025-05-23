import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const GET = async (
    request: Request,
    { params }: { params: { challengeId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, parseInt(params.challengeId))
    });

    if (!challenge) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge);
};

export const PUT = async (
    request: Request,
    { params }: { params: { challengeId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const challenge = await db.update(challenges)
        .set({
            ...body,
        })
        .where(eq(challenges.id, parseInt(params.challengeId)))
        .returning();

    if (!challenge[0]) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge[0]);
};

export const DELETE = async (
    request: Request,
    { params }: { params: { challengeId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const challenge = await db.delete(challenges)
        .where(eq(challenges.id, parseInt(params.challengeId)))
        .returning();

    if (!challenge[0]) {
        return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge[0]);
}; 