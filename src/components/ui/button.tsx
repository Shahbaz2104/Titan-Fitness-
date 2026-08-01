import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:bg-primary-light hover:shadow-[0_0_50px_rgba(230,57,70,0.4)] active:scale-[0.98]",
        accent:
          "bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-[0_0_40px_rgba(255,107,53,0.35)] active:scale-[0.98]",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 active:scale-[0.98]",
        ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        secondary:
          "bg-surface-2 text-foreground border border-border hover:border-white/20 hover:bg-surface active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        glass: "glass text-foreground backdrop-blur-md hover:bg-white/10 active:scale-[0.98]",
        white: "bg-white text-black hover:bg-white/90 active:scale-[0.98] shadow-lg",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
