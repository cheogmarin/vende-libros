
import React, { useState, useEffect } from 'react';
import { UserLevel, Book } from '../types';
import { COLORS, getActiveBooks } from '../constants';

import { useNavigate } from 'react-router-dom';

interface LibraryProps {
  isAuthenticated: boolean;
  userLevel: UserLevel;
}

const Library: React.FC<LibraryProps> = ({ isAuthenticated, userLevel }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setBooks(getActiveBooks());
  }, []);

  const getLockStatus = (index: number) => {
    if (!isAuthenticated) return true;
    if (userLevel === UserLevel.GUEST) return true;
    if (userLevel === UserLevel.SEMILLA && index > 2) return true;
    if (userLevel === UserLevel.CRECIMIENTO && index > 11) return true;
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 relative">
      {/* Botón X arriba a la derecha */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>Biblioteca Digital</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Accede a contenido de alta calidad y herramientas de marketing para potenciar tus ventas.
          Desbloquea más títulos subiendo de nivel.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book, idx) => {
          const isLocked = getLockStatus(idx);
          return (
            <div key={book.id} className={`bg-white p-4 rounded-2xl shadow-md transition-transform hover:-translate-y-2 group border border-gray-50 relative ${isLocked ? 'grayscale-[0.5]' : ''}`}>
              <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-lg">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />

                {isLocked ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-3">
                    <svg className="w-8 h-8 text-white mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Bloqueado</span>
                    <p className="text-white/70 text-[8px] leading-tight mt-1">
                      {!isAuthenticated ? 'Regístrate' : 'Sube de nivel'}
                    </p>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold text-xs px-3 py-1.5 border-2 border-white rounded uppercase">Leer Libro</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 truncate text-sm">{book.title}</h3>
              <p className="text-[10px] text-gray-500 truncate">{book.author}</p>
            </div>
          );
        })}
      </div>

      {/* Botón Cerrar abajo */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-10 rounded-xl transition transform hover:scale-105"
        >
          Cerrar Biblioteca
        </button>
      </div>

      <div className="mt-20 bg-emerald-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">¿Quieres ver tus propios títulos aquí?</h3>
          <p className="text-emerald-100 mb-8 max-w-xl">
            Vende Libros permite a los líderes de alto nivel proponer títulos para la biblioteca colectiva.
            Ayúdanos a crecer la comunidad con contenido valioso.
          </p>
          <button
            onClick={() => alert('Solo para usuarios de tercer nivel.')}
            className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition"
          >
            Contactar Soporte
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -translate-y-1/2 translate-x-1/3 opacity-30"></div>
      </div>
    </div>
  );
};

export default Library;
