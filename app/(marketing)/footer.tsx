import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className = "bg-[#1e1e1e] hidden lg:block h-20 w-full border-t-2 border-[#2c2c2c] p-2">
            <div className = "max-w-screen-lg mx-auto flex items-center justify-evenly h-full gap-x-20">
                <Button size="lg" variant="ghost" className="text-[#f5f5f5] w-full">
                    <Image
                      src="/jp.svg"
                      alt="JAPANESE"
                      height={32}
                      width={40}
                      className="mr-4 rounded-md"
                    />
                    Japanese
                </Button>

                <Button size="lg" variant="ghost" className="text-[#f5f5f5] w-full">
                    <Image
                      src="/mx.svg"
                      alt="MEXICAN"
                      height={32}
                      width={40}
                      className="mr-4 rounded-md"
                    />
                    Mexican
                </Button>

                <Button size="lg" variant="ghost" className="text-[#f5f5f5] w-full">
                    <Image
                      src="/it.svg"
                      alt="ITALIAN"
                      height={32}
                      width={40}
                      className="mr-4 rounded-md"
                    />
                    Italian
                </Button>

                <Button size="lg" variant="ghost" className="text-[#f5f5f5] w-full">
                    <Image
                      src="/ch.svg"
                      alt="CHINESE"
                      height={32}
                      width={40}
                      className="mr-4 rounded-md"
                    />
                    Chinese
                </Button>

                <Button size="lg" variant="ghost" className="text-[#f5f5f5] w-full">
                    <Image
                      src="/es.svg"
                      alt="SPANISH"
                      height={32}
                      width={40}
                      className="mr-4 rounded-md"
                    />
                    Spanish
                </Button>


            </div>
        </footer>
    )
};