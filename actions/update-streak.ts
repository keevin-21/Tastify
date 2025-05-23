"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updateStreak = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
    });

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    const now = new Date();
    const lastLogin = new Date(currentUserProgress.lastLoginDate);
    
    // Check if the last login was yesterday
    const isConsecutiveDay = 
        now.getDate() - lastLogin.getDate() === 1 &&
        now.getMonth() === lastLogin.getMonth() &&
        now.getFullYear() === lastLogin.getFullYear();

    // Check if it's the same day
    const isSameDay = 
        now.getDate() === lastLogin.getDate() &&
        now.getMonth() === lastLogin.getMonth() &&
        now.getFullYear() === lastLogin.getFullYear();

    let newStreak = currentUserProgress.streakCount;

    if (isConsecutiveDay) {
        newStreak += 1;
    } else if (!isSameDay) {
        newStreak = 1;
    }

    // Si nunca ha tenido racha, empieza en 1
    if (!newStreak || newStreak < 1) {
        newStreak = 1;
    }

    await db.update(userProgress)
        .set({
            streakCount: newStreak,
            lastLoginDate: now,
        })
        .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/shop");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");

    return { streakCount: newStreak };
}; 