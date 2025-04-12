"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"
import React, { useState } from "react"

interface CharacterComparisonProps {
  characters: Character[]
  onClose: () => void
}

const CharacterComparison = React.memo(({ characters, onClose }: CharacterComparisonProps) => {
  const [leftCharId, setLeftCharId] = useState<number | null>(null)
  const [rightCharId, setRightCharId] = useState<number | null>(null)

  const leftChar = characters.find((c) => c.id === leftCharId)
  const rightChar = characters.find((c) => c.id === rightCharId)

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case "unsc":
        return "bg-blue-500 hover:bg-blue-500"
      case "covenant":
        return "bg-purple-500 hover:bg-purple-500"
      case "forerunner":
        return "bg-cyan-500 hover:bg-cyan-500"
      case "banished":
        return "bg-red-500 hover:bg-red-500"
      case "flood":
        return "bg-green-500 hover:bg-green-500"
      default:
        return "bg-slate-500 hover:bg-slate-500"
    }
  }

  const getComparisonResult = (left: number, right: number) => {
    if (left > right) return "text-green-500"
    if (left < right) return "text-red-500"
    return "text-yellow-500"
  }

  return (
    <Card className="w-full animate-slideIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Character Comparison</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Left Character Selector */}
          <div>
            <Select value={leftCharId?.toString()} onValueChange={(value) => setLeftCharId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((char) => (
                  <SelectItem key={`left-${char.id}`} value={char.id.toString()}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-lg font-bold">VS</span>
          </div>

          {/* Right Character Selector */}
          <div>
            <Select value={rightCharId?.toString()} onValueChange={(value) => setRightCharId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map((char) => (
                  <SelectItem key={`right-${char.id}`} value={char.id.toString()}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {leftChar && rightChar && (
          <div className="mt-6 space-y-6">
            {/* Character Headers */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={leftChar.imageUrl || "/placeholder.svg?height=128&width=256"}
                    alt={leftChar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Comparison image failed to load:", leftChar.imageUrl)
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=256"
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold">{leftChar.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={cn(getFactionColor(leftChar.faction))}>{leftChar.faction}</Badge>
                  <Badge variant="outline">{leftChar.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">{leftChar.species}</p>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-slate-500">Attributes</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={rightChar.imageUrl || "/placeholder.svg?height=128&width=256"}
                    alt={rightChar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Comparison image failed to load:", rightChar.imageUrl)
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=256"
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold">{rightChar.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className={cn(getFactionColor(rightChar.faction))}>{rightChar.faction}</Badge>
                  <Badge variant="outline">{rightChar.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">{rightChar.species}</p>
              </div>
            </div>

            {/* Stats Comparison */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stats Comparison</h3>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(leftChar.threatLevel, rightChar.threatLevel),
                    )}
                  >
                    {leftChar.threatLevel}/10
                  </span>
                  <Progress value={leftChar.threatLevel * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Threat Level</div>
                <div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(rightChar.threatLevel, leftChar.threatLevel),
                    )}
                  >
                    {rightChar.threatLevel}/10
                  </span>
                  <Progress value={rightChar.threatLevel * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(leftChar.combatSkill, rightChar.combatSkill),
                    )}
                  >
                    {leftChar.combatSkill}/10
                  </span>
                  <Progress value={leftChar.combatSkill * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Combat Skill</div>
                <div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(rightChar.combatSkill, leftChar.combatSkill),
                    )}
                  >
                    {rightChar.combatSkill}/10
                  </span>
                  <Progress value={rightChar.combatSkill * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(leftChar.intelligence, rightChar.intelligence),
                    )}
                  >
                    {leftChar.intelligence}/10
                  </span>
                  <Progress value={leftChar.intelligence * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Intelligence</div>
                <div>
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getComparisonResult(rightChar.intelligence, leftChar.intelligence),
                    )}
                  >
                    {rightChar.intelligence}/10
                  </span>
                  <Progress value={rightChar.intelligence * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(leftChar.leadership, rightChar.leadership))}
                  >
                    {leftChar.leadership}/10
                  </span>
                  <Progress value={leftChar.leadership * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Leadership</div>
                <div>
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(rightChar.leadership, leftChar.leadership))}
                  >
                    {rightChar.leadership}/10
                  </span>
                  <Progress value={rightChar.leadership * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span className={cn("text-lg font-bold", getComparisonResult(leftChar.strength, rightChar.strength))}>
                    {leftChar.strength}/10
                  </span>
                  <Progress value={leftChar.strength * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Strength</div>
                <div>
                  <span className={cn("text-lg font-bold", getComparisonResult(rightChar.strength, leftChar.strength))}>
                    {rightChar.strength}/10
                  </span>
                  <Progress value={rightChar.strength * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(leftChar.durability, rightChar.durability))}
                  >
                    {leftChar.durability}/10
                  </span>
                  <Progress value={leftChar.durability * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Durability</div>
                <div>
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(rightChar.durability, leftChar.durability))}
                  >
                    {rightChar.durability}/10
                  </span>
                  <Progress value={rightChar.durability * 10} className="h-2 mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(leftChar.technology, rightChar.technology))}
                  >
                    {leftChar.technology}/10
                  </span>
                  <Progress value={leftChar.technology * 10} className="h-2 mt-1" />
                </div>
                <div className="text-center text-sm font-medium">Technology</div>
                <div>
                  <span
                    className={cn("text-lg font-bold", getComparisonResult(rightChar.technology, leftChar.technology))}
                  >
                    {rightChar.technology}/10
                  </span>
                  <Progress value={rightChar.technology * 10} className="h-2 mt-1" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

CharacterComparison.displayName = "CharacterComparison"

export default CharacterComparison
