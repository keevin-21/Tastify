"use client";

import { cn } from "@/lib/utils";
import {
    ClerkLoading,
    ClerkLoaded,
    UserButton,
    SignedIn,
    useClerk,
} from "@clerk/nextjs";
import { Loader, LogOut } from "lucide-react"; 
import { SidebarItem } from "./sidebar-item";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
    className?: string;
}

export const Sidebar = ({ className }: Props) => {
    const { signOut } = useClerk();

    const handleSignOut = () => {
        signOut({ redirectUrl: "/" });
    };

    return (
        <div className={cn(
            "flex bg-[#2c2c2c] border-[#2c2c2c] h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
            className
        )}>
            <Link href="/learn">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/mascot.png" height={40} width={40} alt="Mascot" />
                    <h1 className="text 2xl font-extrabold text-[#f5f5f5]">
                        Tastify
                    </h1>
                </div>
            </Link>
            
            <div className="flex flex-col gap-y-2 flex-1">
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
            
            <div className="p-4">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <div className="flex flex-col gap-y-4">
                            <div className="flex items-center gap-x-3 px-2">
                                <UserButton 
                                    afterSignOutUrl="/"
                                    appearance={{
                                        elements: {
                                            avatarBox: "h-[48px] w-[48px]",
                                            userButtonPopoverCard: "bg-[#2c2c2c] border-[#3c3c3c]",
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
                            <Button
                                variant="ghost"
                                className="justify-start h-[48px] text-[#f5f5f5] hover:bg-[#3c3c3c] hover:text-white transition-colors"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </SignedIn>
                </ClerkLoaded>
            </div>
        </div>    
    );
};