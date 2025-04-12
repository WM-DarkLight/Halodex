"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import React from "react"

interface CharacterNotesProps {
  characterId: number
}

const CharacterNotes = React.memo(({ characterId }: CharacterNotesProps) => {
  const [notes, setNotes] = useLocalStorage<Record<number, string>>("halodex-character-notes", {})
  const [currentNote, setCurrentNote] = useState("")
  const { toast } = useToast()

  // Update current note when character changes
  useEffect(() => {
    setCurrentNote(notes[characterId] || "")
  }, [characterId, notes])

  const saveNote = () => {
    setNotes((prev) => ({
      ...prev,
      [characterId]: currentNote,
    }))

    toast({
      title: "Note saved",
      description: "Your notes for this character have been saved.",
    })
  }

  const deleteNote = () => {
    const newNotes = { ...notes }
    delete newNotes[characterId]
    setNotes(newNotes)
    setCurrentNote("")

    toast({
      title: "Note deleted",
      description: "Your notes for this character have been deleted.",
    })
  }

  return (
    <Card className="animate-fadeIn">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Personal Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add your personal notes about this character here..."
          className="min-h-[150px] mb-3"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          {currentNote && (
            <Button variant="outline" size="sm" onClick={deleteNote}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
          <Button size="sm" onClick={saveNote}>
            <Save className="h-4 w-4 mr-1" />
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

CharacterNotes.displayName = "CharacterNotes"

export default CharacterNotes
