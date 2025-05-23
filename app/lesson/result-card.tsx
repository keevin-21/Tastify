import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    value: number;
    variant: "points" | "hearts";
}

export const ResultCard = ({ value, variant }: Props) => {
    const imgSource = variant === "hearts" ? "/heart.svg" : "/points.svg";
    
    return (
        <div className="relative group">
            {/* Subtle glow effect for satisfaction */}
            <div className={cn(
                "absolute -inset-2 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-500",
                variant === "points" && "bg-orange-500",
                variant === "hearts" && "bg-rose-500",
            )} />
            
            <div className={cn(
                "relative rounded-2xl border-2 w-full hover:scale-105 transition-all duration-300 shadow-lg overflow-hidden",
                variant === "points" && "bg-orange-500 border-orange-400",
                variant === "hearts" && "bg-rose-500 border-rose-400",
            )}>
                {/* Header section */}
                <div className={cn(
                    "px-8 py-8 lg:px-11 lg:py-6 text-white rounded-t-2xl font-bold uppercase text-xs lg:text-sm tracking-wider relative",
                    variant === "points" && "bg-orange-500",
                    variant === "hearts" && "bg-rose-500",
                )}>
                    <div className="relative z-10 text-center">
                        {variant === "hearts" ? "Hearts Left" : "Total XP"}
                    </div>

                </div>
                
                {/* Main content section */}
                <div className="bg-white px-6 py-8 lg:px-8 lg:py-12 relative">
                    <div className="flex items-center justify-center relative z-10">
                        <div className="flex items-center gap-3 lg:gap-4">
                            <div className="relative">
                                <Image
                                    src={imgSource}
                                    alt="icon"
                                    width={40}
                                    height={40}
                                    className="lg:w-12 lg:h-12 drop-shadow-sm"
                                />
                                {/* Icon glow effect */}
                                <div className={cn(
                                    "absolute inset-0 rounded-full blur-md opacity-30",
                                    variant === "points" && "bg-orange-400",
                                    variant === "hearts" && "bg-rose-400",
                                )} />
                            </div>
                            
                            <div className={cn(
                                "font-bold text-3xl lg:text-5xl tracking-tight",
                                variant === "points" && "text-orange-600",
                                variant === "hearts" && "text-rose-600",
                            )}>
                                {value}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom accent line */}
                <div className={cn(
                    "h-1 w-full",
                    variant === "points" && "bg-orange-400",
                    variant === "hearts" && "bg-rose-400",
                )} />
            </div>
        </div>        
    )
}