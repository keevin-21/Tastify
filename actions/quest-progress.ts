"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { questProgress, userProgress } from "@/db/schema";

export const getQuestProgress = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const data = await db.query.questProgress.findMany({
        where: eq(questProgress.userId, userId),
    });

    return data;
};

export const upsertQuestProgress = async (questId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const existingProgress = await db.query.questProgress.findFirst({
        where: and(
            eq(questProgress.userId, userId),
            eq(questProgress.questId, questId),
        ),
    });

    if (existingProgress) {
        // Quest already completed
        return { error: "Quest already completed" };
    }

    await db.insert(questProgress).values({
        userId,
        questId,
        completed: true,
        completedAt: new Date(),
    });

    revalidatePath("/quests");
    revalidatePath("/learn");

    return { success: true };
};

export const claimQuestReward = async (questId: number, rewardPoints: number) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            console.error("No userId found in auth");
            return { error: "Unauthorized" };
        }

        console.log("Starting quest claim process:", { userId, questId, rewardPoints });

        // Check if quest is already completed (double-check to prevent race conditions)
        const existingProgress = await db.query.questProgress.findFirst({
            where: and(
                eq(questProgress.userId, userId),
                eq(questProgress.questId, questId),
            ),
        });

        if (existingProgress) {
            console.log("Quest already completed:", existingProgress);
            return { error: "Quest already completed" };
        }

        // Get current user progress
        const currentUserProgress = await db.query.userProgress.findFirst({
            where: eq(userProgress.userId, userId),
        });

        if (!currentUserProgress) {
            console.error("User progress not found for userId:", userId);
            return { error: "User progress not found" };
        }

        console.log("Current user progress:", { 
            currentPoints: currentUserProgress.points, 
            newPoints: currentUserProgress.points + rewardPoints 
        });

        // Since neon-http doesn't support transactions, we'll do operations sequentially
        // First, mark quest as completed
        const completedQuest = await db.insert(questProgress).values({
            userId,
            questId,
            completed: true,
            completedAt: new Date(),
        }).returning();

        console.log("Quest marked as completed:", completedQuest);

        // Then update user points
        const updatedUser = await db
            .update(userProgress)
            .set({
                points: currentUserProgress.points + rewardPoints,
            })
            .where(eq(userProgress.userId, userId))
            .returning();

        console.log("Updated user points:", updatedUser);

        const newPoints = currentUserProgress.points + rewardPoints;

        revalidatePath("/quests");
        revalidatePath("/learn");

        console.log("Quest claim successful, new points:", newPoints);

        return { 
            success: true, 
            points: newPoints 
        };
    } catch (error) {
        console.error("Error in claimQuestReward:", error);
        return { error: "Internal server error" };
    }
}; 