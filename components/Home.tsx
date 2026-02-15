
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, getActiveBooks, ICONS, GIFT_BOOKS } from '../constants';
import { Book } from '../types';

interface HomeProps {
  isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getActiveBooks());
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden bg-gray-900">
        <img
          src="https://picsum.photos/seed/bookshelf/1200/600"
          alt="Vende Libros Header"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-6 leading-tight tracking-tight">
            Gana $570+ vendiendo eBooks
          </h1>
        </div>
      </section>

      {/* Welcome & Onboarding Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>
            📚 ¡Bienvenido a Vende Libros!
          </h2>
          <p className="text-xl font-medium text-emerald-600">Tu camino de $2 a $570 comienza aquí.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              ¡Hola! Nos emociona que estés pensando en unirte a esta red descentralizada de conocimiento. En Vende Libros, no solo adquieres educación digital, sino que activas un sistema inteligente de ingresos colaborativos donde tú tienes el control total del dinero.
              <br /><br />
              Aquí no hay jefes ni empresas intermediarias: <strong>los pagos van directo de persona a persona (P2P).</strong>
            </p>

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: COLORS.deepBlue }}>
              🚀 Tu Plan de Vuelo en 3 Pasos:
            </h3>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 h-full">
                <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">Paso 1</span>
                <h4 className="font-bold text-lg text-emerald-800 mb-2">La Semilla ($2)</h4>
                <p className="text-sm text-emerald-700">
                  Adquieres tu primer paquete de e-books por solo $2. Al venderlo a 3 personas, recuperas tu inversión y generas tus primeros $6. ¡Fácil y rápido!
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 h-full">
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">Paso 2</span>
                <h4 className="font-bold text-lg text-blue-800 mb-2">El Crecimiento ($6 → $54)</h4>
                <p className="text-sm text-blue-700">
                  Con esos $6, desbloqueas el <strong>Paquete Doble</strong>. Ahora, 9 personas de tu red te pagarán $6 cada una, para un total de $54. De esos $54, te sugerimos reinvertir $20 y quedarte con $34 en tu bolsillo.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 h-full">
                <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">Paso 3</span>
                <h4 className="font-bold text-lg text-purple-800 mb-2">La Cosecha ($20 → $540)</h4>
                <p className="text-sm text-purple-700">
                  Al activar el <strong>Paquete Triple</strong> con $20, te posicionas para recibir 27 pagos directos de $20 cada uno. Al completar este nivel, habrás sumado $540 adicionales.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLORS.deepBlue }}>
              💡 Lo que debes saber:
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm">Sin Retiros</h5>
                  <p className="text-xs text-gray-500">Los pagos llegan directamente a tu cuenta bancaria o móvil sin intermediarios.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm">Sin Complicaciones</h5>
                  <p className="text-xs text-gray-500">La app te avisará quién debe pagarte y te ayudará a verificar cada transacción.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm">Contenido de Valor</h5>
                  <p className="text-xs text-gray-500">Con cada nivel desbloqueas nuevos libros electrónicos para tu crecimiento.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm">Regalo de Bienvenida</h5>
                  <p className="text-xs text-gray-500">Recibe 3 libros de ventas y 2 videos motivacionales gratis al registrarte.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGiftModal(true)}
              className="w-full p-4 bg-emerald-600 rounded-2xl text-white text-center font-bold shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
            >
              <span className="animate-bounce">✨</span>
              Ver los 3 libros y 2 videos de regalo que recibirás gratis
              <span className="animate-bounce">✨</span>
            </button>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-6" style={{ color: COLORS.deepBlue }}>¿Cómo funciona?</h2>
              <div className="text-gray-600 text-lg leading-relaxed mb-6 space-y-4">
                <p>
                  Vende Libros es una herramienta tecnológica diseñada para que promotores independientes comercialicen libros digitales bajo un modelo de empoderamiento directo.
                </p>
                <p className="font-bold text-gray-800">Puntos clave del modelo:</p>
                <ul className="list-disc pl-5 space-y-3 text-base">
                  <li><strong>Comisiones del 100%:</strong> No existe una empresa central que retenga fondos. Los pagos se realizan de persona a persona, garantizando que el dinero fluya directamente entre los participantes.</li>
                  <li><strong>Autonomía Total:</strong> El usuario actúa como su propio negocio, sin jefes ni estructuras corporativas. No hay obligación de reinvertir y las ganancias son de libre disponibilidad inmediata.</li>
                  <li><strong>Simplicidad Operativa:</strong> El sistema elimina la burocracia de las redes tradicionales. No requiere crear listas complejas, gestionar referidos ni pagar comisiones a niveles superiores (modelo no piramidal).</li>
                  <li><strong>Rol de la Aplicación:</strong> Funciona exclusivamente como una herramienta de gestión para rastrear ventas, verificar ingresos y desbloquear nuevos niveles de crecimiento.</li>
                  <li><strong>Requisito de Activación:</strong> Para poner en marcha el potencial del sistema, el promotor solo necesita realizar tres ventas iniciales a personas interesadas en participar.</li>
                </ul>
              </div>
              {!showHowItWorks && (
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="bg-emerald-50 text-emerald-700 font-semibold py-2 px-6 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  Saber más sobre la tecnología
                </button>
              )}
            </div>
            <div className="md:w-1/3 flex justify-center sticky top-24">
              <div className="p-8 bg-emerald-100 rounded-full">
                <ICONS.Trend className="w-20 h-20 text-emerald-600" />
              </div>
            </div>
          </div>

          {showHowItWorks && (
            <div className="mt-8 animate-fade-in border-t pt-8">
              <h3 className="text-xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>Estructura Técnica</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-2 text-emerald-700">P2P Real</h3>
                  <p className="text-sm text-gray-600">Sin intermediarios. Los pagos van de tu cliente a tu cuenta bancaria o pago móvil directamente.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-2 text-emerald-700">Derrame Inteligente</h3>
                  <p className="text-sm text-gray-600">Si tu patrocinador es activo, podrías recibir prospectos automáticamente en los huecos de tu red.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-lg mb-2 text-emerald-700">Compresión Dinámica</h3>
                  <p className="text-sm text-gray-600">No dejes que los inactivos frenen tu crecimiento. El sistema salta usuarios para que siempre cobres.</p>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="bg-gray-100 text-gray-600 font-semibold py-2 px-8 rounded-lg border border-gray-200 hover:bg-gray-200 transition"
                >
                  Ver menos
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main CTA Section - Between Philosophy and Gallery */}
      <section className="py-12 bg-gray-50 text-center">
        {!isAuthenticated ? (
          <Link
            to="/auth"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl inline-block"
          >
            Comienza Ahora, Regístrate
          </Link>
        ) : (
          <Link
            to="/dashboard"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl inline-block"
          >
            Ir a mi Dashboard
          </Link>
        )}
      </section>

      {/* Gallery Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10" style={{ color: COLORS.deepBlue }}>Algunos de nuestros títulos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.slice(0, 8).map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-2xl shadow-md transition-transform hover:-translate-y-2 group border border-gray-50">
                <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold px-4 py-2 border-2 border-white rounded">Ver Biblioteca</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 truncate">{book.author}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/library" className="text-emerald-600 font-bold hover:underline flex items-center justify-center">
              Explorar biblioteca completa <ICONS.Book className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gifts Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in my-auto">
            <div className="bg-emerald-600 p-6 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <h3 className="font-bold text-xl">Tu Paquete de Bienvenida</h3>
                  <p className="text-xs opacity-80">Gratis al activar tu cuenta</p>
                </div>
              </div>
              <button
                onClick={() => setShowGiftModal(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8">
              <h4 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-emerald-500 pl-3">📚 eBooks de Estrategia</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {GIFT_BOOKS.map((book) => (
                  <div key={book.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-md transition group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 shadow-sm">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <h5 className="font-bold text-gray-900 text-sm leading-tight mb-1">{book.title}</h5>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-blue-500 pl-3">🎥 Videos Motivacionales</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-blue-900">Mentalidad de Tiburón</h5>
                    <p className="text-xs text-blue-700">Domina el arte de la persistencia.</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-blue-900">El Camino del Éxito P2P</h5>
                    <p className="text-xs text-blue-700">Entiende el poder de las redes descentralizadas.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl transition transform hover:scale-105 w-full sm:w-auto text-center"
                >
                  ¡Quiero mis regalos, registrarme ya!
                </Link>
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 px-12 rounded-2xl transition transform hover:scale-105 w-full sm:w-auto"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
