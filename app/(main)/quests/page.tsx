import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";
import { QUESTS } from "@/constants";
import { Quests } from "@/components/quests";

const QuestsPage = async () => {
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();

    const [userProgress, userSubscription] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
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
                    <ul className="w-full space-y-4">
                        {QUESTS.map((quest) => {
                            const progress = (userProgress.points / quest.value) * 100;
                            const isCompleted = userProgress.points >= quest.value;

                            return (
                                <div
                                    className="flex items-center w-full p-4 gap-x-4 bg-[#232323] rounded-xl hover:bg-[#2c2c2c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                    key={quest.title}
                                >
                                    <div className="relative">
                                        <Image
                                            src="/points.png"
                                            alt="Points"
                                            width={50}
                                            height={50}
                                            className="relative hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[#f5f5f5] text-xl font-bold">
                                                {quest.title}
                                            </p>
                                            <div className="flex items-center gap-2 bg-[#2c2c2c] px-4 py-2 rounded-lg">
                                                <p className="text-[#f5f5f5] font-bold">
                                                    {Math.min(userProgress.points, quest.value)}/{quest.value}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Progress 
                                                value={progress} 
                                                className={`h-3 ${isCompleted ? 'bg-[#3c3c3c]' : ''}`}
                                            />
                                            {isCompleted && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                                    <Image
                                                        src="/check.png"
                                                        alt="Completed"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </FeedWrapper>
        </div>
    )
}

export default QuestsPage;