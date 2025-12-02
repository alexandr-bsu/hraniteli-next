"use client"

import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {Calendar} from "@/widgets/Calendar/Calendar"
import axios from "axios";

export default function CalendarLayout() {
    const dispatch = useDispatch()


    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full bg-white">
            <Suspense>
                <Calendar />
            </Suspense>
        </div>
    )
}