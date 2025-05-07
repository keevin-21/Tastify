"use client";

import { challenges, challengesOptions } from "@/db/schema";
import { useState } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";

type Props = {
    initialPercent: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengesOptions: typeof challengesOptions.$inferSelect[];
    })[];
    userSuscription: any; // replace w suscription typeof
};

export const Quiz = ({
    initialPercent,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSuscription, 
}: Props) => {
    const [hearts, setHearts] = useState(initialHearts);
    const [percent, setPercent] = useState(initialPercent);
    const [challenges] = useState(initialLessonChallenges);

    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        // find the first uncompleted challenge and set it as active, if user exits the quiz, set it to 0 to start from the beginningq
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const challenge = challenges[activeIndex];

    const title = challenge.type === "ASSIST"
    ? "Select the correct answer"
    : challenge.question;

    return (
        <div>
        <>
            <Header
                hearts={hearts}
                percent={percent}
                hasActiveSuscription={!!userSuscription?.isActive}
            />

            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            { /* change back to challenge.type === "ASSIST" */ }
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble  question={challenge.question} />
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </>
        </div>
    );
};