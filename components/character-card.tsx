"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"

// Add React.memo to optimize rendering
import React from "react"

interface CharacterCardProps {
  character: Character
  isSelected: boolean
  isFavorite: boolean
  onClick: () => void
}

function CharacterCard({ character, isSelected, isFavorite, onClick }: CharacterCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md overflow-hidden",
        isSelected && "ring-2 ring-cyan-500 dark:ring-cyan-400",
      )}
      onClick={onClick}
    >
      <div className="relative h-32 bg-slate-200 dark:bg-slate-700">
        <img
          src={character.imageUrl || "/placeholder.svg?height=128&width=256"}
          alt={character.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=256"
          }}
        />
        {isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-md" />
          </div>
        )}
        <Badge
          className={cn(
            "absolute bottom-2 left-2",
            character.faction === "unsc" && "bg-blue-500 hover:bg-blue-500",
            character.faction === "covenant" && "bg-purple-500 hover:bg-purple-500",
            character.faction === "forerunner" && "bg-cyan-500 hover:bg-cyan-500",
            character.faction === "banished" && "bg-red-500 hover:bg-red-500",
            character.faction === "flood" && "bg-green-500 hover:bg-green-500",
            character.faction === "other" && "bg-slate-500 hover:bg-slate-500",
          )}
        >
          {character.faction}
        </Badge>
      </div>
      <CardContent className="p-3">
        <div className="space-y-1">
          <h3 className="font-medium truncate">{character.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {character.species} • {character.role}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// At the end of the file, export the memoized component
export default React.memo(CharacterCard)
