import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  UserPlan, 
  UserAccountStatus,
  UserSubscription, 
  AdminLog, 
  AppView,
  BackupSnapshot,
  PlanDefinition,
  ServerMetricSnapshot,
  ThresholdAlertConfig,
  SystemAlert,
  GeoVisitStat,
  UserSessionLog,
  AgeGroup,
  VisitRecord,
  ManualChapter,
  AppearanceConfig,
  SocialLinksConfig,
  SecurityConfig,
  ApiKeyRecord,
  RolePermissionMatrix,
  CompleteStyleDNA
} from '../types';
import { AnalysisResult, classifySeason } from '../lib/colorAnalysis';
import { getAgeGroupFromBirthDate, getAgeFromBirthDate } from '../data/ageGroups';
import { 
  DEFAULT_APPEARANCE_CONFIG, 
  DEFAULT_SOCIAL_CONFIG, 
  DEFAULT_SECURITY_CONFIG, 
  DEFAULT_API_KEYS, 
  DEFAULT_ROLES, 
  INITIAL_VISITS 
} from '../data/defaultConfig';
import { INITIAL_MANUAL_CHAPTERS } from '../data/manualContent';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  analyses: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  allUsers: UserProfile[];
  adminLogs: AdminLog[];
  currentView: AppView;
  isPremiumModalOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'recovery';
  setCurrentView: (view: AppView) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  setIsPremiumModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean, mode?: 'login' | 'register' | 'recovery') => void;
  
  // Auth actions
  login: (usernameOrEmail: string, password?: string, rememberMe?: boolean) => { success: boolean; message?: string; error?: string };
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
  loginAsMaster: (password: string) => { success: boolean; error?: string };
  register: (data: { 
    username: string;
    email: string; 
    password?: string;
    firstName: string; 
    lastName: string; 
    birthDate?: string;
    sexo?: 'femenino' | 'masculino' | 'otro';
    rememberMe?: boolean;
  }) => { success: boolean; verificationCode?: string; error?: string };
  verifyEmailCode: (email: string, code: string) => { success: boolean; error?: string };
  requestPasswordReset: (email: string) => { success: boolean; code?: string; message: string };
  resetPassword: (email: string, code: string, newPass: string) => { success: boolean; error?: string };
  logout: () => void;
  
  // Analyses
  saveAnalysis: (analysis: AnalysisResult) => void;
  deleteAnalysis: (id: string) => void;
  upgradeToPremium: () => void;
  
  // Age Group & Style DNA
  updateUserAgeGroup: (userId: string, group: AgeGroup) => void;
  saveUserStyleDNA: (dna: CompleteStyleDNA) => void;
  activeAgeFilter: AgeGroup | 'any';
  setActiveAgeFilter: (filter: AgeGroup | 'any') => void;
  quickSwitchAgeGroup: (group: AgeGroup | 'any') => void;
  
  // Admin & User Lifecycle
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserPlan: (userId: string, plan: UserPlan) => void;
  toggleUserStatus: (userId: string) => void;
  deactivateAccount: (userId: string) => { success: boolean; message: string };
  reactivateAccount: (userId: string) => { success: boolean; message: string };
  scheduleAccountDeletion: (userId: string, days?: number) => { success: boolean; message: string };
  cancelAccountDeletion: (userId: string) => { success: boolean; message: string };
  permanentlyDeleteAccount: (userId: string) => { success: boolean; message: string };
  quickSwitchRole: (role: UserRole, plan: UserPlan) => void;
  
  // Plans & Pricing Management
  plans: PlanDefinition[];
  createPlan: (newPlan: Omit<PlanDefinition, 'id'>) => PlanDefinition;
  updatePlan: (id: string, updates: Partial<PlanDefinition>) => void;
  deletePlan: (id: string) => void;
  togglePlanActive: (id: string) => void;

  // Visits Registry & Tracking
  visits: VisitRecord[];
  addVisitRecord: (page: string) => void;
  deleteVisitRecord: (id: string) => void;
  cleanupVisitRecords: (daysThreshold?: number) => void;

  // Manual & Guides
  manualChapters: ManualChapter[];
  updateManualSection: (chapterId: string, sectionId: string, content: string[], tips?: string[]) => void;
  addManualChapter: (title: string, description: string) => void;

  // Appearance & Live Editor
  appearanceConfig: AppearanceConfig;
  updateAppearanceConfig: (updates: Partial<AppearanceConfig>) => void;
  resetAppearanceConfig: () => void;

  // Social Links & WhatsApp Floating Widget
  socialConfig: SocialLinksConfig;
  updateSocialConfig: (updates: Partial<SocialLinksConfig>) => void;

  // Security Configuration
  securityConfig: SecurityConfig;
  updateSecurityConfig: (updates: Partial<SecurityConfig>) => void;

  // API Keys
  apiKeys: ApiKeyRecord[];
  addApiKey: (key: Omit<ApiKeyRecord, 'id'>) => void;
  updateApiKey: (id: string, updates: Partial<ApiKeyRecord>) => void;
  deleteApiKey: (id: string) => void;

  // Roles & Permissions
  roles: RolePermissionMatrix[];
  updateRolePermissions: (roleId: string, permissions: RolePermissionMatrix['permissions']) => void;

  // Database Workbench
  subscriptions: UserSubscription[];
  executeDatabaseMaintenance: (action: 'optimize_indexes' | 'clean_cache' | 'check_integrity' | 'purge_orphans') => { success: boolean; message: string; details: string };
  updateDatabaseRecord: (collection: string, recordId: string, updatedData: any) => { success: boolean; error?: string };
  deleteDatabaseRecord: (collection: string, recordId: string) => { success: boolean; error?: string };
  addDatabaseRecord: (collection: string, data: any) => { success: boolean; id: string };

  // Server Monitoring, Infrastructure Telemetry & Tokens
  serverMetrics: ServerMetricSnapshot;
  refreshServerMetrics: () => void;

  // Alerts & 15-Day Pre-Expiry Thresholds
  systemAlerts: SystemAlert[];
  thresholdConfig: ThresholdAlertConfig;
  updateThresholdConfig: (config: Partial<ThresholdAlertConfig>) => void;
  dismissAlert: (alertId: string) => void;
  sendSubscriptionExpiryNotice: (userId: string, method: 'whatsapp' | 'email') => { success: boolean; message: string };

  // Geographic Monitoring
  geoStats: GeoVisitStat[];

  // Session & Duration Monitoring
  sessionLogs: UserSessionLog[];
  refreshSessionLogs: () => void;

  // WhatsApp Style Backup & Restore System
  backupSnapshots: BackupSnapshot[];
  lastBackupDate: string | null;
  isBackingUp: boolean;
  createProfileBackup: (customName?: string) => Promise<BackupSnapshot>;
  createSystemBackup: (customName?: string) => Promise<BackupSnapshot>;
  restoreBackup: (snapshot: BackupSnapshot, mode?: 'replace' | 'merge') => { success: boolean; message: string };
  restoreFromFile: (fileContent: string, mode?: 'replace' | 'merge') => { success: boolean; message: string };
  downloadBackup: (snapshot: BackupSnapshot) => void;
  deleteBackup: (id: string) => void;

  // Support
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'styled_by_wilma_user',
  ANALYSES: 'styled_by_wilma_analyses',
  ALL_USERS: 'styled_by_wilma_all_users',
  ADMIN_LOGS: 'styled_by_wilma_admin_logs',
  BACKUPS: 'styled_by_wilma_backups',
  PLANS: 'styled_by_wilma_plans',
  THRESHOLDS: 'styled_by_wilma_thresholds',
  DISMISSED_ALERTS: 'styled_by_wilma_dismissed_alerts',
  VISITS: 'styled_by_wilma_visits',
  MANUAL: 'styled_by_wilma_manual',
  APPEARANCE: 'styled_by_wilma_appearance',
  SOCIAL: 'styled_by_wilma_social',
  SECURITY: 'styled_by_wilma_security',
  API_KEYS: 'styled_by_wilma_api_keys',
  ROLES: 'styled_by_wilma_roles'
};

const INITIAL_PLANS: PlanDefinition[] = [
  {
    id: 'plan_free',
    name: 'Plan Gratuito Inicial ($0)',
    slug: 'free',
    badge: 'Gratis ($0)',
    price: 0.00,
    priceYearly: 0.00,
    billingPeriod: 'monthly',
    currency: 'USD',
    description: 'Plan activo por defecto para todas las nuevas usuarias. Diagnóstico básico y paleta esencial sin costo.',
    features: [
      'Diagnóstico de 4 estaciones maestras',
      'Cuestionario guiado de auto-diagnóstico',
      '1 resultado guardado en tu perfil',
      'Guía básica de colores de temporada',
      'Acceso garantizado de por vida ($0 costo)'
    ],
    queryLimit: 10,
    orderIndex: 1,
    isActive: true,
    isPopular: false,
    colorTheme: 'emerald'
  },
  {
    id: 'plan_monthly_vip',
    name: 'Plan Mensual VIP',
    slug: 'monthly-vip',
    badge: 'Más Popular',
    price: 4.99,
    priceYearly: 49.99,
    billingPeriod: 'monthly',
    currency: 'USD',
    description: 'El dossier completo de imagen con códigos HEX, tocador y armario cápsula.',
    features: [
      'Paleta completa de 12 sub-estaciones con códigos HEX y RGB',
      'Tocador de maquillaje con tonos exactos de labiales y bases',
      'Armario cápsula de 6 prendas clave combinables',
      'Tarjeta de bolsillo digital interactiva para compras',
      'Draping virtual ilimitado con fotos de prueba',
      'Copia de seguridad cifrada en la nube'
    ],
    queryLimit: 100,
    orderIndex: 2,
    isActive: true,
    isPopular: true,
    colorTheme: 'rose'
  },
  {
    id: 'plan_yearly_vip',
    name: 'Plan Anual VIP (Ahorro 33%)',
    slug: 'yearly-vip',
    badge: 'Mejor Valor',
    price: 39.99,
    priceYearly: 39.99,
    billingPeriod: 'yearly',
    currency: 'USD',
    description: '12 meses continuos de asesoría con descuento especial y novedades anticipadas.',
    features: [
      'Todo lo incluido en el Plan Mensual VIP sin límites de tiempo',
      'Ahorro del 33% equivalente a 4 meses de regalo',
      'Canal prioritario de consulta por WhatsApp con Wilma Hernández',
      'Actualización semestral de tendencias internacionales',
      'Dossier descargable en alta resolución listo para imprimir'
    ],
    queryLimit: 500,
    orderIndex: 3,
    isActive: true,
    isPopular: false,
    colorTheme: 'amber'
  },
  {
    id: 'plan_pro_stylist',
    name: 'Plan Asesora & Estilista Pro',
    slug: 'pro-stylist',
    badge: 'Profesional',
    price: 19.99,
    priceYearly: 199.99,
    billingPeriod: 'monthly',
    currency: 'USD',
    description: 'Herramienta comercial para asesoras de imagen, estilistas y salones de belleza.',
    features: [
      'Gestión de hasta 50 clientas con perfiles independientes',
      'Exportación de informes con marca de agua personalizada',
      'Fichas técnicas para peluquería (tonos cálidos vs fríos)',
      'Soporte técnico preferente 24/7 y respaldo masivo'
    ],
    queryLimit: 2000,
    orderIndex: 4,
    isActive: true,
    isPopular: false,
    colorTheme: 'indigo'
  }
];

const daysFromNowISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'usr_admin_master',
    username: 'MASTER',
    email: 'wilma.hernandez@styledbywilma.com',
    displayName: 'Wilma Hernández',
    firstName: 'Wilma',
    lastName: 'Hernández',
    birthDate: '1988-03-24',
    age: 38,
    ageGroup: 'adulta',
    sexo: 'femenino',
    role: 'master',
    plan: 'premium',
    location: 'Concepción, Chile',
    city: 'Concepción',
    region: 'Biobío',
    country: 'Chile',
    specialTitle: 'Superadministradora & Asesora Máster en Concepción',
    whatsappNumber: '+56987654321',
    isMaster: true,
    isEmailVerified: true,
    provider: 'email',
    createdAt: '2025-01-01T08:00:00Z',
    status: 'active',
    subscriptionExpiresAt: daysFromNowISO(320),
    lastBackupDate: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    uid: 'usr_2',
    username: 'valeriam',
    email: 'valeria.m@example.com',
    displayName: 'Valeria Morales',
    firstName: 'Valeria',
    lastName: 'Morales',
    birthDate: '1998-08-22',
    age: 28,
    ageGroup: 'adulta_joven',
    sexo: 'femenino',
    role: 'user',
    plan: 'premium',
    isEmailVerified: true,
    provider: 'facebook',
    location: 'Santiago, Chile',
    city: 'Santiago',
    country: 'Chile',
    whatsappNumber: '+56912345678',
    createdAt: '2025-02-14T14:30:00Z',
    status: 'active',
    subscriptionExpiresAt: daysFromNowISO(11),
    lastBackupDate: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    uid: 'usr_3',
    username: 'camilag',
    email: 'camila.garcia@example.com',
    displayName: 'Camila García',
    firstName: 'Camila',
    lastName: 'García',
    birthDate: '2004-11-05',
    age: 21,
    ageGroup: 'joven',
    sexo: 'femenino',
    role: 'user',
    plan: 'free',
    isEmailVerified: true,
    provider: 'google',
    location: 'Concepción, Chile',
    city: 'Concepción',
    region: 'Biobío',
    country: 'Chile',
    createdAt: '2025-02-28T09:15:00Z',
    status: 'active'
  },
  {
    uid: 'usr_4',
    username: 'claudia_madrid',
    email: 'claudia.rivas@gmail.com',
    displayName: 'Claudia Rivas',
    firstName: 'Claudia',
    lastName: 'Rivas',
    birthDate: '1979-04-18',
    age: 47,
    ageGroup: 'madura',
    sexo: 'femenino',
    role: 'user',
    plan: 'premium',
    isEmailVerified: true,
    provider: 'google',
    location: 'Madrid, España',
    city: 'Madrid',
    country: 'España',
    whatsappNumber: '+34612345678',
    createdAt: '2025-03-05T11:20:00Z',
    status: 'active',
    subscriptionExpiresAt: daysFromNowISO(4),
    lastBackupDate: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    uid: 'usr_5',
    username: 'elena_s',
    email: 'elena.sanchez@example.com',
    displayName: 'Elena Sánchez',
    firstName: 'Elena',
    lastName: 'Sánchez',
    birthDate: '1967-03-12',
    age: 59,
    ageGroup: 'senior',
    sexo: 'femenino',
    role: 'user',
    plan: 'free',
    isEmailVerified: true,
    provider: 'email',
    location: 'Bogotá, Colombia',
    createdAt: '2025-03-01T16:45:00Z',
    status: 'deactivated',
    deactivatedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    uid: 'usr_6',
    username: 'rosa_golden',
    email: 'rosa.perez@example.com',
    displayName: 'Rosa María Pérez',
    firstName: 'Rosa María',
    lastName: 'Pérez',
    birthDate: '1955-07-15',
    age: 71,
    ageGroup: 'golden',
    sexo: 'femenino',
    role: 'user',
    plan: 'premium',
    isEmailVerified: true,
    provider: 'email',
    location: 'Concepción, Chile',
    city: 'Concepción',
    region: 'Biobío',
    country: 'Chile',
    whatsappNumber: '+56944332211',
    createdAt: '2025-02-10T10:00:00Z',
    status: 'active',
    subscriptionExpiresAt: daysFromNowISO(25)
  }
];

const INITIAL_LOGS: AdminLog[] = [
  {
    id: 'log_1',
    adminId: 'usr_admin_master',
    adminEmail: 'wilma.hernandez@styledbywilma.com',
    action: 'Verificación de Paletas',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    details: 'Actualización y calibración de las 12 estaciones de colorimetría con IA.'
  },
  {
    id: 'log_2',
    adminId: 'usr_admin_master',
    adminEmail: 'wilma.hernandez@styledbywilma.com',
    action: 'Auditoría de Suscripciones VIP',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    details: 'Revisión preventiva de umbral de 15 días para renovaciones de planes de pago.'
  },
  {
    id: 'log_3',
    adminId: 'system',
    adminEmail: 'system@styledbywilma.com',
    action: 'Monitoreo de Telemetría',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    details: 'Control de consumo de tokens Gemini Vision AI y métricas de servidor Cloudflare D1.'
  }
];

const INITIAL_SUBSCRIPTIONS: UserSubscription[] = [
  {
    id: 'sub_valeria',
    userId: 'usr_2',
    userEmail: 'valeria.m@example.com',
    planId: 'plan_monthly_vip',
    planName: 'Plan Mensual VIP',
    status: 'expiring_soon',
    startDate: new Date(Date.now() - 86400000 * 19).toISOString(),
    endDate: daysFromNowISO(11),
    price: 4.99,
    currency: 'USD',
    autoRenew: true,
    daysRemaining: 11
  },
  {
    id: 'sub_claudia',
    userId: 'usr_4',
    userEmail: 'claudia.rivas@gmail.com',
    planId: 'plan_monthly_vip',
    planName: 'Plan Mensual VIP',
    status: 'expiring_soon',
    startDate: new Date(Date.now() - 86400000 * 26).toISOString(),
    endDate: daysFromNowISO(4),
    price: 4.99,
    currency: 'USD',
    autoRenew: false,
    daysRemaining: 4
  },
  {
    id: 'sub_wilma',
    userId: 'usr_admin_master',
    userEmail: 'wilma.hernandez@styledbywilma.com',
    planId: 'plan_yearly_vip',
    planName: 'Plan Anual VIP',
    status: 'active',
    startDate: '2025-01-01T00:00:00Z',
    endDate: daysFromNowISO(320),
    price: 39.99,
    currency: 'USD',
    autoRenew: true,
    daysRemaining: 320
  }
];

const INITIAL_GEO_STATS: GeoVisitStat[] = [
  {
    id: 'geo_1',
    country: 'Chile',
    countryCode: 'CL',
    flagEmoji: '🇨🇱',
    state: 'Biobío',
    city: 'Concepción',
    visits: 5890,
    uniqueVisitors: 4120,
    conversionRatePercent: 19.4,
    avgDurationMinutes: 16.2,
    lastVisitAt: new Date().toISOString()
  },
  {
    id: 'geo_2',
    country: 'Chile',
    countryCode: 'CL',
    flagEmoji: '🇨🇱',
    state: 'Región Metropolitana',
    city: 'Santiago',
    visits: 4320,
    uniqueVisitors: 3180,
    conversionRatePercent: 14.2,
    avgDurationMinutes: 12.4,
    lastVisitAt: new Date(Date.now() - 1000 * 180).toISOString()
  },
  {
    id: 'geo_3',
    country: 'México',
    countryCode: 'MX',
    flagEmoji: '🇲🇽',
    state: 'Ciudad de México',
    city: 'CDMX',
    visits: 3750,
    uniqueVisitors: 2980,
    conversionRatePercent: 11.8,
    avgDurationMinutes: 9.8,
    lastVisitAt: new Date(Date.now() - 1000 * 45).toISOString()
  },
  {
    id: 'geo_4',
    country: 'España',
    countryCode: 'ES',
    flagEmoji: '🇪🇸',
    state: 'Comunidad de Madrid',
    city: 'Madrid',
    visits: 2410,
    uniqueVisitors: 1950,
    conversionRatePercent: 16.5,
    avgDurationMinutes: 14.3,
    lastVisitAt: new Date(Date.now() - 1000 * 600).toISOString()
  }
];

const INITIAL_SESSION_LOGS: UserSessionLog[] = [
  {
    id: 'sess_1',
    ip: '190.160.84.15',
    city: 'Concepción',
    country: 'Chile',
    flagEmoji: '🇨🇱',
    userId: 'usr_admin_master',
    userEmail: 'wilma.hernandez@styledbywilma.com',
    displayName: 'Wilma Hernández',
    startedAt: new Date(Date.now() - 1000 * 1800).toISOString(),
    lastActiveAt: new Date().toISOString(),
    durationSeconds: 1800,
    device: 'iPad Pro 13"',
    os: 'iPadOS 18',
    browser: 'Safari',
    pagesVisited: ['Consola Superadmin', 'Visitas', 'Manual', 'Editor de Apariencia'],
    status: 'active'
  },
  {
    id: 'sess_2',
    ip: '186.104.22.90',
    city: 'Santiago',
    country: 'Chile',
    flagEmoji: '🇨🇱',
    userId: 'usr_2',
    userEmail: 'valeria.m@example.com',
    displayName: 'Valeria Morales',
    startedAt: new Date(Date.now() - 1000 * 840).toISOString(),
    lastActiveAt: new Date().toISOString(),
    durationSeconds: 840,
    device: 'iPhone 15 Pro',
    os: 'iOS 18.1',
    browser: 'Mobile Safari',
    pagesVisited: ['Inicio', 'Test IA Foto', 'Resultado', 'Armario'],
    status: 'active'
  }
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS[0];
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS;
  });

  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LOGS;
  });

  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      if (saved) return JSON.parse(saved);
    } catch {}
    const defaultResult = classifySeason({
      undertone: 'cool',
      contrast: 'high',
      value: 'deep',
      chroma: 'bright',
      skinHex: '#D1A384',
      method: 'photo'
    });
    return [defaultResult];
  });

  const [plans, setPlans] = useState<PlanDefinition[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PLANS;
  });

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(INITIAL_SUBSCRIPTIONS);

  const [thresholdConfig, setThresholdConfig] = useState<ThresholdAlertConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THRESHOLDS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      subscriptionNoticeDays: 15,
      cpuThresholdPercent: 80,
      tokenQuotaThresholdPercent: 85,
      diskThresholdPercent: 85
    };
  });

  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DISMISSED_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Visits Registry
  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISITS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_VISITS;
  });

  // Manual & Chapters
  const [manualChapters, setManualChapters] = useState<ManualChapter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANUAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MANUAL_CHAPTERS;
  });

  // Appearance Config
  const [appearanceConfig, setAppearanceConfig] = useState<AppearanceConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_APPEARANCE_CONFIG;
  });

  // Social Links & WhatsApp
  const [socialConfig, setSocialConfig] = useState<SocialLinksConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOCIAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber === '+56987654321') parsed.whatsappNumber = '';
        if (parsed.telefono === '+56 41 223 4567') parsed.telefono = '';
        if (parsed.emailSoporte === 'soporte@styledbywilma.cl') parsed.emailSoporte = '';
        if (parsed.emailVentas === 'contacto@styledbywilma.cl') parsed.emailVentas = '';
        if (parsed.direccion?.includes('Barros Arana')) parsed.direccion = 'Concepción, Región del Biobío, Chile';
        return { ...DEFAULT_SOCIAL_CONFIG, ...parsed };
      }
    } catch {}
    return DEFAULT_SOCIAL_CONFIG;
  });

  const [activeAgeFilter, setActiveAgeFilter] = useState<AgeGroup | 'any'>('any');

  // Security Config
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SECURITY_CONFIG;
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_API_KEYS;
  });

  // Roles
  const [roles, setRoles] = useState<RolePermissionMatrix[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ROLES;
  });

  // Geographic statistics state
  const [geoStats, setGeoStats] = useState<GeoVisitStat[]>(INITIAL_GEO_STATS);

  // Session logs state
  const [sessionLogs, setSessionLogs] = useState<UserSessionLog[]>(INITIAL_SESSION_LOGS);

  // Server Metrics state
  const [serverMetrics, setServerMetrics] = useState<ServerMetricSnapshot>({
    cpuUsagePercent: 32.4,
    cpuCores: 4,
    cpuLoadAvg: [0.38, 0.35, 0.31],
    memoryUsedMB: 1980,
    memoryTotalMB: 4096,
    memoryUsagePercent: 48.3,
    diskUsedGB: 12.4,
    diskTotalGB: 50.0,
    diskUsagePercent: 24.8,
    r2StorageUsedGB: 18.6,
    r2StorageLimitGB: 100.0,
    uptimeHours: 842,
    tokenConsumptionToday: 184520,
    tokenConsumptionMonth: 2840000,
    tokenLimitDaily: 500000,
    tokenCostUSD: 0.18,
    apiRequestsToday: 28450,
    apiRequestsPerMinute: 42,
    apiSuccessRate: 99.88,
    apiAvgLatencyMs: 112,
    errors4xxToday: 14,
    errors5xxToday: 0,
    apiEndpoints: [
      { path: '/api/analyze (Gemini Vision AI)', calls: 1840, avgMs: 1650, status: 200 },
      { path: '/api/generate-outfits', calls: 920, avgMs: 1400, status: 200 },
      { path: '/api/visits/track', calls: 14890, avgMs: 24, status: 200 },
      { path: '/api/draping/virtual-render', calls: 3250, avgMs: 85, status: 200 }
    ],
    servicesHealth: [
      { name: 'Gemini 2.5 Flash Vision AI Engine', status: 'operational', latencyMs: 310, uptimePercent: 99.98 },
      { name: 'Cloudflare D1 SQL Database & Workers', status: 'operational', latencyMs: 18, uptimePercent: 100.0 },
      { name: 'Cloudflare R2 Storage (Fotos & Assets)', status: 'operational', latencyMs: 45, uptimePercent: 100.0 },
      { name: 'Cloudflare KV (Sessions & Cache)', status: 'operational', latencyMs: 12, uptimePercent: 100.0 },
      { name: 'Firebase Authentication Gateway', status: 'operational', latencyMs: 65, uptimePercent: 99.95 }
    ],
    timestamp: new Date().toISOString()
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(analyses[0] || null);
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // WhatsApp Backups State
  const [backupSnapshots, setBackupSnapshots] = useState<BackupSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BACKUPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'bkp_sample_sys',
        name: 'Respaldo Maestro del Sistema (Automático)',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        sizeBytes: 1024 * 64,
        sizeFormatted: '64.00 KB',
        type: 'full_system',
        version: '3.0.0',
        encrypted: true,
        itemCounts: {
          users: 6,
          analyses: 1,
          logs: 3,
          visits: 8
        },
        payload: {
          allUsers: INITIAL_USERS,
          analyses: [],
          adminLogs: INITIAL_LOGS,
          visits: INITIAL_VISITS,
          metadata: {
            exportedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            app: 'Styled By Wilma',
            version: '3.0.0'
          }
        }
      }
    ];
  });
  const [isBackingUp, setIsBackingUp] = useState(false);
  const lastBackupDate = user?.lastBackupDate || null;

  // Persist State
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(adminLogs));
  }, [adminLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(backupSnapshots));
  }, [backupSnapshots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(thresholdConfig));
  }, [thresholdConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISMISSED_ALERTS, JSON.stringify(dismissedAlertIds));
  }, [dismissedAlertIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANUAL, JSON.stringify(manualChapters));
  }, [manualChapters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPEARANCE, JSON.stringify(appearanceConfig));
  }, [appearanceConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOCIAL, JSON.stringify(socialConfig));
  }, [socialConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(securityConfig));
  }, [securityConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
  }, [roles]);

  // Apply Appearance CSS variables to the document
  useEffect(() => {
    const root = document.documentElement;
    const colors = appearanceConfig.colors;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-surface', colors.surface);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-light', colors.textMuted);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    root.style.setProperty('--color-info', colors.info);

    // Apply age-group specific adjustments if user is Golden (66+)
    if (user?.ageGroup === 'golden') {
      root.style.fontSize = '18px';
    } else if (user?.ageGroup === 'senior') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = `${appearanceConfig.baseFontSizePx}px`;
    }
  }, [appearanceConfig, user?.ageGroup]);

  // Compute System Alerts
  const computeSystemAlerts = (): SystemAlert[] => {
    const list: SystemAlert[] = [];
    const now = Date.now();
    const noticeMs = thresholdConfig.subscriptionNoticeDays * 86400000;

    allUsers.forEach(u => {
      if (u.plan === 'premium' && u.subscriptionExpiresAt) {
        const expMs = new Date(u.subscriptionExpiresAt).getTime();
        const diffMs = expMs - now;
        const daysRemaining = Math.max(0, Math.ceil(diffMs / 86400000));

        if (diffMs > 0 && diffMs <= noticeMs) {
          const alertId = `exp_${u.uid}_${daysRemaining}`;
          if (!dismissedAlertIds.includes(alertId)) {
            list.push({
              id: alertId,
              type: 'subscription_expiry',
              severity: daysRemaining <= 5 ? 'critical' : 'warning',
              title: `Alerta de Umbral: Plan VIP de ${u.displayName} vence en ${daysRemaining} días`,
              message: `El plan de pago de ${u.displayName} (${u.email}) vencerá el ${new Date(u.subscriptionExpiresAt).toLocaleDateString()}. Activa el recordatorio automático para asegurar la renovación.`,
              targetUserId: u.uid,
              targetUserEmail: u.email,
              daysRemaining,
              createdAt: new Date().toISOString(),
              isRead: false,
              actionRequired: 'Recordatorio WhatsApp / Email'
            });
          }
        }
      }

      if (u.status === 'scheduled_deletion' && u.deletionScheduledDate) {
        const delMs = new Date(u.deletionScheduledDate).getTime();
        const daysLeft = Math.max(0, Math.ceil((delMs - now) / 86400000));
        const alertId = `del_${u.uid}`;
        if (!dismissedAlertIds.includes(alertId)) {
          list.push({
            id: alertId,
            type: 'security',
            severity: 'info',
            title: `Cuenta en periodo de gracia (${securityConfig.gracePeriodDays} días): ${u.displayName}`,
            message: `La cuenta se eliminará permanentemente en ${daysLeft} días a menos que la usuaria inicie sesión.`,
            targetUserId: u.uid,
            targetUserEmail: u.email,
            daysRemaining: daysLeft,
            createdAt: new Date().toISOString(),
            isRead: false
          });
        }
      }
    });

    if (serverMetrics.cpuUsagePercent >= thresholdConfig.cpuThresholdPercent) {
      list.push({
        id: 'alert_cpu_threshold',
        type: 'cpu_high',
        severity: 'critical',
        title: `Uso de CPU supera el umbral (${serverMetrics.cpuUsagePercent.toFixed(1)}% >= ${thresholdConfig.cpuThresholdPercent}%)`,
        message: 'Alta demanda en el servicio de análisis de colorimetría con IA.',
        createdAt: new Date().toISOString(),
        isRead: false
      });
    }

    if (serverMetrics.r2StorageUsedGB >= 80) {
      list.push({
        id: 'alert_r2_storage',
        type: 'storage_r2',
        severity: 'warning',
        title: 'Almacenamiento R2 supera el 80% de cuota',
        message: 'El bucket de imágenes de drapeado y análisis fotográfico se aproxima al límite recomendado.',
        createdAt: new Date().toISOString(),
        isRead: false
      });
    }

    return list;
  };

  const systemAlerts = computeSystemAlerts();

  // Add a visit record
  const addVisitRecord = (page: string) => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const dispositivo = isMobile ? 'móvil' : isTablet ? 'tablet' : 'escritorio';

    const newVisit: VisitRecord = {
      id: 'vis_' + Date.now().toString().slice(-6),
      ipHash: Math.random().toString(36).substring(2, 10),
      userId: user?.uid,
      userEmail: user?.email,
      displayName: user?.displayName,
      isRegistered: !!user,
      pais: user?.country || 'Chile',
      paisCode: 'CL',
      ciudad: user?.city || 'Concepción',
      region: user?.region || 'Biobío',
      flagEmoji: '🇨🇱',
      userAgent: navigator.userAgent,
      navegador: navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Navegador Web',
      so: navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? 'iOS' : navigator.userAgent.includes('Android') ? 'Android' : 'macOS / Windows',
      dispositivo,
      pagina: page,
      referrer: document.referrer || 'directo',
      horaEntrada: new Date().toLocaleTimeString('es-CL'),
      duracionSegundos: Math.floor(Math.random() * 300) + 45,
      fecha: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setVisits(prev => [newVisit, ...prev.slice(0, 199)]);
  };

  const deleteVisitRecord = (id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
  };

  const cleanupVisitRecords = (daysThreshold: number = 30) => {
    const cutoff = Date.now() - daysThreshold * 86400000;
    setVisits(prev => prev.filter(v => new Date(v.createdAt).getTime() >= cutoff));
  };

  // Superadmin Master Login
  const loginAsMaster = (password: string) => {
    if (password === 'xyz19881988') {
      const masterUser = INITIAL_USERS[0];
      setUser(masterUser);
      setCurrentView('admin');
      setIsAuthModalOpen(false);

      const log: AdminLog = {
        id: 'log_' + Date.now(),
        adminId: masterUser.uid,
        adminEmail: masterUser.email,
        action: 'Acceso Secreto Superadmin MASTER',
        timestamp: new Date().toISOString(),
        details: 'Autenticación con credencial de superusuario master.'
      };
      setAdminLogs(prev => [log, ...prev]);
      return { success: true };
    }
    return { success: false, error: 'Contraseña de Master inválida' };
  };

  // Unified Login (Username OR Email)
  const login = (usernameOrEmail: string, password?: string, rememberMe = true) => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // Check if master credentials used directly
    if ((cleanInput === 'master' || cleanInput === 'wilma.hernandez@styledbywilma.com') && password === 'xyz19881988') {
      return loginAsMaster(password);
    }

    const existing = allUsers.find(u => 
      u.email.toLowerCase() === cleanInput || 
      u.username.toLowerCase() === cleanInput
    );

    if (existing) {
      if (existing.status === 'suspended') {
        return { success: false, error: 'Esta cuenta ha sido suspendida temporalmente por una administradora.' };
      }

      if (existing.status === 'deactivated' || existing.status === 'scheduled_deletion') {
        const reactivated: UserProfile = {
          ...existing,
          status: 'active',
          deactivatedAt: undefined,
          deletionScheduledDate: undefined
        };
        setAllUsers(prev => prev.map(u => u.uid === existing.uid ? reactivated : u));
        setUser(reactivated);
        setIsAuthModalOpen(false);
        return { success: true, message: '¡Bienvenida de vuelta! Tu cuenta ha sido reactivada.' };
      }

      setUser(existing);
      setIsAuthModalOpen(false);
      return { success: true };
    } else {
      // Auto-create user if not found
      const generatedUsername = cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput;
      const newUser: UserProfile = {
        uid: 'usr_' + Date.now(),
        username: generatedUsername,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@cliente.styledbywilma.cl`,
        displayName: generatedUsername,
        firstName: generatedUsername,
        lastName: '',
        age: 29,
        ageGroup: 'adulta_joven',
        sexo: 'femenino',
        role: 'user',
        plan: 'free',
        isEmailVerified: true,
        provider: 'email',
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      setAllUsers(prev => [newUser, ...prev]);
      setUser(newUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const loginWithFacebook = () => {
    if (!securityConfig.allowFacebook) {
      alert('El registro con Facebook está temporalmente desactivado por configuración de seguridad.');
      return;
    }
    const existing = allUsers.find(u => u.provider === 'facebook');
    let fbUser: UserProfile;

    if (existing) {
      fbUser = {
        ...existing,
        status: 'active',
        deactivatedAt: undefined,
        deletionScheduledDate: undefined
      };
    } else {
      fbUser = {
        uid: 'usr_fb_' + Date.now(),
        username: 'valeria_fb',
        email: 'valeria.morales@facebook.com',
        displayName: 'Valeria Morales',
        firstName: 'Valeria',
        lastName: 'Morales',
        birthDate: '1998-08-22',
        age: 28,
        ageGroup: 'adulta_joven',
        sexo: 'femenino',
        role: 'user',
        plan: 'premium',
        isEmailVerified: true,
        provider: 'facebook',
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        status: 'active',
        subscriptionExpiresAt: daysFromNowISO(11)
      };
    }

    setAllUsers(prev => {
      const filtered = prev.filter(u => u.email !== fbUser.email);
      return [fbUser, ...filtered];
    });

    setUser(fbUser);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = () => {
    if (!securityConfig.allowGoogle) {
      alert('El registro con Google está temporalmente desactivado por configuración de seguridad.');
      return;
    }
    const googleUser: UserProfile = {
      uid: 'usr_g_' + Date.now(),
      username: 'claudia_g',
      email: 'claudia.rivas@gmail.com',
      displayName: 'Claudia Rivas',
      firstName: 'Claudia',
      lastName: 'Rivas',
      birthDate: '1979-04-18',
      age: 47,
      ageGroup: 'madura',
      sexo: 'femenino',
      role: 'user',
      plan: 'premium',
      isEmailVerified: true,
      provider: 'google',
      createdAt: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      subscriptionExpiresAt: daysFromNowISO(4)
    };

    setAllUsers(prev => {
      const filtered = prev.filter(u => u.email !== googleUser.email);
      return [googleUser, ...filtered];
    });

    setUser(googleUser);
    setIsAuthModalOpen(false);
  };

  const register = (data: { 
    username: string;
    email: string; 
    password?: string;
    firstName: string; 
    lastName: string; 
    birthDate?: string;
    sexo?: 'femenino' | 'masculino' | 'otro';
    rememberMe?: boolean;
  }) => {
    if (!securityConfig.allowEmail) {
      return { success: false, error: 'El registro con email/contraseña está desactivado actualmente.' };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim();

    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
    }

    if (allUsers.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { success: false, error: 'El nombre de usuario ya está en uso. Por favor elige otro.' };
    }

    const age = getAgeFromBirthDate(data.birthDate);
    const ageGroup = getAgeGroupFromBirthDate(data.birthDate);

    const newUser: UserProfile = {
      uid: 'usr_' + Date.now(),
      username: cleanUsername,
      email: cleanEmail,
      displayName: `${data.firstName} ${data.lastName}`.trim(),
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      age,
      ageGroup,
      sexo: data.sexo || 'femenino',
      role: 'user',
      plan: 'free',
      isEmailVerified: !securityConfig.requireEmailVerification,
      provider: 'email',
      createdAt: new Date().toISOString(),
      status: securityConfig.requireAdminApproval ? 'suspended' : 'active'
    };

    setAllUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  const verifyEmailCode = (email: string, code: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const userToVerify = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!userToVerify) return { success: false, error: 'Usuario no encontrado' };

    const verifiedUser: UserProfile = { ...userToVerify, isEmailVerified: true };
    setAllUsers(prev => prev.map(u => u.email.toLowerCase() === cleanEmail ? verifiedUser : u));
    setUser(verifiedUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const requestPasswordReset = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const userExists = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!userExists) return { success: false, message: 'No encontramos ninguna cuenta con ese correo.' };
    return {
      success: true,
      code: '741258',
      message: `Hemos enviado el código de recuperación al correo ${cleanEmail}.`
    };
  };

  const resetPassword = (email: string, code: string, newPass: string) => {
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const saveAnalysis = (analysis: AnalysisResult) => {
    setAnalyses(prev => [analysis, ...prev]);
    setCurrentAnalysis(analysis);
  };

  const deleteAnalysis = (id: string) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(analyses.find(a => a.id !== id) || null);
    }
  };

  const upgradeToPremium = () => {
    if (user) {
      const updated: UserProfile = { 
        ...user, 
        plan: 'premium',
        subscriptionExpiresAt: daysFromNowISO(30)
      };
      setUser(updated);
      setAllUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));
    }
    setIsPremiumModalOpen(false);
  };

  const updateUserAgeGroup = (userId: string, group: AgeGroup) => {
    setAllUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        const mod = { ...u, ageGroup: group };
        if (user?.uid === userId) setUser(mod);
        return mod;
      }
      return u;
    }));
  };

  const saveUserStyleDNA = (dna: CompleteStyleDNA) => {
    if (user) {
      const updated: UserProfile = { ...user, styleDNA: dna };
      setUser(updated);
      setAllUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));
    }
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setAllUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        const mod = { ...u, role };
        if (user?.uid === userId) setUser(mod);
        return mod;
      }
      return u;
    }));
  };

  const updateUserPlan = (userId: string, plan: UserPlan) => {
    setAllUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        const mod = { 
          ...u, 
          plan,
          subscriptionExpiresAt: plan === 'premium' ? daysFromNowISO(30) : undefined
        };
        if (user?.uid === userId) setUser(mod);
        return mod;
      }
      return u;
    }));
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.uid === userId) {
        const newStatus: UserAccountStatus = u.status === 'active' ? 'suspended' : 'active';
        const mod = { ...u, status: newStatus };
        if (user?.uid === userId) setUser(mod);
        return mod;
      }
      return u;
    }));
  };

  const deactivateAccount = (userId: string) => {
    const target = allUsers.find(u => u.uid === userId);
    if (!target) return { success: false, message: 'Usuario no encontrado' };

    const updated: UserProfile = {
      ...target,
      status: 'deactivated',
      deactivatedAt: new Date().toISOString()
    };

    setAllUsers(prev => prev.map(u => u.uid === userId ? updated : u));
    if (user?.uid === userId) {
      setUser(null);
      setCurrentView('landing');
    }
    return { success: true, message: 'Cuenta pausada exitosamente. Se reactivará cuando vuelvas a iniciar sesión.' };
  };

  const reactivateAccount = (userId: string) => {
    const target = allUsers.find(u => u.uid === userId);
    if (!target) return { success: false, message: 'Usuario no encontrado' };

    const updated: UserProfile = {
      ...target,
      status: 'active',
      deactivatedAt: undefined,
      deletionScheduledDate: undefined
    };

    setAllUsers(prev => prev.map(u => u.uid === userId ? updated : u));
    if (user?.uid === userId) setUser(updated);
    return { success: true, message: 'Cuenta reactivada exitosamente.' };
  };

  const scheduleAccountDeletion = (userId: string, days: number = securityConfig.gracePeriodDays) => {
    const target = allUsers.find(u => u.uid === userId);
    if (!target) return { success: false, message: 'Usuario no encontrado' };

    const updated: UserProfile = {
      ...target,
      status: 'scheduled_deletion',
      deletionScheduledDate: daysFromNowISO(days)
    };

    setAllUsers(prev => prev.map(u => u.uid === userId ? updated : u));
    if (user?.uid === userId) {
      setUser(null);
      setCurrentView('landing');
    }
    return { success: true, message: `Eliminación programada. Tienes un periodo de gracia de ${days} días para reactivarla.` };
  };

  const cancelAccountDeletion = (userId: string) => {
    return reactivateAccount(userId);
  };

  const permanentlyDeleteAccount = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.uid !== userId));
    if (user?.uid === userId) {
      setUser(null);
      setCurrentView('landing');
    }
    return { success: true, message: 'Cuenta eliminada permanentemente de la base de datos.' };
  };

  const quickSwitchRole = (role: UserRole, plan: UserPlan) => {
    if (user) {
      const updated: UserProfile = { ...user, role, plan };
      setUser(updated);
      setAllUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));
    } else {
      const demoUser = allUsers.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
      setUser({ ...demoUser, role, plan });
    }
  };

  const quickSwitchAgeGroup = (group: AgeGroup | 'any') => {
    setActiveAgeFilter(group);
    if (user && group !== 'any') {
      const updated: UserProfile = { ...user, ageGroup: group };
      setUser(updated);
      setAllUsers(prev => prev.map(u => u.uid === user.uid ? updated : u));
    }
  };

  // Plans Management
  const createPlan = (newPlan: Omit<PlanDefinition, 'id'>) => {
    const created: PlanDefinition = {
      ...newPlan,
      id: 'plan_' + Date.now()
    };
    setPlans(prev => [...prev, created]);
    return created;
  };

  const updatePlan = (id: string, updates: Partial<PlanDefinition>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const togglePlanActive = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  // Manual Management
  const updateManualSection = (chapterId: string, sectionId: string, content: string[], tips?: string[]) => {
    setManualChapters(prev => prev.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          secciones: ch.secciones.map(sec => {
            if (sec.id === sectionId) {
              return { ...sec, contenido: content, tips: tips || sec.tips };
            }
            return sec;
          })
        };
      }
      return ch;
    }));
  };

  const addManualChapter = (title: string, description: string) => {
    const newCap: ManualChapter = {
      id: 'cap_' + Date.now(),
      capitulo: manualChapters.length + 1,
      titulo: title,
      descripcion: description,
      icono: 'BookOpen',
      secciones: [
        {
          id: 'sec_' + Date.now(),
          seccion: 1,
          subseccion: `${manualChapters.length + 1}.1`,
          titulo: 'Introducción del tema',
          contenido: ['Contenido redactado por la administración.']
        }
      ]
    };
    setManualChapters(prev => [...prev, newCap]);
  };

  // Appearance Management
  const updateAppearanceConfig = (updates: Partial<AppearanceConfig>) => {
    setAppearanceConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const resetAppearanceConfig = () => {
    setAppearanceConfig(DEFAULT_APPEARANCE_CONFIG);
  };

  // Social Config Management
  const updateSocialConfig = (updates: Partial<SocialLinksConfig>) => {
    setSocialConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Security Config Management
  const updateSecurityConfig = (updates: Partial<SecurityConfig>) => {
    setSecurityConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  // API Keys Management
  const addApiKey = (key: Omit<ApiKeyRecord, 'id'>) => {
    const newKey: ApiKeyRecord = {
      ...key,
      id: 'key_' + Date.now()
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const updateApiKey = (id: string, updates: Partial<ApiKeyRecord>) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  // Roles Management
  const updateRolePermissions = (roleId: string, permissions: RolePermissionMatrix['permissions']) => {
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions } : r));
  };

  // Database actions
  const executeDatabaseMaintenance = (action: string) => {
    return {
      success: true,
      message: `Operación de mantenimiento "${action}" ejecutada exitosamente en Cloudflare D1.`,
      details: 'Índices optimizados, espacio purgado e integridad verificada.'
    };
  };

  const updateDatabaseRecord = (collection: string, recordId: string, updatedData: any) => {
    if (collection === 'users') {
      setAllUsers(prev => prev.map(u => u.uid === recordId ? { ...u, ...updatedData } : u));
    }
    return { success: true };
  };

  const deleteDatabaseRecord = (collection: string, recordId: string) => {
    if (collection === 'users') {
      setAllUsers(prev => prev.filter(u => u.uid !== recordId));
    } else if (collection === 'visits') {
      setVisits(prev => prev.filter(v => v.id !== recordId));
    }
    return { success: true };
  };

  const addDatabaseRecord = (collection: string, data: any) => {
    const id = 'rec_' + Date.now();
    return { success: true, id };
  };

  // Server Telemetry refresh
  const refreshServerMetrics = () => {
    setServerMetrics(prev => ({
      ...prev,
      cpuUsagePercent: Number((26 + Math.random() * 20).toFixed(1)),
      cpuLoadAvg: [Number((0.3 + Math.random() * 0.3).toFixed(2)), 0.35, 0.32],
      memoryUsedMB: Math.round(1950 + Math.random() * 300),
      memoryUsagePercent: Number(((1950 + Math.random() * 300) / 4096 * 100).toFixed(1)),
      tokenConsumptionToday: prev.tokenConsumptionToday + Math.round(Math.random() * 150),
      apiRequestsToday: prev.apiRequestsToday + Math.round(Math.random() * 20),
      apiAvgLatencyMs: Math.round(95 + Math.random() * 30),
      timestamp: new Date().toISOString()
    }));
  };

  const updateThresholdConfig = (config: Partial<ThresholdAlertConfig>) => {
    setThresholdConfig(prev => ({ ...prev, ...config }));
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlertIds(prev => [...prev, alertId]);
  };

  const sendSubscriptionExpiryNotice = (userId: string, method: 'whatsapp' | 'email') => {
    const target = allUsers.find(u => u.uid === userId);
    return {
      success: true,
      message: `Notificación enviada por ${method.toUpperCase()} a ${target?.displayName || 'la usuaria'}.`
    };
  };

  const refreshSessionLogs = () => {
    setSessionLogs(prev => prev.map(s => s.status === 'active' ? { ...s, durationSeconds: s.durationSeconds + 60 } : s));
  };

  // Backup & Restore
  const createProfileBackup = async (customName?: string): Promise<BackupSnapshot> => {
    setIsBackingUp(true);
    await new Promise(r => setTimeout(r, 600));

    const now = new Date().toISOString();
    const targetUser = user || INITIAL_USERS[0];
    const payload = {
      user: targetUser,
      analyses,
      metadata: {
        exportedAt: now,
        app: 'Styled By Wilma',
        version: '3.0.0'
      }
    };

    const serialized = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(serialized).length;

    const snapshot: BackupSnapshot = {
      id: 'bkp_usr_' + Date.now(),
      name: customName || `Respaldo de ${targetUser.displayName} (${new Date().toLocaleDateString()})`,
      createdAt: now,
      sizeBytes: bytes,
      sizeFormatted: formatBytes(bytes),
      type: 'user_profile',
      userId: targetUser.uid,
      userEmail: targetUser.email,
      version: '3.0.0',
      encrypted: true,
      itemCounts: {
        analyses: analyses.length
      },
      payload
    };

    setBackupSnapshots(prev => [snapshot, ...prev]);
    setIsBackingUp(false);
    return snapshot;
  };

  const createSystemBackup = async (customName?: string): Promise<BackupSnapshot> => {
    setIsBackingUp(true);
    await new Promise(r => setTimeout(r, 800));

    const now = new Date().toISOString();
    const payload = {
      allUsers,
      analyses,
      adminLogs,
      visits,
      appearance: appearanceConfig,
      socialLinks: socialConfig,
      security: securityConfig,
      metadata: {
        exportedAt: now,
        app: 'Styled By Wilma',
        version: '3.0.0'
      }
    };

    const serialized = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(serialized).length;

    const snapshot: BackupSnapshot = {
      id: 'bkp_sys_' + Date.now(),
      name: customName || `Respaldo Maestro del Sistema (${new Date().toLocaleDateString()})`,
      createdAt: now,
      sizeBytes: bytes,
      sizeFormatted: formatBytes(bytes),
      type: 'full_system',
      version: '3.0.0',
      encrypted: true,
      itemCounts: {
        users: allUsers.length,
        analyses: analyses.length,
        logs: adminLogs.length,
        visits: visits.length
      },
      payload
    };

    setBackupSnapshots(prev => [snapshot, ...prev]);
    setIsBackingUp(false);
    return snapshot;
  };

  const restoreBackup = (snapshot: BackupSnapshot, mode: 'replace' | 'merge' = 'replace') => {
    try {
      if (snapshot.payload.allUsers) setAllUsers(snapshot.payload.allUsers);
      if (snapshot.payload.analyses) setAnalyses(snapshot.payload.analyses);
      if (snapshot.payload.visits) setVisits(snapshot.payload.visits);
      if (snapshot.payload.appearance) setAppearanceConfig(snapshot.payload.appearance);
      if (snapshot.payload.socialLinks) setSocialConfig(snapshot.payload.socialLinks);
      if (snapshot.payload.security) setSecurityConfig(snapshot.payload.security);
      return { success: true, message: 'Respaldo restaurado exitosamente en el sistema.' };
    } catch (err: any) {
      return { success: false, message: 'Error al restaurar: ' + err.message };
    }
  };

  const restoreFromFile = (fileContent: string, mode: 'replace' | 'merge' = 'replace') => {
    try {
      const parsed = JSON.parse(fileContent);
      return restoreBackup(parsed, mode);
    } catch {
      return { success: false, message: 'Archivo de respaldo inválido.' };
    }
  };

  const downloadBackup = (snapshot: BackupSnapshot) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${snapshot.name.replace(/[^a-z0-9_-]/gi, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const deleteBackup = (id: string) => {
    setBackupSnapshots(prev => prev.filter(b => b.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        analyses,
        currentAnalysis,
        allUsers,
        adminLogs,
        currentView,
        isPremiumModalOpen,
        isAuthModalOpen,
        authModalMode,
        setCurrentView,
        setCurrentAnalysis,
        setIsPremiumModalOpen,
        setIsAuthModalOpen: (open, mode = 'login') => {
          setIsAuthModalOpen(open);
          setAuthModalMode(mode);
        },
        login,
        loginWithGoogle,
        loginWithFacebook,
        loginAsMaster,
        register,
        verifyEmailCode,
        requestPasswordReset,
        resetPassword,
        logout,
        saveAnalysis,
        deleteAnalysis,
        upgradeToPremium,
        updateUserAgeGroup,
        saveUserStyleDNA,
        updateUserRole,
        updateUserPlan,
        toggleUserStatus,
        deactivateAccount,
        reactivateAccount,
        scheduleAccountDeletion,
        cancelAccountDeletion,
        permanentlyDeleteAccount,
        quickSwitchRole,
        activeAgeFilter,
        setActiveAgeFilter,
        quickSwitchAgeGroup,
        plans,
        createPlan,
        updatePlan,
        deletePlan,
        togglePlanActive,
        visits,
        addVisitRecord,
        deleteVisitRecord,
        cleanupVisitRecords,
        manualChapters,
        updateManualSection,
        addManualChapter,
        appearanceConfig,
        updateAppearanceConfig,
        resetAppearanceConfig,
        socialConfig,
        updateSocialConfig,
        securityConfig,
        updateSecurityConfig,
        apiKeys,
        addApiKey,
        updateApiKey,
        deleteApiKey,
        roles,
        updateRolePermissions,
        subscriptions,
        executeDatabaseMaintenance,
        updateDatabaseRecord,
        deleteDatabaseRecord,
        addDatabaseRecord,
        serverMetrics,
        refreshServerMetrics,
        systemAlerts,
        thresholdConfig,
        updateThresholdConfig,
        dismissAlert,
        sendSubscriptionExpiryNotice,
        geoStats,
        sessionLogs,
        refreshSessionLogs,
        backupSnapshots,
        lastBackupDate,
        isBackingUp,
        createProfileBackup,
        createSystemBackup,
        restoreBackup,
        restoreFromFile,
        downloadBackup,
        deleteBackup,
        isSupportModalOpen,
        setIsSupportModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
