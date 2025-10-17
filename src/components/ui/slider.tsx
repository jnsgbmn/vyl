// src/components/ui/slider.tsx
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={cn(
      "relative flex touch-none select-none items-center group",
      orientation === "vertical" ? "flex-col h-full w-4" : "w-full",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative grow overflow-hidden rounded-full bg-gray-700",
        orientation === "vertical" ? "w-1 h-full" : "h-1 w-full"
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          "absolute bg-white",
          orientation === "vertical" ? "w-full" : "h-full"
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-3 w-3 rounded-full border-0 bg-white shadow-md transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 cursor-pointer" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
