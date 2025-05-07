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
            <DialogContent className="bg-[#2c2c2c] border-[#2c2c2c] max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src="/mascot.jpg"
                            alt="mascot"
                            width={80}
                            height={80}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl"> 
                        Wait, don&apos;t go yet!
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        You&apos;re about to leave this lesson. Are you sure you want to exit?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                            Keep Learning
                        </Button>

                        <Button variant="dangerOutline" className="w-full" size="lg" onClick={() => {
                            close();
                            router.push("/learn");
                        }}>
                            End Lesson
                        </Button>
                        TODO: change dialog style to match learn page
                    </div>                    
                </DialogFooter>
            </DialogContent> 

        </Dialog>
    )
};