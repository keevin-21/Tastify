"use client";

import { cn } from "@/lib/utils";
import {
    ClerkLoading,
    ClerkLoaded,
    UserButton,
    SignedIn,
} from "@clerk/nextjs";
import { Loader } from "lucide-react"; 
import { SidebarItem } from "./sidebar-item";
import Image from "next/image";
import Link from "next/link";

type Props = {
    className?: string;
}

export const Sidebar = ({ className }: Props) => {
    return (
        <div className={cn(
            "flex bg-gradient-to-b from-[#2c2c2c] to-[#252525] border-r border-[#3c3c3c] h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 flex-col shadow-xl",
            className
        )}>
            <Link href="/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3 group transition-transform hover:scale-[0.98]">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md" />
                        <Image 
                            src="/mascot.png" 
                            height={40} 
                            width={40} 
                            alt="Mascot"
                            className="relative z-10"
                        />
                    </div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] text-transparent bg-clip-text">
                        Tastify
                    </h1>
                </div>
            </Link>
            
            <div className="flex flex-col gap-y-3 flex-1 px-2">
                <SidebarItem
                    label="Learn"
                    href="/learn"
                    iconSrc="/learn.png"
                />

                <SidebarItem
                    label="Leaderboard"
                    href="/leaderboard"
                    iconSrc="/leaderboard.png"
                />

                <SidebarItem
                    label="Quests"
                    href="/quests"
                    iconSrc="/quests.png"
                />

                <SidebarItem
                    label="Shop"
                    href="/shop"
                    iconSrc="/shop.png"
                />
            </div>
            
            <div className="p-4 mt-auto border-t border-[#3c3c3c]">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <div className="flex items-center gap-x-3 px-2 group transition-transform hover:scale-[0.98]">
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-[48px] w-[48px] ring-2 ring-[#3c3c3c] ring-offset-2 ring-offset-[#2c2c2c]",
                                        userButtonPopoverCard: "bg-[#2c2c2c] border-[#3c3c3c] shadow-xl",
                                        userButtonPopoverText: "text-[#f5f5f5]",
                                        userButtonPopoverActionButton: "hover:bg-[#3c3c3c] hover:text-[#f5f5f5]",
                                        userButtonPopoverActionButtonText: "text-[#f5f5f5]",
                                        userButtonPopoverFooter: "hidden"
                                    }
                                }}
                            />
                            <div className="flex flex-col">
                                <span className="text-[#f5f5f5] font-semibold">Profile</span>
                                <span className="text-[#a1a1aa] text-sm">Manage your account</span>
                            </div>
                        </div>
                    </SignedIn>
                </ClerkLoaded>
            </div>
        </div>    
    );
};