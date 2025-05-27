import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription, getQuestProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const ShopPage = async () => {
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();
    const questProgressPromise = getQuestProgress();

    const [userProgress, userSubscription, questProgress] = await Promise.all([
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
                    <UserProgress
                        activeCourse={userProgress.activeCourse}
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSuscription={isPremium}
                        streak={userProgress.streakCount}
                    />
                    {!isPremium && (
                        <div className="overflow-hidden">
                            <Promo />
                        </div>
                    )}
                    <Quests points={userProgress.points} questProgress={questProgress} />
                </div>
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <div className="relative group transition-transform hover:scale-105 duration-300">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image
                            src="/shop.png"
                            alt="Shop"
                            width={90}
                            height={90}
                            className="relative z-10"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl mt-8 mb-4">
                        Item Shop
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8 max-w-md">
                        Use your hard-earned points to purchase special items and power-ups to enhance your learning journey.
                    </p>
                    <div className="w-full max-w-3xl">
                        <Items
                            hearts={userProgress.hearts}
                            points={userProgress.points}
                            hasActiveSuscription={isPremium}
                        /> 
                    </div>
                </div>
            </FeedWrapper>
        </div>
    )
}

export default ShopPage;