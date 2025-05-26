import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
    title: string;
    id: number;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled?: boolean;
    active?: boolean;
};

export const Card = ({
    title,
    id,
    imageSrc,
    onClick,
    active,
    disabled,
}: Props) => {
    return(
        <div
            onClick={() => onClick(id)}
            className={cn(
                "h-full border-2 rounded-xl border-b-4 hover:bg-gradient-to-b hover:from-[#2c2c2c] hover:to-[#1e1e1e] border-[#2c2c2c] cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50",
                disabled && "pointer-events-none opacity-50",
                active && "border-orange-500 bg-gradient-to-b from-orange-500/10 to-orange-600/5 shadow-md shadow-orange-500/20"
            )}
        >
            <div className="min-[24px] w-full flex items-center justify-end">
                {active && (
                    <div className="rounded-md bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center p-1.5 shadow-lg">
                        <Check className="text-white stroke-[4] h-4 w-4"/>
                    </div>
                )}
            </div>
            <Image 
                src={imageSrc}
                alt={title}
                height={70}
                width={93.33}
                className="rounded-lg drop-shadow-md border object-cover hover:scale-110 transition-transform duration-300"
            />
            <p className="text-[#f5f5f5] text-center font-bold mt-3 group-hover:text-orange-400 transition-colors duration-300">
                {title}
            </p>
        </div>
    );
};