import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengesOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { auth } from "@clerk/nextjs/server";

export const GET = async () => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const data = await db.query.challengesOptions.findMany();

    return NextResponse.json(data);
};

export const POST = async (request: Request) => {
    const { userId } = await auth();

    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();

    const data = await db.insert(challengesOptions).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0]);
};