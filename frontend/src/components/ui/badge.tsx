import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2 py-0.5 font-ui text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-bordo text-papel [a]:hover:bg-bordo-hover",
        secondary:
          "bg-papel-profundo text-tinta border-cinza-borda [a]:hover:bg-cinza-borda/40",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-cinza-borda text-tinta [a]:hover:bg-papel-profundo",
        ghost:
          "text-tinta hover:bg-papel-profundo",
        link:
          "text-bordo underline-offset-4 hover:underline",

        /* Status de anúncio */
        "status-active":
          "bg-emerald-50 text-emerald-800 border-emerald-200/70",
        "status-pending":
          "bg-amber-50 text-amber-800 border-amber-200/70",
        "status-paused":
          "bg-cinza-borda/40 text-tinta-leve border-cinza-borda",
        "status-sold":
          "bg-bordo/10 text-bordo border-bordo/20",

        /* Condição do livro */
        "condition-new":
          "bg-emerald-50 text-emerald-800 border-emerald-200/70",
        "condition-good":
          "bg-amber-50 text-amber-800 border-amber-200/70",
        "condition-acceptable":
          "bg-orange-50 text-orange-800 border-orange-200/70",

        /* Área acadêmica */
        "academic-area":
          "bg-papel-profundo text-tinta-leve border-cinza-borda font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
