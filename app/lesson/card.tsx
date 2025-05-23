import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback } from "react";
import { useAudio, useKey } from "react-use";

type Props = {
    id: number;
    imageSrc: string | null;
    audioSrc: string | null;
    shortcut: string;
    text: string;
    selected?: boolean;
    onClick: () => void;
    status?: "correct" | "incorrect" | "default";
    disabled?: boolean;
    type: typeof challenges.$inferSelect["type"];
};

export const Card = ({
    imageSrc,
    audioSrc,
    shortcut,
    text,
    selected,
    onClick,
    status,
    disabled,
    type,
}: Props) => {
    const [audio, , controls] = useAudio({ src: audioSrc || "" });
    
    const handleClick = useCallback(() => {
        if (disabled) return;

        controls.play();
        onClick();
    },[disabled, onClick, controls]);

    useKey(shortcut, handleClick, {}, [handleClick]);
    
    return (
        <div
            onClick={handleClick}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-[#232323] p-4 lg:p-6 cursor-pointer active:border-b-2 bg-[#1e1e1e] border-[#2c2c2c]",
                selected && "border-[#FF6F1F] bg-[#2c2c2c] hover:bg-[#2c2c2c]",
                selected && status === "correct" && "border-green-400 bg-green-900/40 hover:bg-green-900/40",
                selected && status === "incorrect" && "border-red-400 bg-red-900/40 hover:bg-red-900/40",
                disabled && "pointer-events-none opacity-60 hover:bg-[#1e1e1e]",
                type === "ASSIST" && "lg:p-3 w-full"
            )}        
        >
            {audio}
            {imageSrc && (
                <div
                    className="relative aspect-square mb-4 max-h-[80px] lg:max-h-[150px] w-full"
                >
                    <Image
                        src={imageSrc}
                        fill
                        alt={text}
                    />
                </div>
            )}

            <div className={cn(
                "flex items-center justify-between",
                type === "ASSIST" && "flex-row-reverse",
            )}>
                {type === "ASSIST" && <div />}
                <p className={cn(
                    "text-[#f5f5f5] text-sm lg:text-base",
                    selected && "text-[#FF6F1F]",
                    selected && status === "correct" && "text-green-400",
                    selected && status === "incorrect" && "text-red-400",
                )}>
                    {text}
                </p>
                <div className={cn(
                    "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold",
                    selected && "border-[#FF6F1F] text-[#FF6F1F]",
                    selected && status === "correct" && "border-green-400 text-green-400",
                    selected && status === "incorrect" &&  "border-red-400 text-red-400",
                )}>
                    {shortcut}
                </div>
            </div>
        </div>
    );
};