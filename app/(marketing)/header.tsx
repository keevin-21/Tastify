import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Ghost, Loader } from "lucide-react";
import { Button } from "@/components/ui/button"

export const Header = () => {
    return (
        <header className="bg-[#1e1e1e] h-20 w-full border-b-2 border-[#2c2c2c] px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/mascot.png" height={40} width={40} alt="Mascot" />
                    <h1 className="text 2xl font-extrabold text-[#f5f5f5]">
                        Tastify
                    </h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton 
                        afterSwitchSessionUrl="/"/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton
                            mode="modal"
                            fallbackRedirectUrl="/learn"
                            >
                                <Button size="lg" variant="ghost">
                                    Login
                                </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
};