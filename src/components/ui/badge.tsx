import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-muted-strong",
        solid:
          "border-foreground bg-foreground text-background",
        outline:
          "border-border-strong bg-transparent text-foreground",
        muted:
          "border-border bg-card text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
