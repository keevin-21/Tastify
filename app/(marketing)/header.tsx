import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

export const Header = () => {
    return (
        <header className="h-20 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full bg-green-300">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="" height={40} width={40} alt="Mascot" />
                    <div className="text 2xl font-extrabold text-blue-700">
                        Tastify
                    </div>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            {/* Todo: <Button> Import this from button file that i dont have lol</Button> */}
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
};