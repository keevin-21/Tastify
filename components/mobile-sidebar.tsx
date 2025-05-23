import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet"

import { Sidebar } from "@/components/sidebar"
import { Menu } from "lucide-react"

export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 active:scale-95">
                    <Menu className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="sr-only">Open menu</span>
                </button>
            </SheetTrigger>
            <SheetContent 
                className="p-0 z-[100] w-[280px] sm:w-[320px] bg-[#232323] border-r-2 border-[#2c2c2c]" 
                side="left"
            >
                <div className="h-full overflow-hidden">
                    <Sidebar />
                </div>
            </SheetContent>
        </Sheet>
    )
}