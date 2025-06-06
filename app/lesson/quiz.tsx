"use client";

import { challenges, challengesOptions, userSubscription } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"

type Props = {
    initialPercent: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengesOptions: typeof challengesOptions.$inferSelect[];
    })[];
    userSubscription: typeof userSubscription.$inferSelect & { isActive: boolean } | null; // replace w suscription typeof
};

export const Quiz = ({
    initialPercent,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription, 
}: Props) => {
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();

    useMount(() => {
        if (initialPercent === 100) {
            openPracticeModal();
        }
    });

    const { width, height } = useWindowSize();
    
    const router = useRouter();

    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true})
    
    const [correctAudio, , correctControls] = useAudio({ src:"/correct.mp3" })
    const [incorrectAudio, , incorrectControls] = useAudio({ src:"/incorrect.mp3" })

    const [lessonId] = useState(initialLessonId);
    const [pending, startTransition] = useTransition();
    const [hearts, setHearts] = useState(initialHearts);
    const [percent, setPercent] = useState(() => {
        return initialPercent === 100 ? 0 : initialPercent;
    });
    const [challenges] = useState(initialLessonChallenges);

    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        // find the first uncompleted challenge and set it as active, if user exits the quiz, set it to 0 to start from the beginningq
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"default" | "correct" | "incorrect">("default");

    const currentChallenge = challenges[activeIndex];
    const options = currentChallenge?.challengesOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onSelect = (id: number) => {
        if (status !== "default") return;

        setSelectedOption(id);
    };

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "incorrect") {
            setStatus("default");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("default");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if (!correctOption) { return; }

        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(currentChallenge.id).then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }

                    correctControls.play();
                    setStatus("correct");
                    setPercent((prev) => prev + 100 / challenges.length);

                    // this is a practice
                    if (initialPercent === 100) {
                        setHearts((prev) => Math.min(prev + 1, 5));
                    }
                })
                .catch(() => toast.error("Error updating challenge progress"));
            });
        } else {
            startTransition(() => {
                reduceHearts(currentChallenge.id)
                .then((response) => {
                    if (response?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }    

                    incorrectControls.play();
                    setStatus("incorrect");

                    if (!response?.error) {
                        setHearts((prev) => Math.max(prev - 1, 0));
                    }
                })
                .catch(() => toast.error("Error reducing hearts"));
            })
        }
    };

    if (!currentChallenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col min-h-screen">
                    <div className="flex-1 flex items-center justify-center">
                        <motion.div 
                            className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center text-white rounded-xl p-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.5,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                            >
                                <Image
                                    src="/finish.svg"
                                    alt="finish"
                                    width={100}
                                    height={100}
                                    className="animate-bounce"
                                />
                            </motion.div>

                            <motion.h1 
                                className="text-xl lg:text-3xl font-bold text-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                Great Job! <br />
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className="bg-gradient-to-r from-[#FF6F1F] to-[#FF8F1F] text-transparent bg-clip-text"
                                >
                                    You finished the lesson!
                                </motion.span>
                            </motion.h1>
                            
                            <motion.div 
                                className="flex items-center justify-center gap-x-4 w-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                            >
                                <ResultCard
                                    variant="points"
                                    value={challenges.length * 10}
                                />
                                <ResultCard
                                    variant="hearts"
                                    value={userSubscription?.isActive ? -1 : hearts}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                    <Footer
                        lessonId={lessonId}
                        status="completed"
                        onCheck={() => router.push("/learn")}
                    />
                </div>
            </>
        );
    }

    const title = currentChallenge.type === "ASSIST"
    ? "Fill in the blank"
    : currentChallenge.question;

    return (
        <div className="flex flex-col min-h-screen">
            {incorrectAudio}
            {correctAudio}
            <Header
                hearts={hearts}
                percent={percent}
                hasActiveSubscription={!!userSubscription?.isActive}
            />

            <div className="flex-1">
                <div className="h-full flex items-center justify-center py-8">
                    <div className={cn(
                        "lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col bg-[#232323] rounded-xl shadow-lg border-2 border-[#2c2c2c]",
                        currentChallenge.type === "SELECT" ? "gap-y-8 py-8" : "gap-y-6 py-6"
                    )}>
                        <div className="text-center">
                            <h1 className={cn(
                                "text-xl lg:text-3xl font-bold text-[#f5f5f5] mb-2",
                                currentChallenge.type === "ASSIST" && "text-lg lg:text-2xl"
                            )}>
                                {title}
                            </h1>
                            <div className="w-16 h-1 bg-[#FF6F1F] mx-auto rounded-full"></div>
                        </div>
                        <div className={cn(
                            "px-4 lg:px-8",
                            currentChallenge.type === "ASSIST" && "flex flex-col items-center"
                        )}>
                            {currentChallenge.type === "ASSIST" && (
                                <div className="w-full max-w-md mb-8">
                                    <QuestionBubble question={currentChallenge.question} />
                                </div>
                            )}
                            <Challenge
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending}
                                type={currentChallenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
                lessonId={lessonId}
            />
        </div>
    );
};