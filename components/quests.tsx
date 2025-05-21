import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { QUESTS } from "@/constants";
import { Progress } from "./ui/progress";

type Props = {
    points: number;
};

export const Quests = ({ points }: Props) => {
    return (
        <div className="border-2 rounded-xl p-6 space-y-6 bg-[#232323] border-[#3c3c3c] hover:bg-[#2c2c2c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-3">
                    <div className="relative">
                        <Image
                            src="/quests.png"
                            alt="Quests"
                            width={32}
                            height={32}
                            className="relative hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <h3 className="text-[#f5f5f5] font-bold text-lg">
                        Quests
                    </h3>
                </div>
                <Link href="/quests">
                    <Button 
                        size="sm" 
                        variant="secondaryOutline"
                        className="hover:scale-105 transition-all duration-300"
                    >
                        View all
                    </Button>
                </Link>
            </div>
            <ul className="w-full space-y-3">
                {QUESTS.map((quest) => {
                    const progress = (points / quest.value) * 100;
                    const isCompleted = points >= quest.value;

                    return (
                        <div
                            className="flex items-center w-full p-3 gap-x-3 bg-[#2c2c2c] rounded-lg hover:bg-[#3c3c3c] transition-all duration-300"
                            key={quest.title}
                        >
                            <div className="relative">
                                <Image
                                    src="/points.png"
                                    alt="Points"
                                    width={32}
                                    height={32}
                                    className="relative hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col gap-y-2 w-full">
                                <div className="flex items-center justify-between">
                                    <p className="text-[#f5f5f5] text-base font-bold">
                                        {quest.title}
                                    </p>
                                    <div className="flex items-center gap-2 bg-[#232323] px-3 py-1 rounded-md">
                                        <p className="text-[#f5f5f5] text-sm font-bold">
                                            {Math.min(points, quest.value)}/{quest.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Progress 
                                        value={progress} 
                                        className={`h-2 ${isCompleted ? 'bg-[#3c3c3c]' : ''}`}
                                    />
                                    {isCompleted && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                            <Image
                                                src="/check.png"
                                                alt="Completed"
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </ul>
        </div>
    )
}