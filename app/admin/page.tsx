"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "@/lib/admin";

const App = dynamic(() => import("./app"), { ssr: false });

const AdminPage = () => {    
    const { isLoaded, userId } = useAuth();

    useEffect(() => {
        if (isLoaded && (!userId || !isAdmin(userId))) {
        redirect("/");
        }
    }, [isLoaded, userId]);

    if (!isLoaded) {
        return null;
    }

    return (
        <App />
    );
};

export default AdminPage;