import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export const Promo = () => {
    return (
        <div className="border-2 rounded-xl p-6 space-y-6 bg-[#232323] border-[#3c3c3c] hover:bg-[#2c2c2c] hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                    <div className="relative">
                        <Image
                            src="/premium_heart.svg"
                            alt="MAX"
                            width={32}
                            height={32}
                            className="relative hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    <h3 className="text-[#f5f5f5] font-bold text-xl">
                        Upgrade to MAX
                    </h3>
                </div>
                <p className="text-neutral-400 text-base">
                    Get access to unlimited hearts and more!
                </p>
            </div>
            <Link href="/shop" className="w-full block">
                <Button 
                    variant="super" 
                    className="w-full font-bold text-white hover:scale-105 transition-all duration-300"
                    size="lg"
                >
                    Upgrade now
                </Button>
            </Link>
        </div>
    )
}