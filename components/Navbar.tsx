
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
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold italic" style={{ color: COLORS.deepBlue }}>
                Vende<span style={{ color: COLORS.emeraldGreen }}>Libros</span>
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === link.path
                      ? 'border-emerald-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={handleQuickShare}
                  title="Compartir mi link de patrocinio"
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
                <span className="text-sm text-gray-600 hidden md:block">Hola, <strong>{user.username}</strong></span>
                <button
                  onClick={onLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-emerald-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
