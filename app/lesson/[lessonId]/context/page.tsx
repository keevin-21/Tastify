import { getLesson, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { LessonContext } from "./lesson-context";
import { Header } from "../../header";
import { getLessonContext } from "@/lib/lesson-context";

type Props = {
  params: Promise<{ lessonId: string }>;
};

const LessonContextPage = async ({ params }: Props) => {
  const { lessonId } = await params;
  const lessonIdNumber = parseInt(lessonId);

  const lessonPromise = getLesson(lessonIdNumber);
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();
  const contextDataPromise = getLessonContext(lessonIdNumber);

  const [lesson, userProgress, userSubscription, contextData] = await Promise.all([
    lessonPromise,
    userProgressPromise,
    userSubscriptionPromise,
    contextDataPromise,
  ]);

  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        hearts={userProgress.hearts}
        percent={0}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <LessonContext
        lessonId={lesson.id}
        title={lesson.title}
        challengesCount={lesson.challenges.length}
        contextData={contextData}
      />
    </div>
  );
};

export default LessonContextPage; 