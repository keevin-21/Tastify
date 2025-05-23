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
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper /*i can use flex-row-reverse here*/>
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
                <Quests 
                    points={userProgress.points} 
                    questProgress={questProgress}
                />
            </StickyWrapper>
            
            <FeedWrapper /*and here*/>
                <Header title={userProgress.activeCourse.title} />
                { units.map((unit) => (
                    <div key={unit.id} className="mb-10">
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
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;