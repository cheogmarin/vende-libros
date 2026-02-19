

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, ICONS } from '../constants';

const LandingPage: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-blue-600 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200')] bg-cover bg-center opacity-20"></div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
                    <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full animate-float-delayed"></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <span className="text-white font-semibold text-sm">✨ Oportunidad de Ingreso Extra</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                        Gana Dinero Extra<br />
                        <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                            Vendiendo eBooks
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                        Comienza con solo <strong className="text-yellow-300">$2</strong> y alcanza hasta <strong className="text-yellow-300">$570+</strong> mensuales
                    </p>

                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Sin experiencia. Sin complicaciones. 100% de comisiones para ti.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/auth"
                            className="group relative px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <span>¡Regístrate Gratis Ahora!</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        <a
                            href="#como-funciona"
                            className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-full border-2 border-white/50 hover:bg-white/20 transition-all"
                        >
                            ¿Cómo Funciona?
                        </a>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/90 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>100% Gratis Registrarse</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Pagos P2P Directos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>Cientos Ya Ganando</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>
                            ¿Por Qué Vende Libros?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Un sistema diseñado para que todos puedan ganar dinero extra de manera simple
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Benefit 1 */}
                        <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Gana hasta $570+</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Camino claro de $2 → $6 → $540. Crece a tu ritmo y alcanza tus metas financieras.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Comisiones</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Sin intermediarios. Los pagos van directo de persona a persona (P2P) a tu cuenta.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Regalos Gratis</h3>
                            <p className="text-gray-600 leading-relaxed">
                                3 libros de ventas + 2 videos motivacionales al registrarte. Sin costo alguno.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Solo $2 p/ empezar</h3>
                            <p className="text-gray-600 leading-relaxed">
                                La inversión inicial más baja. Accesible para todos. Comienza hoy mismo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-20 bg-white overflow-hidden relative">
                {/* Decorative background gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl translate-y-1/2"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Misión Inspiradora</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4" style={{ color: COLORS.deepBlue }}>
                            Mira esto antes de empezar
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Descubre cómo personas comunes están transformando su realidad con solo $2 y este sistema educativo.
                        </p>
                    </div>

                    <div className="relative group">
                        {/* Outer Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                        {/* Video Container */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 shadow-2xl border-4 border-white aspect-video flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500">
                            {/* Reemplaza la URL del video con tu link de Supabase */}
                            <video
                                controls
                                className="w-full h-full object-cover"
                                preload="metadata"
                                poster="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80"
                            >
                                <source src={`https://jzeupopnmmxidcbfeplb.supabase.co/storage/v1/object/public/videos/motivacion-1.mp4?t=${Date.now()}`} type="video/mp4" />
                                Tu navegador no soporta la reproducción de videos.
                            </video>

                            {/* Overlay indicator if not playing */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end p-8">
                                <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Haz clic para ver el video informativo
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="como-funciona" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>
                            Tu Camino al Éxito en 3 Pasos
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple, directo y diseñado para que tengas éxito
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connection Line (hidden on mobile) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-blue-200 to-purple-200 transform -translate-y-1/2" style={{ top: '80px' }}></div>

                        <div className="grid md:grid-cols-3 gap-8 lg:gap-4 relative">
                            {/* Step 1 */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-3xl border-2 border-emerald-200 text-center h-full flex flex-col">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg relative z-10">
                                        1
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-emerald-900">Regístrate Gratis</h3>
                                    <p className="text-emerald-800 leading-relaxed flex-grow">
                                        Crea tu cuenta en menos de 2 minutos. Recibe acceso inmediato a tus libros de regalo y material de capacitación.
                                    </p>
                                    <div className="mt-6 p-4 bg-white rounded-xl border border-emerald-200">
                                        <p className="font-bold text-emerald-600 text-sm">✨ Bonus Incluido</p>
                                        <p className="text-xs text-gray-600 mt-1">3 eBooks + 2 Videos Gratis</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-3xl border-2 border-blue-200 text-center h-full flex flex-col">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg relative z-10">
                                        2
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-blue-900">Activa tu Negocio</h3>
                                    <p className="text-blue-800 leading-relaxed flex-grow">
                                        Invierte solo $2 para activar tu primer nivel. Estudia los libros y aprende las estrategias comprobadas de ventas.
                                    </p>
                                    <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                                        <p className="font-bold text-blue-600 text-sm">💡 Inversión Mínima</p>
                                        <p className="text-xs text-gray-600 mt-1">Desde solo $2 USD</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl border-2 border-purple-200 text-center h-full flex flex-col">
                                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-lg relative z-10">
                                        3
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-purple-900">Comparte y Gana</h3>
                                    <p className="text-purple-800 leading-relaxed flex-grow">
                                        Comparte la oportunidad con otros. Los pagos llegan directamente a tu cuenta. Tú decides cuánto crecer.
                                    </p>
                                    <div className="mt-6 p-4 bg-white rounded-xl border border-purple-200">
                                        <p className="font-bold text-purple-600 text-sm">🚀 Potencial Real</p>
                                        <p className="text-xs text-gray-600 mt-1">Hasta $570+ mensuales</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works Explanation Section */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 md:p-12 border-2 border-emerald-200 shadow-xl">
                        <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ color: COLORS.deepBlue }}>
                            ¿Cómo Funciona?
                        </h3>

                        <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                            Vende Libros es una plataforma P2P (persona a persona) para la venta de e-books, diseñada para que el promotor tenga el control total sin intermediarios. Sus pilares son:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Pilar 1 */}
                            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-emerald-900 mb-2">Ganancia Total</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Recibes el 100% de las comisiones directamente en tu cuenta; la app no retiene fondos.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pilar 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-blue-900 mb-2">Autonomía y Libertad</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Actúas como un negocio propio, sin jefes ni obligación de reinvertir.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pilar 3 */}
                            <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-purple-900 mb-2">Gestión Simple</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            La aplicación solo funciona como un rastreador de ventas y niveles, eliminando la burocracia y las estructuras corporativas complejas.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pilar 4 */}
                            <div className="bg-white p-6 rounded-2xl border border-yellow-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-yellow-900 mb-2">Activación Rápida</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            El sistema se pone en marcha con solo 3 ventas iniciales.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-xl text-gray-600">
                            Resolvemos tus dudas sobre cómo funciona Vende Libros
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* FAQ 1 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(1)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Qué es Vende Libros?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 1 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 1 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    Es una herramienta tecnológica que permite a promotores independientes comercializar paquetes de libros digitales. El sistema gestiona la red y el acceso al contenido, pero no interviene en el flujo del dinero, el cual es 100% directo entre usuarios.
                                </div>
                            )}
                        </div>

                        {/* FAQ 2 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(2)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Cómo recibo mis ganancias?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 2 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 2 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    El 100% de tus ventas va directamente a tu cuenta personal (Pago Móvil, Transferencia, Binance, etc.). La aplicación nunca toca tu dinero; tú configuras tus propios métodos de cobro en tu perfil.
                                </div>
                            )}
                        </div>

                        {/* FAQ 3 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(3)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Qué pasa si envío un pago y el receptor no lo confirma?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 3 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 3 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    No te preocupes. El sistema cuenta con un Cronómetro de Seguridad de 24 horas. Si el receptor no confirma tu pago en ese tiempo, la aplicación verificará tu número de referencia y activará tu nivel automáticamente. La red nunca se detiene.
                                </div>
                            )}
                        </div>

                        {/* FAQ 4 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(4)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Puedo usar la misma cuenta bancaria para mi pareja o amigos?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 4 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 4 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    No. Por seguridad y para evitar fraudes o cuentas falsas, el sistema prohíbe el uso de datos bancarios duplicados. Cada usuario debe tener sus propios métodos de pago únicos y personales.
                                </div>
                            )}
                        </div>

                        {/* FAQ 5 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(5)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Cuántas ventas necesito para tener éxito?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 5 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 5 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    El sistema se activa con solo 3 ventas iniciales del Paquete Básico. A partir de ahí, tu crecimiento dependerá de cómo ayudes a tu equipo a duplicar ese mismo proceso simple.
                                </div>
                            )}
                        </div>

                        {/* FAQ 6 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(6)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Es esto una pirámide?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 6 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 6 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    No. En las pirámides el dinero sube a una empresa central que reparte migajas. Aquí no hay empresa central. Tú vendes un producto real (libros digitales) y te quedas con el 100% de la comisión de cada venta que el sistema te asigne. Eres un promotor independiente de contenido educativo.
                                </div>
                            )}
                        </div>

                        {/* FAQ 7 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(7)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Tengo que reinvertir obligatoriamente?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 7 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 7 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    Tú tienes la autonomía total. El sistema te sugerirá cuándo es el momento ideal para subir de nivel y multiplicar tus ingresos, pero la decisión de disponer de tu dinero es siempre tuya.
                                </div>
                            )}
                        </div>

                        {/* FAQ 8 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(8)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Qué pasa si completo los 3 niveles?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 8 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 8 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    Una vez que recibes tus 27 pagos del Paquete Triple, habrás completado tu ciclo con éxito. Tu cuenta quedará inactiva y podrás decidir si quieres iniciar un nuevo ciclo desde cero para seguir ganando.
                                </div>
                            )}
                        </div>

                        {/* FAQ 9 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(9)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Qué es el Derrame Inteligente?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 9 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 9 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    Es un sistema de apoyo en equipo. Si tu patrocinador es muy activo y ya completó sus 3 ventas iniciales, los nuevos prospectos que él traiga caerán automáticamente en los "huecos" de tu red. Esto significa que podrías recibir referidos automáticamente gracias al trabajo de tu equipo.
                                </div>
                            )}
                        </div>

                        {/* FAQ 10 */}
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <button
                                onClick={() => toggleFAQ(10)}
                                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-lg text-gray-900 pr-4">
                                    ¿Qué es la Compresión Dinámica?
                                </span>
                                <svg
                                    className={`w-6 h-6 text-emerald-600 flex-shrink-0 transition-transform ${openFAQ === 10 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFAQ === 10 && (
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-fade-in">
                                    Esta función garantiza que los usuarios inactivos no frenen tu crecimiento. Si alguien en tu línea de cobro no ha activado su nivel o está inactivo, el sistema lo salta automáticamente para que el pago llegue al siguiente líder activo. ¡Aquí siempre cobras!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-20 bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Únete a Nuestra Comunidad
                        </h2>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Cientos de personas ya están generando ingresos extra con Vende Libros
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                            <div className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                                500+
                            </div>
                            <p className="text-lg font-semibold">Miembros Activos</p>
                            <p className="text-sm text-white/80 mt-2">Ganando dinero diariamente</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                            <div className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                                $570+
                            </div>
                            <p className="text-lg font-semibold">Potencial Mensual</p>
                            <p className="text-sm text-white/80 mt-2">Con el sistema completo</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
                            <div className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                                100%
                            </div>
                            <p className="text-lg font-semibold">De Comisiones</p>
                            <p className="text-sm text-white/80 mt-2">Sin retenciones ni tarifas</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-blue-900/50"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        ¿Listo para Transformar<br />tu Futuro Financiero?
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Miles ya lo están haciendo. Tu turno es ahora.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                        <Link
                            to="/auth"
                            className="group px-12 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xl rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <span>Comenzar Ahora - Es Gratis</span>
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-sm text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="font-semibold">100% Seguro</span>
                            <span className="text-xs">Pagos P2P protegidos</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-semibold">Inicio Inmediato</span>
                            <span className="text-xs">Actívate en minutos</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span className="font-semibold">Sin Riesgos</span>
                            <span className="text-xs">Registro gratuito</span>
                        </div>
                    </div>

                    <p className="mt-10 text-gray-500 text-sm">
                        Al registrarte, aceptas recibir información sobre Vende Libros y la oportunidad de negocio.
                    </p>
                </div>
            </section>

            {/* Custom Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
