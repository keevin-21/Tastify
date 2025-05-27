"use client";

import { useCloudinaryLessonImage } from "@/hooks/use-cloudinary-lesson-image";
import { CloudinaryImage } from "./cloudinary-image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
    src: string | null;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
};

export const LessonImage = ({
    src,
    alt,
    width = 400,
    height = 400,
    className,
    priority = false,
}: Props) => {
    const [isMounted, setIsMounted] = useState(false);
    const { imageUrl, hasImage } = useCloudinaryLessonImage(src);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (!isMounted || !hasImage) {
        return null;
    }

    return (
        <CloudinaryImage
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={cn("rounded-lg", className)}
            priority={priority}
            folder="lessons"
        />
    );
};
