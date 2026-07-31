"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        className: "!rounded-xl !border !border-border !bg-surface !text-foreground",
        style: {
          background: "#111111",
          border: "1px solid #262626",
          color: "#fafafa",
        },
      }}
    />
  );
}
