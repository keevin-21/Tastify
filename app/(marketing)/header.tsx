'use client';

import Image from "next/image";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Header = () => {
    return (
        <motion.header 
            className="bg-[#1e1e1e] h-20 w-full border-b-2 border-[#2c2c2c] px-4 relative"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.8 
            }}
        >
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full relative">
                <motion.div 
                    className="pt-8 pl-4 pb-7 flex items-center gap-x-3 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                    >
                    <Image src="/mascot.png" height={40} width={40} alt="Mascot" />
                    </motion.div>
                    <h1 className="text-2xl font-extrabold text-[#f5f5f5]">
                        Tastify
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                            <UserButton afterSwitchSessionUrl="/"/>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton
                            mode="modal"
                            fallbackRedirectUrl="/learn"
                            >
                                <Button 
                                    size="lg" 
                                    variant="ghost"
                                    className="hover:scale-105 transition-transform"
                                >
                                    Login
                                </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
                </motion.div>

                {/* Animated gradient border */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6F1F] via-[#FF6F1F] to-[#FF6F1F]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ 
                        duration: 1.5,
                        delay: 0.2
                    }}
                />
            </div>
        </motion.header>
    )
};