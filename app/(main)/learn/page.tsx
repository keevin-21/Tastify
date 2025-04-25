import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";

const LearnPage = async () => {
    const userProgressPromise = getUserProgress();

    const [
        userProgress
    ] = await Promise.all([
        userProgressPromise
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper /*i can use flex-row-reverse here*/>
                <UserProgress

                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSuscription={false}    
                />
            </StickyWrapper>
            
            <FeedWrapper /*and here*/>
                <Header title={userProgress.activeCourse.title} />
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;