
import React, { useState, useEffect } from 'react';
import { User, UserLevel, UserStatus, Book, PaymentRecord } from '../types';
import { COLORS, ICONS, getActiveBooks, VENEZUELAN_BANKS, checkDuplicatePayment, SECURITY_ERROR_MESSAGE } from '../constants';
import { select, hierarchy, tree, linkVertical } from 'd3';
import { supabase } from '../supabase';
import { getCommissionBeneficiary, findActiveSponsor } from '../src/utils/network';

interface DashboardProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MATRIX' | 'PAYMENTS' | 'CATALOG' | 'SETTINGS'>('OVERVIEW');
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [beneficiary, setBeneficiary] = useState<Partial<User> | null>(null);

  // Real P2P Payments State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Misión Inspiradora (Video) State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("https://nxkjmndvovsnnfaypdxr.supabase.co/storage/v1/object/public/video/motivacion-1.mp4");

  // Network Stats State
  const [networkStats, setNetworkStats] = useState({
    level1: 0,
    level2: 0,
    level3: 0
  });

  // Settings form state
  const [editPayment, setEditPayment] = useState({
    bankName: user.paymentInfo?.bankName || '',
    accountNumber: user.paymentInfo?.accountNumber || '',
    phone: user.paymentInfo?.phone || '',
    idNumber: user.paymentInfo?.idNumber || '',
  });
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    fetchPayments();
    fetchNetworkStats();
    setCustomBooks(getActiveBooks());
  }, []);

  const fetchNetworkStats = async () => {
    // 1. Get Level 1 (Directs)
    const { data: level1 } = await supabase
      .from('profiles')
      .select('id')
      .eq('parent_id', user.id);

    const count1 = level1?.length || 0;
    const l1Ids = level1?.map(u => u.id) || [];

    // 2. Get Level 2
    let count2 = 0;
    let l2Ids: string[] = [];
    if (l1Ids.length > 0) {
      const { data: level2 } = await supabase
        .from('profiles')
        .select('id')
        .in('parent_id', l1Ids);
      count2 = level2?.length || 0;
      l2Ids = level2?.map(u => u.id) || [];
    }

    // 3. Get Level 3
    let count3 = 0;
    if (l2Ids.length > 0) {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .in('parent_id', l2Ids);
      count3 = count || 0;
    }

    setNetworkStats({ level1: count1, level2: count2, level3: count3 });
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        sender:profiles!sender_id(username),
        receiver:profiles!receiver_id(username)
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const formatted: PaymentRecord[] = data.map(p => ({
        id: p.id,
        senderId: p.sender?.username || 'Usuario', // Safe access
        receiverId: p.receiver?.username || 'Usuario', // Safe access
        amount: p.amount,
        status: p.status as 'PENDING' | 'CONFIRMED' | 'DISPUTED',
        receiptUrl: p.receipt_url,
        timestamp: new Date(p.created_at).getTime(),
        levelTarget: p.level_target as UserLevel
      }));
      setPayments(formatted);
    } else if (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'CONFIRMED' })
      .eq('id', paymentId);

    if (!error) {
      const payment = payments.find(p => p.id === paymentId);
      if (payment) {
        handleUpdateLevelAndStatus(payment);
        fetchPayments();
      }
    } else {
      alert('Error al confirmar pago: ' + error.message);
    }
  };

  const handleDisputePayment = async (paymentId: string) => {
    const reason = window.prompt("Indique brevemente el motivo de la disputa (ej: Comprobante falso, monto incompleto):");
    if (reason !== null) {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'DISPUTED' })
        .eq('id', paymentId);

      if (!error) {
        alert("Disputa iniciada. El sistema revisará la transacción.");
        fetchPayments();
      }
    }
  };

  // Plan level details
  const levelDetails = {
    [UserLevel.GUEST]: { levelNum: 0, name: 'Invitado', cost: 0, nextCost: 2, goal: 'Semilla', description: 'Compra tu primer paquete de eBooks por $2 para activar tu red y empezar a recibir pagos.' },
    [UserLevel.SEMILLA]: { levelNum: 1, name: 'Semilla', cost: 2, nextCost: 6, goal: 'Crecimiento', description: 'Vende a 3 personas para ganar $6. Luego desbloquea el Paquete Doble.' },
    [UserLevel.CRECIMIENTO]: { levelNum: 2, name: 'Crecimiento', cost: 6, nextCost: 20, goal: 'Cosecha', description: 'Recibe 9 pagos de $6 de tu segundo nivel ($54 totales). Luego desbloquea el Paquete Triple.' },
    [UserLevel.COSECHA]: { levelNum: 3, name: 'Cosecha', cost: 20, nextCost: 0, goal: 'Finalizado', description: 'Recibe 27 pagos de $20 de tu tercer nivel ($540 totales). ¡Felicidades, completaste la matriz!' },
  };

  const handleRestartCycle = async () => {
    if (!user.sponsorId) {
      alert("Error: No se encontró patrocinador original.");
      return;
    }

    const activeSponsorId = await findActiveSponsor(user.sponsorId);
    if (!activeSponsorId) {
      alert("Error: No se encontró un patrocinador activo en tu línea ascendente.");
      return;
    }

    // Set target for level 1 payment to restart
    const { data: sponsorProfile } = await supabase.from('profiles').select('*').eq('id', activeSponsorId).single();
    if (sponsorProfile) {
      setBeneficiary(sponsorProfile);
      setShowUpgradeModal(true);
    }
  };

  const currentDetails = levelDetails[user.level];

  const prepareUpgrade = async () => {
    const nextLevelNum = currentDetails.levelNum + 1;
    // Use the new dynamic network logic to find the beneficiary
    const beneficiaryId = await getCommissionBeneficiary(user.id, currentDetails.goal as UserLevel);

    if (beneficiaryId) {
      const { data: benProfile } = await supabase.from('profiles').select('*').eq('id', beneficiaryId).single();
      if (benProfile) {
        setBeneficiary(benProfile);
        setShowUpgradeModal(true);
      } else {
        alert("Error: No se pudo encontrar los datos del beneficiario.");
      }
    } else {
      // Should not happen if root is set up correctly, but fallback to root just in case
      console.error("No beneficiary found via matrix logic. Creating ticket...");
      alert("Error de sistema: No se encontró beneficiario. Contacta soporte.");
    }
  };

  const confirmUpgrade = async () => {
    if (!receiptFile) {
      alert('Por favor selecciona una foto de tu comprobante de pago.');
      return;
    }

    if (!beneficiary?.id) {
      alert('Beneficiario no encontrado.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, receiptFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      // 2. Create payment record
      let nextLevel = UserLevel.GUEST;
      if (user.level === UserLevel.GUEST) nextLevel = UserLevel.SEMILLA;
      else if (user.level === UserLevel.SEMILLA) nextLevel = UserLevel.CRECIMIENTO;
      else if (user.level === UserLevel.CRECIMIENTO) nextLevel = UserLevel.COSECHA;

      const { error: dbError } = await supabase.from('payments').insert([
        {
          sender_id: user.id,
          receiver_id: beneficiary.id,
          amount: currentDetails.nextCost,
          receipt_url: publicUrl,
          level_target: nextLevel,
          status: 'PENDING'
        }
      ]);

      if (dbError) throw dbError;

      // 3. Post-payment Logic: Auto-detect cycle completion or restart
      if (user.status === 'COMPLETED' && nextLevel === UserLevel.SEMILLA) {
        // User is restarting. We update their status back to ACTIVE when payment is confirmed.
        // For now, we'll wait for confirmation as usual, but we can pre-set some data.
      }

      alert('¡Pago registrado con éxito! Tu receptor debe confirmarlo para que subas de nivel.');
      setShowUpgradeModal(false);
      setReceiptFile(null);
      fetchPayments();
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert('Seleccione un video primero.');
      return;
    }

    setIsUploadingVideo(true);
    try {
      // 1. Upload new video (overwriting if possible or using a new name)
      const fileName = `motivacion-1.mp4`; // Overwrite the main video
      const { error: uploadError } = await supabase.storage
        .from('video')
        .upload(fileName, videoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('video')
        .getPublicUrl(fileName);

      // 2. Cache-busting: add a timestamp to the URL to force refresh
      const finalUrl = `${publicUrl}?t=${Date.now()}`;
      setVideoUrl(finalUrl);

      alert('¡Video motivacional actualizado con éxito! Los cambios se verán reflejados en la Landing Page.');
      setVideoFile(null);
    } catch (error: any) {
      alert('Error al subir video: ' + error.message);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleUpdateLevelAndStatus = async (payment: PaymentRecord) => {
    // This logic should ideally be in a Supabase Trigger or a central function
    // But for now we handle it here on confirmation

    let nextLevel = payment.levelTarget;
    let nextStatus = user.status;
    let nextCycle = user.cycle;
    let nextHistory = [...(user.cycleHistory || [])];

    // If confirming the 27th payment of Level 3
    if (nextLevel === UserLevel.COSECHA) {
      const { count } = await supabase
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('level_target', UserLevel.COSECHA)
        .eq('status', 'CONFIRMED');

      if ((count || 0) + 1 >= 27) {
        nextStatus = UserStatus.COMPLETED;
        nextHistory.push({
          cycle: user.cycle,
          completedAt: Date.now(),
          earnings: user.earnings + payment.amount
        });
      }
    }

    // If confirming re-entry payment (Level 1 from COMPLETED status)
    if (user.status === UserStatus.COMPLETED && nextLevel === UserLevel.SEMILLA) {
      nextStatus = UserStatus.ACTIVE;
      nextCycle = user.cycle + 1;
    }

    onUpdate({
      level: nextLevel,
      status: nextStatus,
      cycle: nextCycle,
      cycleHistory: nextHistory,
      earnings: user.earnings + payment.amount
    });
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newBooks = [...customBooks];
        newBooks[index] = { ...newBooks[index], cover: base64String, isCustom: true };
        setCustomBooks(newBooks);
        localStorage.setItem('vende_libros_custom_catalog', JSON.stringify(newBooks));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookTextUpdate = (index: number, field: 'title' | 'author', value: string) => {
    const newBooks = [...customBooks];
    newBooks[index] = { ...newBooks[index], [field]: value, isCustom: true };
    setCustomBooks(newBooks);
    localStorage.setItem('vende_libros_custom_catalog', JSON.stringify(newBooks));
  };

  const resetCatalog = () => {
    localStorage.removeItem('vende_libros_custom_catalog');
    setCustomBooks(getActiveBooks());
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const isDuplicate = checkDuplicatePayment(editPayment, user.id);
    if (isDuplicate) {
      alert(SECURITY_ERROR_MESSAGE);
      return;
    }
    setSaveStatus('SAVING');
    setTimeout(() => {
      onUpdate({ paymentInfo: editPayment });
      setSaveStatus('SUCCESS');
      setTimeout(() => setSaveStatus('IDLE'), 3000);
    }, 800);
  };

  const handleShareApp = async () => {
    const shareUrl = `https://vendelibros.app/#/auth?ref=${user.username}`;
    const shareData = {
      title: 'Vende Libros - ¡Únete a mi red!',
      text: `¡Hola! Únete a mi red en Vende Libros y empieza a ganar comisiones P2P del 100%. Regístrate usando mi código de anfitrión: ${user.username}`,
      url: shareUrl,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.error('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link de invitación copiado.');
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'PENDING' && p.receiverId === user.username);
  const disputedPayments = payments.filter(p => p.status === 'DISPUTED');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 relative">
      {/* Active Disputes Alert */}
      {disputedPayments.length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3 text-red-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="font-bold text-sm uppercase tracking-wider">Transacciones en Disputa</p>
              <p className="text-xs">Tienes {disputedPayments.length} reporte(s) bajo investigación.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('PAYMENTS')} className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200">Ver Detalles</button>
        </div>
      )}

      {/* Header Stat Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Nivel Actual</p>
          <p className="text-2xl font-bold" style={{ color: COLORS.deepBlue }}>{currentDetails.name}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Ganancias Reales</p>
          <p className="text-2xl font-bold text-emerald-600">${user.earnings}.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Red Directa</p>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{networkStats.level1} / 3</p>
            {networkStats.level1 >= 3 && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Completo</span>}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Progreso Matriz</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-1000"
              style={{ width: `${user.matrixProgress || 0}%` }}
            ></div>
          </div>
          <p className="text-right text-xs mt-2 text-gray-500 font-bold">{user.matrixProgress || 0}%</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Section */}
        <div className="flex-grow">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex border-b overflow-x-auto whitespace-nowrap">
              {['OVERVIEW', 'MATRIX', 'PAYMENTS', 'CATALOG', 'HISTORY', 'SETTINGS'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 min-w-[120px] py-4 font-bold text-sm tracking-wide transition-colors ${activeTab === tab ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab === 'OVERVIEW' ? 'PANEL' : tab === 'MATRIX' ? 'MI RED' : tab === 'PAYMENTS' ? 'PAGOS' : tab === 'CATALOG' ? 'CATÁLOGO' : tab === 'HISTORY' ? 'HISTORIAL' : 'CONFIGURACIÓN'}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'HISTORY' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Historial de Ciclos</h3>
                  {user.cycleHistory && user.cycleHistory.length > 0 ? (
                    <div className="grid gap-4">
                      {user.cycleHistory.map((record, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                              <p className="font-bold">Ciclo {record.cycle}</p>
                              <p className="text-xs text-gray-500">Finalizado el {new Date(record.completedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">+${record.earnings}</p>
                            <p className="text-[10px] text-gray-400 uppercase">Ganancia Total</p>
                          </div>
                        </div>
                      ))}
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-dashed border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-emerald-200 p-3 rounded-xl text-emerald-700 animate-pulse">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          </div>
                          <div>
                            <p className="font-bold text-emerald-800">Ciclo {user.cycle} (En curso)</p>
                            <p className="text-xs text-emerald-600">Progreso: {user.matrixProgress}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 italic">Aún estás en tu primer ciclo. ¡Completa tu nivel 3 para ver tu historial!</p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-8">
                  {/* Custom Message for Root User / Completed User */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {currentDetails.nextCost > 0 ? `Próximo Paso: ${currentDetails.goal}` : 'Estado: Fundador / Administrador'}
                        </h3>
                        <p className="opacity-90 max-w-lg">
                          {currentDetails.nextCost > 0
                            ? currentDetails.description
                            : 'Como usuario raíz, eres el punto de origen de la red. No requieres realizar pagos a niveles superiores. Tu función es administrar y expandir la comunidad.'}
                        </p>
                      </div>
                      {currentDetails.nextCost > 0 && (
                        <button
                          onClick={prepareUpgrade}
                          className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform"
                        >
                          Adquirir por ${currentDetails.nextCost}
                        </button>
                      )}
                      {user.status === 'COMPLETED' && (
                        <button
                          onClick={handleRestartCycle}
                          className="bg-white text-amber-700 font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition transform flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Reiniciar Ciclo ($2)
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold mb-4" style={{ color: COLORS.deepBlue }}>Verificar Pagos P2P</h4>
                      <div className="space-y-4">
                        {pendingPayments.length > 0 ? pendingPayments.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-emerald-700">{p.senderId.substring(0, 2).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">{p.senderId}</p>
                                <p className="text-xs text-gray-500">Monto: ${p.amount.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirmPayment(p.id)}
                                title="Confirmar Recepción"
                                className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 shadow-sm transition"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button
                                onClick={() => handleDisputePayment(p.id)}
                                title="Reportar Disputa"
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm transition"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              </button>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs text-gray-400 italic">No tienes pagos pendientes por verificar hoy.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-4" style={{ color: COLORS.deepBlue }}>Mis Libros Activos</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {customBooks.slice(0, 4).map((book) => (
                          <div key={book.id} className="bg-gray-50 p-3 rounded-xl flex items-center gap-3 border border-gray-100 overflow-hidden group hover:bg-white hover:shadow-md transition">
                            <img src={book.cover} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                            <div className="truncate">
                              <p className="text-[10px] font-bold truncate group-hover:text-emerald-700">{book.title}</p>
                              <p className="text-[8px] text-gray-500">Nivel 1</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Misión Inspiradora Management (Root/Admin Only) */}
                  {(user.email === 'josegmarin2012@gmail.com' || currentDetails.nextCost === 0) && (
                    <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-emerald-500/20 rounded-2xl">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Misión Inspiradora</h3>
                            <p className="text-emerald-300/80 text-sm">Gestiona el video motivacional de atracción para la Landing Page.</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                              <label className="block text-xs font-bold text-emerald-400 uppercase mb-2">Nuevo Video (Recomendado {'<'} 40MB)</label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 transition cursor-pointer"
                              />
                              {videoFile && (
                                <p className="mt-2 text-[10px] text-emerald-300 italic">Archivo listo: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                              )}
                            </div>
                            <button
                              onClick={handleVideoUpload}
                              disabled={isUploadingVideo || !videoFile}
                              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-white font-bold rounded-2xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                            >
                              {isUploadingVideo ? (
                                <>
                                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                  Subiendo Video...
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                  Actualizar Video de Portada
                                </>
                              )}
                            </button>
                          </div>

                          <div className="relative group aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                            <video key={videoUrl} controls className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition">
                              <source src={videoUrl} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition">
                              <span className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold">VISTA PREVIA ACTUAL</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'MATRIX' && (
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-4">Visualización de tu Red 3x3</h3>
                  <MatrixGraph userId={user.id} />
                  <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-lg">
                    <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-xs text-emerald-600 font-bold uppercase">Nivel 1</p>
                      <p className="text-lg font-black text-emerald-900">{networkStats.level1}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-bold uppercase">Nivel 2</p>
                      <p className="text-lg font-black text-blue-900">{networkStats.level2}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-xs text-purple-600 font-bold uppercase">Nivel 3</p>
                      <p className="text-lg font-black text-purple-900">{networkStats.level3}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'PAYMENTS' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Historial y Disputas</h3>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">● Pagado</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">● Disputa</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-gray-500 uppercase text-[10px] font-bold">
                          <th className="py-3 px-2">ID Transacción</th>
                          <th className="py-3 px-2">Usuario</th>
                          <th className="py-3 px-2">Monto</th>
                          <th className="py-3 px-2">Fecha</th>
                          <th className="py-3 px-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map(p => (
                          <tr key={p.id} className={`border-b hover:bg-gray-50 transition ${p.status === 'DISPUTED' ? 'bg-red-50/50' : ''}`}>
                            <td className="py-4 px-2 font-mono text-[10px]">{p.id}</td>
                            <td className="py-4 px-2">{p.senderId}</td>
                            <td className="py-4 px-2 font-bold">${p.amount.toFixed(2)}</td>
                            <td className="py-4 px-2 text-[10px] text-gray-400">{new Date(p.timestamp).toLocaleDateString()}</td>
                            <td className="py-4 px-2">
                              {p.status === 'CONFIRMED' && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">Confirmado</span>}
                              {p.status === 'PENDING' && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">Pendiente</span>}
                              {p.status === 'DISPUTED' && (
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">En Disputa</span>
                                  <button title="Ayuda" className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'CATALOG' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">Administrar Títulos</h3>
                      <p className="text-sm text-gray-500">Sube tus propias imágenes y edita los títulos.</p>
                    </div>
                    <button onClick={resetCatalog} className="text-red-600 text-sm font-bold hover:underline">Resetear</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {customBooks.map((book, idx) => (
                      <div key={book.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex gap-4">
                        <div className="relative group w-24 h-36 flex-shrink-0">
                          <img src={book.cover} className="w-full h-full object-cover rounded-lg shadow-md" alt="" />
                          <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-lg text-white text-xs font-bold text-center p-2">
                            CAMBIAR PORTADA
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(idx, e)} />
                          </label>
                        </div>
                        <div className="flex-grow space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Título del Libro</label>
                            <input
                              type="text"
                              value={book.title}
                              onChange={(e) => handleBookTextUpdate(idx, 'title', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Autor</label>
                            <input
                              type="text"
                              value={book.author}
                              onChange={(e) => handleBookTextUpdate(idx, 'author', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'SETTINGS' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">Datos de Cobro</h3>
                    <p className="text-sm text-gray-500">Corrige cualquier error en tu información de pago.</p>
                  </div>

                  <form onSubmit={handleUpdateSettings} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="col-span-full md:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Banco / Método de Pago</label>
                        <select
                          required
                          value={editPayment.bankName}
                          onChange={(e) => setEditPayment({ ...editPayment, bankName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all appearance-none cursor-pointer"
                        >
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
                          value={editPayment.idNumber}
                          onChange={(e) => setEditPayment({ ...editPayment, idNumber: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
                        />
                      </div>

                      <div className="col-span-full md:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Teléfono (Pago Móvil)</label>
                        <input
                          type="tel"
                          required
                          value={editPayment.phone}
                          onChange={(e) => setEditPayment({ ...editPayment, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
                        />
                      </div>

                      <div className="col-span-full md:col-span-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Número de Cuenta o Email</label>
                        <input
                          type="text"
                          required
                          value={editPayment.accountNumber}
                          onChange={(e) => setEditPayment({ ...editPayment, accountNumber: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={saveStatus === 'SAVING'}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center gap-2 ${saveStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                      >
                        {saveStatus === 'SAVING' ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Guardando...
                          </span>
                        ) : saveStatus === 'SUCCESS' ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            ¡Datos Actualizados!
                          </>
                        ) : (
                          'Guardar Cambios'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h4 className="font-bold mb-4" style={{ color: COLORS.deepBlue }}>Link de Referencia</h4>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 break-all text-xs font-mono mb-4 text-emerald-700">
              https://vendelibros.app/#/auth?ref={user.username}
            </div>
            <div className="space-y-3">
              <button
                onClick={handleShareApp}
                className="w-full bg-emerald-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Compartir App
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h4 className="font-bold mb-4" style={{ color: COLORS.deepBlue }}>Mi Patrocinador</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                {user.sponsorId?.[0].toUpperCase() || 'V'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold truncate text-gray-800">{user.sponsorId || 'josegmarin2012@gmail.com'}</p>
                <p className="text-[10px] text-gray-500 uppercase">Patrocinador Directo</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-2">💡 Seguridad P2P</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              "Nunca confirmes un pago sin haber revisado tu banco. Una vez confirmado, el sistema desbloqueará el contenido automáticamente."
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade P2P Modal */}
      {showUpgradeModal && beneficiary && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-emerald-600 p-6 text-white text-center">
              <h3 className="text-xl font-bold">Instrucciones de Pago Directo</h3>
              <p className="text-xs opacity-90">Estás adquiriendo el Paquete de Nivel {currentDetails.levelNum + 1}</p>
            </div>

            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm mb-2">Debes enviar exactamente</p>
                <p className="text-4xl font-black text-emerald-600">${currentDetails.nextCost}.00</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Beneficiario</span>
                  <span className="text-sm font-bold text-gray-800">{beneficiary.username}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Datos de Pago</p>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed">
                    <strong>Banco:</strong> {beneficiary.paymentInfo?.bankName}<br />
                    <strong>Cuenta/Email:</strong> {beneficiary.paymentInfo?.accountNumber}<br />
                    <strong>Teléfono:</strong> {beneficiary.paymentInfo?.phone}<br />
                    <strong>RIF/CI:</strong> {beneficiary.paymentInfo?.idNumber}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-start gap-4 mb-8">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-emerald-800 mb-1">Sube la foto del comprobante *</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="text-[10px] text-emerald-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmUpgrade}
                  disabled={isUploading}
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition transform active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Subiendo...
                    </>
                  ) : 'Ya realicé el pago, Confirmar'}
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  disabled={isUploading}
                  className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MatrixGraph: React.FC<{ userId: string }> = ({ userId }) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !userId) return;

    const fetchTree = async () => {
      // Fetch self and children (2 levels deep for visualization)
      // Level 0: Self
      // Level 1: Children
      // Level 2: Grandchildren

      const { data: allDescendants, error } = await supabase
        .from('profiles')
        .select('id, username, parent_id')
        .or(`parent_id.eq.${userId}`); // Get direct children first

      // Real recursive fetch is complex in client-side SQL, so we'll do a simple 2-level fetch
      // 1. Get Children
      const { data: children } = await supabase.from('profiles').select('id, username, parent_id').eq('parent_id', userId);

      if (!children) return;

      // 2. Get Grandchildren
      const childrenIds = children.map(c => c.id);
      let grandchildren: any[] = [];
      if (childrenIds.length > 0) {
        const { data: grand } = await supabase.from('profiles').select('id, username, parent_id').in('parent_id', childrenIds);
        if (grand) grandchildren = grand;
      }

      const rootNode = {
        name: 'Tú',
        id: userId,
        children: children.map(child => ({
          name: child.username,
          id: child.id,
          children: grandchildren.filter(g => g.parent_id === child.id).map(g => ({
            name: g.username,
            id: g.id
          }))
        }))
      };

      renderTree(rootNode);
    };

    fetchTree();
  }, [userId]);

  const renderTree = (data: any) => {
    if (!svgRef.current) return;
    const width = 400;
    const height = 300;
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const root = hierarchy(data);
    const treeLayout = tree<any>().size([width - 40, height - 80]);
    treeLayout(root);

    const g = svg.append('g').attr('transform', 'translate(20, 40)');

    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', linkVertical().x((d: any) => d.x).y((d: any) => d.y) as any)
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 2);

    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    nodes.append('circle')
      .attr('r', 10)
      .attr('fill', (d: any) => d.depth === 0 ? COLORS.emeraldGreen : d.depth === 1 ? COLORS.deepBlue : '#cbd5e1')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    nodes.append('text')
      .attr('dy', (d: any) => d.depth === 0 ? -15 : 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', '#475569')
      .text((d: any) => d.data.name);
  };

  return <svg ref={svgRef} width="400" height="300" className="max-w-full bg-gray-50/50 rounded-2xl"></svg>;
};

export default Dashboard;
