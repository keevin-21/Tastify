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
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <QuestsWrapper 
                    userProgress={userProgress}
                    userSubscription={userSubscription}
                    questProgress={questProgressData}
                />
                {!isPremium && (
                    <Promo />
                )}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <div className="relative">
                        <Image
                            src="/quests.png"
                            alt="Quests"
                            width={90}
                            height={90}
                            className="relative z-10 hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl my-6">
                        Quests
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8">
                        Complete quests to earn rewards.
                    </p>
                    <QuestsWrapper 
                        userProgress={userProgress}
                        userSubscription={userSubscription}
                        questProgress={questProgressData}
                        questsOnly={true}
                    />
                </div>
            </FeedWrapper>
        </div>
    );
};

export default QuestsPage;