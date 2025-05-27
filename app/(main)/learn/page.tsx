import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { getCourseProgress, getLessonPercent, getUnits, getUserProgress, getUserSubscription, getQuestProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LearnPage = async () => {
    const userProgressPromise = getUserProgress();
    const unitsData = getUnits();
    const courseProgressPromise = getCourseProgress();
    const lessonPercentPromise = getLessonPercent();
    const userSubscriptionPromise = getUserSubscription();
    const questProgressPromise = getQuestProgress();
    
    const [
        userProgress,
        units,
        courseProgress,
        lessonPercent,
        userSubscription,
        questProgress,
    ] = await Promise.all([
        userProgressPromise,
        unitsData,
        courseProgressPromise,
        lessonPercentPromise,
        userSubscriptionPromise,
        questProgressPromise,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    if (!courseProgress) {
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
                    <Quests 
                        points={userProgress.points} 
                        questProgress={questProgress}
                    />
                </div>
            </StickyWrapper>
            
            <FeedWrapper>
                <div className="space-y-8">
                    <Header title={userProgress.activeCourse.title} />
                    <div className="space-y-8">
                        {units.map((unit) => (
                            <div key={unit.id}>
                                <Unit
                                    id={unit.id}
                                    order={unit.order}
                                    description={unit.description}
                                    title={unit.title}
                                    lessons={unit.lessons}
                                    activeLesson={courseProgress.activeLesson}
                                    activeLessonPercent={lessonPercent}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;