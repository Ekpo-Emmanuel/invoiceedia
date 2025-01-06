import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[72px] w-full" />
        ))}
      </div>
    </div>
  )
}

