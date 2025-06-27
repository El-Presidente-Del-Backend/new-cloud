"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Cloud, Shield, Smartphone, Users, Zap, CheckCircle, Star, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Cloud className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CloudStore</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Precios
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                Acerca de
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu almacenamiento en la nube
            <span className="text-blue-600 block">seguro y confiable</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Guarda, sincroniza y comparte tus archivos desde cualquier lugar. Con CloudStore tienes acceso a tus
            documentos las 24 horas del día.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-4xl mx-auto">
            <img src="/placeholder.svg?height=400&width=800" alt="CloudStore Dashboard" className="w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir CloudStore?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos las mejores características para mantener tus archivos seguros y accesibles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Seguridad Avanzada</h3>
                <p className="text-gray-600">
                  Encriptación de extremo a extremo para mantener tus archivos completamente seguros.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sincronización Rápida</h3>
                <p className="text-gray-600">Sincroniza tus archivos instantáneamente en todos tus dispositivos.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Acceso Móvil</h3>
                <p className="text-gray-600">
                  Accede a tus archivos desde cualquier dispositivo, en cualquier momento.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Colaboración</h3>
                <p className="text-gray-600">Comparte y colabora en archivos con tu equipo de forma sencilla.</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Backup Automático</h3>
                <p className="text-gray-600">
                  Respaldo automático de tus archivos importantes sin que tengas que preocuparte.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
                <p className="text-gray-600">Nuestro equipo de soporte está disponible las 24 horas para ayudarte.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planes que se adaptan a ti</h2>
            <p className="text-xl text-gray-600">Desde uso personal hasta empresarial, tenemos el plan perfecto</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Básico</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">Gratis</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>5 GB de almacenamiento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Sincronización básica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Acceso móvil</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Comenzar Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-blue-500 relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Más Popular</span>
              </div>
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  $9.99<span className="text-lg text-gray-600">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>100 GB de almacenamiento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Sincronización avanzada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Colaboración en equipo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Soporte prioritario</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button className="w-full">Comenzar Prueba</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-2">Empresarial</h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  $29.99<span className="text-lg text-gray-600">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>1 TB de almacenamiento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Usuarios ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Administración avanzada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Soporte 24/7</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contactar Ventas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de usuarios que ya confían en CloudStore para sus archivos
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Crear Cuenta Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">CloudStore</span>
              </div>
              <p className="text-gray-400">
                La mejor solución de almacenamiento en la nube para individuos y empresas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Seguridad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreras
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Estado del Servicio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CloudStore. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
