import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { InfinityIcon } from "lucide-react";
import { courses } from "@/db/schema";

type Props = {
    activeCourse: typeof courses.$inferSelect;
    hearts: number;
    points: number;
    hasActiveSuscription: boolean;
    streak: number;
};

export const UserProgress = ({
    activeCourse,
    points,
    hearts,
    hasActiveSuscription,
    streak
}: Props) => {
    return(
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Link href="/courses">
                <Button 
                    variant="ghost" 
                    className="hover:bg-[#2c2c2c] hover:scale-105 transition-all duration-300 border border-transparent hover:border-[#3c3c3c] rounded-xl"
                >
                    <Image 
                        src={activeCourse.imageSrc}
                        alt={activeCourse.title}
                        className="rounded-md border hover:scale-110 transition-transform duration-300"
                        width={32}
                        height={32}
                    />
                </Button>
            </Link>
            <Link href="/shop">
                <Button 
                    className="text-orange-500 hover:bg-orange-500/10 hover:scale-105 transition-all duration-300 border border-transparent hover:border-orange-500/30 rounded-xl font-bold" 
                    variant="ghost"
                >
                    <Image src="/points.svg" height={28} width={28} alt="shop" className="mr-2 hover:scale-110 transition-transform duration-300" />
                        { points }
                </Button>
            </Link>
            <Link href="/shop">
                <Button 
                    className="text-rose-500 hover:bg-rose-500/10 hover:scale-105 transition-all duration-300 border border-transparent hover:border-rose-500/30 rounded-xl font-bold" 
                    variant="ghost"
                >
                    <Image src="/heart.svg" height={22} width={22} alt="shop" className="mr-2 hover:scale-110 transition-transform duration-300" />
                        { hasActiveSuscription
                            ? <InfinityIcon className=" h-4 w-4 stroke-[3]" />
                            : hearts
                        }
                </Button>
            </Link>
            <Button 
                className="text-orange-500 hover:bg-orange-500/10 hover:scale-105 transition-all duration-300 border border-transparent hover:border-orange-500/30 rounded-xl font-bold" 
                variant="ghost"
            >
                <Image src="/streak.svg" height={28} width={28} alt="streak" className="mr-2 hover:scale-110 transition-transform duration-300" />
                { streak }
            </Button>
        </div>
    );
};