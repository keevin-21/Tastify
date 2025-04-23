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

                    activeCourse={{ title: "Japanese", imageSrc:"/jp.svg"}}
                    hearts={5}
                    points={100}
                    hasActiveSuscription={false}    
                />
            </StickyWrapper>
            
            <FeedWrapper /*and here*/>
                <Header title="Japanese" />
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;