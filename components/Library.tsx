
import React, { useState, useEffect } from 'react';
import { UserLevel, Book } from '../types';
import { COLORS, getActiveBooks } from '../constants';

interface LibraryProps {
  isAuthenticated: boolean;
  userLevel: UserLevel;
}

const Library: React.FC<LibraryProps> = ({ isAuthenticated, userLevel }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(getActiveBooks());
  }, []);

  const getLockStatus = (index: number) => {
    if (!isAuthenticated) return true;
    if (userLevel === UserLevel.GUEST) return true;
    if (userLevel === UserLevel.SEMILLA && index > 1) return true;
    if (userLevel === UserLevel.CRECIMIENTO && index > 3) return true;
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4" style={{ color: COLORS.deepBlue }}>Biblioteca Digital</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Accede a contenido de alta calidad y herramientas de marketing para potenciar tus ventas. 
          Desbloquea más títulos subiendo de nivel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book, idx) => {
          const isLocked = getLockStatus(idx);
          return (
            <div key={book.id} className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group ${isLocked ? 'opacity-75' : ''}`}>
              <div className="relative aspect-[3/4]">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition transform group-hover:scale-105" />
                {isLocked && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex flex-col items-center justify-center text-white px-4 text-center">
                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="font-bold text-sm">Bloqueado</p>
                    <p className="text-[10px] mt-1 opacity-80">
                      {!isAuthenticated ? 'Regístrate para ver' : 'Sube de nivel para leer'}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{book.author}</p>
                <button 
                  disabled={isLocked}
                  className={`w-full py-3 rounded-xl font-bold transition ${
                    isLocked 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                  }`}
                >
                  {isLocked ? 'Cerrado' : 'Leer Ahora'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 bg-emerald-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-4">¿Quieres ver tus propios títulos aquí?</h3>
          <p className="text-emerald-100 mb-8 max-w-xl">
            Vende Libros permite a los líderes de alto nivel proponer títulos para la biblioteca colectiva. 
            Ayúdanos a crecer la comunidad con contenido valioso.
          </p>
          <button className="bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition">
            Contactar Soporte
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -translate-y-1/2 translate-x-1/3 opacity-30"></div>
      </div>
    </div>
  );
};

export default Library;
