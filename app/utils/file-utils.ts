export const getFileTypeFromName = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"]
  const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"]
  const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf", "odt"]
  const audioExtensions = ["mp3", "wav", "flac", "aac", "ogg"]

  if (imageExtensions.includes(extension)) return "image"
  if (videoExtensions.includes(extension)) return "video"
  if (documentExtensions.includes(extension)) return "document"
  if (audioExtensions.includes(extension)) return "audio"

  return "other"
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export const formatDate = (date: any): string => {
  if (!date) return "Fecha desconocida"

  let dateObj: Date
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    dateObj = new Date(date)
  }

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Hace 1 día"
  if (diffDays < 7) return `Hace ${diffDays} días`
  if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semana${Math.ceil(diffDays / 7) > 1 ? "s" : ""}`

  return dateObj.toLocaleDateString("es-ES")
}
