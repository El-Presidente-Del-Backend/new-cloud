"use client"

import { useState, useMemo, useEffect } from "react"
import { signOut } from "firebase/auth"
import { auth, db } from "../firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "../hooks/use-toast"
import {
  Cloud, Home, Users, Share2, Menu, ChevronDown, LogOut, 
  Search, Upload, FolderPlus, List, Grid3X3, MoreHorizontal,
  Download, Trash2, FolderOpen, Folder, ExternalLink,
  FileText, File, Image as ImageIcon, Video
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useFolders } from "../hooks/use-folders"
import { useFiles, useSharedWithMe } from "../hooks/use-files"
import { uploadFile, deleteFile } from "../services/file-service"
import { createFolder, deleteFolder } from "../services/folder-service"
import { shareFile } from "../services/share-service"
import { formatFileSize, formatDate } from "../utils/file-utils"
import { UploadForm } from "@/components/ui/upload-form"
import { ShareModal } from "@/components/ui/share-modal"
import { useStorageUsage } from "../hooks/use-storage-usage"
import { useRecentFiles } from "../hooks/use-recent-files"
import { accessFile } from "../services/file-service"
import FileViewer from "@/components/ui/file-viewer"
import { useIsMobile } from "../hooks/use-mobile"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState<"my-files" | "shared">("my-files")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFileForShare, setSelectedFileForShare] = useState<any>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  
  // Añadir estado para el visor de archivos
  const [fileToView, setFileToView] = useState<any>(null)
  
  // Estados para búsqueda y filtros - MOVER AQUÍ, ANTES DEL useEffect
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = useIsMobile()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        
        try {
          const userDocRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          } else {
            console.log("No se encontraron datos adicionales del usuario")
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error)
        }
      } else {
        router.push("/login")
      }
      setLoading(false)
    })
    
    return () => unsubscribe()
  }, [router])

  const { folders, loading: loadingFolders } = useFolders(user)
  const { files, loading: loadingFiles } = useFiles(user, selectedFolderId)
  const { sharedFiles, loading: loadingShared } = useSharedWithMe(user)
  const { usedStorage, totalStorage, usedPercentage, loading: loadingStorage } = useStorageUsage(user)
  const { recentFiles, loading: loadingRecentFiles } = useRecentFiles(user)

  // Función para manejar el clic en un archivo reciente
  const handleRecentFileClick = async (file: any) => {
    if (file.folderId) {
      setSelectedFolderId(file.folderId)
    }
    
    await accessFile(file, user)
    
    setFileToView(file)
  }

  // Función para manejar la apertura/descarga de un archivo
  const handleOpenFile = async (file: any) => {
    try {
      await accessFile(file, user)
      
      setFileToView(file)
    } catch (error) {
      console.error("Error al abrir archivo:", error)
      toast({
        title: "Error",
        description: "No se pudo abrir el archivo",
        variant: "destructive",
      })
    }
  }

  const handleCloseViewer = () => {
    setFileToView(null)
  }

  // Filtrado y ordenamiento de archivos
  const filteredAndSortedFiles = useMemo(() => {
    const currentFiles = activeTab === "my-files" ? files : sharedFiles
    let result = [...currentFiles]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((file) => (file.name || file.fileName || "").toLowerCase().includes(searchLower))
    }

    if (filterType !== "all") {
      result = result.filter((file) => file.type === filterType)
    }

    result.sort((a, b) => {
      let valueA: any, valueB: any

      if (sortBy === "name") {
        valueA = (a.name || a.fileName || "").toLowerCase()
        valueB = (b.name || b.fileName || "").toLowerCase()
      } else if (sortBy === "size") {
        valueA = a.size || 0
        valueB = b.size || 0
      } else if (sortBy === "createdAt") {
        valueA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0)
        valueB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0)
      } else if (sortBy === "type") {
        valueA = a.type || ""
        valueB = b.type || ""
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    return result
  }, [files, sharedFiles, activeTab, searchTerm, filterType, sortBy, sortDirection])

  useEffect(() => {
    console.log("Files:", files);
    console.log("Shared files:", sharedFiles);
    console.log("Filtered files:", filteredAndSortedFiles);
  }, [files, sharedFiles, filteredAndSortedFiles]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  const displayName = userData?.name || user?.email

  const getFileIcon = (file: any) => {
    const fileType = file.type
    switch (fileType) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-500" />
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />
      case "document":
        return <FileText className="w-5 h-5 text-red-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    try {
      await uploadFile(file, user, selectedFolderId)
      toast({
        title: "Éxito",
        description: "Archivo subido correctamente",
      })
    } catch (error) {
      console.error("Error al subir archivo:", error)
      toast({
        title: "Error",
        description: "Error al subir archivo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      await createFolder(newFolderName, user)
      setNewFolderName("")
      toast({
        title: "Éxito",
        description: "Carpeta creada correctamente",
      })
    } catch (error) {
      console.error("Error al crear carpeta:", error)
      toast({
        title: "Error",
        description: "Error al crear carpeta",
        variant: "destructive",
      })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleDeleteFile = async (file: any) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${file.name || file.fileName}"?`)) {
      try {
        await deleteFile(file, user)
        toast({
          title: "Éxito",
          description: "Archivo eliminado correctamente",
        })
      } catch (error) {
        console.error("Error al eliminar archivo:", error)
        toast({
          title: "Error",
          description: "Error al eliminar archivo",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta carpeta y todo su contenido?")) {
      try {
        await deleteFolder(folderId, user)
        if (selectedFolderId === folderId) {
          setSelectedFolderId(null)
        }
        toast({
          title: "Éxito",
          description: "Carpeta eliminada correctamente",
        })
      } catch (error) {
        console.error("Error al eliminar carpeta:", error)
        toast({
          title: "Error",
          description: "Error al eliminar carpeta",
          variant: "destructive",
        })
      }
    }
  }

  const handleShareFile = async (file: any, email: string, permission: string) => {
    try {
      await shareFile(file, email, permission, user, userData)
      toast({
        title: "Éxito",
        description: `Archivo compartido con ${email}`,
      })
    } catch (error) {
      console.error("Error al compartir archivo:", error)
      toast({
        title: "Error",
        description: "Error al compartir archivo",
        variant: "destructive",
      })
      throw error
    }
  }

  const openShareModal = (file: any) => {
    setSelectedFileForShare(file)
    setShowShareModal(true)
  }

  const closeShareModal = () => {
    setSelectedFileForShare(null)
    setShowShareModal(false)
  }

  const handleDownloadFile = async (file: any) => {
    try {
      // Registrar el acceso al archivo
      await accessFile(file, user)
      
      // Crear un enlace temporal para la descarga
      const link = document.createElement("a")
      link.href = file.url
      link.download = file.name || "download"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error al descargar archivo:", error)
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      })
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">CloudStore</h1>
            </div>
            {!isMobile && (
              <div className="relative max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar archivos y carpetas..."
                  className="pl-10 w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          
          {/* Menú móvil */}
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          {/* Perfil de usuario (visible en desktop) */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bienvenido, {displayName}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Barra de búsqueda móvil */}
        {isMobile && (
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Menú móvil desplegable */}
      {isMobile && mobileMenuOpen && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col space-y-3">
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("my-files")}>
              <Home className="w-4 h-4 mr-2" />
              Mis Archivos
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActiveTab("shared")}>
              <Users className="w-4 h-4 mr-2" />
              Compartidos Conmigo
            </Button>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{displayName}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-files"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("my-files")}
          >
            <Home className="w-4 h-4 inline mr-2" />
            Mis Archivos
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "shared"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("shared")}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Compartidos Conmigo
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Solo mostrar en desktop para "Mis Archivos" */}
        {!isMobile && activeTab === "my-files" && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            {/* Carpetas */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Carpetas</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFolderDialog(true)}
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </div>
              <nav className="space-y-1">
                <Button
                  variant={selectedFolderId === null ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolderId(null)}
                >
                  <Home className="w-4 h-4 mr-3" />
                  Raíz
                </Button>
                {loadingFolders ? (
                  <div className="text-sm text-gray-500">Cargando carpetas...</div>
                ) : (
                  folders.map((folder) => (
                    <div key={folder.id} className="flex items-center group">
                      <Button
                        variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
                        className="flex-1 justify-start"
                        onClick={() => setSelectedFolderId(folder.id)}
                      >
                        <Folder className="w-4 h-4 mr-3 text-blue-500" />
                        <span className="truncate">{folder.name}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFolder(folder.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                )}
              </nav>
            </div>

            {/* Archivos recientes - Añadido a la sidebar */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Archivos recientes</h3>
              {loadingRecentFiles ? (
                <div className="text-sm text-gray-500">Cargando archivos recientes...</div>
              ) : recentFiles.length === 0 ? (
                <div className="text-sm text-gray-500">No hay archivos recientes</div>
              ) : (
                <div className="space-y-2">
                  {recentFiles.slice(0, 5).map((file) => (
                    <div 
                      key={file.id} 
                      className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer group"
                      onClick={() => handleRecentFileClick(file)}
                    >
                      <div className="mr-3 text-gray-500">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {formatFileSize(file.size)} • {new Date(file.accessedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estadísticas de almacenamiento */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Almacenamiento</h3>
              {loadingStorage ? (
                <div className="text-sm text-gray-500">Calculando...</div>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{formatFileSize(usedStorage)} de {formatFileSize(totalStorage)}</span>
                    <span className="text-gray-600">{usedPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usedPercentage > 90 ? "bg-red-500" : usedPercentage > 70 ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${usedPercentage}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Breadcrumb - Solo para "Mis Archivos" */}
          {activeTab === "my-files" && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Home className="w-4 h-4" />
              <span>Mis Archivos</span>
              {selectedFolderId && (
                <>
                  <span>/</span>
                  <span>{folders.find((f) => f.id === selectedFolderId)?.name || "Carpeta"}</span>
                </>
              )}
            </div>
          )}

          {/* Upload Section - Solo para "Mis Archivos" y adaptado para móvil */}
          {activeTab === "my-files" && !isMobile && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Subir Archivo</h2>
              <UploadForm onUpload={handleUpload} isUploading={isUploading} />
            </div>
          )}

          {/* Modal de subida para móvil */}
          {isMobile && isUploading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Subir Archivo</h3>
                <UploadForm onUpload={async (file) => {
                  await handleUpload(file);
                  setIsUploading(false);
                }} isUploading={isUploading} />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => setIsUploading(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar adaptada para móvil */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
            <div>
              <h2 className="text-lg font-semibold">
                {activeTab === "my-files"
                  ? selectedFolderId
                    ? `Archivos en: ${folders.find((f) => f.id === selectedFolderId)?.name || "Carpeta"}`
                    : "Archivos en Raíz"
                  : "Archivos Compartidos Conmigo"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filtros simplificados para móvil */}
              {!isMobile ? (
                <div className="flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="image">Imágenes</option>
                    <option value="video">Videos</option>
                    <option value="document">Documentos</option>
                    <option value="other">Otros</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="name">Nombre</option>
                    <option value="size">Tamaño</option>
                    <option value="createdAt">Fecha</option>
                    <option value="type">Tipo</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  >
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Filtrar <ChevronDown className="ml-1 w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Tipo de archivo</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setFilterType("all")}>
                      Todos los tipos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("image")}>
                      Imágenes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("video")}>
                      Videos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType("document")}>
                      Documentos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      Nombre
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("size")}>
                      Tamaño
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                      Fecha
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                      {sortDirection === "asc" ? "Ascendente ↑" : "Descendente ↓"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <div className="flex items-center gap-2">
                {selectedFiles.length > 0 && (
                  <Badge variant="secondary">
                    {selectedFiles.length} seleccionado{selectedFiles.length > 1 ? "s" : ""}
                  </Badge>
                )}
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={isMobile ? "hidden sm:inline-flex" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* File List/Grid */}
          {loadingFiles || loadingShared ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Cargando archivos...</div>
            </div>
          ) : filteredAndSortedFiles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">
                {searchTerm || filterType !== "all"
                  ? "No se encontraron archivos con los filtros aplicados"
                  : activeTab === "my-files"
                    ? selectedFolderId
                      ? "No hay archivos en esta carpeta"
                      : "No hay archivos en la raíz"
                    : "No hay archivos compartidos contigo"}
              </div>
            </div>
          ) : isMobile || viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredAndSortedFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={(e) => {
                    // Si se hace clic en el nombre o icono del archivo, abrirlo
                    if ((e.target as HTMLElement).closest('.file-preview')) {
                      e.stopPropagation()
                      handleOpenFile(file)
                    } else {
                      // De lo contrario, seleccionarlo
                      toggleFileSelection(file.id)
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 flex items-center justify-center file-preview">
                        {getFileIcon(file)}
                      </div>
                      <div className="text-center space-y-1 w-full">
                        <p className="text-sm font-medium text-gray-900 truncate file-preview">{file.name || file.fileName}</p>
                        <p className="text-xs text-gray-500">{file.size ? formatFileSize(file.size) : "—"}</p>
                        <p className="text-xs text-gray-400">{formatDate(file.createdAt)}</p>
                        {file.isShared && (
                          <Badge variant="outline" className="text-xs">
                            Compartido
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-sm font-medium text-gray-700">
                <div className="col-span-6">Nombre</div>
                <div className="col-span-2">Tamaño</div>
                <div className="col-span-3">Modificado</div>
                <div className="col-span-1"></div>
              </div>

              {filteredAndSortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                    selectedFiles.includes(file.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={(e) => {
                    // Si se hace clic en el nombre del archivo, abrirlo
                    if ((e.target as HTMLElement).closest('.file-name-cell')) {
                      e.stopPropagation()
                      handleOpenFile(file)
                    } else {
                      // De lo contrario, seleccionarlo
                      toggleFileSelection(file.id)
                    }
                  }}
                >
                  <div className="col-span-6 flex items-center gap-3 file-name-cell">
                    {getFileIcon(file)}
                    <span className="font-medium text-gray-900">{file.name || file.fileName}</span>
                    {file.isShared && (
                      <Badge variant="outline" className="text-xs">
                        Compartido
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">{file.size ? formatFileSize(file.size) : "—"}</div>
                  <div className="col-span-3 text-sm text-gray-600">{formatDate(file.createdAt)}</div>
                  <div className="col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleOpenFile(file)
                        }}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadFile(file)
                        }}>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        {!file.isShared && (
                          <DropdownMenuItem onClick={() => openShareModal(file)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartir
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteFile(file)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Share Modal */}
      <ShareModal
        file={selectedFileForShare}
        isOpen={showShareModal}
        onClose={closeShareModal}
        onShare={handleShareFile}
      />

      {/* Visor de archivos */}
      {fileToView && (
        <FileViewer 
          file={fileToView}
          onClose={handleCloseViewer}
        />
      )}

      {showFolderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Nueva carpeta</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nombre de la carpeta"
              className="w-full border border-gray-300 rounded p-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleCreateFolder();
                  setShowFolderDialog(false);
                }}
                disabled={isCreatingFolder || !newFolderName.trim()}
              >
                {isCreatingFolder ? "Creando..." : "Crear"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
