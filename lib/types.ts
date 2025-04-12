export type Faction = "unsc" | "covenant" | "forerunner" | "banished" | "flood" | "other"

export interface Character {
  id: number
  name: string
  species: string
  faction: Faction
  affiliation: string
  role: string
  status: string
  equipment: string
  weapons?: string
  abilities?: string
  biography?: string
  imageUrl?: string
  firstAppearance?: string
  threatLevel: number
  combatSkill: number
  intelligence: number
  leadership: number
  strength: number
  durability: number
  technology: number
}
