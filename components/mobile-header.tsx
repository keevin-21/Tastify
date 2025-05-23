import Image from "next/image"
import { MobileSidebar } from "./mobile-sidebar"

export const MobileHeader = () => {
    return (
        <nav className="lg:hidden px-4 sm:px-6 h-[60px] flex items-center justify-between bg-[#FF6F1F] border-b-2 border-[#cc570f] fixed top-0 w-full z-50 shadow-lg">
            <div className="flex items-center">
                <MobileSidebar />
            </div>
            
            <div className="flex-1 flex justify-center items-center gap-2 py-4">
                <h1 className="text-white font-bold text-xl sm:text-2xl tracking-wide">
                    Tastify
                </h1>
                <div className="px-2 bg-white/10 rounded-full border border-white/20">
                    <span className="text-white text-sm">Beta</span>
                </div>
            </div>
            
            <div className="w-8 sm:w-10">
                {/* this div maintains visual balance */}
            </div>
        </nav>
    )
}