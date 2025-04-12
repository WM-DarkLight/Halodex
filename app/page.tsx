"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Star,
  AlertTriangle,
  BarChart2,
  Scale,
  Keyboard,
} from "lucide-react"
import {
  initializeDB,
  getAllCharacters,
  getCharacterById,
  addCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/database"
import type { Character } from "@/lib/types"
import CharacterCard from "@/components/character-card"
import CharacterDetails from "@/components/character-details"
import CharacterForm from "@/components/character-form"
import CharacterComparison from "@/components/character-comparison"
import CharacterNotes from "@/components/character-notes"
import DashboardStats from "@/components/dashboard-stats"
import AdvancedFilters, { type FilterOptions } from "@/components/advanced-filters"
import StatsChart from "@/components/stats-chart"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { setupKeyboardShortcuts, type KeyboardShortcut } from "@/lib/keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

export default function HalodexApp() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isComparisonMode, setIsComparisonMode] = useState(false)
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"name" | "threat" | "faction">("name")
  const [viewMode, setViewMode] = useLocalStorage<"list" | "grid">("halodex-view-mode", "list")
  const [favorites, setFavorites] = useLocalStorage<number[]>("halodex-favorites", [])
  const [activeTab, setActiveTab] = useLocalStorage<string>("halodex-active-tab", "characters")
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    minThreatLevel: 1,
    maxThreatLevel: 10,
    minCombatSkill: 1,
  })
  const { theme, setTheme } = useTheme()
  const darkMode = theme === "dark"
  const { toast } = useToast()

  // Initialize database and load characters
  useEffect(() => {
    const loadData = async () => {
      try {
        await initializeDB()
        const chars = await getAllCharacters()
        setCharacters(chars)
      } catch (error) {
        console.error("Failed to load characters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Set up keyboard shortcuts
  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: "n",
        description: "Add new character",
        action: () => setIsAddDialogOpen(true),
      },
      {
        key: "f",
        description: "Focus search",
        action: () => document.getElementById("search-input")?.focus(),
      },
      {
        key: "d",
        description: "Toggle dark mode",
        action: () => setTheme(darkMode ? "light" : "dark"),
      },
      {
        key: "c",
        description: "Toggle comparison mode",
        action: () => setIsComparisonMode(!isComparisonMode),
      },
      {
        key: "t",
        description: "Switch to dashboard tab",
        action: () => setActiveTab("dashboard"),
      },
      {
        key: "h",
        description: "Switch to characters tab",
        action: () => setActiveTab("characters"),
      },
      {
        key: "?",
        description: "Show keyboard shortcuts",
        action: () => setIsKeyboardShortcutsOpen(true),
      },
    ]

    const cleanup = setupKeyboardShortcuts(shortcuts)
    return cleanup
  }, [darkMode, isComparisonMode, setTheme, setActiveTab])

  // Apply dark mode class on initial render and when darkMode changes
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [darkMode])

  // Filter and sort characters
  const filteredCharacters = characters
    .filter((char) => {
      // Basic text search
      const matchesSearch =
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.affiliation.toLowerCase().includes(searchQuery.toLowerCase())

      // Basic faction filter
      const matchesFaction =
        activeFilter === "all" ||
        (activeFilter === "favorites" && favorites.includes(char.id)) ||
        char.faction === activeFilter

      // Advanced filters
      const matchesAdvancedFilters =
        (!advancedFilters.faction || char.faction === advancedFilters.faction) &&
        (!advancedFilters.status || char.status === advancedFilters.status) &&
        (!advancedFilters.species || char.species.includes(advancedFilters.species)) &&
        char.threatLevel >= advancedFilters.minThreatLevel &&
        char.threatLevel <= advancedFilters.maxThreatLevel &&
        char.combatSkill >= advancedFilters.minCombatSkill

      return matchesSearch && matchesFaction && matchesAdvancedFilters
    })
    .sort((a, b) => {
      if (sortOrder === "name") return a.name.localeCompare(b.name)
      if (sortOrder === "threat") return b.threatLevel - a.threatLevel
      if (sortOrder === "faction") return a.faction.localeCompare(b.faction)
      return 0
    })

  const handleCharacterSelect = useCallback(
    async (id: number) => {
      try {
        const character = await getCharacterById(id)
        setSelectedCharacter(character)
      } catch (error) {
        console.error("Failed to load character details:", error)
        toast({
          title: "Error",
          description: "Failed to load character details.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleAddCharacter = async (character: Omit<Character, "id">) => {
    try {
      const newId = await addCharacter(character)
      const newChar = await getCharacterById(newId)
      setCharacters((prev) => [...prev, newChar])
      setIsAddDialogOpen(false)
      toast({
        title: "Success",
        description: `${character.name} has been added to the Halodex.`,
      })
    } catch (error) {
      console.error("Failed to add character:", error)
      toast({
        title: "Error",
        description: "Failed to add character.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCharacter = async (character: Character) => {
    try {
      await updateCharacter(character)
      setCharacters((prev) => prev.map((c) => (c.id === character.id ? character : c)))
      setSelectedCharacter(character)
      setIsEditDialogOpen(false)
      toast({
        title: "Success",
        description: `${character.name} has been updated.`,
      })
    } catch (error) {
      console.error("Failed to update character:", error)
      toast({
        title: "Error",
        description: "Failed to update character.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCharacter = async (id: number) => {
    if (!confirm("Are you sure you want to delete this character?")) return

    try {
      await deleteCharacter(id)
      setCharacters((prev) => prev.filter((c) => c.id !== id))
      setSelectedCharacter(null)
      setFavorites((prev) => prev.filter((favId) => favId !== id))
      toast({
        title: "Success",
        description: "Character has been deleted.",
      })
    } catch (error) {
      console.error("Failed to delete character:", error)
      toast({
        title: "Error",
        description: "Failed to delete character.",
        variant: "destructive",
      })
    }
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]))
  }

  const toggleDarkMode = () => {
    setTheme(darkMode ? "light" : "dark")
  }

  const exportData = () => {
    const dataStr = JSON.stringify(characters)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `halodex-export-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        if (!Array.isArray(importedData)) {
          throw new Error("Invalid data format")
        }

        // Clear existing data and import new data
        for (const char of importedData) {
          await addCharacter(char)
        }

        // Reload characters
        const chars = await getAllCharacters()
        setCharacters(chars)

        toast({
          title: "Import Successful",
          description: `Imported ${importedData.length} characters.`,
        })
      } catch (error) {
        console.error("Import failed:", error)
        toast({
          title: "Import Failed",
          description: "The file format is invalid.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleApplyAdvancedFilters = (filters: FilterOptions) => {
    setAdvancedFilters(filters)
    toast({
      title: "Filters Applied",
      description: "Advanced filters have been applied to the character list.",
    })
  }

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      minThreatLevel: 1,
      maxThreatLevel: 10,
      minCombatSkill: 1,
    })
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800",
        "flex flex-col",
      )}
    >
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-950 shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Halodex</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Dark Mode</span>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById("import-file")?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                    <input id="import-file" type="file" accept=".json" className="hidden" onChange={importData} />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.reload()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh App
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsKeyboardShortcutsOpen(true)}>
                    <Keyboard className="mr-2 h-4 w-4" />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="characters" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Characters
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 animate-fadeIn">
            <DashboardStats characters={characters} />
          </TabsContent>

          <TabsContent value="characters" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="search-input"
                      placeholder="Search characters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <Button variant="outline" size="icon" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <AdvancedFilters
                  onApplyFilters={handleApplyAdvancedFilters}
                  onResetFilters={handleResetAdvancedFilters}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <Select value={activeFilter} onValueChange={setActiveFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by faction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Characters</SelectItem>
                        <SelectItem value="favorites">Favorites</SelectItem>
                        <SelectItem value="unsc">UNSC</SelectItem>
                        <SelectItem value="covenant">Covenant</SelectItem>
                        <SelectItem value="forerunner">Forerunner</SelectItem>
                        <SelectItem value="banished">Banished</SelectItem>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="threat">Threat Level</SelectItem>
                        <SelectItem value="faction">Faction</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                    >
                      {viewMode === "list" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="7" height="7" x="3" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="14" rx="1" />
                          <rect width="7" height="7" x="3" y="14" rx="1" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="21" x2="3" y1="6" y2="6" />
                          <line x1="21" x2="3" y1="12" y2="12" />
                          <line x1="21" x2="3" y1="18" y2="18" />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {filteredCharacters.length} {filteredCharacters.length === 1 ? "character" : "characters"} found
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsComparisonMode(!isComparisonMode)}
                  >
                    <Scale className="h-4 w-4" />
                    {isComparisonMode ? "Exit Comparison" : "Compare Characters"}
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-320px)]">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                      <p className="text-slate-500">Loading characters...</p>
                    </div>
                  ) : filteredCharacters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                      <p className="text-slate-500">No characters found</p>
                      {searchQuery && (
                        <Button variant="link" onClick={() => setSearchQuery("")}>
                          Clear search
                        </Button>
                      )}
                    </div>
                  ) : viewMode === "list" ? (
                    <div className="space-y-2">
                      {filteredCharacters.map((character) => (
                        <div
                          key={character.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors card-hover",
                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                            selectedCharacter?.id === character.id && "bg-slate-100 dark:bg-slate-800",
                          )}
                          onClick={() => handleCharacterSelect(character.id)}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                            <img
                              src={character.imageUrl || "/placeholder.svg?height=40&width=40"}
                              alt={character.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">{character.name}</h3>
                              <div className="flex items-center gap-1">
                                {favorites.includes(character.id) && (
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                )}
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    character.faction === "unsc" && "border-blue-500 text-blue-500",
                                    character.faction === "covenant" && "border-purple-500 text-purple-500",
                                    character.faction === "forerunner" && "border-cyan-500 text-cyan-500",
                                    character.faction === "banished" && "border-red-500 text-red-500",
                                    character.faction === "flood" && "border-green-500 text-green-500",
                                  )}
                                >
                                  {character.faction}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {character.species} • {character.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredCharacters.map((character) => (
                        <CharacterCard
                          key={character.id}
                          character={character}
                          isSelected={selectedCharacter?.id === character.id}
                          isFavorite={favorites.includes(character.id)}
                          onClick={() => handleCharacterSelect(character.id)}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="lg:col-span-2">
                {isComparisonMode ? (
                  <CharacterComparison characters={characters} onClose={() => setIsComparisonMode(false)} />
                ) : selectedCharacter ? (
                  <div className="space-y-6">
                    <CharacterDetails
                      character={selectedCharacter}
                      isFavorite={favorites.includes(selectedCharacter.id)}
                      onToggleFavorite={() => toggleFavorite(selectedCharacter.id)}
                      onEdit={() => setIsEditDialogOpen(true)}
                      onDelete={() => handleDeleteCharacter(selectedCharacter.id)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <StatsChart character={selectedCharacter} />
                      <CharacterNotes characterId={selectedCharacter.id} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                    <Shield className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to Halodex</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                      Your comprehensive database of characters from the Halo universe. Select a character from the list
                      to view detailed information.
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)} className="animate-pulse-slow">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Character
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Character Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Character</DialogTitle>
            <DialogDescription>Enter the details for the new character to add to the Halodex.</DialogDescription>
          </DialogHeader>

          <CharacterForm onSubmit={handleAddCharacter} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
            <DialogDescription>Update the details for {selectedCharacter?.name}.</DialogDescription>
          </DialogHeader>

          {selectedCharacter && (
            <CharacterForm
              character={selectedCharacter}
              onSubmit={handleUpdateCharacter}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>Use these keyboard shortcuts to navigate the application faster.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">n</span>
                <span className="text-sm">Add new character</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">f</span>
                <span className="text-sm">Focus search</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">d</span>
                <span className="text-sm">Toggle dark mode</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">c</span>
                <span className="text-sm">Toggle comparison</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">t</span>
                <span className="text-sm">Dashboard tab</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">h</span>
                <span className="text-sm">Characters tab</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="kbd">?</span>
                <span className="text-sm">Show this help</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsKeyboardShortcutsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
