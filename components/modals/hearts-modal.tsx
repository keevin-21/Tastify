"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHeartsModal } from "@/store/use-hearts-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const HeartsModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useHeartsModal();

    useEffect(() => setIsClient(true), []);

    const onClick = () => {
        close();
        router.push("/store");
    };

    if (!isClient) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md p-0 bg-gradient-to-b from-[#1e1e1e] to-[#2c2c2c] border-[#2c2c2c] [&>button]:text-white">
                <DialogHeader className="space-y-4 pt-6 px-6">
                    <div className="flex items-center w-full justify-center">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-rose-600 rounded-full blur opacity-30 animate-pulse"></div>
                            <Image
                                src="/broken_heart.svg"
                                alt="mascot"
                                width={80}
                                height={80}
                                className="relative"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-[#f5f5f5] font-bold text-2xl"> 
                        You ran out of hearts!
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-400 text-base">
                        Get Pro Subscription for unlimited hearts or purchase them in the shop.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-[#2c2c2c]/50 backdrop-blur-sm mt-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button 
                            variant="secondary" 
                            className="w-full font-bold text-white hover:bg-[#FF6F1F]/90 border-[#cc570f] hover:scale-105 transition-all duration-300" 
                            size="lg" 
                            onClick={onClick}
                        >
                            Get Unlimited Hearts
                        </Button>

                        <Button 
                            variant="ghost" 
                            className="w-full font-bold text-neutral-400 hover:bg-[#1e1e1e] hover:scale-105 transition-all duration-300" 
                            size="lg" 
                            onClick={close}
                        >
                            No Thanks
                        </Button>
                    </div>                    
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    )
};