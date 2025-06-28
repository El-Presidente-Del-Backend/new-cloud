"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const useStorageUsage = (user: any) => {
  const [usedStorage, setUsedStorage] = useState(0)
  const [totalStorage, setTotalStorage] = useState(15 * 1024 * 1024 * 1024) // 15 GB por defecto
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setUsedStorage(0)
      setLoading(false)
      return
    }

    setLoading(true)

    // Obtener todos los archivos del usuario
    const filesRef = collection(db, "users", user.uid, "files")
    
    const unsubscribe = onSnapshot(
      filesRef,
      (snapshot) => {
        // Calcular el tamaño total sumando el tamaño de cada archivo
        const totalSize = snapshot.docs.reduce((sum, doc) => {
          const fileData = doc.data()
          return sum + (fileData.size || 0)
        }, 0)
        
        setUsedStorage(totalSize)
        setLoading(false)
      },
      (error) => {
        console.error("Error al calcular uso de almacenamiento:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { 
    usedStorage, 
    totalStorage, 
    usedPercentage: (usedStorage / totalStorage) * 100,
    loading 
  }
}