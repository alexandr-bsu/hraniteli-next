import React, { useRef, useState, useCallback } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface FullWidthPopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  padding?: string; // e.g., '32px'
  maxWidth?: string; // e.g., '100vw'
  className?: string;
}

export const FullWidthPopup: React.FC<FullWidthPopupProps> = ({
  open,
  onClose,
  children,
  padding = "32px",
  maxWidth = "100vw",
  className = "",
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur"
      style={{ background: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center ${className} rounded-[20px]`}
        style={{ pointerEvents: "none" }}
      >
        <div
          className="bg-white rounded-[20px] shadow-lg overflow-hidden"
          style={{
            maxWidth,
            width: `calc(100vw - 2 * ${padding})`,
            margin: padding,
            pointerEvents: "auto",
            maxHeight: "calc(100vh - 2 * 32px)",
            padding: 0,
          }}
          onClick={e => e.stopPropagation()}
        >
          <SimpleBar
            style={{ maxHeight: "100%" }}
            autoHide={true}
            forceVisible="y"
          >
            {children}
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}; 