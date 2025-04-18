'use client'
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { close } from "@/redux/slices/modal";
import { ModalState } from "@/redux/store";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Props ={
    children: React.ReactNode;
    type: string,
    closeButton?: boolean;
    maxWidth?: string,
    className?: string,
    onOpenChange?: () => void,
}
export const ModalWindow:React.FC<Props> = ({onOpenChange, className, maxWidth, closeButton = true, children, type}) => {
    const isOpenType = useSelector<ModalState>(state => state.modal.isOpenType) as string;
    const isOpen = useSelector<ModalState>(state => state.modal.isOpen) as boolean;
    const dispatch = useDispatch();

    return (
        <>
            <Dialog  onOpenChange={() => 
                    dispatch(close())
                } open={isOpen && isOpenType === type} >

                <DialogContent maxWidth={maxWidth} className={`${className} w-[95%] max-w-[640px] p-[30px] rounded-[30px]`}>
                {
                    closeButton &&  <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4]  ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-full">
                        <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                    </DialogClose>
                }
                    {children}
                </DialogContent>
            </Dialog>
        </>
    );
};