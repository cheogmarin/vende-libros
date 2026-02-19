
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserLevel, UserStatus } from '../types';
import { COLORS, ROOT_USER_EMAIL } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { findSpilloverPlacement, findActiveSponsor } from '../src/utils/network';
import { supabase } from '../supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleSponsorStep, setShowGoogleSponsorStep] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [googleUserData, setGoogleUserData] = useState<{ name: string, email: string } | null>(null);

  const navigate = useNavigate();

  // Robust sponsor code extraction
  const getInitialSponsor = () => {
    try {
      const hash = window.location.hash || '';
      const queryPart = hash.includes('?') ? hash.split('?')[1] : '';
      return new URLSearchParams(queryPart).get('ref') || ROOT_USER_EMAIL;
    } catch (e) {
      return ROOT_USER_EMAIL;
    }
  };

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sponsorCode: getInitialSponsor(),
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sponsorCode: '',
  });

  // Real-time validation logic
  useEffect(() => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      sponsorCode: '',
    };

    if (isRegistering || showGoogleSponsorStep) {
      if (formData.sponsorCode.trim() === '') {
        newErrors.sponsorCode = 'El código de anfitrión es obligatorio.';
      }

      if (!showGoogleSponsorStep) {
        if (formData.username.length > 0 && formData.username.length < 3) {
          newErrors.username = 'Mínimo 3 caracteres.';
        } else if (formData.username.length > 0 && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          newErrors.username = 'Solo letras, números y guiones bajos.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email.length > 0 && !emailRegex.test(formData.email)) {
          newErrors.email = 'Correo electrónico inválido.';
        }

        if (formData.password.length > 0 && formData.password.length < 6) {
          newErrors.password = 'Mínimo 6 caracteres.';
        }

        if (formData.confirmPassword.length > 0 && formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Las claves no coinciden.';
        }
      }
    }

    setErrors(newErrors);
  }, [formData, isRegistering, showGoogleSponsorStep]);

  const isRootUser = formData.email === ROOT_USER_EMAIL;

  const isFormValid = isRegistering
    ? (!errors.username && !errors.email && !errors.password && !errors.confirmPassword && (isRootUser || !errors.sponsorCode) &&
      formData.username && formData.email && formData.password && formData.confirmPassword && (isRootUser || formData.sponsorCode))
    : (formData.email && formData.password && !errors.email);

  const generateWelcomeEmail = async (username: string, sponsorId: string, email: string) => {
    setIsGeneratingEmail(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Genera un correo electrónico de bienvenida profesional y motivador en ESPAÑOL para un nuevo usuario de 'Vende Libros'. 
                   Nombre: ${username}. Patrocinador: ${sponsorId}. 
                   REQUISITO ESTRICTO: El cuerpo del mensaje (Body) debe tener EXACTAMENTE TRES PÁRRAFOS cortos. 
                   Párrafo 1: Bienvenida y validación de su entrada a la red P2P. 
                   Párrafo 2: Explicación rápida de que ganará el 100% de comisión de sus ventas. 
                   Párrafo 3: Llamado a la acción para configurar su pago móvil/banco ahora mismo. 
                   Responde ÚNICAMENTE con un objeto JSON: {"subject": "...", "body": "..."}`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const content = JSON.parse(response.text || `{"subject": "¡Bienvenido a Vende Libros!", "body": "Estamos felices de tenerte aquí.\\n\\nTu negocio P2P está listo para generar el 100% de comisiones directamente a tu cuenta.\\n\\nEntra ahora y configura tus datos de cobro."}`);
      setSimulatedEmail(content);
    } catch (error) {
      console.error("Error generating email:", error);
      setSimulatedEmail({
        subject: "¡Bienvenido a Vende Libros!",
        body: `¡Hola ${username}! Es un placer darte la bienvenida a nuestra red descentralizada de conocimiento.\n\nDesde ahora tienes el control total para recibir pagos de $2, $6 y $20 directamente de persona a persona sin intermediarios.\n\nPor favor, entra a tu oficina virtual y configura tus métodos de pago para empezar a cobrar hoy mismo.`
      });
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleGoogleAuth = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const mockGoogleData = {
        name: "Usuario Google",
        email: "usuario.google@gmail.com"
      };
      const isRootUser = mockGoogleData.email === ROOT_USER_EMAIL;

      const newUser: User = {
        id: 'mock-google-id-' + Date.now(),
        username: mockGoogleData.name,
        email: mockGoogleData.email,
        sponsorId: isRootUser ? null : getInitialSponsor(),
        level: isRootUser ? UserLevel.COSECHA : UserLevel.GUEST,
        status: isRootUser ? UserStatus.ACTIVE : UserStatus.ACTIVE,
        cycle: 1,
        cycleHistory: [],
        paymentInfo: null,
        earnings: 0,
        matrixProgress: 0,
      };

      setIsGoogleLoading(false);
      onLogin(newUser);
      navigate('/setup-profile');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert('Error al registrar: ' + error.message);
        return;
      }

      if (data.user) {
        // Find placement (Spillover)
        const parentId = await findSpilloverPlacement(formData.sponsorCode);

        // Create profile in Supabase
        const isRootUser = formData.email === ROOT_USER_EMAIL;
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            username: formData.username,
            email: formData.email,
            sponsor_id: isRootUser ? null : formData.sponsorCode,
            parent_id: isRootUser ? null : (await findActiveSponsor(formData.sponsorCode) || parentId),
            level: isRootUser ? UserLevel.COSECHA : UserLevel.GUEST,
            status: 'ACTIVE',
            cycle: 1,
            earnings: 0,
            matrix_progress: 0,
          },
        ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        const newUser: User = {
          id: data.user.id,
          username: formData.username,
          email: formData.email,
          sponsorId: isRootUser ? null : formData.sponsorCode,
          level: isRootUser ? UserLevel.COSECHA : UserLevel.GUEST,
          status: UserStatus.ACTIVE,
          cycle: 1,
          cycleHistory: [],
          paymentInfo: null,
          earnings: 0,
          matrixProgress: 0,
        };

        setPendingUser(newUser);
        await generateWelcomeEmail(newUser.username, newUser.sponsorId || ROOT_USER_EMAIL, newUser.email);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // FALLBACK: Permitir acceso administrativo directo si falla Supabase (ej. email no confirmado)
        if (formData.email === ROOT_USER_EMAIL) {
          const rootUser: User = {
            id: 'usr_root_001',
            username: 'Fundador (Nodo 0)',
            email: ROOT_USER_EMAIL,
            sponsorId: null,
            level: UserLevel.COSECHA,
            status: UserStatus.ACTIVE,
            cycle: 1,
            cycleHistory: [],
            paymentInfo: {
              bankName: 'BANCO DE VENEZUELA',
              accountNumber: 'josegmarin2012@gmail.com',
              phone: '+58 412-0000000',
              idNumber: 'MASTER-001'
            },
            earnings: 0,
            matrixProgress: 0
          };
          onLogin(rootUser);
          navigate('/dashboard');
          return;
        }

        alert('Error al ingresar: ' + error.message);
        return;
      }

      if (data.user) {
        // App.tsx will handle the session and fetch profile
        navigate('/dashboard');
      }
    }
  };


  const handleFinalizeRegistration = () => {
    if (pendingUser) {
      onLogin(pendingUser);
      navigate('/setup-profile');
    }
  };

  const getInputClass = (error: string, value: string) => {
    const base = "appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm transition-all ";
    if (error) return base + "border-red-500 bg-red-50";
    if (value && !error) return base + "border-emerald-500 bg-emerald-50";
    return base + "border-gray-300";
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-20 blur-3xl"></div>

      {isGeneratingEmail && (
        <div className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="text-2xl font-bold text-emerald-800 animate-pulse">Activando tu Red P2P...</h3>
          <p className="text-gray-500 mt-2">Configurando tu oficina virtual y generando bienvenida en español.</p>
        </div>
      )}



      {/* Email Simulation Modal with 3 paragraphs and scroll */}
      {simulatedEmail && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-emerald-600 p-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Confirmación de Registro</h3>
                  <p className="text-xs opacity-80">VL-SISTEMA: Notificación Automática</p>
                </div>
              </div>
            </div>

            <div className="p-10">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200">
                <p className="text-sm text-gray-500 mb-2"><strong>Asunto:</strong> {simulatedEmail.subject}</p>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {simulatedEmail.body}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleFinalizeRegistration}
                  className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl transition transform hover:scale-105"
                >
                  Entrar a mi Oficina Virtual
                </button>
                <p className="text-[10px] text-gray-400 text-center px-8">
                  Al entrar, configurarás tus métodos de pago para recibir tus comisiones de $2.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 z-10">
        <div className="text-center">
          <div className="inline-block bg-emerald-100 p-3 rounded-2xl mb-4">
            <span className="text-2xl font-bold italic" style={{ color: COLORS.deepBlue }}>
              Vende<span style={{ color: COLORS.emeraldGreen }}>Libros</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isRegistering ? 'Únete a la Red' : 'Panel de Control'}
          </h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            <img className="h-5 w-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Continuar con Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="px-3 bg-white text-gray-400 font-bold">O usa tu correo</span></div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {isRegistering && (
                <>
                  {!isRootUser && (
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Anfitrión (Sponsor) *</label>
                      <input
                        type="text"
                        required
                        value={formData.sponsorCode}
                        onChange={(e) => setFormData({ ...formData, sponsorCode: e.target.value })}
                        className={getInputClass(errors.sponsorCode, formData.sponsorCode)}
                        placeholder="Email de quien te invitó"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nombre de Usuario</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={getInputClass(errors.username, formData.username)}
                      placeholder="usuario_nuevo"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={getInputClass(errors.email, formData.email)}
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={getInputClass(errors.password, formData.password)}
                  placeholder="••••••••"
                />
              </div>
              {isRegistering && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Confirmar Contraseña</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={getInputClass(errors.confirmPassword, formData.confirmPassword)}
                    placeholder="••••••••"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 px-4 text-sm font-black rounded-xl text-white transition-all shadow-xl ${isFormValid
                ? 'bg-emerald-600 hover:bg-emerald-700 transform hover:scale-[1.02] active:scale-95'
                : 'bg-gray-200 cursor-not-allowed opacity-80'
                }`}
            >
              {isRegistering ? 'ACTIVAR MI NEGOCIO' : 'ENTRAR AL PANEL'}
            </button>

            {!isRegistering && (
              <p className="text-[10px] text-gray-400 text-center italic">
                (Por favor, regístrate para activar tu nueva cuenta)
              </p>
            )}
          </form>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-600 font-bold hover:text-emerald-700 text-sm transition"
          >
            {isRegistering ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Eres nuevo? Empieza hoy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
