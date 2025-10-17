// src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black shadow-xl hover:bg-gray-100 hover:scale-110 rounded-md",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 rounded-md",
        outline:
          "border border-white/20 bg-transparent shadow-sm hover:bg-white/10 hover:border-white/40 text-white rounded-md",
        secondary:
          "bg-gray-800 text-white shadow-sm hover:bg-gray-700 rounded-md",
        ghost:
          "bg-transparent text-white hover:bg-transparent hover:opacity-70 rounded-none",
        link: "text-white underline-offset-4 hover:underline hover:opacity-70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
