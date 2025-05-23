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
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSuscription={isPremium}
                    streak={userProgress.streakCount}
                />
                {!isPremium && (
                    <Promo />
                )}
                <Quests points={userProgress.points} questProgress={questProgress} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <div className="relative">
                        <Image
                            src="/shop.png"
                            alt="Shop"
                            width={90}
                            height={90}
                            className="relative z-10 hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl my-6">
                        Shop
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8">
                        Spend your points to buy items.
                    </p>
                    <Items
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSuscription={isPremium}
                    /> 
                </div>
            </FeedWrapper>
        </div>
    )
}

export default ShopPage;