
import React from 'react';
import { Book, User } from './types';

export const COLORS = {
  deepBlue: '#002B5B',
  emeraldGreen: '#50C878',
  white: '#FFFFFF',
};

export const ROOT_USER_EMAIL = 'josegmarin2012@gmail.com';
export const ROOT_USER_ID = 'usr_root_001';

// Seguridad: Mensaje de infracción
export const SECURITY_ERROR_MESSAGE = "ALERTA DE SEGURIDAD: Los datos de pago ingresados ya están vinculados a otra cuenta activa. Queda terminantemente prohibido el uso de una misma cuenta bancaria, pago móvil o billetera digital en más de una cuenta de usuario. El sistema ha detectado este intento de duplicidad y la operación ha sido bloqueada para prevenir la suspensión de las cuentas involucradas.";

export const VENEZUELAN_BANKS = [
  "BANESCO BANCO UNIVERSAL S.A.C.A.",
  "100% BANCO, BANCO UNIVERSAL C.A.",
  "BANCAMIGA BANCO UNIVERSAL, C.A.",
  "BANCARIBE C.A. BANCO UNIVERSAL",
  "BANCO ACTIVO",
  "BANCO CARONI C.A. BANCO UNIVERSAL",
  "BANCO DE LA FANB",
  "BANCO DE LA GENTE EMPRENDEDORA C.A.",
  "BANCO DE VENEZUELA",
  "BANCO DEL TESORO",
  "BANCO DIGITAL DE LOS TRABAJADORES",
  "BANCO DIGITAL N58",
  "BANCO EXTERIOR C.A. BANCO UNIVERSAL",
  "BANCO MERCANTIL",
  "BANCO NACIONAL DE CREDITO",
  "BANCO PLAZA, BANCO UNIVERSAL",
  "BANCO PROVINCIAL",
  "BANCO SOFITASA",
  "BANCRECER, S.A. BANCO MICROFINANCIERO",
  "BANPLUS BANCO UNIVERSAL, C.A.",
  "BFC BANCO FONDO COMUN",
  "DEL SUR BANCO UNIVERSAL C.A.",
  "INSTITUTO MUNICIPAL DE CREDITO POPULAR",
  "R4, BANCO MICROFINANCIERO, C.A",
  "VENEZOLANO DE CREDITO",
  "ZELLE",
  "BINANCE / USDT",
  "OTRO (Especificar en cuenta)"
];

export const GIFT_BOOKS: Book[] = [
  {
    id: 'gift_1',
    title: 'Venta directa y mercadeo multinivel',
    author: 'Estrategias de Red',
    cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800',
    isLocked: false
  },
  {
    id: 'gift_2',
    title: 'Aprende a vender paso a paso',
    author: 'Guía Práctica',
    cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800',
    isLocked: false
  },
  {
    id: 'gift_3',
    title: 'Neuroselling',
    author: 'Psicología de Ventas',
    cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800',
    isLocked: false
  }
];

const DEFAULT_BOOKS: Book[] = [
  { id: '1', title: 'Relatos de mi pueblo', author: 'Tradición Popular', cover: 'https://picsum.photos/seed/pueblo/400/600', isLocked: true },
  { id: '2', title: 'Pulgarcito', author: 'Charles Perrault', cover: 'https://picsum.photos/seed/thumb/400/600', isLocked: true },
  { id: '3', title: 'Las hadas', author: 'Charles Perrault', cover: 'https://picsum.photos/seed/fairies/400/600', isLocked: true },
  { id: '4', title: 'Las habichuelas mágicas', author: 'Hans Christian Andersen', cover: 'https://picsum.photos/seed/beans/400/600', isLocked: true },
  { id: '5', title: 'La Sirenita', author: 'Hans Christian Andersen', cover: 'https://picsum.photos/seed/mermaid/400/600', isLocked: true },
  { id: '6', title: 'La pobre viejecita', author: 'Rafael Pombo', cover: 'https://picsum.photos/seed/viejecita/400/600', isLocked: true },
  { id: '7', title: 'La nube de lluvia', author: 'Tradición Oral', cover: 'https://picsum.photos/seed/raincloud/400/600', isLocked: true },
  { id: '8', title: 'La bella durmiente', author: 'Charles Perrault', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800', isLocked: true },
  { id: '9', title: 'El fantasma de Canterville', author: 'Oscar Wilde', cover: 'https://picsum.photos/seed/ghost/400/600', isLocked: true },
  { id: '10', title: 'Fábulas de Jean de la Fontaine', author: 'Jean de la Fontaine', cover: 'https://picsum.photos/seed/fontaine/400/600', isLocked: true },
  { id: '11', title: 'Fábulas de Esopo', author: 'Esopo', cover: 'https://picsum.photos/seed/aesop/400/600', isLocked: true },
  { id: '12', title: 'El traje nuevo del emperador', author: 'Hans Christian Andersen', cover: 'https://picsum.photos/seed/emperor/400/600', isLocked: true },
  { id: '13', title: 'El ruiseñor y la rosa', author: 'Oscar Wilde', cover: 'https://picsum.photos/seed/nightingale/400/600', isLocked: true },
  { id: '14', title: 'El Principito', author: 'Antoine de Saint-Exupéry', cover: 'https://images.unsplash.com/photo-1510172951991-859a697113ac?q=80&w=800', isLocked: true },
  { id: '15', title: 'El príncipe Rana', author: 'Hermanos Grimm', cover: 'https://picsum.photos/seed/frogprince/400/600', isLocked: true },
  { id: '16', title: 'El príncipe feliz', author: 'Oscar Wilde', cover: 'https://picsum.photos/seed/happyprince/400/600', isLocked: true },
  { id: '17', title: 'El pica pedrero', author: 'Tradición Oriental', cover: 'https://picsum.photos/seed/stonemason/400/600', isLocked: true },
  { id: '18', title: 'El patito feo', author: 'Hans Christian Andersen', cover: 'https://picsum.photos/seed/duckling/400/600', isLocked: true },
  { id: '19', title: 'El origen del mal', author: 'León Tolstói', cover: 'https://picsum.photos/seed/evilorigin/400/600', isLocked: true },
  { id: '20', title: 'El maravilloso Mago de Oz', author: 'L. Frank Baum', cover: 'https://picsum.photos/seed/oz/400/600', isLocked: true },
  { id: '21', title: 'El intrépido soldadito de plomo', author: 'Hans Christian Andersen', cover: 'https://picsum.photos/seed/tin-soldier/400/600', isLocked: true },
  { id: '22', title: 'El gigante egoísta', author: 'Oscar Wilde', cover: 'https://picsum.photos/seed/giant/400/600', isLocked: true },
  { id: '23', title: 'El gato con botas', author: 'Charles Perrault', cover: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800', isLocked: true },
  { id: '24', title: 'A Margarita Debayle', author: 'Rubén Darío', cover: 'https://picsum.photos/seed/debayle/400/600', isLocked: true },
  { id: '25', title: 'El cohete extraordinario', author: 'Oscar Wilde', cover: 'https://picsum.photos/seed/rocket/400/600', isLocked: true },
  { id: '26', title: 'Cenicienta', author: 'Charles Perrault', cover: 'https://picsum.photos/seed/cinderella/400/600', isLocked: true },
  { id: '27', title: 'Caperucita Roja', author: 'Charles Perrault', cover: 'https://picsum.photos/seed/redriding/400/600', isLocked: true },
  { id: '28', title: 'La camisa del hombre feliz', author: 'León Tolstói', cover: 'https://picsum.photos/seed/happyman/400/600', isLocked: true },
  { id: '29', title: 'Barba azul', author: 'Charles Perrault', cover: 'https://picsum.photos/seed/bluebeard/400/600', isLocked: true },
  { id: '30', title: 'Las aventuras de Pinocho', author: 'Carlo Collodi', cover: 'https://picsum.photos/seed/pinocchio/400/600', isLocked: true },
];

export const getActiveBooks = (): Book[] => {
  const saved = localStorage.getItem('vende_libros_custom_catalog');
  if (saved) {
    try {
      const custom = JSON.parse(saved) as Book[];
      if (custom.length > 0) return custom;
    } catch (e) {
      console.error("Error loading custom books", e);
    }
  }
  return DEFAULT_BOOKS;
};

// Verifica si existen datos de pago duplicados en la base de datos simulada
export const checkDuplicatePayment = (
  paymentData: { idNumber: string; phone: string; accountNumber: string },
  currentUserId: string
): boolean => {
  const allUsersStr = localStorage.getItem('vende_libros_all_users') || '[]';
  const allUsers: User[] = JSON.parse(allUsersStr);

  return allUsers.some(user => {
    // Solo comparar con otros usuarios
    if (user.id === currentUserId) return false;
    if (!user.paymentInfo) return false;

    return (
      user.paymentInfo.idNumber === paymentData.idNumber ||
      user.paymentInfo.phone === paymentData.phone ||
      user.paymentInfo.accountNumber === paymentData.accountNumber
    );
  });
};

// Logic to find beneficiary in the P2P tree
export const getBeneficiaryForLevel = (user: User, targetLevel: number): Partial<User> => {
  const rootUser: Partial<User> = {
    id: ROOT_USER_ID,
    username: 'Fundador (Nodo 0)',
    email: ROOT_USER_EMAIL,
    paymentInfo: {
      bankName: 'BANCO DE VENEZUELA',
      accountNumber: 'josegmarin2012@gmail.com',
      phone: '+58 412-0000000',
      idNumber: 'MASTER-001'
    }
  };

  if (!user.sponsorId || user.sponsorId === ROOT_USER_ID) return rootUser;
  return rootUser; 
};

export const ICONS = {
  Book: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Trend: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Users: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Cloud: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
};
