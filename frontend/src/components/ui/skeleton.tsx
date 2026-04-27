// Customizado: substitui animate-pulse + bg-muted por .shimmer-papel
// (animacao 1.5s ease-in-out entre papel-profundo e cinza-borda).
// Brief V03 §3.4 — pulse cinza generico nao combina com a paleta.
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("shimmer-papel rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
