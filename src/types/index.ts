import { SeasonData } from '../data/seasons';
import { AnalysisResult } from '../lib/colorAnalysis';

export type UserRole = 'user' | 'editor' | 'admin' | 'master';
export type UserPlan = 'free' | 'premium' | string;
export type UserAccountStatus = 'active' | 'suspended' | 'deactivated' | 'scheduled_deletion';

export type AgeGroup = 
  | 'joven'          // 18-25: Fresco, tendencias, presupuestos inteligentes, redes sociales
  | 'adulta_joven'    // 26-35: Balance vida profesional + personal, versatilidad
  | 'adulta'         // 36-45: Presencia profesional, calidad sobre cantidad, empoderamiento
  | 'madura'         // 46-55: Elegancia, confort elevado, estilo refinado
  | 'senior'         // 56-65: Estilo atemporal, sofisticación, máxima comodidad
  | 'golden';        // 66+: Elegancia clásica, calidez, accesibilidad visual ampliada

export interface AgeGroupProfileInfo {
  id: AgeGroup;
  title: string;
  range: string;
  badge: string;
  focus: string;
  stylingQuote: string;
  uiPreferences: {
    baseFontSize: string; // e.g., '14px', '16px', '18px'
    contrastMode: 'normal' | 'high';
    simplifiedNav: boolean;
  };
}

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  age?: number;
  ageGroup?: AgeGroup;
  sexo?: 'femenino' | 'masculino' | 'otro';
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
  status: UserAccountStatus;
  location?: string;
  city?: string;
  region?: string;
  country?: string;
  whatsappNumber?: string;
  specialTitle?: string;
  isMaster?: boolean;
  isEmailVerified?: boolean;
  provider?: 'email' | 'google' | 'facebook';
  passwordHash?: string;
  lastBackupDate?: string;
  deactivatedAt?: string;
  deletionScheduledDate?: string; // 30-day grace period
  subscriptionExpiresAt?: string; // For 15-day pre-expiry alerts
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    pinterest?: string;
  };
  styleDNA?: CompleteStyleDNA;
}

// ═══════════════════════════════════════════════════════════
// STYLE DNA SUB-PROFILES (7 DNAs)
// ═══════════════════════════════════════════════════════════

export interface ColorDNA {
  seasonId?: string;
  seasonName?: string;
  undertone?: 'cálido' | 'frío' | 'neutro';
  contrastLevel?: 'bajo' | 'medio' | 'alto';
  favoriteColors?: string[];
  colorsToAvoid?: string[];
  bestMetal?: 'Oro' | 'Plata' | 'Oro Rosa';
  bestNeutrals?: string[];
}

export interface BodyDNA {
  silhouette?: 'reloj_de_arena' | 'triangulo' | 'triangulo_invertido' | 'rectangulo' | 'ovalo';
  heightCategory?: 'petite' | 'media' | 'alta';
  proportions?: string;
  preferredNecklines?: string[];
  preferredWaistlines?: string[];
  fitPreference?: 'ajustado' | 'estructurado' | 'fluido' | 'holgado';
}

export interface StyleDNAProfile {
  archetypes: string[]; // e.g. ['Clásico', 'Elegante', 'Natural / Relajado', 'Romántico', 'Dramático', 'Creativo', 'Seductor']
  preferredOccasions: string[];
  fashionIcons: string[];
  minimalistVsMaximalist: number; // 1 to 5
}

export interface LifestyleDNA {
  occupationType?: string; // Oficina, Negocio propio, Cuidado del hogar, Estudiante, Docencia, Salud, etc.
  climateZone?: string; // Templado oceánico Biobío / Concepción
  dailyRoutine?: string;
  socialActivitiesFrequency?: 'baja' | 'moderada' | 'alta';
  sportsOrActiveHoursWeekly?: number;
}

export interface ComfortDNA {
  heelTolerance?: 'solo_planos' | 'bajo_comodo' | 'tacones_medios' | 'altos_ocasional';
  preferredFabrics?: string[]; // Lino, algodón orgánico, seda, cachemira, denim suave
  sensitiveSkin?: boolean;
  tightFittingTolerance?: 'alta' | 'media' | 'baja';
}

export interface ShoppingDNA {
  shoppingBudgetTier?: 'accesible' | 'medio' | 'premium' | 'inversion';
  favoriteStores?: string[]; // Tiendas locales Concepción / Chile
  frequency?: 'mensual' | 'estacional' | 'por_necesidad';
  sustainablePriority?: boolean;
}

export interface WardrobeDNA {
  capsulePiecesCount?: number;
  unwornClothesPercent?: number;
  dominantColorsInCloset?: string[];
  organizationLevel?: 'impecable' | 'organizado' | 'desorden_moderado' | 'caos';
}

export interface CompleteStyleDNA {
  color: ColorDNA;
  body: BodyDNA;
  style: StyleDNAProfile;
  lifestyle: LifestyleDNA;
  comfort: ComfortDNA;
  shopping: ShoppingDNA;
  wardrobe: WardrobeDNA;
  lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════
// VISITS TRACKING & ANALYTICS
// ═══════════════════════════════════════════════════════════

export interface VisitRecord {
  id: string;
  ipHash: string;
  userId?: string;
  userEmail?: string;
  displayName?: string;
  isRegistered: boolean;
  pais: string;
  paisCode: string;
  ciudad: string;
  region: string;
  flagEmoji: string;
  userAgent: string;
  navegador: string;
  so: string;
  dispositivo: 'móvil' | 'tablet' | 'escritorio';
  pagina: string;
  referrer: string;
  horaEntrada: string;
  horaSalida?: string;
  duracionSegundos: number;
  fecha: string; // YYYY-MM-DD
  createdAt: string;
}

export interface VisitFilters {
  dateRange: 'today' | '7days' | '30days' | 'all';
  country?: string;
  page?: string;
  device?: 'all' | 'móvil' | 'tablet' | 'escritorio';
  userType?: 'all' | 'registered' | 'anonymous';
  durationBucket?: 'all' | 'lt_10s' | '10s_1m' | '1m_5m' | 'gt_5m';
  searchQuery?: string;
}

// ═══════════════════════════════════════════════════════════
// MANUAL Y GUÍA DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════

export interface ManualSectionItem {
  id: string;
  seccion: number;
  subseccion: string;
  titulo: string;
  contenido: string[];
  pasos?: string[];
  tips?: string[];
  icono?: string;
}

export interface ManualChapter {
  id: string;
  capitulo: number;
  titulo: string;
  descripcion: string;
  icono: string;
  secciones: ManualSectionItem[];
}

// ═══════════════════════════════════════════════════════════
// APARIENCIA Y PERSONALIZACIÓN EN VIVO
// ═══════════════════════════════════════════════════════════

export interface HeaderConfig {
  showLogo: boolean;
  showAppName: boolean;
  showSearch: boolean;
  showNotifications: boolean;
  showAvatar: boolean;
  showUserRoleBadge: boolean;
  bgColor: string;
  textColor: string;
  heightPx: number;
  isSticky: boolean;
  transparentOnTop: boolean;
}

export interface SidebarConfig {
  position: 'left' | 'right';
  collapsible: boolean;
  showByDefault: boolean;
  bgColor: string;
  activeItemColor: string;
  iconSize: 'sm' | 'md' | 'lg';
}

export interface BottomNavConfig {
  enabled: boolean;
  activeColor: string;
  inactiveColor: string;
  items: {
    id: string;
    label: string;
    icon: string;
    view: AppView;
    visible: boolean;
  }[];
}

export interface ButtonStyleConfig {
  style: 'rounded' | 'square' | 'pill';
  shadow: 'none' | 'soft' | 'medium' | 'strong';
  hoverAnimation: 'scale' | 'glow' | 'lift' | 'none';
}

export interface AppearanceConfig {
  appName: string;
  description: string;
  slogan: string;
  footerText: string;
  copyright: string;
  logoUrl?: string;
  faviconUrl?: string;
  logoDarkUrl?: string;
  heroBannerUrl?: string;
  advisorPhotoUrl?: string;
  customSampleUrl?: string;
  pwaIcon192Url?: string;
  pwaIcon512Url?: string;
  themeColorPwa: string;
  header: HeaderConfig;
  sidebar: SidebarConfig;
  bottomNav: BottomNavConfig;
  buttons: ButtonStyleConfig;
  fontHeadings: 'Playfair Display' | 'Inter' | 'Poppins' | 'Montserrat' | 'Lora' | 'Cormorant Garamond';
  fontBody: 'Inter' | 'Plus Jakarta Sans' | 'Roboto' | 'Open Sans';
  baseFontSizePx: number;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// ═══════════════════════════════════════════════════════════
// REDES SOCIALES, WHATSAPP & CONTACTO
// ═══════════════════════════════════════════════════════════

export interface SocialLinksConfig {
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  pinterest: string;
  threads: string;
  // WhatsApp flotante
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappHours: string;
  whatsappActive: boolean;
  whatsappPosition: 'right' | 'left';
  whatsappColor: string;
  whatsappIcon: 'whatsapp' | 'telegram' | 'chat';
  // Teléfono & Email
  telefono: string;
  emailSoporte: string;
  emailVentas: string;
  // Dirección física (Concepción / Biobío)
  direccion: string;
  ciudad: string;
  region: string;
  pais: string;
}

// ═══════════════════════════════════════════════════════════
// SEGURIDAD & REGISTRO CONFIG
// ═══════════════════════════════════════════════════════════

export interface SecurityConfig {
  // Opciones de Registro
  allowGoogle: boolean;
  allowFacebook: boolean;
  allowEmail: boolean;
  requireEmailVerification: boolean;
  requireAdminApproval: boolean;
  allowInvitation: boolean;
  invitationCodeRequired: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  // Contraseña
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumber: boolean;
  passwordRequireSymbol: boolean;
  passwordExpirationDays: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  // Sesión
  sessionDurationHours: number;
  rememberSessionEnabled: boolean;
  autoLogoutMinutes: number;
  allowMultipleDevices: boolean;
  maxConcurrentDevices: number;
  // 2FA
  enable2FA: boolean;
  require2FAAdmin: boolean;
  twoFactorMethods: ('email' | 'sms' | 'app')[];
  // Protección
  enableRateLimit: boolean;
  maxAttemptsPerIpHour: number;
  enableCaptcha: boolean;
  blockSuspiciousIps: boolean;
  whitelistedIps: string;
  // Log y Auditoría
  enableLoginLog: boolean;
  enableCriticalChangesLog: boolean;
  notifyAdminSuspiciousLogin: boolean;
  logRetentionDays: number;
  // Cuenta de usuaria
  allowCloseAccount: boolean;
  gracePeriodDays: number;
  allowReactivate: boolean;
  allowManualPermanentDelete: boolean;
  // Textos Legales
  termsAndConditions: string;
  privacyPolicy: string;
  cookiePolicy: string;
  lastLegalUpdate: string;
}

// ═══════════════════════════════════════════════════════════
// API KEYS & INTEGRACIONES
// ═══════════════════════════════════════════════════════════

export interface ApiKeyRecord {
  id: string;
  service: 'gemini' | 'firebase' | 'cloudflare_d1' | 'cloudflare_r2' | 'cloudflare_kv' | 'payment_gateway';
  name: string;
  keyMasked: string;
  consumptionTokens: number;
  limitTokens: number;
  status: 'active' | 'warning' | 'paused' | 'expired';
  costAccumulatedUSD: number;
  expiresAt?: string;
  lastUsedAt?: string;
}

// ═══════════════════════════════════════════════════════════
// ROLES Y PERMISOS
// ═══════════════════════════════════════════════════════════

export interface RolePermissionMatrix {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: {
    dashboardView: boolean;
    visitsView: boolean;
    manualEdit: boolean;
    appearanceEdit: boolean;
    socialLinksEdit: boolean;
    securityEdit: boolean;
    usersManage: boolean;
    plansManage: boolean;
    databaseAccess: boolean;
    backupManage: boolean;
    monitoringView: boolean;
    apiKeysManage: boolean;
    rolesManage: boolean;
    alertsManage: boolean;
    downloadsAccess: boolean;
  };
}

// ═══════════════════════════════════════════════════════════
// BACKUP & RESTORE
// ═══════════════════════════════════════════════════════════

export interface BackupSnapshot {
  id: string;
  name: string;
  createdAt: string;
  sizeBytes: number;
  sizeFormatted: string;
  type: 'full_system' | 'user_profile' | 'scheduled';
  userId?: string;
  userEmail?: string;
  version: string;
  encrypted: boolean;
  itemCounts: {
    users?: number;
    analyses: number;
    logs?: number;
    visits?: number;
  };
  payload: {
    user?: UserProfile;
    analyses?: AnalysisResult[];
    allUsers?: UserProfile[];
    adminLogs?: AdminLog[];
    visits?: VisitRecord[];
    appearance?: AppearanceConfig;
    socialLinks?: SocialLinksConfig;
    security?: SecurityConfig;
    metadata?: {
      exportedAt: string;
      app: string;
      version: string;
    };
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'expiring_soon' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  autoRenew: boolean;
  daysRemaining?: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetUserId?: string;
  targetEmail?: string;
  timestamp: string;
  details: string;
}

export type AppView = 
  | 'landing' 
  | 'analyzer-select' 
  | 'analyzer-photo' 
  | 'analyzer-quiz' 
  | 'result' 
  | 'virtual-drape' 
  | 'seasons-guide' 
  | 'profile' 
  | 'admin'
  | 'manual'
  | 'dna-survey';

// Plan Management
export interface PlanDefinition {
  id: string;
  name: string;
  slug?: string;
  badge?: string;
  price: number;
  priceYearly?: number;
  billingPeriod: 'monthly' | 'yearly' | 'one_time';
  currency: string;
  description: string;
  features: string[];
  queryLimit?: number; // Límite consultas AI
  orderIndex?: number;
  isActive: boolean;
  isPopular?: boolean;
  colorTheme?: string;
}

// App Theme Config
export interface AppThemeConfig {
  id: string;
  name: string;
  description: string;
  category: 'light' | 'dark' | 'variety';
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  borderColor: string;
  previewColors: string[];
}

// Server Telemetry & Monitoring
export interface ServerMetricSnapshot {
  cpuUsagePercent: number;
  cpuCores: number;
  cpuLoadAvg: number[];
  memoryUsedMB: number;
  memoryTotalMB: number;
  memoryUsagePercent: number;
  diskUsedGB: number;
  diskTotalGB: number;
  diskUsagePercent: number;
  r2StorageUsedGB: number;
  r2StorageLimitGB: number;
  uptimeHours: number;
  tokenConsumptionToday: number;
  tokenConsumptionMonth: number;
  tokenLimitDaily: number;
  tokenCostUSD: number;
  apiRequestsToday: number;
  apiRequestsPerMinute: number;
  apiSuccessRate: number;
  apiAvgLatencyMs: number;
  errors4xxToday: number;
  errors5xxToday: number;
  apiEndpoints: {
    path: string;
    calls: number;
    avgMs: number;
    status: number;
  }[];
  servicesHealth: {
    name: string;
    status: 'operational' | 'degraded' | 'outage';
    latencyMs: number;
    uptimePercent: number;
  }[];
  timestamp: string;
}

export interface ThresholdAlertConfig {
  subscriptionNoticeDays: number; // default: 15
  cpuThresholdPercent: number; // default: 80
  tokenQuotaThresholdPercent: number; // default: 85
  diskThresholdPercent: number; // default: 85
}

export interface SystemAlert {
  id: string;
  type: 'subscription_expiry' | 'cpu_high' | 'token_quota' | 'disk_storage' | 'security' | 'storage_r2';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  targetUserId?: string;
  targetUserEmail?: string;
  daysRemaining?: number;
  createdAt: string;
  isRead: boolean;
  actionRequired?: string;
}

export interface GeoVisitStat {
  id: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  state: string;
  city: string;
  visits: number;
  uniqueVisitors: number;
  conversionRatePercent: number;
  avgDurationMinutes: number;
  lastVisitAt: string;
}

export interface UserSessionLog {
  id: string;
  ip: string;
  city: string;
  country: string;
  flagEmoji: string;
  userId?: string;
  userEmail?: string;
  displayName?: string;
  startedAt: string;
  lastActiveAt: string;
  durationSeconds: number;
  device: string;
  os: string;
  browser: string;
  pagesVisited: string[];
  status: 'active' | 'ended';
}
