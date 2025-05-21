import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

type Props = {
    params: {
        lessonId: number;
    };
};

const LessonIdPage = async ({ params }: Props) => {
    const lessonPromise  = getLesson(params.lessonId);
    const userProgressPromise = getUserProgress();
    const userSubscriptionPromise = getUserSubscription();

    const [
        lesson,
        userProgress,
        userSubscription,
    ] = await Promise.all([
        lessonPromise,
        userProgressPromise,
        userSubscriptionPromise,
    ]);

    if (!lesson || !userProgress) {
        redirect("/learn");
    }

    const initialPercent = lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length * 100;

    return (
        <div>
            <Quiz
                initialLessonId={lesson.id}
                initialLessonChallenges={lesson.challenges}
                initialHearts={userProgress.hearts}
                initialPercent={initialPercent}
                userSuscription={userSubscription}
            />
        </div>
    )
}

export default LessonIdPage;