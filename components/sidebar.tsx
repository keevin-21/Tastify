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
                    iconSrc="/learn.png"    //put svg icon in public folde4r
                />

                <SidebarItem
                    label="Leaderboard"
                    href="/leaderboard"
                    iconSrc="/leaderboard.png"    //put svg icon in public folde4r
                />

                <SidebarItem
                    label="Quests"
                    href="/quests"
                    iconSrc="/quests.png"    //put svg icon in public folde4r
                />

                <SidebarItem
                    label="Shop"
                    href="/shop"
                    iconSrc="/shop.png"    //put svg icon in public folde4r
                />
            </div>
            
            <div className="p-4 space-y-3">
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <div className="flex flex-col gap-y-3">
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10",
                                        userButtonPopoverCard: "bg-[#2c2c2c] border-[#3c3c3c]",
                                        userButtonPopoverText: "text-[#f5f5f5]"
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                className="justify-start h-[52px] text-[#f5f5f5] hover:bg-[#3c3c3c] hover:text-white transition-colors"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </SignedIn>
                </ClerkLoaded>
            </div>
        </div>    
    );
};