import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    value: number;
    variant: "points" | "hearts";
}

export const ResultCard = ({ value, variant }: Props) => {
    const imgSource = variant === "hearts" ? "/heart.svg" : "/points.png";
    
    return (
        <div className={cn(
            "rounded-xl border-2 w-full",
            variant === "points" && "bg-orange-500 border-orange-500",
            variant === "hearts" && "bg-rose-500 border-rose-500",
        )}>
            <div className={cn(
                "p-1.5 text-white rounded-xl font-bold uppercase text-xs",
                variant === "points" && "bg-orange-500",
                variant === "hearts" && "bg-rose-500",
            )}>
                {variant === "hearts" ? "Hearts Left" : "Total XP"}
            </div>
            <div className={cn(
                "rounded-xl bg-white items-center flex justify-center p-6 font-bold text-lg",
                variant === "points" && "text-orange-500",
                variant === "hearts" && "text-rose-500",
            )}>
                <Image
                    src={imgSource}
                    alt="icon"
                    width={30}
                    height={30}
                    className="mr-2"
                />
                {value}
            </div>
        </div>        
    )
}