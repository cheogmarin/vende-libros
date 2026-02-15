
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { COLORS, VENEZUELAN_BANKS, checkDuplicatePayment, SECURITY_ERROR_MESSAGE, ROOT_USER_EMAIL } from '../constants';

interface ProfileSetupProps {
  user: User;
  onComplete: (updates: Partial<User>) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    bankName: '',
    accountNumber: '',
    phone: '',
    idNumber: '',
  });

  // State for completing profile (e.g. after Google Auth)
  const [missingData, setMissingData] = useState({
    username: user.username || '',
    sponsorId: user.sponsorId || '',
  });

  const navigate = useNavigate();
  const isRootUser = user.email === ROOT_USER_EMAIL;

  // Si ya tiene datos de pago (por un update anterior), navegamos al dashboard
  if (user.paymentInfo) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar datos de perfil si faltan
    if (!missingData.username || (!isRootUser && !missingData.sponsorId)) {
      alert('Por favor completa los datos de perfil (Usuario y Anfitrión).');
      return;
    }

    // Validar banco
    if (!paymentInfo.bankName) {
      alert('Por favor selecciona un banco o método de pago.');
      return;
    }

    // Validación de seguridad P2P: No duplicados
    const isDuplicate = checkDuplicatePayment(paymentInfo, user.id);
    if (isDuplicate) {
      alert(SECURITY_ERROR_MESSAGE);
      return;
    }

    // Guardar TODO de una vez
    await onComplete({
      username: missingData.username,
      sponsorId: isRootUser ? null : missingData.sponsorId,
      paymentInfo
    });

    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: COLORS.deepBlue }}>Activa tu cuenta</h2>
            <p className="text-gray-500 text-sm">Completa tus datos para empezar a ganar</p>
          </div>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Para que otros usuarios puedan pagarte directamente, necesitamos configurar tu perfil y cuenta bancaria.
          <strong className="block mt-2 text-emerald-700">El dinero siempre va directo a ti, sin intermediarios.</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección de Perfil */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Información de Usuario</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Nombre de Usuario</label>
                <input
                  type="text"
                  required
                  value={missingData.username}
                  onChange={(e) => setMissingData({ ...missingData, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="Ej. juan_perez"
                />
              </div>
              {!isRootUser && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">Email de tu Anfitrión</label>
                  <input
                    type="text"
                    required
                    value={missingData.sponsorId}
                    onChange={(e) => setMissingData({ ...missingData, sponsorId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                    placeholder="Email de quien te invitó"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sección de Cobro */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Datos para recibir pagos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-600 mb-2">Banco / Método de Pago</label>
                <select
                  required
                  value={paymentInfo.bankName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="">Selecciona una opción...</option>
                  {VENEZUELAN_BANKS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Cédula / RIF</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.idNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, idNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="V-12345678"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Teléfono (Pagomóvil)</label>
                <input
                  type="tel"
                  required
                  value={paymentInfo.phone}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="04121234567"
                />
              </div>

              <div className="col-span-full">
                <label className="block text-xs font-bold text-gray-600 mb-2">Número de Cuenta o Email (Zelle)</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.accountNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="20 dígitos o email"
                />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-amber-800 font-bold mb-1">Verifica tus datos</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Tus pagos de $2, $6 y $20 llegarán directamente a estos datos. Asegúrate de que sean exactos.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Activar mi Oficina Virtual</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
