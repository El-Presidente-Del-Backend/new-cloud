"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cloud, CheckCircle } from "lucide-react"

export default function ResetPasswordComplete() {
  const router = useRouter()

  // Redirigir automáticamente después de unos segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [router])

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
            <CardTitle className="text-2xl">Contraseña restablecida</CardTitle>
            <CardDescription>
              Tu contraseña ha sido actualizada correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">¡Proceso completado!</h3>
              <p className="text-gray-600">
                Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <p className="text-sm text-gray-500">
                Serás redirigido automáticamente a la página de inicio de sesión en unos segundos...
              </p>
              <Link href="/login" className="block">
                <Button className="w-full mt-4">
                  Ir a iniciar sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
