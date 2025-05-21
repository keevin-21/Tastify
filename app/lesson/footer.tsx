import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
    disabled?: boolean;
    status: "correct" | "incorrect" | "default" | "completed";
    onCheck: () => void;
    lessonId?: number;
}

export const Footer = ({
    disabled,
    status,
    onCheck,
    lessonId,
}: Props) => {
    useKey("Enter", onCheck, {}, [onCheck]);
    const isMobile = useMedia("(max-width: 1024px)");

    return (
        <footer className={cn(
            "lg:-h[140px] h-[100px] border-t-4 bg-[#232323] border-[#FF6F1F]",
            status === "correct" && "border-transparent bg-green-900/40",
            status === "incorrect" && "border-transparent bg-red-900/40",
        )}>
            <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
                {status === "correct" && (
                    <div className="text-green-400 font-bold text-base lg:text-2xl flex items-center">
                        <CheckCircle className="w-6 h-6 lg:h-10 lg:w-10 mr-4" />
                        Nice job!

                    </div>
                )}
                {status === "incorrect" && (
                    <div className="text-red-400 font-bold text-base lg:text-2xl flex items-center">
                        <XCircle className="w-6 h-6 lg:h-10 lg:w-10 mr-4" />
                        Try again!

                    </div>
                )}
                {status === "completed" && (
                    <Button variant="default" size={isMobile ? "sm" : "lg"} onClick={() => window.location.href = `/lesson/${lessonId}`}>
                        Practice again
                    </Button>
                )}
                <Button disabled={disabled} className="ml-auto" onClick={onCheck} size={isMobile ? "sm" : "lg"} variant={status === "incorrect" ? "danger" : "secondary"}>
                    {status === "default" && "Check"};
                    {status === "correct" && "Next"};
                    {status === "incorrect" && "Try again"};
                    {status === "completed" && "Next lesson"};
                </Button>
            </div>
        </footer>
    )
}

