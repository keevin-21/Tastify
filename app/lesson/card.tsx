import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useKey } from "react-use";
import { CloudinaryImage } from "@/components/cloudinary-image";
import { useCloudinaryAudio } from "@/hooks/use-cloudinary-audio";

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
    const { audio, controls, hasAudio } = useCloudinaryAudio(audioSrc);
    
    const handleClick = useCallback(() => {
        if (disabled) return;

        if (hasAudio && controls) {
            controls.play();
        }
        onClick();
    },[disabled, onClick, controls, hasAudio]);

    useKey(shortcut, handleClick, {}, [handleClick]);
    
    return (
        <div
            onClick={handleClick}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-[#232323] p-4 lg:p-6 cursor-pointer active:border-b-2 bg-[#1e1e1e] border-[#2c2c2c] transition-all duration-300",
                selected && "border-[#FF6F1F] bg-[#2c2c2c] hover:bg-[#2c2c2c] transform scale-105",
                selected && status === "correct" && "border-green-400 bg-green-900/40 hover:bg-green-900/40",
                selected && status === "incorrect" && "border-red-400 bg-red-900/40 hover:bg-red-900/40",
                disabled && "pointer-events-none opacity-60 hover:bg-[#1e1e1e]",
                type === "ASSIST" && "lg:p-4 w-full max-w-md mx-auto hover:shadow-lg hover:shadow-orange-500/20",
                type === "SELECT" && "min-h-[100px] flex flex-col justify-center hover:shadow-lg hover:shadow-orange-500/20"
            )}        
        >
            {audio && hasAudio && audio}
            {imageSrc && type === "SELECT" && (
                <div className="relative w-full flex justify-center mb-4">
                    <div className="h-32 w-32">
                        <CloudinaryImage
                            src={imageSrc}
                            alt={text}
                            width={128}
                            height={128}
                            className="rounded-lg object-cover w-full h-full"
                        />
                    </div>
                </div>
            )}

            <div className={cn(
                "flex items-center justify-between",
                type === "ASSIST" && "flex-row-reverse gap-4",
                type === "SELECT" && "flex-col gap-3 items-center justify-center text-center",
                type === "SELECT" && !imageSrc && "flex-row justify-between items-center"
            )}>
                {type === "ASSIST" && <div />}
                <p className={cn(
                    "text-[#f5f5f5] text-sm lg:text-base font-medium",
                    selected && "text-[#FF6F1F]",
                    selected && status === "correct" && "text-green-400",
                    selected && status === "incorrect" && "text-red-400",
                    type === "SELECT" && "text-center w-full",
                    type === "ASSIST" && "text-lg"
                )}>
                    {text}
                </p>
                <div className={cn(
                    "lg:w-[30px] lg:h-[30px] w-[20px] h-[20px] border-2 flex items-center justify-center rounded-lg text-neutral-400 lg:text-[15px] text-xs font-semibold transition-colors duration-300",
                    selected && "border-[#FF6F1F] text-[#FF6F1F]",
                    selected && status === "correct" && "border-green-400 text-green-400",
                    selected && status === "incorrect" &&  "border-red-400 text-red-400",
                    type === "SELECT" && "mt-2",
                    type === "ASSIST" && "lg:w-[35px] lg:h-[35px] lg:text-base"
                )}>
                    {shortcut}
                </div>
            </div>
        </div>
    );
};