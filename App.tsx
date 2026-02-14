
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Auth from './components/Auth';
import ProfileSetup from './components/ProfileSetup';
import { User, UserLevel } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('vende_libros_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const updateGlobalUserList = (updatedUser: User) => {
    const allUsersStr = localStorage.getItem('vende_libros_all_users') || '[]';
    let allUsers: User[] = JSON.parse(allUsersStr);
    
    const index = allUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      allUsers[index] = updatedUser;
    } else {
      allUsers.push(updatedUser);
    }
    
    localStorage.setItem('vende_libros_all_users', JSON.stringify(allUsers));
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('vende_libros_user', JSON.stringify(userData));
    updateGlobalUserList(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vende_libros_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('vende_libros_user', JSON.stringify(updated));
      updateGlobalUserList(updated);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated && user ? (
                  user.paymentInfo ? <Dashboard user={user} onUpdate={updateUser} /> : <Navigate to="/setup-profile" />
                ) : <Navigate to="/auth" />
              } 
            />
            <Route path="/library" element={<Library isAuthenticated={isAuthenticated} userLevel={user?.level || UserLevel.GUEST} />} />
            <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
            <Route 
              path="/setup-profile" 
              element={isAuthenticated && user ? <ProfileSetup user={user} onComplete={updateUser} /> : <Navigate to="/auth" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-8 px-4 text-center text-gray-500 text-sm">
          <p>Vende Libros es una aplicación sin fines de lucro, los usuarios ganan el 100% de las comisiones de sus ventas.</p>
          <p className="mt-2">© 2024 Vende Libros. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
