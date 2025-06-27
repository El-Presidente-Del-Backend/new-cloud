"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Cloud, Eye, EyeOff } from "lucide-react"

import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirige o actualiza estado según tu lógica
      router.push("/dashboard");
    } catch (err) {
      let errorMessage = "Error de autenticación";
      if (typeof err === "object" && err !== null && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === 'auth/invalid-email') {
          errorMessage = "El formato del correo electrónico no es válido";
        } else if (code === 'auth/user-not-found') {
          errorMessage = "No existe una cuenta con este correo electrónico";
        } else if (code === 'auth/wrong-password') {
          errorMessage = "Contraseña incorrecta";
        } else if (code === 'auth/network-request-failed') {
          errorMessage = "Error de conexión. Verifica tu conexión a internet";
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa a tu cuenta para acceder a tus archivos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                
                </div>
             

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input id="remember" type="checkbox" className="rounded border-gray-300" />
                  <Label htmlFor="remember" className="text-sm">
                    Recordarme
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Regístrate aquí
                </Link>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuar con Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
