"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import React from "react"

interface AdvancedFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void
  onResetFilters: () => void
}

export interface FilterOptions {
  faction?: string
  status?: string
  minThreatLevel: number
  maxThreatLevel: number
  minCombatSkill: number
  species?: string
}

const AdvancedFilters = React.memo(({ onApplyFilters, onResetFilters }: AdvancedFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    faction: undefined,
    status: undefined,
    minThreatLevel: 1,
    maxThreatLevel: 10,
    minCombatSkill: 1,
    species: undefined,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))

    // Track active filters for display
    if (value && !activeFilters.includes(key)) {
      setActiveFilters((prev) => [...prev, key])
    } else if (!value && activeFilters.includes(key)) {
      setActiveFilters((prev) => prev.filter((f) => f !== key))
    }
  }

  const applyFilters = () => {
    onApplyFilters(filters)
  }

  const resetFilters = () => {
    setFilters({
      faction: undefined,
      status: undefined,
      minThreatLevel: 1,
      maxThreatLevel: 10,
      minCombatSkill: 1,
      species: undefined,
    })
    setActiveFilters([])
    onResetFilters()
  }

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }))
    setActiveFilters((prev) => prev.filter((f) => f !== key))
  }

  const getFilterLabel = (key: string) => {
    switch (key) {
      case "faction":
        return `Faction: ${filters.faction}`
      case "status":
        return `Status: ${filters.status}`
      case "minThreatLevel":
        return `Min Threat: ${filters.minThreatLevel}`
      case "maxThreatLevel":
        return `Max Threat: ${filters.maxThreatLevel}`
      case "minCombatSkill":
        return `Min Combat: ${filters.minCombatSkill}`
      case "species":
        return `Species: ${filters.species}`
      default:
        return key
    }
  }

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {getFilterLabel(filter)}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}

      {isExpanded && (
        <Card className="animate-slideDown">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Faction</label>
                <Select value={filters.faction} onValueChange={(value) => handleFilterChange("faction", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any faction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unsc">UNSC</SelectItem>
                    <SelectItem value="covenant">Covenant</SelectItem>
                    <SelectItem value="forerunner">Forerunner</SelectItem>
                    <SelectItem value="banished">Banished</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                    <SelectItem value="MIA">MIA</SelectItem>
                    <SelectItem value="Contained">Contained</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Species</label>
                <Select value={filters.species} onValueChange={(value) => handleFilterChange("species", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Human">Human</SelectItem>
                    <SelectItem value="Sangheili">Sangheili</SelectItem>
                    <SelectItem value="Jiralhanae">Jiralhanae</SelectItem>
                    <SelectItem value="Forerunner">Forerunner</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Flood">Flood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Threat Level Range</label>
                <span className="text-sm text-slate-500">
                  {filters.minThreatLevel} - {filters.maxThreatLevel}
                </span>
              </div>
              <div className="pt-2">
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[filters.minThreatLevel, filters.maxThreatLevel]}
                  onValueChange={(value) => {
                    handleFilterChange("minThreatLevel", value[0])
                    handleFilterChange("maxThreatLevel", value[1])
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Minimum Combat Skill</label>
                <span className="text-sm text-slate-500">{filters.minCombatSkill}</span>
              </div>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[filters.minCombatSkill]}
                onValueChange={(value) => handleFilterChange("minCombatSkill", value[0])}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

AdvancedFilters.displayName = "AdvancedFilters"

export default AdvancedFilters
