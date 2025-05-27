import { NextResponse } from "next/server";
import { resetAllQuests } from "@/actions/quest-progress";

export async function POST() {
    try {
        const result = await resetAllQuests();
        
        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[RESET_QUESTS]", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
} 