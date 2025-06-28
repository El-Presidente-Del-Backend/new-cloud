"use client"

import { useState, useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export interface Folder {
  id: string
  name: string
  createdAt: any
}

export const useFolders = (user: any) => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setFolders([])
      setLoading(false)
      return
    }

    setLoading(true)

    const foldersRef = collection(db, "users", user.uid, "folders")

    const unsubscribe = onSnapshot(
      foldersRef,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Folder[]
        setFolders(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Error al obtener carpetas:", err)
        setError("Error al cargar carpetas: " + err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  return { folders, loading, error }
}
