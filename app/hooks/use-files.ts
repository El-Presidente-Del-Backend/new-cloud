"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export interface FileItem {
  id: string
  name: string
  url: string
  folderId?: string | null
  createdAt: any
  ownerId: string
  ownerEmail: string
  size: number
  type: string
  extension: string
  isShared?: boolean
  fileName?: string
}

export const useFiles = (user: any, selectedFolderId: string | null) => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setFiles([])
      setLoading(false)
      return
    }

    setLoading(true)

    const filesRef = collection(db, "users", user.uid, "files")
    const q = query(filesRef, where("folderId", "==", selectedFolderId || null))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FileItem[]
        setFiles(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Error al obtener archivos:", err)
        setError("Error al cargar archivos: " + err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user, selectedFolderId])

  return { files, loading, error }
}

export const useSharedWithMe = (user: any) => {
  const [sharedFiles, setSharedFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setSharedFiles([])
      setLoading(false)
      return
    }

    setLoading(true)

    const sharedRef = collection(db, "users", user.uid, "sharedWithMe")

    const unsubscribe = onSnapshot(
      sharedRef,
      (snapshot) => {
        const sharedDocs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isShared: true,
        })) as FileItem[]
        setSharedFiles(sharedDocs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Error al obtener archivos compartidos:", err)
        setError("Error al cargar archivos compartidos: " + err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  return { sharedFiles, loading, error }
}

