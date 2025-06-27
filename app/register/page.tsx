"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cloud, Eye, EyeOff, CheckCircle } from "lucide-react"

import { auth, db } from "../firebase/firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    setIsLoading(true)
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim()
      if (!name) throw new Error("El nombre es obligatorio para registrarse")
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: formData.email,
        name,
        phone,
        createdAt: serverTimestamp()
      })
      router.push("/dashboard")
    } catch (err: any) {
      let errorMessage = "Error de autenticación"
      if (err.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido"
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "La contraseña debe tener al menos 6 caracteres"
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Ya existe una cuenta con este correo electrónico"
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Error de conexión. Verifica tu conexión a internet"
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CloudStore</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar a usar CloudStore</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Tu número de teléfono"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  Acepto los{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    política de privacidad
                  </Link>
                </Label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
