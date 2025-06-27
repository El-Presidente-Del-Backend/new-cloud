"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import { useRouter } from "next/navigation"
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
import {
  Cloud,
  Download,
  File,
  FileText,
  Folder,
  Grid3X3,
  Home,
  ImageIcon,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Upload,
  Users,
  Video,
  LogOut,
} from "lucide-react"

interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
  fileType?: "image" | "video" | "document" | "other"
  starred?: boolean
}

const mockFiles: FileItem[] = [
  { id: "1", name: "Documentos", type: "folder", modified: "Hace 2 días" },
  { id: "2", name: "Fotos Vacaciones", type: "folder", modified: "Hace 1 semana" },
  { id: "3", name: "Presentación.pptx", type: "file", size: "2.4 MB", modified: "Hace 3 horas", fileType: "document" },
  {
    id: "4",
    name: "IMG_2024.jpg",
    type: "file",
    size: "1.8 MB",
    modified: "Hace 1 día",
    fileType: "image",
    starred: true,
  },
  { id: "5", name: "Video_proyecto.mp4", type: "file", size: "45.2 MB", modified: "Hace 2 días", fileType: "video" },
  { id: "6", name: "Informe_anual.pdf", type: "file", size: "3.1 MB", modified: "Hace 5 días", fileType: "document" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login") // Redirige si no está autenticado
      } else {
        setUser(currentUser)
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") return <Folder className="w-5 h-5 text-blue-500" />

    switch (item.fileType) {
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

  const handleLogout = () => {
    // Simular logout
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">CloudStore</h1>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar archivos y carpetas..." className="pl-10 w-80" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Subir
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
              <Home className="w-4 h-4 mr-3" />
              Mis Archivos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Compartidos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Star className="w-4 h-4 mr-3" />
              Favoritos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-3" />
              Papelera
            </Button>
          </nav>

          <Separator className="my-6" />

          {/* Storage Usage */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Almacenamiento</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Usado</span>
                <span className="font-medium">2.4 GB de 15 GB</span>
              </div>
              <Progress value={16} className="h-2" />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Obtener más espacio
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="w-4 h-4" />
            <span>Mis Archivos</span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Subir archivo
              </Button>
              {selectedFiles.length > 0 && (
                <>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir ({selectedFiles.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
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

          {/* File List/Grid */}
          {viewMode === "list" ? (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 text-sm font-medium text-gray-700">
                <div className="col-span-6">Nombre</div>
                <div className="col-span-2">Tamaño</div>
                <div className="col-span-3">Modificado</div>
                <div className="col-span-1"></div>
              </div>

              {mockFiles.map((file) => (
                <div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                    selectedFiles.includes(file.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    {getFileIcon(file)}
                    <span className="font-medium text-gray-900">{file.name}</span>
                    {file.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">{file.size || "—"}</div>
                  <div className="col-span-3 text-sm text-gray-600">{file.modified}</div>
                  <div className="col-span-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartir
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="w-4 h-4 mr-2" />
                          {file.starred ? "Quitar de favoritos" : "Agregar a favoritos"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedFiles.includes(file.id) ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 flex items-center justify-center">{getFileIcon(file)}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate w-full">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size || "Carpeta"}</p>
                        <p className="text-xs text-gray-400">{file.modified}</p>
                      </div>
                      {file.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
