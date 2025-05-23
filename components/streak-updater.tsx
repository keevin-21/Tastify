"use client";

import { useEffect } from "react";
import { updateStreak } from "@/actions/update-streak";

export const StreakUpdater = () => {
    useEffect(() => {
        updateStreak().catch(console.error);
    }, []);

    return null;
}; 