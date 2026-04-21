import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-cinza-borda bg-superficie px-3 py-1 font-ui text-sm text-tinta transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-tinta placeholder:text-cinza-quente focus-visible:border-bordo focus-visible:ring-2 focus-visible:ring-bordo/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-papel-profundo disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
