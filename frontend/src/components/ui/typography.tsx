import * as React from "react"

import { cn } from "@/lib/utils"

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-4xl font-light tracking-tight text-tinta md:text-5xl",
        className
      )}
      {...props}
    />
  )
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-display text-2xl font-normal tracking-tight text-tinta md:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-display text-xl font-normal tracking-tight text-tinta",
        className
      )}
      {...props}
    />
  )
}

function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("prose-codice", className)} {...props} />
}

export { H1, H2, H3, Prose }
