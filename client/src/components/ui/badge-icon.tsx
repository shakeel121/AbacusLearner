import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeIconVariants = cva(
  "badge inline-flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        outline: "border border-input bg-background text-foreground",
        success: "bg-accent",
        locked: "bg-[#9e9e9e] opacity-50",
      },
      size: {
        default: "w-12 h-12",
        sm: "w-8 h-8",
        lg: "w-16 h-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeIconVariants> {
  icon: string;
}

function BadgeIcon({
  className,
  variant,
  size,
  icon,
  ...props
}: BadgeIconProps) {
  return (
    <div className={cn(badgeIconVariants({ variant, size }), className)} {...props}>
      <span className="material-icons text-white">{icon}</span>
    </div>
  );
}

export { BadgeIcon, badgeIconVariants };
