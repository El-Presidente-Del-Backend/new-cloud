"use client"

import { useState, useEffect } from "react"
import { ref, onValue, off } from "firebase/database"
import { database } from "../firebase/firebaseConfig"
import { RecentFile } from "../services/recent-files-service"

export const useRecentFiles = (user: any) => {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setRecentFiles([])
      setLoading(false)
      return
    }

    setLoading(true)

    // Referencia a los archivos recientes del usuario
    const recentFilesRef = ref(database, `recentFiles/${user.uid}`)
    
    // Escuchar cambios en tiempo real
    onValue(
      recentFilesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setRecentFiles([])
          setLoading(false)
          setError(null)
          return
        }
        
        const recentFilesData: RecentFile[] = []
        snapshot.forEach((childSnapshot) => {
          recentFilesData.push(childSnapshot.val() as RecentFile)
        })
        
        // Ordenar por fecha de acceso (más reciente primero)
        const sortedFiles = recentFilesData.sort((a, b) => b.accessedAt - a.accessedAt)
        setRecentFiles(sortedFiles)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error("Error al obtener archivos recientes:", err)
        setError("Error al cargar archivos recientes: " + err.message)
        setLoading(false)
      }
    )

    // Limpiar listener al desmontar
    return () => {
      off(recentFilesRef)
    }
  }, [user])

  return { recentFiles, loading, error }
}