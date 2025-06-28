"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ShareModalProps {
  file: any
  isOpen: boolean
  onClose: () => void
  onShare: (file: any, email: string, permission: string) => Promise<void>
}

export function ShareModal({ file, isOpen, onClose, onShare }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState("read")
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!email.trim()) return

    setIsSharing(true)
    try {
      await onShare(file, email, permission)
      setEmail("")
      setPermission("read")
      onClose()
    } catch (error) {
      console.error("Error al compartir:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartir archivo</DialogTitle>
          <DialogDescription>Compartir "{file?.name || file?.fileName}" con otro usuario</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="permission">Permisos</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar permisos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Solo lectura</SelectItem>
                <SelectItem value="write">Lectura y escritura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={isSharing || !email.trim()}>
            {isSharing ? "Compartiendo..." : "Compartir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
