"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect } from "react"

export default function ClientSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")

    const debouncedSearch = useDebounce(searchQuery, 300)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedSearch) {
            params.set("query", debouncedSearch)
        } else {
            params.delete("query")
        }

        startTransition(() => {
            router.replace(`?${params.toString()}`)
        })
    }, [debouncedSearch, router, searchParams])

    return (
        <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search clients..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
} 