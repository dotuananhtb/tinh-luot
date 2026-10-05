import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-ink font-mono font-bold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-150 outline-none select-none focus-visible:ring-4 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-lime text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--ink)]",
        outline:
          "bg-white text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--ink)]",
        ink: "bg-ink text-lime hover:bg-ink/90 active:scale-[0.97]",
        ghost: "border-transparent hover:bg-ink/5",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
