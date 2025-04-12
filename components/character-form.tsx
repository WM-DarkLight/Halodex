"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Character } from "@/lib/types"

interface CharacterFormProps {
  character?: Character
  onSubmit: (character: Character | Omit<Character, "id">) => void
  onCancel: () => void
}

export default function CharacterForm({ character, onSubmit, onCancel }: CharacterFormProps) {
  const [formData, setFormData] = useState<Omit<Character, "id"> & { id?: number }>({
    id: character?.id,
    name: character?.name || "",
    species: character?.species || "",
    faction: character?.faction || "unsc",
    affiliation: character?.affiliation || "",
    role: character?.role || "",
    status: character?.status || "Active",
    equipment: character?.equipment || "",
    weapons: character?.weapons || "",
    abilities: character?.abilities || "",
    biography: character?.biography || "",
    imageUrl: character?.imageUrl || "",
    firstAppearance: character?.firstAppearance || "",
    threatLevel: character?.threatLevel || 5,
    combatSkill: character?.combatSkill || 5,
    intelligence: character?.intelligence || 5,
    leadership: character?.leadership || 5,
    strength: character?.strength || 5,
    durability: character?.durability || 5,
    technology: character?.technology || 5,
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            value={formData.species}
            onChange={(e) => handleChange("species", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faction">Faction</Label>
          <Select value={formData.faction} onValueChange={(value) => handleChange("faction", value)}>
            <SelectTrigger id="faction">
              <SelectValue placeholder="Select faction" />
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
          <Label htmlFor="affiliation">Affiliation</Label>
          <Input
            id="affiliation"
            value={formData.affiliation}
            onChange={(e) => handleChange("affiliation", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={formData.role} onChange={(e) => handleChange("role", e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
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
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            placeholder="https://example.com/image.png"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstAppearance">First Appearance</Label>
          <Input
            id="firstAppearance"
            value={formData.firstAppearance}
            onChange={(e) => handleChange("firstAppearance", e.target.value)}
            placeholder="Halo: Combat Evolved"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="equipment">Notable Equipment</Label>
        <Textarea
          id="equipment"
          value={formData.equipment}
          onChange={(e) => handleChange("equipment", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weapons">Weapons</Label>
        <Textarea
          id="weapons"
          value={formData.weapons}
          onChange={(e) => handleChange("weapons", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abilities">Special Abilities</Label>
        <Textarea
          id="abilities"
          value={formData.abilities}
          onChange={(e) => handleChange("abilities", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="biography">Biography</Label>
        <Textarea
          id="biography"
          value={formData.biography}
          onChange={(e) => handleChange("biography", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Character Stats</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="threatLevel">Threat Level</Label>
              <span className="text-sm">{formData.threatLevel}/10</span>
            </div>
            <Slider
              id="threatLevel"
              min={1}
              max={10}
              step={1}
              value={[formData.threatLevel]}
              onValueChange={(value) => handleChange("threatLevel", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="combatSkill">Combat Skill</Label>
              <span className="text-sm">{formData.combatSkill}/10</span>
            </div>
            <Slider
              id="combatSkill"
              min={1}
              max={10}
              step={1}
              value={[formData.combatSkill]}
              onValueChange={(value) => handleChange("combatSkill", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="intelligence">Intelligence</Label>
              <span className="text-sm">{formData.intelligence}/10</span>
            </div>
            <Slider
              id="intelligence"
              min={1}
              max={10}
              step={1}
              value={[formData.intelligence]}
              onValueChange={(value) => handleChange("intelligence", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="leadership">Leadership</Label>
              <span className="text-sm">{formData.leadership}/10</span>
            </div>
            <Slider
              id="leadership"
              min={1}
              max={10}
              step={1}
              value={[formData.leadership]}
              onValueChange={(value) => handleChange("leadership", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="strength">Strength</Label>
              <span className="text-sm">{formData.strength}/10</span>
            </div>
            <Slider
              id="strength"
              min={1}
              max={10}
              step={1}
              value={[formData.strength]}
              onValueChange={(value) => handleChange("strength", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="durability">Durability</Label>
              <span className="text-sm">{formData.durability}/10</span>
            </div>
            <Slider
              id="durability"
              min={1}
              max={10}
              step={1}
              value={[formData.durability]}
              onValueChange={(value) => handleChange("durability", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="technology">Technology</Label>
              <span className="text-sm">{formData.technology}/10</span>
            </div>
            <Slider
              id="technology"
              min={1}
              max={10}
              step={1}
              value={[formData.technology]}
              onValueChange={(value) => handleChange("technology", value[0])}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{character ? "Update Character" : "Add Character"}</Button>
      </div>
    </form>
  )
}
