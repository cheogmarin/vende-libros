
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import Auth from './components/Auth';
import ProfileSetup from './components/ProfileSetup';
import { User, UserLevel } from './types';
import { supabase } from './supabase';
import { ROOT_USER_EMAIL } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      // FIX: Inject default payment info for root user if missing
      let paymentInfo = data.payment_info;
      if (data.email === ROOT_USER_EMAIL && !paymentInfo) {
        paymentInfo = {
          bankName: 'BANCO DE VENEZUELA',
          accountNumber: 'josegmarin2012@gmail.com',
          phone: '+58 412-0000000',
          idNumber: 'MASTER-001'
        };
      }

      const formattedUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        sponsorId: data.sponsor_id,
        level: data.level as UserLevel,
        paymentInfo: paymentInfo,
        earnings: data.earnings,
        matrixProgress: data.matrix_progress,
      };
      setUser(formattedUser);
      setIsAuthenticated(true);
    } else if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: updates.username || user.username,
            email: updates.email || user.email,
            sponsor_id: updates.sponsorId !== undefined ? updates.sponsorId : user.sponsorId,
            level: updates.level || user.level,
            payment_info: updates.paymentInfo || user.paymentInfo,
            earnings: updates.earnings !== undefined ? updates.earnings : user.earnings,
            matrix_progress: updates.matrixProgress !== undefined ? updates.matrixProgress : user.matrixProgress,
          });

        if (error) {
          console.warn('DB Update warning (likely mock user):', error.message);
        }
      } catch (e) {
        console.error('Update operation failed:', e);
      }

      // ALWAYS update local state so the user can proceed to the dashboard
      setUser({ ...user, ...updates });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
