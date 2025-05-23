import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const GET = async (
    request: Request,
    { params }: { params: { unitId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unit = await db.query.units.findFirst({
        where: eq(units.id, parseInt(params.unitId))
    });

    if (!unit) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(unit);
};

export const PUT = async (
    request: Request,
    { params }: { params: { unitId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const unit = await db.update(units)
        .set({
            ...body,
        })
        .where(eq(units.id, parseInt(params.unitId)))
        .returning();

    if (!unit[0]) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(unit[0]);
};

export const DELETE = async (
    request: Request,
    { params }: { params: { unitId: string } }
) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unit = await db.delete(units)
        .where(eq(units.id, parseInt(params.unitId)))
        .returning();

    if (!unit[0]) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(unit[0]);
}; 