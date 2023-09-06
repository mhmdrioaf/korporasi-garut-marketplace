import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const containerVariants = cva("w-full px-16 py-8 lg:px-8 lg:py-40", {
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

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
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
