import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const polarisButtonVariants = cva(
  "relative inline-flex items-center justify-center font-medium cursor-pointer appearance-none outline-none text-decoration-none user-select-none transition-all duration-75 rounded-md transform-gpu",
  {
    variants: {
      variant: {
        // Primary Orange (#EF7722, #FAA533)
        primary: [
          "bg-gradient-to-b from-[#EF7722] to-[#E66D1A] text-white",
          "border border-solid border-[#D65E14] border-b-[4px] border-b-[#C4550F]",
          "shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_1px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-[#FAA533] hover:to-[#EF7722]",
          "active:bg-gradient-to-b active:from-[#D65E14] active:to-[#C4550F] active:shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_1px_2px_rgba(0,0,0,0.1)_inset] active:translate-y-[1px] active:scale-[0.98] active:border-b active:border-t-[4px] active:border-t-[#C4550F]",
          "focus:outline-none",
          "disabled:bg-gradient-to-b disabled:from-[#f6f6f7] disabled:to-[#f6f6f7] disabled:text-[#b9bec7] disabled:border-[#d9d9d9] disabled:border-b-[4px] disabled:border-b-[#d9d9d9] disabled:shadow-none disabled:cursor-not-allowed"
        ],
        // Secondary Blue (#0BA6DF)
        secondary: [
          "bg-gradient-to-b from-[#0BA6DF] to-[#0995C9] text-white",
          "border border-solid border-[#0783B1] border-b-[4px] border-b-[#067199]",
          "shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_1px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-[#1CB3E8] hover:to-[#0BA6DF]",
          "active:bg-gradient-to-b active:from-[#0783B1] active:to-[#067199] active:shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_1px_2px_rgba(0,0,0,0.1)_inset] active:translate-y-[1px] active:scale-[0.98] active:border-b active:border-t-[4px] active:border-t-[#067199]",
          "focus:outline-none",
          "disabled:bg-gradient-to-b disabled:from-[#f6f6f7] disabled:to-[#f6f6f7] disabled:text-[#b9bec7] disabled:border-[#d9d9d9] disabled:border-b-[4px] disabled:border-b-[#d9d9d9] disabled:shadow-none disabled:cursor-not-allowed"
        ],
        // Neutral (#EBEBEB)
        outline: [
          "bg-gradient-to-b from-[#FFFFFF] to-[#F5F5F5] text-[#2A2F38]",
          "border border-solid border-[#D0D0D0] border-b-[4px] border-b-[#B8B8B8]",
          "shadow-[0_1px_0_rgba(255,255,255,0.75)_inset,0_1px_0_rgba(0,0,0,0.06),0_0_0_1px_rgba(99,115,129,0.10)]",
          "hover:bg-gradient-to-b hover:from-[#F8F8F8] hover:to-[#EBEBEB]",
          "active:bg-gradient-to-b active:from-[#E5E5E5] active:to-[#DADADA] active:shadow-[0_0_0_1px_rgba(99,115,129,0.15)_inset,0_1px_2px_rgba(0,0,0,0.12)_inset] active:translate-y-[1px] active:scale-[0.98] active:border-b active:border-t-[4px] active:border-t-[#B8B8B8]",
          "focus:outline-none",
          "disabled:bg-gradient-to-b disabled:from-[#f6f6f7] disabled:to-[#f6f6f7] disabled:text-[#b9bec7] disabled:border-[#d9d9d9] disabled:border-b-[4px] disabled:border-b-[#d9d9d9] disabled:shadow-none disabled:cursor-not-allowed"
        ],
        critical: [
          "bg-gradient-to-b from-[#d82c0d] to-[#bf2600] text-white",
          "border border-solid border-[#a91e00] border-b-[4px] border-b-[#8b1a00]",
          "shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_1px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.1)]",
          "hover:bg-gradient-to-b hover:from-[#cd2a0d] hover:to-[#b52500]",
          "active:bg-gradient-to-b active:from-[#b32400] active:to-[#a91e00] active:shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_1px_2px_rgba(0,0,0,0.1)_inset] active:translate-y-[1px] active:scale-[0.98] active:border-b active:border-t-[4px] active:border-t-[#8b1a00]",
          "focus:outline-none",
          "disabled:bg-gradient-to-b disabled:from-[#f6f6f7] disabled:to-[#f6f6f7] disabled:text-[#b9bec7] disabled:border-[#d9d9d9] disabled:border-b-[4px] disabled:border-b-[#d9d9d9] disabled:shadow-none disabled:cursor-not-allowed"
        ],
      },
      size: {
        micro: "text-xs min-h-[1.5rem] px-2 py-1",
        slim: "text-sm min-h-[2rem] px-3 py-1",
        medium: "text-sm min-h-[2.25rem] px-4 py-1.5",
        large: "text-base min-h-[2.75rem] px-6 py-2",
        default: "text-sm min-h-[2.25rem] px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "medium",
    },
  }
)

export interface PolarisButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof polarisButtonVariants> {
  asChild?: boolean
  primary?: boolean
  secondary?: boolean
  critical?: boolean
  outline?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const PolarisButton = React.forwardRef<HTMLButtonElement, PolarisButtonProps>(
  ({ className, variant, size, asChild = false, primary, secondary, critical, outline, loading, disabled, fullWidth, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    let finalVariant = variant
    if (primary) finalVariant = "primary"
    if (secondary) finalVariant = "secondary"
    if (critical) finalVariant = "critical"
    if (outline) finalVariant = "outline"

    if (asChild) {
      return (
        <Comp
          className={cn(
            polarisButtonVariants({ variant: finalVariant, size }),
            fullWidth && "w-full",
            className
          )}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(
          polarisButtonVariants({ variant: finalVariant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
PolarisButton.displayName = "PolarisButton"

export { PolarisButton, polarisButtonVariants }
