import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const containerVariants = cva("w-full px-4 py-8 md:px-16 md:py-4", {
  variants: {
    variant: {
      default: "",
      column: "flex flex-col gap-8",
      row: "flex flex-row gap-4",
      rowCenter: "flex flex-row items-center gap-4",
      rowCenterBetween: "flex flex-row items-center justify-between",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface IContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, IContainerProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(containerVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container, containerVariants };
