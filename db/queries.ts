import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { courses, lessons, units, userProgress, challengeProgress, challenges, userSubscription, questProgress } from "./schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true,
        },
    });

    return data;
});

export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    challenges: {
                        orderBy: (challenges, { asc }) => [asc(challenges.order)],
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            if (lesson.challenges.length === 0) {
                return { ...lesson, completed: false };
            }
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
        });

        return { ...lesson, completed: allCompletedChallenges };
    });
  
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});

// get all courses
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
});

export const getCourseById = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            units: {
                orderBy: (units, { asc }) => [asc(units.order)],
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.order)],
                        
                    },
                },
            },
        },
    });

    return data;
});

export const getCourseProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId) {
        return null;
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    const firstUncompletedLesson = unitsInActiveCourse.flatMap((unit) => unit.lessons).find((lesson) => {
        // if something doesnt work, check the last if clause
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress || challenge.challengeProgress.length === 0 || challenge.challengeProgress.some((progress) => progress.completed === false);
        });
    });

    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    }
});

export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }
    const courseProgress = await getCourseProgress();

    const lessonId = id || courseProgress?.activeLessonId;

    if (!lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengesOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        // if something doesnt work, check the last if clause
        const completed = challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);

        return { ...challenge, completed };
    });

    return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercent = cache(async () => {
    const courseProgress = await getCourseProgress();

    if(!courseProgress?.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);
    const percentage = Math.round((completedChallenges.length / lesson.challenges.length) * 100);

    return percentage;
})

export const getQuestProgress = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const data = await db.query.questProgress.findMany({
        where: eq(questProgress.userId, userId),
    });

    return data;
});

const DAY_IN_MILLISECONDS = 86_400_000;

export const getUserSubscription = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
    });

    if (!data) return null;

    const isActive = data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MILLISECONDS > Date.now();

    return {
        ...data,
        isActive: !!isActive,
    }
});

// top 10 users - Global leaderboard across all courses
export const getLeaderboardUsers = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    try {
        const data = await db.query.userProgress.findMany({
            orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
            limit: 20, // Get more records to account for potential duplicates
            columns: {
                userId: true,
                userName: true,
                userImageSrc: true,
                points: true,
            },
            with: {
                activeCourse: {
                    columns: {
                        title: true,
                        imageSrc: true,
                    },
                },
            },
        });

        // Get subscriptions separately to avoid relation issues
        const subscriptions = await db.query.userSubscription.findMany({
            where: (userSubscription, { inArray }) => 
                inArray(userSubscription.userId, data.map(user => user.userId))
        });

        // Create a Map to ensure unique users and keep highest points
        const uniqueUsersMap = new Map();
        
        data.forEach(user => {
            const existingUser = uniqueUsersMap.get(user.userId);
            // Keep the user with higher points or the first one if points are equal
            if (!existingUser || user.points > existingUser.points) {
                // Find user's subscription
                const subscription = subscriptions.find(sub => sub.userId === user.userId);
                const isActive = subscription && 
                    subscription.stripePriceId && 
                    subscription.stripeCurrentPeriodEnd &&
                    new Date(subscription.stripeCurrentPeriodEnd) > new Date();
                
                uniqueUsersMap.set(user.userId, {
                    ...user,
                    isPremium: !!isActive
                });
            }
        });

        // Convert back to array and sort by points, then limit to 10
        const uniqueUsers = Array.from(uniqueUsersMap.values())
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);

        return uniqueUsers;
    } catch (error) {
        console.error("Error fetching leaderboard users:", error);
        return [];
    }
});