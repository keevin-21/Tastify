"use client";

import { useEffect, useState, useCallback } from "react";
import { QUESTS } from "@/constants";
import { Button } from "@/components/ui/button";
import { claimQuestReward } from "@/actions/quest-progress";
import Image from "next/image";
import { toast } from "sonner";

type Quest = {
    id: number;
    title: string;
    value: number;
    completed: boolean;
};

type QuestProgressType = {
    id: number;
    userId: string;
    questId: number;
    completed: boolean;
    completedAt: Date | null;
};

type Props = {
    initialPoints: number;
    questProgress: QuestProgressType[];
    onPointsUpdate: (points: number) => void;
};

export const QuestsClient = ({ initialPoints, questProgress, onPointsUpdate }: Props) => {
    const [points, setPoints] = useState(initialPoints);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [claimingQuest, setClaimingQuest] = useState<number | null>(null);

    // Use useCallback to prevent unnecessary re-renders
    const updateQuests = useCallback(() => {
        const questsWithCompletion = QUESTS.map((quest, index) => {
            const questId = index + 1;
            const isCompleted = questProgress.some(
                (progress) => progress.questId === questId && progress.completed
            );
            
            return {
                ...quest,
                id: questId,
                completed: isCompleted
            };
        });

        setQuests(questsWithCompletion);
    }, [questProgress]);

    useEffect(() => {
        setPoints(initialPoints);
    }, [initialPoints]);

    useEffect(() => {
        updateQuests();
    }, [updateQuests]);

    const onCompleteQuest = async (questId: number) => {
        const quest = quests.find((q) => q.id === questId);
        if (!quest || quest.completed || claimingQuest === questId) {
            console.log("Quest claim blocked:", { 
                questFound: !!quest, 
                questCompleted: quest?.completed, 
                alreadyClaiming: claimingQuest === questId 
            });
            return;
        }

        const rewardPoints = Math.floor(quest.value / 2);
        setClaimingQuest(questId);
        
        try {
            console.log("Claiming quest reward:", { questId, rewardPoints });
            const result = await claimQuestReward(questId, rewardPoints);
            console.log("Quest reward result:", result);
            
            if (result.error) {
                console.error("Error claiming quest reward:", result.error);
                toast.error(`Failed to claim quest: ${result.error}`);
                return;
            }

            if (result.success && result.points !== undefined) {
                console.log("Quest claimed successfully, updating points:", result.points);
                setPoints(result.points);
                onPointsUpdate(result.points);
                
                // Update quest state locally
                setQuests((prevQuests) =>
                    prevQuests.map((q) =>
                        q.id === questId ? { ...q, completed: true } : q
                    )
                );
                
                toast.success(`Quest completed! +${rewardPoints} XP earned!`);
            } else {
                console.error("Unexpected result format:", result);
                toast.error("Unexpected error occurred");
            }
        } catch (error) {
            console.error("Error claiming quest reward:", error);
            toast.error("Failed to claim quest reward");
        } finally {
            setClaimingQuest(null);
        }
    };

    return (
        <div className="w-full space-y-4">
            {quests.map((quest) => {
                const progress = (points / quest.value) * 100;
                const canClaim = !quest.completed && points >= quest.value;
                const isClaiming = claimingQuest === quest.id;

                return (
                    <div
                        key={quest.id}
                        className="p-6 bg-[#232323] rounded-xl border border-[#3c3c3c] hover:bg-[#2c2c2c] hover:border-[#4c4c4c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src="/points.svg"
                                        alt="Points"
                                        width={50}
                                        height={50}
                                        className="relative hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-[#f5f5f5] text-xl font-bold">
                                        {quest.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm">
                                        Earn {Math.floor(quest.value / 2)} XP when completed
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {quest.completed ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-400 font-bold text-lg bg-green-400/20 px-4 py-2 rounded-full">
                                            ✓ Completed
                                        </span>
                                    </div>
                                ) : (
                                    <div className="bg-[#2c2c2c] px-4 py-2 rounded-lg border border-[#3c3c3c]">
                                        <span className="text-[#f5f5f5] font-bold text-lg">
                                            {Math.min(points, quest.value)}/{quest.value}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="relative h-3 w-full bg-[#1c1c1c] rounded-full overflow-hidden mb-4">
                            <div 
                                className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${
                                    quest.completed 
                                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                        : 'bg-gradient-to-r from-[#FF6F1F] to-[#FF8A3D]'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                            {/* Progress bar shine effect */}
                            <div 
                                className={`absolute left-0 top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 ${
                                    progress > 0 ? 'animate-pulse' : ''
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>

                        {canClaim && (
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => onCompleteQuest(quest.id)}
                                    size="lg"
                                    disabled={isClaiming}
                                    className="bg-orange-400 hover:bg-orange-500 border-orange-500 text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isClaiming ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Claiming...
                                        </div>
                                    ) : (
                                        <>
                                            <Image 
                                                src="/points.svg" 
                                                alt="Points" 
                                                width={16} 
                                                height={16}
                                                className="mr-2"
                                            />
                                            Claim {Math.floor(quest.value / 2)} XP
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}; 