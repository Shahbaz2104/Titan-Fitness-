"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none items-center select-none", className)}
    {...props}
  >
    <SliderPrimitive.Track className="bg-surface-2 relative h-2 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="from-primary to-accent absolute h-full bg-gradient-to-r" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary bg-background shadow-glow focus-visible:ring-primary/50 block h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
