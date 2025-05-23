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
import { useExitModal } from "@/store/use-exit-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const { isOpen, close } = useExitModal();

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
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full blur opacity-30 animate-pulse"></div>
                            <Image
                                src="/mascot.jpg"
                                alt="mascot"
                                width={80}
                                height={80}
                                className="relative rounded-full border-4 border-[#FF6F1F]"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-[#f5f5f5] font-bold text-2xl"> 
                        Wait, don&apos;t go yet!
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-400 text-base">
                        You&apos;re about to leave this lesson. Are you sure you want to exit?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="px-6 py-4 bg-[#2c2c2c]/50 backdrop-blur-sm mt-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button 
                            variant="secondary" 
                            className="w-full font-bold text-white hover:bg-[#FF6F1F]/90 border-[#cc570f] hover:scale-105 transition-all duration-300" 
                            size="lg" 
                            onClick={close}
                        >
                            Keep Learning
                        </Button>

                        <Button 
                            variant="ghost" 
                            className="w-full font-bold text-neutral-400 hover:bg-[#1e1e1e] hover:scale-105 transition-all duration-300" 
                            size="lg" 
                            onClick={() => {
                                close();
                                router.push("/learn");
                            }}
                        >
                            End Lesson
                        </Button>
                    </div>                    
                </DialogFooter>
            </DialogContent> 
        </Dialog>
    )
};