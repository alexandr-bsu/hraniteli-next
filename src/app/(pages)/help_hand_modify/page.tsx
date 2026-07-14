"use client"

import HelpHandModify from "@/views/help_hand_modify";
import { Suspense } from "react";

export default function HelpHandModifyPage() {
    return (
        <div className="w-full min-h-screen flex justify-center items-stretch">
            <Suspense fallback={<div>Загрузка...</div>}>
                <HelpHandModify />
            </Suspense>
        </div>
    );
}
