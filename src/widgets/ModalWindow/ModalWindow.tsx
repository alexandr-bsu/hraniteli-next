'use client'
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { closeModal, ModalType } from "@/redux/slices/modal";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    children: React.ReactNode;
    type: ModalType;
    closeButton?: boolean;
    maxWidth?: string;
    className?: string;
    onOpenChange?: () => void;
    open?: boolean;
}
export const ModalWindow:React.FC<Props> = ({onOpenChange, className, maxWidth, closeButton = true, children, type, open}) => {
    const modalType = useSelector<RootState>(state => state.modal.type);
    const isOpen = useSelector<RootState>(state => state.modal.isOpen) as boolean;
    const dispatch = useDispatch();

    return (
        <>
            <Dialog  onOpenChange={() => 
                    dispatch(closeModal())
                } open={open !== undefined ? open : (isOpen && modalType === type)} >

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