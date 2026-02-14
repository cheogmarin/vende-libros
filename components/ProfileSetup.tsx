
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { COLORS, VENEZUELAN_BANKS, checkDuplicatePayment, SECURITY_ERROR_MESSAGE } from '../constants';

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
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInfo.bankName) {
      alert('Por favor selecciona un banco o método de pago.');
      return;
    }

    // Validación de seguridad P2P: No duplicados en la red
    const isDuplicate = checkDuplicatePayment(paymentInfo, user.id);
    if (isDuplicate) {
      alert(SECURITY_ERROR_MESSAGE);
      return;
    }

    onComplete({ paymentInfo });
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
            <h2 className="text-3xl font-bold" style={{ color: COLORS.deepBlue }}>Configura tu cobro</h2>
            <p className="text-gray-500 text-sm">Paso final para activar tu oficina virtual</p>
          </div>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Para que otros usuarios puedan pagarte directamente, necesitamos saber a qué banco y cuenta deben enviarte el dinero. 
          <strong className="block mt-2 text-emerald-700">Recuerda: El dinero nunca pasa por nosotros, va directo a ti.</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="col-span-full md:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Banco / Método de Pago</label>
              <select
                required
                value={paymentInfo.bankName}
                onChange={(e) => setPaymentInfo({...paymentInfo, bankName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Selecciona una opción...</option>
                {VENEZUELAN_BANKS.map((bank) => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-full md:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Cédula / RIF</label>
              <input
                type="text"
                required
                value={paymentInfo.idNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, idNumber: e.target.value})}
                placeholder="V-12345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 transition-all"
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Teléfono (Pago Móvil)</label>
              <input
                type="tel"
                required
                value={paymentInfo.phone}
                onChange={(e) => setPaymentInfo({...paymentInfo, phone: e.target.value})}
                placeholder="04121234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 transition-all"
              />
            </div>

            <div className="col-span-full md:col-span-1">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Número de Cuenta o Email</label>
              <input
                type="text"
                required
                value={paymentInfo.accountNumber}
                onChange={(e) => setPaymentInfo({...paymentInfo, accountNumber: e.target.value})}
                placeholder="20 dígitos o email para Zelle"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 transition-all"
              />
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
                Es fundamental que estos datos sean correctos. Los otros miembros los usarán para enviarte tus ganancias de $2, $6 y $20. Datos erróneos podrían retrasar tu activación.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Activar mi Perfil de Vendedor</span>
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
