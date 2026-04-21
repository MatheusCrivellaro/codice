import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-cinza-borda bg-superficie px-3 py-2 font-ui text-sm text-tinta transition-colors outline-none placeholder:text-cinza-quente focus-visible:border-bordo focus-visible:ring-2 focus-visible:ring-bordo/20 disabled:cursor-not-allowed disabled:bg-papel-profundo disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
