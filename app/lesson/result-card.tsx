import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
    value: number;
    variant: "points" | "hearts";
}

export const ResultCard = ({ value, variant }: Props) => {
    const imgSource = variant === "hearts" ? "/heart.svg" : "/points.svg";
    
    return (
        <motion.div 
            className="relative group"
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                mass: 1,
                delay: variant === "points" ? 0.4 : 0.6
            }}
            whileHover={{ scale: 1.05 }}
        >
            {/* Subtle glow effect for satisfaction */}
            <motion.div 
                className={cn(
                    "absolute -inset-2 rounded-2xl blur-sm opacity-10 group-hover:opacity-20 transition-opacity duration-500",
                    variant === "points" && "bg-orange-500",
                    variant === "hearts" && "bg-rose-500",
                )}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            
            <div className={cn(
                "relative rounded-2xl border-2 w-full transition-all duration-300",
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
                            <motion.div 
                                className="relative"
                                animate={{
                                    y: [0, -4, 0],
                                    rotate: [0, -5, 5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Image
                                    src={imgSource}
                                    alt="icon"
                                    width={40}
                                    height={40}
                                    className="lg:w-12 lg:h-12"
                                />
                                {/* Icon glow effect */}
                                <motion.div 
                                    className={cn(
                                        "absolute inset-0 rounded-full blur-md opacity-20",
                                        variant === "points" && "bg-orange-400",
                                        variant === "hearts" && "bg-rose-400",
                                    )}
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.2, 0.3, 0.2]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                            
                            <motion.div 
                                className={cn(
                                    "font-bold text-3xl lg:text-5xl tracking-tight",
                                    variant === "points" && "text-orange-600",
                                    variant === "hearts" && "text-rose-600",
                                )}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                    mass: 1,
                                    delay: variant === "points" ? 0.6 : 0.8
                                }}
                            >
                                {value === -1 ? "∞" : value}
                            </motion.div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom accent line */}
                <motion.div 
                    className={cn(
                        "h-1 w-full",
                        variant === "points" && "bg-orange-400",
                        variant === "hearts" && "bg-rose-400",
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: variant === "points" ? 0.8 : 1 }}
                />
            </div>
        </motion.div>        
    )
}