"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Cloud, ArrowLeft, CheckCircle } from "lucide-react"
import { auth } from "../firebase/firebaseConfig"
import { sendPasswordResetEmail } from "firebase/auth"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      // Configuración para usar la interfaz de Firebase
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`, // URL de redirección después de restablecer
        handleCodeInApp: false // Usar la interfaz de Firebase
      })
      setSuccess(true)
    } catch (err: any) {
      let errorMessage = "Error al enviar el correo de restablecimiento"
      if (err.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido"
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = "No existe una cuenta con este correo electrónico"
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Demasiados intentos. Inténtalo más tarde"
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Error de conexión. Verifica tu conexión a internet"
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
            <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
            <CardDescription>
              Te enviaremos un correo electrónico con instrucciones para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Correo enviado</h3>
                <p className="text-gray-600">
                  Hemos enviado un correo electrónico a <strong>{email}</strong> con instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Sigue las instrucciones en el correo para completar el proceso. Firebase te proporcionará una interfaz para crear tu nueva contraseña.
                </p>
                <div className="mt-6 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                  >
                    Solicitar otro correo
                  </Button>
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al inicio de sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-blue-600 hover:underline">
                    <ArrowLeft className="w-4 h-4 inline mr-1" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

