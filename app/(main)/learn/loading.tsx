import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-y-4">
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6F1F] to-[#FF6F1F] rounded-full blur opacity-30 animate-pulse"></div>
                <div className="relative bg-[#232323] p-8 rounded-full border-2 border-[#3c3c3c]">
                    <Loader className="h-12 w-12 text-[#FF6F1F] animate-spin"/>
                </div>
            </div>
            <div className="flex flex-col items-center gap-y-2">
                <div className="h-2 w-32 bg-[#2c2c2c] rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-[#FF6F1F] rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-[#f5f5f5] text-sm font-medium">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default Loading;