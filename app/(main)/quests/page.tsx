import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription, getQuestProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Promo } from "@/components/promo";
import { QuestsWrapper } from "./quests-wrapper";

const QuestsPage = async () => {
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();
    const questProgressPromise = getQuestProgress();

    const [userProgress, userSubscription, questProgressData] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
        questProgressPromise,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const isPremium = !!userSubscription?.isActive;

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6 py-6 min-h-screen bg-[#1e1e1e]">
            <StickyWrapper>
                <div className="space-y-4">
                    <QuestsWrapper 
                        userProgress={{
                            ...userProgress,
                            activeCourse: userProgress.activeCourse!
                        }}
                        userSubscription={userSubscription}
                        questProgress={questProgressData}
                    />
                    {!isPremium && (
                        <div className="overflow-hidden">
                            <Promo />
                        </div>
                    )}
                </div>
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <div className="relative group transition-transform hover:scale-105 duration-300">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image
                            src="/quests.png"
                            alt="Quests"
                            width={90}
                            height={90}
                            className="relative z-10"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl mt-8 mb-4">
                        Daily Quests
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8 max-w-md">
                        Complete daily quests to earn rewards and climb the ranks. Track your progress and unlock achievements.
                    </p>
                    <div className="w-full max-w-3xl">
                        <QuestsWrapper 
                            userProgress={{
                                ...userProgress,
                                activeCourse: userProgress.activeCourse!
                            }}
                            userSubscription={userSubscription}
                            questProgress={questProgressData}
                            questsOnly={true}
                        />
                    </div>
                </div>
            </FeedWrapper>
        </div>
    );
};

export default QuestsPage;