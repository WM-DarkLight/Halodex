"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Shield, Swords, Brain } from "lucide-react"
import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"
import React from "react"

interface DashboardStatsProps {
  characters: Character[]
}

const DashboardStats = React.memo(({ characters }: DashboardStatsProps) => {
  // Calculate statistics
  const totalCharacters = characters.length

  const factionCounts = characters.reduce(
    (acc, char) => {
      acc[char.faction] = (acc[char.faction] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const factionData = Object.entries(factionCounts).map(([faction, count]) => ({
    faction,
    count,
    percentage: Math.round((count / totalCharacters) * 100),
  }))

  // Calculate average stats
  const avgStats = characters.reduce(
    (acc, char) => {
      acc.threatLevel += char.threatLevel
      acc.combatSkill += char.combatSkill
      acc.intelligence += char.intelligence
      acc.leadership += char.leadership
      acc.strength += char.strength
      acc.durability += char.durability
      acc.technology += char.technology
      return acc
    },
    {
      threatLevel: 0,
      combatSkill: 0,
      intelligence: 0,
      leadership: 0,
      strength: 0,
      durability: 0,
      technology: 0,
    },
  )

  Object.keys(avgStats).forEach((key) => {
    avgStats[key as keyof typeof avgStats] =
      Math.round((avgStats[key as keyof typeof avgStats] / totalCharacters) * 10) / 10
  })

  // Find top threats
  const topThreats = [...characters].sort((a, b) => b.threatLevel - a.threatLevel).slice(0, 3)

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Characters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCharacters}</div>
            <p className="text-xs text-muted-foreground">Across {Object.keys(factionCounts).length} factions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStats.threatLevel}/10</div>
            <Progress value={avgStats.threatLevel * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Combat Skill</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStats.combatSkill}/10</div>
            <Progress value={avgStats.combatSkill * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Intelligence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgStats.intelligence}/10</div>
            <Progress value={avgStats.intelligence * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Faction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {factionData.map(({ faction, count, percentage }) => (
                <div key={faction} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={cn(
                        faction === "unsc" && "bg-blue-500 hover:bg-blue-500",
                        faction === "covenant" && "bg-purple-500 hover:bg-purple-500",
                        faction === "forerunner" && "bg-cyan-500 hover:bg-cyan-500",
                        faction === "banished" && "bg-red-500 hover:bg-red-500",
                        faction === "flood" && "bg-green-500 hover:bg-green-500",
                        faction === "other" && "bg-slate-500 hover:bg-slate-500",
                      )}
                    >
                      {faction}
                    </Badge>
                    <span className="text-sm font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topThreats.map((char) => (
                <div key={char.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                    <img
                      src={char.imageUrl || "/placeholder.svg?height=40&width=40"}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{char.name}</h3>
                      <Badge variant="outline" className="text-red-500 border-red-500">
                        Level {char.threatLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{char.species}</span>
                      <span>•</span>
                      <Badge
                        className={cn(
                          "text-xs",
                          char.faction === "unsc" && "bg-blue-500 hover:bg-blue-500",
                          char.faction === "covenant" && "bg-purple-500 hover:bg-purple-500",
                          char.faction === "forerunner" && "bg-cyan-500 hover:bg-cyan-500",
                          char.faction === "banished" && "bg-red-500 hover:bg-red-500",
                          char.faction === "flood" && "bg-green-500 hover:bg-green-500",
                          char.faction === "other" && "bg-slate-500 hover:bg-slate-500",
                        )}
                      >
                        {char.faction}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

DashboardStats.displayName = "DashboardStats"

export default DashboardStats
