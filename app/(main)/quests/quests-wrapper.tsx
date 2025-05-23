"use client";

import { useState, useEffect } from "react";
import { UserProgress } from "@/components/user-progress";
import { QuestsClient } from "./quests-client";

type UserProgressType = {
    activeCourse: any;
    hearts: number;
    points: number;
    streakCount: number;
};

type UserSubscriptionType = {
    isActive: boolean;
} | null;

type QuestProgressType = {
    id: number;
    userId: string;
    questId: number;
    completed: boolean;
    completedAt: Date | null;
};

type Props = {
    userProgress: UserProgressType;
    userSubscription: UserSubscriptionType;
    questProgress: QuestProgressType[];
    questsOnly?: boolean;
};

export const QuestsWrapper = ({ userProgress, userSubscription, questProgress, questsOnly = false }: Props) => {
    const [currentPoints, setCurrentPoints] = useState(userProgress.points);

    // Update points when userProgress changes
    useEffect(() => {
        console.log("QuestsWrapper: userProgress.points changed:", userProgress.points);
        setCurrentPoints(userProgress.points);
    }, [userProgress.points]);

    const handlePointsUpdate = (newPoints: number) => {
        console.log("QuestsWrapper: handlePointsUpdate called with:", newPoints);
        setCurrentPoints(newPoints);
    };

    const isPremium = !!userSubscription?.isActive;

    if (questsOnly) {
        return (
            <QuestsClient
                initialPoints={currentPoints}
                questProgress={questProgress}
                onPointsUpdate={handlePointsUpdate}
            />
        );
    }

    return (
        <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={currentPoints}
            hasActiveSuscription={isPremium}
            streak={userProgress.streakCount}
        />
    );
}; 