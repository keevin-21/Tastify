import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getLeaderboardUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LeaderboardPage = async () => {
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();
    const leaderboardUsersPromise = getLeaderboardUsers();

    const [userProgress, userSubscription, leaderboardUsers] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
        leaderboardUsersPromise,
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
                <Quests points={userProgress.points} />
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <div className="relative">
                        <Image
                            src="/leaderboard.png"
                            alt="Leaderboard"
                            width={90}
                            height={90}
                            className="relative z-10 hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl my-6">
                        Leaderboard
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8">
                        See how you rank against other users.
                    </p>
                    <div className="w-full space-y-4">
                        {leaderboardUsers.map((userProgress, index) => (
                            <div
                                key={userProgress.userId}
                                className="flex items-center w-full p-4 rounded-xl bg-[#232323] hover:bg-[#2c2c2c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2c2c2c] mr-4">
                                    <p className="font-bold text-[#f5f5f5]">
                                        {index + 1}
                                    </p>
                                </div>
                                <Avatar className="border-2 border-[#3c3c3c] h-12 w-12 mr-4">
                                    <AvatarImage
                                        className="object-cover"
                                        src={userProgress.userImageSrc}
                                    />
                                </Avatar>
                                <p className="text-[#f5f5f5] font-bold flex-1">
                                    {userProgress.userName}
                                </p>
                                <div className="flex items-center gap-2 bg-[#2c2c2c] px-4 py-2 rounded-lg">
                                    <Image
                                        src="/points.png"
                                        alt="Points"
                                        height={20}
                                        width={20}
                                    />
                                    <p className="text-[#f5f5f5] font-bold">
                                        {userProgress.points}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FeedWrapper>
        </div>
    )
}

export default LeaderboardPage;