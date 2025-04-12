"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Edit, Trash2, User, Briefcase, Flag, AlertCircle, Zap, Award } from "lucide-react"
import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"

// Add React.memo to optimize rendering
import React from "react"

interface CharacterDetailsProps {
  character: Character
  isFavorite: boolean
  onToggleFavorite: () => void
  onEdit: () => void
  onDelete: () => void
}

function CharacterDetails({ character, isFavorite, onToggleFavorite, onEdit, onDelete }: CharacterDetailsProps) {
  // Calculate threat level percentage for progress bar
  const threatPercentage = (character.threatLevel / 10) * 100

  // Get threat level text
  const getThreatLevelText = (level: number) => {
    if (level <= 2) return "Low"
    if (level <= 5) return "Medium"
    if (level <= 8) return "High"
    return "Extreme"
  }

  // Get threat level color
  const getThreatLevelColor = (level: number) => {
    if (level <= 2) return "bg-green-500"
    if (level <= 5) return "bg-amber-500"
    if (level <= 8) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-slate-700 to-slate-900">
        <img
          src={character.imageUrl || "/placeholder.svg?height=256&width=800"}
          alt={character.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=256&width=800"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className={cn(
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
            <Badge variant="outline" className="text-white border-white">
              {character.status}
            </Badge>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{character.name}</h2>
          <p className="text-slate-200">
            {character.species} • {character.role}
          </p>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
            onClick={onToggleFavorite}
          >
            <Star className={cn("h-4 w-4", isFavorite && "fill-amber-400")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="p-4 md:p-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="bio">Biography</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">Species</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{character.species}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{character.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">Affiliation</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{character.affiliation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{character.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">Threat Level</p>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={threatPercentage}
                      className={cn("h-2", getThreatLevelColor(character.threatLevel))}
                    />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {getThreatLevelText(character.threatLevel)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium">First Appearance</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{character.firstAppearance}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Notable Equipment</h3>
            <p className="text-slate-600 dark:text-slate-400">{character.equipment}</p>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Combat Skill</span>
                  <span className="text-sm text-slate-500">{character.combatSkill}/10</span>
                </div>
                <Progress value={(character.combatSkill / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Intelligence</span>
                  <span className="text-sm text-slate-500">{character.intelligence}/10</span>
                </div>
                <Progress value={(character.intelligence / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Leadership</span>
                  <span className="text-sm text-slate-500">{character.leadership}/10</span>
                </div>
                <Progress value={(character.leadership / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Strength</span>
                  <span className="text-sm text-slate-500">{character.strength}/10</span>
                </div>
                <Progress value={(character.strength / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Durability</span>
                  <span className="text-sm text-slate-500">{character.durability}/10</span>
                </div>
                <Progress value={(character.durability / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Technology</span>
                  <span className="text-sm text-slate-500">{character.technology}/10</span>
                </div>
                <Progress value={(character.technology / 10) * 100} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bio" className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{character.biography}</p>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h3>Notable Equipment</h3>
            <p>{character.equipment}</p>

            {character.weapons && (
              <>
                <h3>Weapons</h3>
                <p>{character.weapons}</p>
              </>
            )}

            {character.abilities && (
              <>
                <h3>Special Abilities</h3>
                <p>{character.abilities}</p>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// At the end of the file, export the memoized component
export default React.memo(CharacterDetails)
