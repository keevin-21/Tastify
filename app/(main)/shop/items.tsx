"use client";

import { refillHearts } from "@/actions/user-progress";
import { createStripeSession } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { POINTS_TO_REFILL } from "@/constants";

type Props = {
    hearts: number;
    points: number;
    hasActiveSuscription: boolean;
}

export const Items = ({
    hearts,
    points,
    hasActiveSuscription,
}: Props) => {

    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        };

        startTransition(() => {
            refillHearts().catch(() => {
                toast.error("Error refilling hearts");
            });
        });
    };

    const onUpgrade = () => {
        startTransition(() => {
            createStripeSession().then((response) => {
                if (response.data) {
                    window.location.href = response.data;
                }
            })
            .catch(() => toast.error("Error upgrading subscription"));
        });
    };

    return (
        <ul className="w-full space-y-6">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2 border-[#2c2c2c] bg-[#232323] rounded-xl shadow-lg hover:bg-[#2c2c2c] hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                    <Image
                        src="/heart.svg"
                        alt="Heart"
                        width={60}
                        height={60}
                        className="relative hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <div className="flex-1">
                    <p className="text-[#f5f5f5] text-base lg:text-xl font-bold">
                        Refill Hearts
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
                    className="bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#f5f5f5] hover:scale-105 transition-all duration-300 border border-[#3c3c3c]"
                >
                    {hearts === 5 ? "full" : (
                        <div className="flex items-center gap-x-2">
                            <Image
                                src="/points.svg"
                                alt="Points"
                                height={20}
                                width={20}
                            />
                            <p>
                                {POINTS_TO_REFILL}
                            </p>
                        </div>
                    )}
                </Button>
            </div>
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2 border-[#2c2c2c] bg-[#232323] rounded-xl shadow-lg hover:bg-[#2c2c2c] hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <div className="relative">
                    <Image
                        src="/premium_heart.svg"
                        alt="Premium Heart"
                        width={60}
                        height={60}
                        className="relative hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <div className="flex-1">
                    <p className="text-[#f5f5f5] text-base lg:text-xl font-bold">
                        Unlimited Hearts
                    </p>
                </div>
                <Button
                    onClick={onUpgrade}
                    disabled={pending}
                    className="bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#f5f5f5] hover:scale-105 transition-all duration-300 border border-[#3c3c3c]"
                >
                    {hasActiveSuscription ? "settings" : "upgrade"}
                </Button>
            </div>
        </ul>
    )
}