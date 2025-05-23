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
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = usePracticeModal();

    useEffect(() => setIsClient(true), []);

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
                                src="/mending_heart.svg"
                                alt="heart"
                                width={80}
                                height={80}
                                className="relative drop-shadow-2xl"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-[#f5f5f5] font-bold text-2xl"> 
                        Practice Mode
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-400 text-base">
                        Use practice mode to improve your skills and regain hearts. You won&apos;t lose any hearts or points in this mode.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-[#2c2c2c]/50 backdrop-blur-sm mt-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button 
                            variant="secondary" 
                            className="w-full font-bold text-white hover:bg-[#FF6F1F]/90 hover:scale-105 transition-all duration-300" 
                            size="lg" 
                            onClick={close}
                        >
                            I Understand
                        </Button>
                    </div>                    
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    )
};