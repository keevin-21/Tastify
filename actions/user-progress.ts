"use server";        

import db from "@/db/drizzle";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { POINTS_TO_REFILL } from "@/constants";
import { generateUniqueUsername } from "@/lib/user-utils";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        throw new Error("User not authenticated");
    }

    const course = await getCourseById(courseId);

    if (!course) {
        throw new Error("Course not found");
    }

    if (!course.units.length || !course.units[0].lessons.length) {
        throw new Error("Course has no lessons");
    }

    const existingUserProgress = await getUserProgress();

    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
        }).where(eq(userProgress.userId, userId));

        revalidatePath("/courses");
        revalidatePath("/learn");
        revalidatePath("/leaderboard");
        redirect("/learn")
    }

    // Generate a unique username for new users
    const baseUsername = user.firstName || user.username || "User";
    const uniqueUsername = await generateUniqueUsername(baseUsername, userId);

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: uniqueUsername,
        userImageSrc: user.imageUrl || "/mascot.png"
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    revalidatePath("/leaderboard");
    redirect("/learn")
};

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }
    
    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();
    
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgress;

    if (isPractice) { return { error: "practice" }; }

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if (userSubscription?.isActive) {
        return { error: "subscription" };
    }

    if (currentUserProgress.hearts === 0) {
        return { error: "hearts" };
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");
    revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found ")
    }

    if (currentUserProgress.hearts === 5) {
        throw new Error("User already has 5 hearts");
    }

    if (currentUserProgress.points < POINTS_TO_REFILL) {
        throw new Error("User does not have enough points");
    }

    await db.update(userProgress).set({
        hearts: currentUserProgress.hearts + 1,
        points: currentUserProgress.points - POINTS_TO_REFILL,
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");
}

export const updateUserPoints = async (pointsToAdd: number) => {
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

    await db.update(userProgress)
        .set({
            points: currentUserProgress.points + pointsToAdd,
        })
        .where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/shop");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");

    return { points: currentUserProgress.points + pointsToAdd };
};