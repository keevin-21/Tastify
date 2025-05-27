import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getLeaderboardUsers, getUserProgress, getUserSubscription, getQuestProgress } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Crown } from "lucide-react";

const LeaderboardPage = async () => {
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();
    const leaderboardUsersPromise = getLeaderboardUsers();
    const questProgressPromise = getQuestProgress();

    const [userProgress, userSubscription, leaderboardUsers, questProgress] = await Promise.all([
        userProgressPromise,
        userSubscriptionPromise,
        leaderboardUsersPromise,
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
                            src="/leaderboard.png"
                            alt="Leaderboard"
                            width={90}
                            height={90}
                            className="relative z-10"
                        />
                    </div>
                    <h1 className="text-center font-bold text-[#f5f5f5] text-2xl mt-8 mb-4">
                        Global Leaderboard
                    </h1>
                    <p className="text-neutral-400 text-center text-lg mb-8 max-w-md">
                        Compete with learners worldwide and showcase your cooking mastery. Rise through the ranks!
                    </p>
                    <div className="w-full max-w-3xl space-y-4">
                        {leaderboardUsers.map((userProgress, index) => (
                            <div
                                key={userProgress.userId}
                                className={`
                                    flex items-center w-full p-4 rounded-xl
                                    hover:bg-[#2c2c2c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300
                                    ${index === 0 ? 'bg-gradient-to-r from-[#2c2c2c]/50 to-transparent shadow-lg' : ''}
                                `}
                            >
                                <div className={`
                                    flex items-center justify-center w-8 h-8 rounded-full mr-4
                                    ${index === 0 ? 'bg-orange-500/20' : 'bg-[#2c2c2c]/50'}
                                `}>
                                    <div className="font-bold text-[#f5f5f5] flex items-center justify-center">
                                        {index === 0 && (
                                            <Image
                                                src="/1st_place.svg"
                                                alt="1st Place"
                                                height={30}
                                                width={30}
                                                className="scale-110"
                                            />
                                        )}
                                        {index === 1 && (
                                            <Image
                                                src="/2nd_place.svg"
                                                alt="2nd Place"
                                                height={30}
                                                width={30}
                                            />
                                        )}
                                        {index === 2 && (
                                            <Image
                                                src="/3rd_place.svg"
                                                alt="3rd Place"
                                                height={30}
                                                width={30}
                                            />
                                        )}
                                        {index > 2 && (
                                            <span className="text-neutral-400">{index + 1}</span>
                                        )}
                                    </div>
                                </div>
                                <Avatar className={`
                                    border-2 h-12 w-12 mr-4 
                                    ${index === 0 ? 'border-orange-500/50' : 'border-[#3c3c3c]'}
                                `}>
                                    <AvatarImage
                                        className="object-cover"
                                        src={userProgress.userImageSrc}
                                    />
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[#f5f5f5] font-bold flex items-center">
                                            {userProgress.userName}
                                            <span className="text-xs text-neutral-500 ml-2 font-normal">
                                                #{userProgress.userId.slice(-4)}
                                            </span>
                                        </p>
                                        {userProgress.isPremium && (
                                            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                                                <Crown className="w-3 h-3" />
                                                <span>PRO</span>
                                            </div>
                                        )}
                                    </div>
                                    {userProgress.activeCourse && (
                                        <p className="text-xs text-neutral-400 font-normal mt-1">
                                            Learning {userProgress.activeCourse.title}
                                        </p>
                                    )}
                                </div>
                                <div className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg
                                    ${index === 0 ? 'bg-orange-500/20' : 'bg-[#2c2c2c]/50'}
                                `}>
                                    <Image
                                        src="/points.svg"
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