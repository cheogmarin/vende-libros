
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { COLORS } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Biblioteca', path: '/library' },
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  const handleQuickShare = async () => {
    if (!user) return;
    const shareUrl = `https://vendelibros.app/#/auth?ref=${user.username}`;
    const shareData = {
      title: 'Vende Libros',
      text: `¡Únete a mi equipo en Vende Libros! Gana el 100% de comisiones vendiendo eBooks.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link de patrocinio copiado.');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <span className="text-2xl font-bold italic" style={{ color: COLORS.deepBlue }}>
                Vende<span style={{ color: COLORS.emeraldGreen }}>Libros</span>
              </span>
              {user && (
                <div className="flex flex-col items-start border-l border-gray-200 pl-3">
                  <span className="text-sm font-bold truncate max-w-[120px]" style={{ color: COLORS.deepBlue }}>{user.username}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                      user.status === 'COMPLETED' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                        'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                      }`}></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                      {user.status === 'ACTIVE' ? 'Activo' : user.status === 'COMPLETED' ? 'Completado' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === link.path
                    ? 'border-emerald-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {user && (
              <>
                <button
                  onClick={handleQuickShare}
                  title="Compartir link"
                  className="hidden md:flex p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
                <button
                  onClick={onLogout}
                  className="hidden md:block bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                >
                  Salir
                </button>
              </>
            )}

            {/* Mobile Menu Button (Bottom bar approach for vertical view) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  menu?.classList.toggle('hidden');
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div id="mobile-menu" className="hidden md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              className={`block px-3 py-3 rounded-xl text-base font-bold ${location.pathname === link.path
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                onLogout();
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="w-full text-left block px-3 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
