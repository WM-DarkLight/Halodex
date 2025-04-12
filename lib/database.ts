import type { Character } from "./types"
import { initialCharacters } from "./initial-data"

// IndexedDB setup
const DB_NAME = "halodex"
const DB_VERSION = 2 // Increased version to trigger database upgrade
const CHARACTERS_STORE = "characters"

let db: IDBDatabase | null = null

export async function initializeDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("IndexedDB error:", event)
      reject("Failed to open database")
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      resolve()
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // If the object store exists, delete it to start fresh
      if (database.objectStoreNames.contains(CHARACTERS_STORE)) {
        database.deleteObjectStore(CHARACTERS_STORE)
      }

      // Create object store for characters
      const store = database.createObjectStore(CHARACTERS_STORE, { keyPath: "id", autoIncrement: true })

      // Create indexes for searching
      store.createIndex("name", "name", { unique: false })
      store.createIndex("faction", "faction", { unique: false })
      store.createIndex("species", "species", { unique: false })

      // Add initial data
      store.transaction.oncomplete = async () => {
        const characterStore = database.transaction(CHARACTERS_STORE, "readwrite").objectStore(CHARACTERS_STORE)

        // Add initial data without checking if data exists
        initialCharacters.forEach((character) => {
          characterStore.add(character)
        })
      }
    }
  })
}

export async function resetDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    // Close the current connection
    db.close()
    db = null

    // Delete the database
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME)

    deleteRequest.onsuccess = () => {
      console.log("Database deleted successfully")
      // Reinitialize the database
      initializeDB()
        .then(() => resolve())
        .catch((error) => reject(error))
    }

    deleteRequest.onerror = (event) => {
      console.error("Error deleting database:", event)
      reject("Failed to delete database")
    }
  })
}

export async function getAllCharacters(): Promise<Character[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readonly")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = (event) => {
      console.error("Error getting characters:", event)
      reject("Failed to get characters")
    }
  })
}

export async function getCharacterById(id: number): Promise<Character> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readonly")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const request = store.get(id)

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result)
      } else {
        reject(`Character with ID ${id} not found`)
      }
    }

    request.onerror = (event) => {
      console.error("Error getting character:", event)
      reject("Failed to get character")
    }
  })
}

export async function addCharacter(character: Omit<Character, "id">): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readwrite")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const request = store.add(character)

    request.onsuccess = () => {
      resolve(request.result as number)
    }

    request.onerror = (event) => {
      console.error("Error adding character:", event)
      reject("Failed to add character")
    }
  })
}

export async function updateCharacter(character: Character): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readwrite")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const request = store.put(character)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = (event) => {
      console.error("Error updating character:", event)
      reject("Failed to update character")
    }
  })
}

export async function deleteCharacter(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readwrite")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const request = store.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = (event) => {
      console.error("Error deleting character:", event)
      reject("Failed to delete character")
    }
  })
}

export async function searchCharacters(query: string): Promise<Character[]> {
  const allCharacters = await getAllCharacters()

  return allCharacters.filter(
    (character) =>
      character.name.toLowerCase().includes(query.toLowerCase()) ||
      character.species.toLowerCase().includes(query.toLowerCase()) ||
      character.affiliation.toLowerCase().includes(query.toLowerCase()) ||
      character.role.toLowerCase().includes(query.toLowerCase()),
  )
}

export async function getCharactersByFaction(faction: string): Promise<Character[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("Database not initialized")
      return
    }

    const transaction = db.transaction(CHARACTERS_STORE, "readonly")
    const store = transaction.objectStore(CHARACTERS_STORE)
    const index = store.index("faction")
    const request = index.getAll(faction)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = (event) => {
      console.error("Error getting characters by faction:", event)
      reject("Failed to get characters by faction")
    }
  })
}
