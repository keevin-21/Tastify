"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type Props = {
    label: string;
    iconSrc: string;
    href: string;
};

export const SidebarItem = ({
    label,
    iconSrc,
    href
}: Props) => {
    const pathName = usePathname();
    const active = pathName === href;

    return (
        <Button
            variant={active ? "sidebarOutline" : "sidebar"}
            className={`
                justify-start h-[52px] w-full relative group transition-all duration-300
                ${active ? 'bg-[#3c3c3c]' : 'hover:bg-[#3c3c3c]/20'}
            `}
            asChild
        >
            <Link href={href}>
                <div className="flex items-center">
                    <Image 
                        src={iconSrc}
                        alt={label}
                        height={32}
                        width={32}
                        className={`
                            mr-5 transition-transform duration-300
                            ${active ? 'scale-105' : 'group-hover:scale-105'}
                        `}
                    />
                    <span className={`
                        font-medium transition-colors duration-300
                        ${active ? 'text-white' : 'text-[#f5f5f5] group-hover:text-white'}
                    `}>
                        {label}
                    </span>
                </div>
            </Link>
        </Button>
    )
}