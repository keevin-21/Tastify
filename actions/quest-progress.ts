"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, lt } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { questProgress, userProgress } from "@/db/schema";

const isQuestExpired = (completedAt: Date) => {
    const now = new Date();
    const completedDate = new Date(completedAt);
    
    const resetDate = new Date(now);
    resetDate.setUTCHours(0, 0, 0, 0);
    
    return completedDate < resetDate;
};

export const getQuestProgress = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const data = await db.query.questProgress.findMany({
        where: eq(questProgress.userId, userId),
    });

    const activeQuests = data.filter(quest => 
        !quest.completedAt || !isQuestExpired(quest.completedAt)
    );

    return activeQuests;
};

export const resetAllQuests = async () => {
    try {
        // Delete all quest progress records
        await db.delete(questProgress);

        // Revalidate all relevant paths
        revalidatePath("/quests");
        revalidatePath("/learn");
        revalidatePath("/leaderboard");

        return { success: true };
    } catch (error) {
        console.error("Error resetting all quests:", error);
        return { error: "Failed to reset quests" };
    }
};

export const resetExpiredQuests = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const now = new Date();
    const resetDate = new Date(now);
    resetDate.setUTCHours(0, 0, 0, 0);

    // Delete expired quest progress
    await db.delete(questProgress)
        .where(
            and(
                eq(questProgress.userId, userId),
                lt(questProgress.completedAt!, resetDate)
            )
        );

    revalidatePath("/quests");
    revalidatePath("/learn");
};

export const claimQuestReward = async (questId: number, rewardPoints: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            console.error("No userId found in auth");
            return { error: "Unauthorized" };
        }

        // Check if quest is already completed (double-check to prevent race conditions)
        const existingProgress = await db.query.questProgress.findFirst({
            where: and(
                eq(questProgress.userId, userId),
                eq(questProgress.questId, questId),
            ),
        });

        if (existingProgress) {
            // Check if the quest has expired
            if (existingProgress.completedAt && isQuestExpired(existingProgress.completedAt)) {
                // Delete expired quest progress
                await db.delete(questProgress)
                    .where(eq(questProgress.id, existingProgress.id));
            } else {
                console.log("Quest already completed and still active:", existingProgress);
                return { error: "Quest already completed" };
            }
        }

        // Get current user progress
        const currentUserProgress = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
        });

        if (!currentUserProgress) {
            console.error("User progress not found for userId:", userId);
            return { error: "User progress not found" };
        }

        // First, mark quest as completed
        const completedQuest = await db.insert(questProgress).values({
            userId,
            questId,
            completed: true,
            completedAt: new Date(),
        }).returning();

        // Then update user points
        const updatedUser = await db
            .update(userProgress)
            .set({
                points: currentUserProgress.points + rewardPoints,
            })
            .where(eq(userProgress.userId, userId))
            .returning();

        const newPoints = currentUserProgress.points + rewardPoints;

        revalidatePath("/quests");
        revalidatePath("/learn");

        return { 
            success: true, 
            points: newPoints 
        };
    } catch (error) {
        console.error("Error in claimQuestReward:", error);
        return { error: "Internal server error" };
    }
}; 