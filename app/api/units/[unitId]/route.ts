import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

// GET: Obtener una unidad por ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ unitId: string }> }
) {
    const { unitId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const unit = await db.query.units.findFirst({
        where: eq(units.id, parseInt(unitId))
    });

    if (!unit) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(unit);
}

// PUT: Actualizar una unidad por ID
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ unitId: string }> }
) {
    const { unitId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await db
        .update(units)
        .set({ ...body })
        .where(eq(units.id, parseInt(unitId)))
        .returning();

    if (!updated[0]) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
}

// DELETE: Eliminar una unidad por ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ unitId: string }> }
) {
    const { unitId } = await params;
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await db
        .delete(units)
        .where(eq(units.id, parseInt(unitId)))
        .returning();

    if (!deleted[0]) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json(deleted[0]);
} 