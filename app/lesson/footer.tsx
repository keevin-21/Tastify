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
                    <div className="text-green-400 font-bold text-base lg:text-2xl flex items-center animate-[slideInLeft_0.5s_ease-out] group relative">
                        <CheckCircle className="w-6 h-6 lg:h-10 lg:w-10 mr-4 animate-[bounceIn_0.6s_ease-out_0.2s_both] group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:text-green-300 transition-colors duration-300">
                            Nice job!
                        </span>
                        
                        {/* Success particles */}
                        <div className="absolute -top-2 left-12 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-70" />
                        <div className="absolute -bottom-1 left-16 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.3s' }} />
                    </div>
                )}
                {status === "incorrect" && (
                    <div className="text-red-400 font-bold text-base lg:text-2xl flex items-center animate-[slideInLeft_0.5s_ease-out] group">
                        <XCircle className="w-6 h-6 lg:h-10 lg:w-10 mr-4 animate-[shakeIcon_0.6s_ease-out] group-hover:scale-110 transition-transform duration-300" />
                        <span className="group-hover:text-red-300 transition-colors duration-300">
                            Try again!
                        </span>
                    </div>
                )}
                {status === "completed" && (
                    <Button 
                        variant="default" 
                        size={isMobile ? "sm" : "lg"} 
                        onClick={() => window.location.href = `/lesson/${lessonId}`}
                        className="hover:scale-105 transition-all duration-300"
                    >
                        Practice again
                    </Button>
                )}
                <Button 
                    disabled={disabled} 
                    className="ml-auto hover:scale-105 transition-all duration-300" 
                    onClick={onCheck} 
                    size={isMobile ? "sm" : "lg"} 
                    variant={status === "incorrect" ? "danger" : "secondary"}
                >
                    {status === "default" && "Check"}
                    {status === "correct" && "Next"}
                    {status === "incorrect" && "Try again"}
                    {status === "completed" && "Next lesson"}
                </Button>
            </div>
        </footer>
    )
}

