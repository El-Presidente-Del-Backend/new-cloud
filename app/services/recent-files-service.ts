import { ref, set, get, remove, query, orderByChild, limitToLast } from "firebase/database"
import { database } from "../firebase/firebaseConfig"

// Número máximo de archivos recientes a mantener por usuario
const MAX_RECENT_FILES = 10

export interface RecentFile {
  id: string
  name: string
  url: string
  type: string
  extension: string
  accessedAt: number
  folderId: string | null
  size: number
}

/**
 * Añade o actualiza un archivo en la lista de recientes
 */
export const addToRecentFiles = async (userId: string, file: any): Promise<void> => {
  if (!userId || !file) return

  try {
    const recentFileData: RecentFile = {
      id: file.id,
      name: file.name,
      url: file.url,
      type: file.type || "other",
      extension: file.extension || "",
      accessedAt: Date.now(),
      folderId: file.folderId || null,
      size: file.size || 0
    }

    // Referencia al archivo reciente específico
    const recentFileRef = ref(database, `recentFiles/${userId}/${file.id}`)
    
    // Guardar el archivo reciente
    await set(recentFileRef, recentFileData)
    
    // Obtener todos los archivos recientes para mantener solo los MAX_RECENT_FILES más recientes
    await pruneOldRecentFiles(userId)
  } catch (error) {
    console.error("Error al añadir archivo reciente:", error)
  }
}

/**
 * Elimina un archivo de la lista de recientes
 */
export const removeFromRecentFiles = async (userId: string, fileId: string): Promise<void> => {
  if (!userId || !fileId) return

  try {
    const recentFileRef = ref(database, `recentFiles/${userId}/${fileId}`)
    await remove(recentFileRef)
  } catch (error) {
    console.error("Error al eliminar archivo reciente:", error)
  }
}

/**
 * Obtiene los archivos recientes de un usuario
 */
export const getRecentFiles = async (userId: string): Promise<RecentFile[]> => {
  if (!userId) return []

  try {
    // Consulta para obtener los archivos recientes ordenados por fecha de acceso
    const recentFilesRef = ref(database, `recentFiles/${userId}`)
    const snapshot = await get(recentFilesRef)
    
    if (!snapshot.exists()) return []
    
    const recentFiles: RecentFile[] = []
    snapshot.forEach((childSnapshot) => {
      recentFiles.push(childSnapshot.val() as RecentFile)
    })
    
    // Ordenar por fecha de acceso (más reciente primero)
    return recentFiles.sort((a, b) => b.accessedAt - a.accessedAt)
  } catch (error) {
    console.error("Error al obtener archivos recientes:", error)
    return []
  }
}

/**
 * Elimina archivos antiguos para mantener solo los MAX_RECENT_FILES más recientes
 */
const pruneOldRecentFiles = async (userId: string): Promise<void> => {
  try {
    const recentFiles = await getRecentFiles(userId)
    
    if (recentFiles.length <= MAX_RECENT_FILES) return
    
    // Ordenar por fecha de acceso (más antiguo primero)
    const sortedFiles = [...recentFiles].sort((a, b) => a.accessedAt - b.accessedAt)
    
    // Eliminar los archivos más antiguos que exceden el límite
    const filesToRemove = sortedFiles.slice(0, sortedFiles.length - MAX_RECENT_FILES)
    
    for (const file of filesToRemove) {
      await removeFromRecentFiles(userId, file.id)
    }
  } catch (error) {
    console.error("Error al limpiar archivos recientes antiguos:", error)
  }
}