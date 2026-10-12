import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  BarChart3, 
  Globe, 
  BookOpen, 
  Palette, 
  Share2, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Database, 
  Cloud, 
  Activity, 
  KeyRound, 
  UserCheck, 
  Bell, 
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Cpu,
  HardDrive,
  Terminal,
  Send,
  Eye,
  Lock,
  MessageCircle,
  Copy,
  ChevronDown,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Sliders,
  Printer,
  FileText,
  Camera
} from 'lucide-react';
import { exportToExcel, exportVisitsToPDF, exportManualToPDF, exportManualToWord } from '../lib/exportUtils';
import { ImageUploaderWidget, PRESET_LOGO_EXAMPLE, PRESET_SAMPLE_PHOTO } from './ImageUploaderWidget';
import { AGE_GROUPS_CONFIG } from '../data/ageGroups';
import { VisitRecord, PlanDefinition, UserProfile, UserRole, UserPlan } from '../types';

export type AdminTab = 
  | 'dashboard'
  | 'visits'
  | 'manual'
  | 'appearance'
  | 'social'
  | 'security'
  | 'users'
  | 'plans'
  | 'database'
  | 'backups'
  | 'monitoring'
  | 'apikeys'
  | 'roles'
  | 'alerts'
  | 'downloads';

export const AdminPanel: React.FC = () => {
  const { 
    user, 
    allUsers, 
    visits, 
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
    updateUserRole, 
    updateUserPlan, 
    toggleUserStatus,
    deactivateAccount,
    reactivateAccount,
    scheduleAccountDeletion,
    cancelAccountDeletion,
    permanentlyDeleteAccount,
    plans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanActive,
    subscriptions,
    executeDatabaseMaintenance,
    serverMetrics,
    refreshServerMetrics,
    systemAlerts,
    dismissAlert,
    sendSubscriptionExpiryNotice,
    geoStats,
    backupSnapshots,
    createSystemBackup,
    restoreBackup,
    downloadBackup,
    deleteBackup,
    setCurrentView
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Tab 2: Visits state
  const [visitSearch, setVisitSearch] = useState('');
  const [visitCountryFilter, setVisitCountryFilter] = useState('all');
  const [visitDeviceFilter, setVisitDeviceFilter] = useState('all');
  const [visitDurationFilter, setVisitDurationFilter] = useState('all');

  // Tab 4: Appearance live controls
  const [tempAppearance, setTempAppearance] = useState(appearanceConfig);
  const [activeAppearanceSection, setActiveAppearanceSection] = useState<'logo' | 'identity' | 'header' | 'sidebar' | 'colors' | 'typography' | 'buttons'>('colors');

  // Tab 5: Social & WhatsApp form
  const [tempSocial, setTempSocial] = useState(socialConfig);

  // Tab 6: Security form
  const [tempSecurity, setTempSecurity] = useState(securityConfig);

  // Tab 7: Users filter
  const [userSearch, setUserSearch] = useState('');
  const [userGroupFilter, setUserGroupFilter] = useState('all');
  const [userPlanFilter, setUserPlanFilter] = useState('all');

  // Tab 8: Plans form & modal CRUD
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<{
    name: string;
    slug: string;
    badge: string;
    price: number;
    priceYearly: number;
    billingPeriod: 'monthly' | 'yearly' | 'one_time';
    currency: string;
    description: string;
    features: string[];
    queryLimit: number;
    isActive: boolean;
    isPopular: boolean;
    colorTheme: string;
  }>({
    name: '',
    slug: '',
    badge: 'VIP',
    price: 4.99,
    priceYearly: 49.99,
    billingPeriod: 'monthly',
    currency: 'USD',
    description: '',
    features: [
      'Paleta completa de 12 colores con códigos HEX y RGB',
      'Tocador de maquillaje y recomendaciones de moda',
      'Draping virtual ilimitado'
    ],
    queryLimit: 100,
    isActive: true,
    isPopular: false,
    colorTheme: 'rose',
  });
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const handleOpenCreatePlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      name: '',
      slug: '',
      badge: 'Nuevo VIP',
      price: 9.99,
      priceYearly: 89.99,
      billingPeriod: 'monthly',
      currency: 'USD',
      description: 'Acceso exclusivo a asesoría cromática avanzada y personalización.',
      features: [
        'Paleta completa de 12 colores con códigos HEX y RGB',
        'Tocador de maquillaje con tonos exactos',
        'Armario cápsula de 6 prendas clave',
        'Draping virtual ilimitado'
      ],
      queryLimit: 150,
      isActive: true,
      isPopular: false,
      colorTheme: 'purple',
    });
    setNewFeatureInput('');
    setPlanModalOpen(true);
  };

  const handleOpenEditPlan = (p: PlanDefinition) => {
    setEditingPlanId(p.id);
    setPlanForm({
      name: p.name,
      slug: p.slug || '',
      badge: p.badge || '',
      price: p.price,
      priceYearly: p.priceYearly || p.price * 10,
      billingPeriod: p.billingPeriod,
      currency: p.currency || 'USD',
      description: p.description,
      features: [...p.features],
      queryLimit: p.queryLimit || 100,
      isActive: p.isActive,
      isPopular: p.isPopular || false,
      colorTheme: p.colorTheme || 'rose',
    });
    setNewFeatureInput('');
    setPlanModalOpen(true);
  };

  const handleSavePlanForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showToast('Por favor escribe un nombre para el plan.');
      return;
    }

    if (editingPlanId) {
      updatePlan(editingPlanId, {
        name: planForm.name,
        slug: planForm.slug || planForm.name.toLowerCase().replace(/\s+/g, '-'),
        badge: planForm.badge,
        price: Number(planForm.price),
        priceYearly: Number(planForm.priceYearly),
        billingPeriod: planForm.billingPeriod,
        currency: planForm.currency,
        description: planForm.description,
        features: planForm.features.filter(f => f.trim().length > 0),
        queryLimit: Number(planForm.queryLimit),
        isActive: planForm.isActive,
        isPopular: planForm.isPopular,
        colorTheme: planForm.colorTheme,
      });
      showToast(`Plan "${planForm.name}" modificado con éxito.`);
    } else {
      createPlan({
        name: planForm.name,
        slug: planForm.slug || planForm.name.toLowerCase().replace(/\s+/g, '-'),
        badge: planForm.badge,
        price: Number(planForm.price),
        priceYearly: Number(planForm.priceYearly),
        billingPeriod: planForm.billingPeriod,
        currency: planForm.currency,
        description: planForm.description,
        features: planForm.features.filter(f => f.trim().length > 0),
        queryLimit: Number(planForm.queryLimit),
        isActive: planForm.isActive,
        isPopular: planForm.isPopular,
        colorTheme: planForm.colorTheme,
      });
      showToast(`Plan "${planForm.name}" creado con éxito.`);
    }
    setPlanModalOpen(false);
  };

  const handleDeletePlanItem = (id: string, name: string) => {
    if (confirm(`¿Estás segura de eliminar el plan "${name}"? Esta acción no se puede deshacer.`)) {
      deletePlan(id);
      showToast(`Plan "${name}" eliminado.`);
    }
  };

  const handleAddFeatureToPlan = () => {
    if (!newFeatureInput.trim()) return;
    setPlanForm({
      ...planForm,
      features: [...planForm.features, newFeatureInput.trim()]
    });
    setNewFeatureInput('');
  };

  const handleRemoveFeatureFromPlan = (idx: number) => {
    setPlanForm({
      ...planForm,
      features: planForm.features.filter((_, i) => i !== idx)
    });
  };

  const handleFeatureTextChange = (idx: number, text: string) => {
    const updated = [...planForm.features];
    updated[idx] = text;
    setPlanForm({ ...planForm, features: updated });
  };

  // Tab 9: Database Workbench
  const [selectedDbTable, setSelectedDbTable] = useState('users');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users WHERE status = "active" LIMIT 10;');
  const [sqlResult, setSqlResult] = useState<string | null>(null);
  const [sqlAllowWrite, setSqlAllowWrite] = useState(false);

  // Tab 12: API Keys
  const [newKeyService, setNewKeyService] = useState<'gemini' | 'firebase' | 'cloudflare_d1' | 'cloudflare_r2'>('gemini');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  // Tab 10: Backup
  const [backupNameInput, setBackupNameInput] = useState('');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ═══════════════════════════════════════════════════════════
  // FILTERED VISITS
  // ═══════════════════════════════════════════════════════════
  const filteredVisits = visits.filter(v => {
    const matchesSearch = !visitSearch.trim() || 
      v.ipHash.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.ciudad.toLowerCase().includes(visitSearch.toLowerCase()) ||
      v.pagina.toLowerCase().includes(visitSearch.toLowerCase()) ||
      (v.displayName && v.displayName.toLowerCase().includes(visitSearch.toLowerCase()));

    const matchesCountry = visitCountryFilter === 'all' || v.pais === visitCountryFilter;
    const matchesDevice = visitDeviceFilter === 'all' || v.dispositivo === visitDeviceFilter;
    
    let matchesDuration = true;
    if (visitDurationFilter === 'lt_10s') matchesDuration = v.duracionSegundos < 10;
    else if (visitDurationFilter === '10s_1m') matchesDuration = v.duracionSegundos >= 10 && v.duracionSegundos <= 60;
    else if (visitDurationFilter === '1m_5m') matchesDuration = v.duracionSegundos > 60 && v.duracionSegundos <= 300;
    else if (visitDurationFilter === 'gt_5m') matchesDuration = v.duracionSegundos > 300;

    return matchesSearch && matchesCountry && matchesDevice && matchesDuration;
  });

  // Visits statistics
  const totalVisitsToday = visits.length;
  const avgDuration = Math.round(visits.reduce((acc, v) => acc + v.duracionSegundos, 0) / (visits.length || 1));
  const mobileVisitsPercent = Math.round((visits.filter(v => v.dispositivo === 'móvil').length / (visits.length || 1)) * 100);

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = !userSearch.trim() || 
      u.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase());
    const matchesGroup = userGroupFilter === 'all' || u.ageGroup === userGroupFilter;
    const matchesPlan = userPlanFilter === 'all' || u.plan === userPlanFilter;
    return matchesSearch && matchesGroup && matchesPlan;
  });

  const handleApplyAppearance = () => {
    updateAppearanceConfig(tempAppearance);
    showToast('¡Apariencia actualizada exitosamente y aplicada en vivo!');
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialConfig(tempSocial);
    showToast('Redes sociales y configuración de WhatsApp guardados.');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurityConfig(tempSecurity);
    showToast('Configuraciones de registro y seguridad actualizadas.');
  };

  const handleExecuteSql = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim()) return;

    if (!sqlAllowWrite && /(DROP|DELETE|UPDATE|ALTER|INSERT)/i.test(sqlQuery)) {
      setSqlResult('⚠️ Operación de escritura rechazada: la consola SQL está en modo Solo Lectura. Activa el interruptor para ejecutar sentencias DML/DDL.');
      return;
    }

    setSqlResult(`✓ Consulta ejecutada con éxito en Cloudflare D1. Filas afectadas: ${selectedDbTable === 'users' ? allUsers.length : 12}. Latencia: 14ms.`);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Superadmin Navigation Header */}
      <header className="h-16 bg-stone-950 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base font-bold text-white tracking-wide">
                Consola Superadmin Styled By Wilma
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700">
                MASTER v3.0
              </span>
            </div>
            <p className="text-[10px] text-stone-400">
              Concepción, Biobío, Chile &bull; Cloudflare D1 + R2 + KV &bull; Gemini 2.5 Flash Vision
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>CLT (Chile): {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <button
            onClick={() => setCurrentView('landing')}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Panel Layout: Vertical Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Vertical Sidebar (15 Sections) */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-stone-950 border-r border-stone-800 flex flex-col shrink-0 transition-all duration-200`}>
          <div className="p-3 border-b border-stone-800 flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                15 Módulos Maestros
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 text-xs cursor-pointer mx-auto"
              title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {[
              { id: 'dashboard', label: '1. Dashboard', icon: BarChart3 },
              { id: 'visits', label: '2. Visitas', icon: Globe, badge: '⭐ Nuevo' },
              { id: 'manual', label: '3. Guía y Manual', icon: BookOpen, badge: '⭐ Nuevo' },
              { id: 'appearance', label: '4. Apariencia', icon: Palette, badge: '⭐ Live' },
              { id: 'social', label: '5. Redes y WhatsApp', icon: Share2, badge: '⭐ Nuevo' },
              { id: 'security', label: '6. Seguridad & Registro', icon: ShieldCheck, badge: '⭐ Nuevo' },
              { id: 'users', label: '7. Gestión Usuarios', icon: Users },
              { id: 'plans', label: '8. Gestión de Planes', icon: CreditCard },
              { id: 'database', label: '9. Base de Datos D1', icon: Database },
              { id: 'backups', label: '10. Backup & Restore', icon: Cloud },
              { id: 'monitoring', label: '11. Monitoreo', icon: Activity },
              { id: 'apikeys', label: '12. API Keys', icon: KeyRound },
              { id: 'roles', label: '13. Roles & Permisos', icon: UserCheck },
              { id: 'alerts', label: '14. Alertas & Umbrales', icon: Bell, alertCount: systemAlerts.length },
              { id: 'downloads', label: '15. Descargas & Reportes', icon: Download },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 font-bold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700 shrink-0">
                      {item.badge}
                    </span>
                  )}
                  {!sidebarCollapsed && item.alertCount && item.alertCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white shrink-0 font-bold">
                      {item.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-900 space-y-6">
          
          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 1: DASHBOARD */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <span>Panel de Control & Estadísticas Full</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Métricas consolidadas de visitas, usuarios, consumo de tokens y servidores Cloudflare.
                  </p>
                </div>

                <button
                  onClick={refreshServerMetrics}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-stone-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualizar Métricas</span>
                </button>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[11px] text-stone-400 font-medium">Visitas Hoy / Total</span>
                  <p className="text-2xl font-bold text-white">{totalVisitsToday} <span className="text-xs text-stone-500 font-normal">/ 18,450</span></p>
                  <p className="text-[10px] text-emerald-400 font-semibold">+14.2% vs semana anterior</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[11px] text-stone-400 font-medium">Usuarios Registrados</span>
                  <p className="text-2xl font-bold text-white">{allUsers.length} <span className="text-xs text-stone-500 font-normal">activos</span></p>
                  <p className="text-[10px] text-purple-400 font-semibold">6 grupos de edad configurados</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[11px] text-stone-400 font-medium">Ingresos Estimados</span>
                  <p className="text-2xl font-bold text-emerald-400">$849.50 <span className="text-xs text-stone-500 font-normal">USD/mes</span></p>
                  <p className="text-[10px] text-stone-400 font-semibold">Suscripciones VIP y anuales</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                  <span className="text-[11px] text-stone-400 font-medium">Tokens Gemini AI Hoy</span>
                  <p className="text-2xl font-bold text-amber-400">{serverMetrics.tokenConsumptionToday.toLocaleString()}</p>
                  <p className="text-[10px] text-amber-400/80 font-semibold">Costo: ${(serverMetrics.tokenCostUSD).toFixed(3)} USD</p>
                </div>
              </div>

              {/* Telemetry Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-300">Uso de CPU</span>
                    <span className="font-mono text-purple-400">{serverMetrics.cpuUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${serverMetrics.cpuUsagePercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-stone-500">4 núcleos virtuales Cloudflare Worker</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-300">Memoria RAM</span>
                    <span className="font-mono text-purple-400">{serverMetrics.memoryUsagePercent}%</span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all"
                      style={{ width: `${serverMetrics.memoryUsagePercent}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-stone-500">{serverMetrics.memoryUsedMB} MB / 4096 MB</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-300">Storage R2 (Fotos)</span>
                    <span className="font-mono text-purple-400">{serverMetrics.r2StorageUsedGB} GB</span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${(serverMetrics.r2StorageUsedGB / serverMetrics.r2StorageLimitGB) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-stone-500">Límite asignado: {serverMetrics.r2StorageLimitGB} GB</p>
                </div>
              </div>

              {/* Charts Visualizations Mock Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Visitas Últimos 30 Días (Línea)</span>
                    <span className="text-[10px] text-stone-500">Promedio: 615 / día</span>
                  </h3>
                  <div className="h-40 flex items-end gap-1.5 pt-4 pb-2">
                    {[45, 52, 60, 48, 70, 85, 90, 78, 65, 80, 95, 110, 85, 92, 105, 115, 120, 110, 95, 130, 140, 125, 135, 150, 145, 160, 175, 165, 180, 190].map((val, idx) => (
                      <div key={idx} className="flex-1 bg-purple-600/60 hover:bg-purple-500 rounded-t-xs transition-colors" style={{ height: `${(val / 200) * 100}%` }} title={`Día ${idx + 1}: ${val * 4} visitas`}></div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center justify-between">
                    <span>Top Países Visitantes</span>
                    <span className="text-[10px] text-stone-500">Chile lidera</span>
                  </h3>
                  <div className="space-y-2 pt-1 text-xs">
                    {geoStats.slice(0, 4).map((g) => (
                      <div key={g.id} className="space-y-1">
                        <div className="flex justify-between text-stone-300 text-[11px]">
                          <span>{g.flagEmoji} {g.country} ({g.city})</span>
                          <span className="font-bold">{g.visits.toLocaleString()} visitas</span>
                        </div>
                        <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-rose-400 h-full rounded-full"
                            style={{ width: `${(g.visits / 6000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 2: VISITAS (REGISTRO COMPLETO ⭐ NUEVO) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'visits' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-purple-400" />
                    <span>Registro Completo de Visitas & Audiencia</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Auditoría de tráfico en Cloudflare D1: IP anonimizada, geolocalización, duración y dispositivo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      exportToExcel(
                        filteredVisits.map(v => ({
                          ID: v.id,
                          IP_Hash: v.ipHash,
                          Pais: v.pais,
                          Ciudad: v.ciudad,
                          Pagina: v.pagina,
                          Dispositivo: v.dispositivo,
                          Navegador: v.navegador,
                          SO: v.so,
                          Hora: v.horaEntrada,
                          Fecha: v.fecha,
                          Duracion_Seg: v.duracionSegundos,
                          Usuario: v.displayName || 'Anonimo'
                        })),
                        'Visitas-StyledByWilma'
                      );
                      showToast('Archivo Excel descargado con éxito.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Excel</span>
                  </button>

                  <button
                    onClick={() => {
                      exportVisitsToPDF(filteredVisits);
                      showToast('Informe de visitas en PDF generado.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Exportar PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('¿Deseas limpiar registros antiguos mayores a 30 días?')) {
                        cleanupVisitRecords(30);
                        showToast('Registros antiguos depurados de D1.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Limpiar Historial
                  </button>
                </div>
              </div>

              {/* Visits Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Total Visitas Hoy</span>
                  <p className="text-lg font-bold text-white">{totalVisitsToday}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Duración Promedio</span>
                  <p className="text-lg font-bold text-purple-400">{avgDuration} segundos</p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Tráfico Móvil</span>
                  <p className="text-lg font-bold text-teal-400">{mobileVisitsPercent}%</p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400">Ciudad Top</span>
                  <p className="text-lg font-bold text-amber-400">Concepción (Biobío)</p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Buscar por IP, Página o Usuario</label>
                  <input
                    type="text"
                    value={visitSearch}
                    onChange={(e) => setVisitSearch(e.target.value)}
                    placeholder="Filtrar..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">País</label>
                  <select
                    value={visitCountryFilter}
                    onChange={(e) => setVisitCountryFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="all">Todos los países</option>
                    <option value="Chile">Chile</option>
                    <option value="México">México</option>
                    <option value="España">España</option>
                    <option value="Argentina">Argentina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Dispositivo</label>
                  <select
                    value={visitDeviceFilter}
                    onChange={(e) => setVisitDeviceFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="all">Todos</option>
                    <option value="móvil">Móvil</option>
                    <option value="tablet">Tablet</option>
                    <option value="escritorio">Escritorio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Duración Sesión</label>
                  <select
                    value={visitDurationFilter}
                    onChange={(e) => setVisitDurationFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white"
                  >
                    <option value="all">Cualquier duración</option>
                    <option value="lt_10s">&lt; 10 seg (Rebote)</option>
                    <option value="10s_1m">10 seg - 1 min</option>
                    <option value="1m_5m">1 min - 5 min</option>
                    <option value="gt_5m">&gt; 5 min (Sesión profunda)</option>
                  </select>
                </div>
              </div>

              {/* Complete Visits Table */}
              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900/80 text-stone-400 text-[10px] uppercase tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">IP (Hash)</th>
                      <th className="p-3">País / Ciudad</th>
                      <th className="p-3">Página</th>
                      <th className="p-3">Dispositivo / SO</th>
                      <th className="p-3">Hora / Fecha</th>
                      <th className="p-3">Duración</th>
                      <th className="p-3">Usuario</th>
                      <th className="p-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-stone-900/50">
                        <td className="p-3 font-mono text-[11px] text-stone-500">{v.id}</td>
                        <td className="p-3 font-mono text-purple-300 text-[11px]">{v.ipHash}</td>
                        <td className="p-3">
                          <span className="font-semibold text-stone-200">{v.flagEmoji} {v.pais}</span>
                          <span className="block text-[10px] text-stone-400">{v.ciudad} ({v.region})</span>
                        </td>
                        <td className="p-3 font-mono text-stone-300 text-[11px]">{v.pagina}</td>
                        <td className="p-3">
                          <span className="capitalize text-stone-200">{v.dispositivo}</span>
                          <span className="block text-[10px] text-stone-500">{v.navegador} &bull; {v.so}</span>
                        </td>
                        <td className="p-3 text-[11px] text-stone-400">
                          {v.horaEntrada}
                          <span className="block text-[10px] text-stone-500">{v.fecha}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            v.duracionSegundos > 300 
                              ? 'bg-emerald-950 text-emerald-300' 
                              : v.duracionSegundos > 60 
                              ? 'bg-purple-950 text-purple-300' 
                              : 'bg-stone-800 text-stone-400'
                          }`}>
                            {v.duracionSegundos}s
                          </span>
                        </td>
                        <td className="p-3">
                          {v.displayName ? (
                            <span className="text-rose-300 font-semibold">{v.displayName}</span>
                          ) : (
                            <span className="text-stone-500 italic">Anónimo</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              deleteVisitRecord(v.id);
                              showToast('Registro eliminado.');
                            }}
                            className="p-1 hover:text-red-400 text-stone-500 cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 3: GUÍA Y MANUAL COMPLETO (11 CAPÍTULOS) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'manual' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    <span>Gestión del Manual & Guía de la Aplicación</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Edición directa de los 11 capítulos de la aplicación y exportación en PDF/Word.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => exportManualToPDF(manualChapters)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar PDF</span>
                  </button>
                  <button
                    onClick={() => exportManualToWord(manualChapters)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Descargar Word</span>
                  </button>
                </div>
              </div>

              {/* Chapters Accordion / Editor */}
              <div className="space-y-4">
                {manualChapters.map((ch) => (
                  <div key={ch.id} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-purple-900 text-purple-200 text-xs font-bold flex items-center justify-center">
                          {ch.capitulo}
                        </span>
                        <div>
                          <h3 className="font-serif text-base font-bold text-white">
                            Capítulo {ch.capitulo}: {ch.titulo}
                          </h3>
                          <p className="text-xs text-stone-400">{ch.descripcion}</p>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500">{ch.secciones.length} secciones</span>
                    </div>

                    <div className="pl-10 space-y-2 pt-2 border-t border-stone-900">
                      {ch.secciones.map((sec) => (
                        <div key={sec.id} className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/80 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-mono text-purple-400 font-bold mr-2">{sec.subseccion}</span>
                            <span className="font-semibold text-stone-200">{sec.titulo}</span>
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{sec.contenido[0]}</p>
                          </div>
                          <button
                            onClick={() => {
                              const newText = prompt('Modificar primer párrafo de contenido:', sec.contenido[0]);
                              if (newText) {
                                updateManualSection(ch.id, sec.id, [newText, ...sec.contenido.slice(1)]);
                                showToast('Sección del manual actualizada.');
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-white cursor-pointer"
                            title="Editar texto"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 4: APARIENCIA (LIVE EDITOR ⭐ AMPLIADO) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Palette className="w-6 h-6 text-purple-400" />
                    <span>Editor en Vivo de Apariencia & Branding</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Personaliza paletas pastel, logos, barra superior, tipografías y botones con previsualización al instante.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetAppearanceConfig();
                      setTempAppearance(appearanceConfig);
                      showToast('Predeterminados restaurados.');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={handleApplyAppearance}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Aplicar Cambios en Vivo
                  </button>
                </div>
              </div>

              {/* Split Screen Editor: Left Controls + Right Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Controls Column */}
                <div className="lg:col-span-7 bg-stone-950 p-6 rounded-3xl border border-stone-800 space-y-6">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-1.5 p-1 bg-stone-900 rounded-2xl">
                    {[
                      { id: 'colors', label: 'Colores' },
                      { id: 'logo', label: 'Imágenes, Logo & Cámara' },
                      { id: 'header', label: 'Header' },
                      { id: 'typography', label: 'Tipografía' },
                      { id: 'buttons', label: 'Botones CTA' }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveAppearanceSection(sub.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeAppearanceSection === sub.id
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* Colors Controls */}
                  {activeAppearanceSection === 'colors' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Color Primario (Rose Soft)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={tempAppearance.colors.primary}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, primary: e.target.value }
                              })}
                              className="w-9 h-9 rounded-lg border border-stone-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={tempAppearance.colors.primary}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, primary: e.target.value }
                              })}
                              className="w-24 px-2 py-1 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Color Secundario (Sage Green)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={tempAppearance.colors.secondary}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, secondary: e.target.value }
                              })}
                              className="w-9 h-9 rounded-lg border border-stone-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={tempAppearance.colors.secondary}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, secondary: e.target.value }
                              })}
                              className="w-24 px-2 py-1 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Color Acento (Soft Gold)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={tempAppearance.colors.accent}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, accent: e.target.value }
                              })}
                              className="w-9 h-9 rounded-lg border border-stone-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={tempAppearance.colors.accent}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, accent: e.target.value }
                              })}
                              className="w-24 px-2 py-1 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Color Fondo (Light Beige)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={tempAppearance.colors.background}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, background: e.target.value }
                              })}
                              className="w-9 h-9 rounded-lg border border-stone-700 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={tempAppearance.colors.background}
                              onChange={(e) => setTempAppearance({
                                ...tempAppearance,
                                colors: { ...tempAppearance.colors, background: e.target.value }
                              })}
                              className="w-24 px-2 py-1 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Presets */}
                      <div className="pt-2">
                        <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Presets de Color:</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Suave (Default)', pri: '#E8B4B8', sec: '#A8B5A0', acc: '#D4A574', bg: '#FAF7F2' },
                            { name: 'Pastel Femenino', pri: '#F472B6', sec: '#A78BFA', acc: '#FBBF24', bg: '#FFFDF9' },
                            { name: 'Rose Haute-Couture', pri: '#E11D48', sec: '#9F1239', acc: '#F59E0B', bg: '#FAF8F6' },
                            { name: 'Esmeralda & Oro', pri: '#059669', sec: '#047857', acc: '#D97706', bg: '#F0FDF4' }
                          ].map(preset => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setTempAppearance({
                                ...tempAppearance,
                                colors: {
                                  ...tempAppearance.colors,
                                  primary: preset.pri,
                                  secondary: preset.sec,
                                  accent: preset.acc,
                                  background: preset.bg
                                }
                              })}
                              className="px-2.5 py-1 text-[11px] bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xl text-stone-200 cursor-pointer"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Logo, Images, Camera & Identity */}
                  {activeAppearanceSection === 'logo' && (
                    <div className="space-y-5 animate-in fade-in">
                      {/* Notice Banner */}
                      <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <Camera className="w-4 h-4 text-purple-400" />
                          <span>Subida y Cambio de Imágenes Multi-Dispositivo</span>
                        </div>
                        <p className="text-[11px] text-stone-300 leading-relaxed">
                          Puedes subir y cambiar todas las imágenes desde tu teléfono móvil, tablet, computadora o capturarlas directamente con la cámara. Incluye la opción de cargar un ejemplo personalizado de logo para probar el diseño.
                        </p>
                      </div>

                      {/* 1. Logo Principal de la Aplicación */}
                      <ImageUploaderWidget
                        label="Logo Principal de la Aplicación"
                        sublabel="Visible en la cabecera, inicio, footer y tarjetas de resultados compartidas."
                        currentImageUrl={tempAppearance.logoUrl}
                        onImageChange={(val) => setTempAppearance({ ...tempAppearance, logoUrl: val })}
                        presetExampleUrl={PRESET_LOGO_EXAMPLE}
                        presetExampleLabel="Cargar Ejemplo Personalizado de Logo (Haute Couture)"
                        recommendedSize="512 x 512 px (PNG / WebP con fondo transparente)"
                        aspectRatio="square"
                      />

                      {/* 2. Logo para Fondo Oscuro */}
                      <ImageUploaderWidget
                        label="Logo Versión Oscura (Dark Mode)"
                        sublabel="Variante alternativa para temas oscuros o contrastes nocturnos."
                        currentImageUrl={tempAppearance.logoDarkUrl}
                        onImageChange={(val) => setTempAppearance({ ...tempAppearance, logoDarkUrl: val })}
                        recommendedSize="512 x 512 px"
                        aspectRatio="square"
                      />

                      {/* 3. Banner de Portada / Bienvenida */}
                      <ImageUploaderWidget
                        label="Banner de Portada / Hero del Atelier"
                        sublabel="Imagen destacada para la cabecera del portal y tarjetas de bienvenida."
                        currentImageUrl={tempAppearance.heroBannerUrl}
                        onImageChange={(val) => setTempAppearance({ ...tempAppearance, heroBannerUrl: val })}
                        presetExampleUrl={PRESET_SAMPLE_PHOTO}
                        presetExampleLabel="Cargar Ejemplo de Portada Atelier"
                        recommendedSize="1200 x 600 px (Formato panorámico)"
                        aspectRatio="wide"
                      />

                      {/* 4. Fotografía de la Asesora (Wilma Hernández) */}
                      <ImageUploaderWidget
                        label="Fotografía Oficial de la Asesora (Wilma Hernández)"
                        sublabel="Se muestra en el widget de WhatsApp, contacto presencial y credencial."
                        currentImageUrl={tempAppearance.advisorPhotoUrl}
                        onImageChange={(val) => setTempAppearance({ ...tempAppearance, advisorPhotoUrl: val })}
                        recommendedSize="400 x 400 px (Retrato cuadrado)"
                        aspectRatio="avatar"
                      />

                      {/* 5. Ejemplo Personalizado de Prueba / Muestra de Draping */}
                      <ImageUploaderWidget
                        label="Ejemplo Personalizado de Muestra (Catálogo / Draping)"
                        sublabel="Fotografía o mockup de demostración para clientes y sesiones presenciales."
                        currentImageUrl={tempAppearance.customSampleUrl}
                        onImageChange={(val) => setTempAppearance({ ...tempAppearance, customSampleUrl: val })}
                        recommendedSize="600 x 600 px"
                        aspectRatio="square"
                      />

                      {/* Identity Text Inputs */}
                      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 pt-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Textos de Identidad de Marca
                        </h4>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1 text-xs">Nombre de la Aplicación</label>
                          <input
                            type="text"
                            value={tempAppearance.appName}
                            onChange={(e) => setTempAppearance({ ...tempAppearance, appName: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1 text-xs">Eslogan</label>
                          <input
                            type="text"
                            value={tempAppearance.slogan}
                            onChange={(e) => setTempAppearance({ ...tempAppearance, slogan: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1 text-xs">Descripción de la App</label>
                          <textarea
                            rows={2}
                            value={tempAppearance.description}
                            onChange={(e) => setTempAppearance({ ...tempAppearance, description: e.target.value })}
                            className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Header Settings */}
                  {activeAppearanceSection === 'header' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 bg-stone-900 rounded-xl">
                        <span className="text-xs text-stone-200">Mostrar Logo</span>
                        <input
                          type="checkbox"
                          checked={tempAppearance.header.showLogo}
                          onChange={(e) => setTempAppearance({
                            ...tempAppearance,
                            header: { ...tempAppearance.header, showLogo: e.target.checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-stone-900 rounded-xl">
                        <span className="text-xs text-stone-200">Encabezado Fijo (Sticky)</span>
                        <input
                          type="checkbox"
                          checked={tempAppearance.header.isSticky}
                          onChange={(e) => setTempAppearance({
                            ...tempAppearance,
                            header: { ...tempAppearance.header, isSticky: e.target.checked }
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-300 mb-1">Altura del Header: {tempAppearance.header.heightPx}px</label>
                        <input
                          type="range"
                          min={56}
                          max={96}
                          value={tempAppearance.header.heightPx}
                          onChange={(e) => setTempAppearance({
                            ...tempAppearance,
                            header: { ...tempAppearance.header, heightPx: Number(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Typography Settings */}
                  {activeAppearanceSection === 'typography' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">Fuente de Títulos</label>
                        <select
                          value={tempAppearance.fontHeadings}
                          onChange={(e) => setTempAppearance({ ...tempAppearance, fontHeadings: e.target.value as any })}
                          className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                        >
                          <option value="Playfair Display">Playfair Display (Elegante clásico)</option>
                          <option value="Cormorant Garamond">Cormorant Garamond (Haute Couture)</option>
                          <option value="Inter">Inter (Moderno limpio)</option>
                          <option value="Poppins">Poppins (Geométrico contemporáneo)</option>
                          <option value="Montserrat">Montserrat (Editorial)</option>
                          <option value="Lora">Lora (Literario suave)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Tamaño Base de Fuente: {tempAppearance.baseFontSizePx}px
                        </label>
                        <input
                          type="range"
                          min={14}
                          max={20}
                          value={tempAppearance.baseFontSizePx}
                          onChange={(e) => setTempAppearance({ ...tempAppearance, baseFontSizePx: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  {activeAppearanceSection === 'buttons' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">Estilo de Bordes</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['rounded', 'square', 'pill'] as const).map(st => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setTempAppearance({
                                ...tempAppearance,
                                buttons: { ...tempAppearance.buttons, style: st }
                              })}
                              className={`py-2 text-xs font-bold rounded-xl border capitalize cursor-pointer ${
                                tempAppearance.buttons.style === st
                                  ? 'border-purple-500 bg-purple-950 text-purple-200'
                                  : 'border-stone-800 bg-stone-900 text-stone-400'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Live Preview Box */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 text-stone-800 shadow-xl border border-stone-200 space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Previsualización en Vivo de la Interfaz
                  </span>

                  {/* Mini Preview Header */}
                  <div 
                    style={{ backgroundColor: tempAppearance.header.bgColor, color: tempAppearance.header.textColor }}
                    className="p-3 rounded-2xl border border-stone-200 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        style={{ backgroundColor: tempAppearance.colors.primary }}
                        className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs"
                      >
                        W
                      </div>
                      <span className="font-bold text-xs">{tempAppearance.appName}</span>
                    </div>
                    <span 
                      style={{ color: tempAppearance.colors.primary }}
                      className="text-[10px] font-bold"
                    >
                      Menú
                    </span>
                  </div>

                  {/* Mini Preview Hero Card */}
                  <div 
                    style={{ backgroundColor: tempAppearance.colors.background }}
                    className="p-5 rounded-2xl border border-stone-200 space-y-3"
                  >
                    <span 
                      style={{ color: tempAppearance.colors.secondary }}
                      className="text-[10px] font-extrabold uppercase tracking-widest block"
                    >
                      Colorimetría & Imagen
                    </span>
                    <h4 
                      style={{ fontFamily: tempAppearance.fontHeadings }}
                      className="text-lg font-bold text-stone-900 leading-tight"
                    >
                      {tempAppearance.slogan || 'Descubre tus colores de poder'}
                    </h4>

                    <div className="flex gap-2 pt-1">
                      <button
                        style={{ 
                          backgroundColor: tempAppearance.colors.primary,
                          borderRadius: tempAppearance.buttons.style === 'pill' ? '9999px' : tempAppearance.buttons.style === 'square' ? '4px' : '12px'
                        }}
                        className="px-4 py-2 text-white font-bold text-xs shadow-xs"
                      >
                        Iniciar Escaneo
                      </button>

                      <button
                        style={{ 
                          borderColor: tempAppearance.colors.accent,
                          color: tempAppearance.colors.accent,
                          borderRadius: tempAppearance.buttons.style === 'pill' ? '9999px' : tempAppearance.buttons.style === 'square' ? '4px' : '12px'
                        }}
                        className="px-3 py-2 bg-white border font-bold text-xs"
                      >
                        12 Estaciones
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 text-center italic">
                    Los cambios aplicados se reflejan inmediatamente en todas las vistas de la PWA.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 5: REDES SOCIALES & WHATSAPP (CAMPOS EN BLANCO) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'social' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-purple-400" />
                    <span>Redes Sociales, WhatsApp & Datos de Contacto</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Campos en blanco editables por superadmin (los campos vacíos se ocultan automáticamente en la web).
                  </p>
                </div>

                <button
                  onClick={handleSaveSocial}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>

              <form onSubmit={handleSaveSocial} className="space-y-6">
                {/* 8 Social Media Links */}
                <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Redes Sociales de la Aplicación (Dejar en blanco = Oculto)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={tempSocial.instagram}
                        onChange={(e) => setTempSocial({ ...tempSocial, instagram: e.target.value })}
                        placeholder="https://instagram.com/styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={tempSocial.facebook}
                        onChange={(e) => setTempSocial({ ...tempSocial, facebook: e.target.value })}
                        placeholder="https://facebook.com/styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">TikTok URL</label>
                      <input
                        type="text"
                        value={tempSocial.tiktok}
                        onChange={(e) => setTempSocial({ ...tempSocial, tiktok: e.target.value })}
                        placeholder="https://tiktok.com/@styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Twitter / X URL</label>
                      <input
                        type="text"
                        value={tempSocial.twitter}
                        onChange={(e) => setTempSocial({ ...tempSocial, twitter: e.target.value })}
                        placeholder="https://x.com/styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={tempSocial.linkedin}
                        onChange={(e) => setTempSocial({ ...tempSocial, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">YouTube URL</label>
                      <input
                        type="text"
                        value={tempSocial.youtube}
                        onChange={(e) => setTempSocial({ ...tempSocial, youtube: e.target.value })}
                        placeholder="https://youtube.com/@styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Pinterest URL</label>
                      <input
                        type="text"
                        value={tempSocial.pinterest}
                        onChange={(e) => setTempSocial({ ...tempSocial, pinterest: e.target.value })}
                        placeholder="https://pinterest.com/styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Threads URL</label>
                      <input
                        type="text"
                        value={tempSocial.threads}
                        onChange={(e) => setTempSocial({ ...tempSocial, threads: e.target.value })}
                        placeholder="https://threads.net/@styledbywilma"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Config */}
                <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Configuración Botón Flotante WhatsApp</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <span>Activar botón:</span>
                      <input
                        type="checkbox"
                        checked={tempSocial.whatsappActive}
                        onChange={(e) => setTempSocial({ ...tempSocial, whatsappActive: e.target.checked })}
                      />
                    </label>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Número (Formato Internacional)</label>
                      <input
                        type="text"
                        value={tempSocial.whatsappNumber}
                        onChange={(e) => setTempSocial({ ...tempSocial, whatsappNumber: e.target.value })}
                        placeholder="+56987654321"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Horario de Atención</label>
                      <input
                        type="text"
                        value={tempSocial.whatsappHours}
                        onChange={(e) => setTempSocial({ ...tempSocial, whatsappHours: e.target.value })}
                        placeholder="Lunes a Sábado de 10:00 a 19:00 hrs"
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Mensaje Predefinido de WhatsApp</label>
                      <input
                        type="text"
                        value={tempSocial.whatsappMessage}
                        onChange={(e) => setTempSocial({ ...tempSocial, whatsappMessage: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Posición del Botón</label>
                      <select
                        value={tempSocial.whatsappPosition}
                        onChange={(e) => setTempSocial({ ...tempSocial, whatsappPosition: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      >
                        <option value="right">Derecha (Recomendado)</option>
                        <option value="left">Izquierda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Color del Botón</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={tempSocial.whatsappColor}
                          onChange={(e) => setTempSocial({ ...tempSocial, whatsappColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-stone-300">{tempSocial.whatsappColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Physical Contact in Chile */}
                <div className="p-6 rounded-3xl bg-stone-950 border border-stone-800 space-y-4">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Datos de Atelier Físico & Soporte (Concepción, Biobío, Chile)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Teléfono Contacto</label>
                      <input
                        type="text"
                        value={tempSocial.telefono}
                        onChange={(e) => setTempSocial({ ...tempSocial, telefono: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Email de Soporte</label>
                      <input
                        type="email"
                        value={tempSocial.emailSoporte}
                        onChange={(e) => setTempSocial({ ...tempSocial, emailSoporte: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Dirección Física</label>
                      <input
                        type="text"
                        value={tempSocial.direccion}
                        onChange={(e) => setTempSocial({ ...tempSocial, direccion: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Ciudad y Región</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={tempSocial.ciudad}
                          onChange={(e) => setTempSocial({ ...tempSocial, ciudad: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                        />
                        <input
                          type="text"
                          value={tempSocial.region}
                          onChange={(e) => setTempSocial({ ...tempSocial, region: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 6: SEGURIDAD (OPCIONES DE REGISTRO ⭐ NUEVO) */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-purple-400" />
                    <span>Configuración de Seguridad, Registro & Políticas</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    30+ parámetros de autenticación Firebase, complejidad de claves, sesión y privacidad.
                  </p>
                </div>

                <button
                  onClick={handleSaveSecurity}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Guardar Seguridad
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Registration options */}
                <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                    Opciones de Registro de Usuarias
                  </h3>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Permitir registro con Google</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.allowGoogle}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, allowGoogle: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Permitir registro con Facebook</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.allowFacebook}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, allowFacebook: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Permitir registro con Email/Password</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.allowEmail}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, allowEmail: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Requerir verificación PIN de email</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.requireEmailVerification}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, requireEmailVerification: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Modo mantenimiento (bloquea registros)</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.maintenanceMode}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, maintenanceMode: e.target.checked })}
                      />
                    </label>
                  </div>
                </div>

                {/* Password & Session Policy */}
                <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                    Políticas de Clave y Sesión
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-stone-300">Longitud mínima de contraseña:</span>
                        <span className="font-bold text-purple-400">{tempSecurity.passwordMinLength} caracteres</span>
                      </div>
                      <input
                        type="range"
                        min={6}
                        max={16}
                        value={tempSecurity.passwordMinLength}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, passwordMinLength: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Requerir al menos un número</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.passwordRequireNumber}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, passwordRequireNumber: e.target.checked })}
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 bg-stone-900 rounded-xl">
                      <span>Requerir 2FA obligatorio para Admins</span>
                      <input
                        type="checkbox"
                        checked={tempSecurity.require2FAAdmin}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, require2FAAdmin: e.target.checked })}
                      />
                    </label>

                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Periodo de Gracia para Cerrar Cuenta (días)</label>
                      <input
                        type="number"
                        value={tempSecurity.gracePeriodDays}
                        onChange={(e) => setTempSecurity({ ...tempSecurity, gracePeriodDays: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 7: GESTIÓN DE USUARIOS */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span>Gestión de Usuarias & Grupos de Edad</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Control de cuentas, roles, membresías VIP y ciclo de vida (estilo Facebook).
                  </p>
                </div>

                <button
                  onClick={() => {
                    exportToExcel(
                      filteredUsers.map(u => ({
                        UID: u.uid,
                        Username: u.username,
                        Nombre: u.displayName,
                        Email: u.email,
                        Edad: u.age || 29,
                        Grupo_Edad: u.ageGroup || 'adulta_joven',
                        Rol: u.role,
                        Plan: u.plan,
                        Estado: u.status,
                        Registro: u.createdAt
                      })),
                      'Usuarias-StyledByWilma'
                    );
                    showToast('Listado de usuarias exportado a Excel.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar a Excel</span>
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar por nombre, @username o correo..."
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <select
                    value={userGroupFilter}
                    onChange={(e) => setUserGroupFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                  >
                    <option value="all">Todos los grupos de edad</option>
                    <option value="joven">18-25: Joven</option>
                    <option value="adulta_joven">26-35: Adulta Joven</option>
                    <option value="adulta">36-45: Adulta</option>
                    <option value="madura">46-55: Madura</option>
                    <option value="senior">56-65: Senior</option>
                    <option value="golden">66+: Golden</option>
                  </select>
                </div>

                <div>
                  <select
                    value={userPlanFilter}
                    onChange={(e) => setUserPlanFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-800 rounded-xl text-white"
                  >
                    <option value="all">Todos los planes</option>
                    <option value="free">Plan Gratuito</option>
                    <option value="premium">Plan VIP Premium</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900/80 text-stone-400 text-[10px] uppercase tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3">Usuaria</th>
                      <th className="p-3">Username / Email</th>
                      <th className="p-3">Edad / Grupo</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900">
                    {filteredUsers.map((u) => {
                      const groupInfo = u.ageGroup ? AGE_GROUPS_CONFIG[u.ageGroup] : null;
                      return (
                        <tr key={u.uid} className="hover:bg-stone-900/50">
                          <td className="p-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center font-bold text-xs">
                                {u.firstName.charAt(0)}
                              </div>
                              <span>{u.displayName}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-purple-300 text-[11px]">@{u.username}</span>
                            <span className="block text-[10px] text-stone-500">{u.email}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-stone-300 font-semibold">{u.age || 29} años</span>
                            {groupInfo && (
                              <span className="block text-[10px] text-rose-400 font-medium">
                                {groupInfo.title} ({groupInfo.range})
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <select
                              value={u.role}
                              onChange={(e) => {
                                updateUserRole(u.uid, e.target.value as UserRole);
                                showToast(`Rol de ${u.displayName} modificado.`);
                              }}
                              className="px-2 py-1 bg-stone-900 border border-stone-800 rounded-lg text-[11px] text-stone-300"
                            >
                              <option value="user">Usuaria</option>
                              <option value="editor">Editora</option>
                              <option value="admin">Admin</option>
                              <option value="master">Master</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select
                              value={u.plan}
                              onChange={(e) => {
                                updateUserPlan(u.uid, e.target.value as UserPlan);
                                showToast(`Plan de ${u.displayName} actualizado.`);
                              }}
                              className="px-2 py-1 bg-stone-900 border border-stone-800 rounded-lg text-[11px] text-stone-300"
                            >
                              <option value="free">Gratuito</option>
                              <option value="premium">VIP Premium</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active' 
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                : u.status === 'deactivated'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {u.status === 'deactivated' ? (
                                <button
                                  onClick={() => reactivateAccount(u.uid)}
                                  className="px-2 py-1 text-[10px] bg-emerald-900/60 text-emerald-300 rounded hover:bg-emerald-800 cursor-pointer"
                                >
                                  Reactivar
                                </button>
                              ) : (
                                <button
                                  onClick={() => deactivateAccount(u.uid)}
                                  className="px-2 py-1 text-[10px] bg-stone-800 text-stone-300 rounded hover:bg-stone-700 cursor-pointer"
                                  title="Pausar cuenta estilo Facebook"
                                >
                                  Pausar
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar permanentemente a ${u.displayName}?`)) {
                                    permanentlyDeleteAccount(u.uid);
                                    showToast('Cuenta eliminada permanentemente.');
                                  }
                                }}
                                className="p-1 hover:text-red-400 text-stone-500 cursor-pointer"
                                title="Borrado definitivo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 8: GESTIÓN DE PLANES */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'plans' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header and Create Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-stone-950 border border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-purple-400" />
                    <h2 className="font-serif text-2xl font-bold text-white">
                      Planes de Membresía VIP & Plan Gratuito
                    </h2>
                  </div>
                  <p className="text-xs text-stone-300 mt-1.5 max-w-2xl">
                    Todos los planes se pueden editar (precio, nombre, detalles, características, descripción), cambiar, modificar, eliminar y crear nuevos planes por el superusuario habilitado en la opción VIP. El plan gratuito cero está activo para los nuevos usuarios.
                  </p>
                </div>

                <button
                  onClick={handleOpenCreatePlan}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Nuevo Plan</span>
                </button>
              </div>

              {/* Status Notice about Free Plan Tier 0 */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Plan Gratuito Cero ($0.00):</strong> Activo de forma predeterminada para todas las nuevas cuentas registradas.
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
                  Activo para Nuevos Usuarios
                </span>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {plans.map((p) => {
                  const isFree = p.price === 0;

                  return (
                    <div 
                      key={p.id} 
                      className={`p-5 rounded-3xl bg-stone-950 border transition-all flex flex-col justify-between relative ${
                        p.isActive 
                          ? 'border-stone-800 hover:border-purple-500/50' 
                          : 'border-red-950/60 opacity-70'
                      }`}
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {p.badge && (
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                isFree 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                                  : 'bg-purple-900 text-purple-200 border border-purple-700'
                              }`}>
                                {p.badge}
                              </span>
                            )}
                            {p.isPopular && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-950">
                                Popular
                              </span>
                            )}
                          </div>

                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                            p.isActive 
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}>
                            {p.isActive ? 'Activo' : 'Pausado'}
                          </span>
                        </div>

                        {/* Plan Name & Price */}
                        <h3 className="font-serif text-lg font-bold text-white mt-1">
                          {p.name}
                        </h3>

                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-amber-300">
                            {isFree ? '$0.00' : `$${p.price.toFixed(2)}`}
                          </span>
                          <span className="text-xs text-stone-400">
                            {p.currency || 'USD'} / {p.billingPeriod === 'monthly' ? 'mes' : p.billingPeriod === 'yearly' ? 'año' : 'pago único'}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Characteristics / Features List */}
                        <div className="mt-4 pt-3 border-t border-stone-900 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Características ({p.features?.length || 0}):
                          </span>
                          <div className="space-y-1 text-[11px] text-stone-300 max-h-36 overflow-y-auto pr-1">
                            {(p.features || []).map((f, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Edit, Toggle Active, Delete */}
                      <div className="mt-5 pt-3 border-t border-stone-900 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditPlan(p)}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Editar detalles, precio, características y nombre"
                        >
                          <Edit className="w-3.5 h-3.5 text-purple-400" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => togglePlanActive(p.id)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                            p.isActive 
                              ? 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300' 
                              : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                          }`}
                          title={p.isActive ? 'Pausar plan' : 'Activar plan'}
                        >
                          {p.isActive ? 'Pausar' : 'Activar'}
                        </button>

                        {!isFree && (
                          <button
                            onClick={() => handleDeletePlanItem(p.id, p.name)}
                            className="p-2 rounded-xl bg-stone-900 hover:bg-red-950/80 border border-stone-800 hover:border-red-800 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar este plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* MODAL: EDITAR O CREAR PLAN DE MEMBRESÍA */}
              {/* ═══════════════════════════════════════════════════════ */}
              {planModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
                  <div className="bg-stone-950 rounded-3xl max-w-xl w-full text-white p-5 sm:p-7 space-y-4 shadow-2xl border border-stone-800 relative my-auto">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-purple-400" />
                          <span>{editingPlanId ? 'Editar Plan de Membresía' : 'Crear Nuevo Plan de Membresía'}</span>
                        </h3>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Personaliza precio, nombre, descripción y características del plan.
                        </p>
                      </div>
                      <button
                        onClick={() => setPlanModalOpen(false)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSavePlanForm} className="space-y-4 text-xs">
                      
                      {/* Name & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Nombre del Plan *</label>
                          <input
                            type="text"
                            required
                            value={planForm.name}
                            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                            placeholder="Ej. Plan Mensual VIP"
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Badge / Etiqueta</label>
                          <input
                            type="text"
                            value={planForm.badge}
                            onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                            placeholder="Ej. Más Popular / VIP / Inicial"
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-medium"
                          />
                        </div>
                      </div>

                      {/* Price, Period, Currency */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Precio ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={planForm.price}
                            onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Período de Facturación</label>
                          <select
                            value={planForm.billingPeriod}
                            onChange={(e) => setPlanForm({ ...planForm, billingPeriod: e.target.value as any })}
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white"
                          >
                            <option value="monthly">Mensual</option>
                            <option value="yearly">Anual</option>
                            <option value="one_time">Pago Único</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-400 font-semibold mb-1">Moneda</label>
                          <input
                            type="text"
                            value={planForm.currency}
                            onChange={(e) => setPlanForm({ ...planForm, currency: e.target.value })}
                            placeholder="USD / CLP"
                            className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white font-mono"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-stone-400 font-semibold mb-1">Descripción del Plan</label>
                        <textarea
                          rows={2}
                          value={planForm.description}
                          onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                          placeholder="Breve descripción atractiva del alcance y ventajas de este plan..."
                          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white"
                        />
                      </div>

                      {/* Features / Characteristics Manager */}
                      <div className="space-y-2 pt-1 border-t border-stone-800">
                        <label className="block text-stone-300 font-bold">
                          Características & Beneficios Incluidos
                        </label>
                        
                        {/* List of current features */}
                        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                          {planForm.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-stone-900/60 p-1.5 rounded-xl border border-stone-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => handleFeatureTextChange(idx, e.target.value)}
                                className="flex-1 bg-transparent border-0 text-white text-xs focus:ring-0"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFeatureFromPlan(idx)}
                                className="p-1 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Quitar beneficio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add new feature input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newFeatureInput}
                            onChange={(e) => setNewFeatureInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddFeatureToPlan();
                              }
                            }}
                            placeholder="Escribe un nuevo beneficio y presiona Agregar..."
                            className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-white text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddFeatureToPlan}
                            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                          >
                            + Agregar
                          </button>
                        </div>
                      </div>

                      {/* Toggles: Active, Popular */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-800">
                        <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={planForm.isActive}
                            onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                          />
                          <span className="text-xs text-stone-200">Plan Activo</span>
                        </label>

                        <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 border border-stone-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={planForm.isPopular}
                            onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                          />
                          <span className="text-xs text-stone-200">Destacar como Popular</span>
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                        <button
                          type="button"
                          onClick={() => setPlanModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
                        >
                          {editingPlanId ? 'Guardar Cambios' : 'Crear Plan'}
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 9: BASE DE DATOS D1 & CONSOLA SQL */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Database className="w-6 h-6 text-purple-400" />
                    <span>Base de Datos Cloudflare D1 & Consola SQL</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Visualizador de tablas D1, inspección de registros y consola de consultas SQL.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const res = executeDatabaseMaintenance('optimize_indexes');
                    showToast(res.message);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Optimizar Índices D1</span>
                </button>
              </div>

              {/* Table selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'users', label: 'users' },
                  { id: 'visits', label: 'visits' },
                  { id: 'manual', label: 'manual' },
                  { id: 'appearance', label: 'appearance' },
                  { id: 'social_links', label: 'social_links' },
                  { id: 'security_config', label: 'security_config' },
                  { id: 'plans', label: 'plans' },
                  { id: 'style_dna', label: 'style_dna' },
                  { id: 'backups', label: 'backups' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedDbTable(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedDbTable === t.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* SQL Console */}
              <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-300 font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    Consola SQL D1 (Read-Only por defecto)
                  </span>

                  <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer">
                    <span>Permitir Escritura (DML/DDL):</span>
                    <input
                      type="checkbox"
                      checked={sqlAllowWrite}
                      onChange={(e) => setSqlAllowWrite(e.target.checked)}
                    />
                  </label>
                </div>

                <form onSubmit={handleExecuteSql} className="space-y-2">
                  <textarea
                    rows={3}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    className="w-full p-3 bg-stone-900 border border-stone-800 rounded-xl font-mono text-xs text-purple-200"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Ejecutar Consulta SQL
                    </button>
                  </div>
                </form>

                {sqlResult && (
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 font-mono text-xs text-stone-300">
                    {sqlResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 10: BACKUP & RESTORE */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'backups' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Cloud className="w-6 h-6 text-purple-400" />
                    <span>Copias de Seguridad (Tipo WhatsApp) & Restauración</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Copia integral en un solo archivo cifrado con usuarios, visitas, apariencias y manual.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setIsCreatingBackup(true);
                    await createSystemBackup(backupNameInput || undefined);
                    setIsCreatingBackup(false);
                    showToast('Copia de seguridad del sistema generada exitosamente.');
                  }}
                  disabled={isCreatingBackup}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{isCreatingBackup ? 'Generando...' : 'Crear Backup Ahora'}</span>
                </button>
              </div>

              {/* Backups List */}
              <div className="space-y-3">
                {backupSnapshots.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-xs text-white">{b.name}</h4>
                      <p className="text-[11px] text-stone-400">
                        {new Date(b.createdAt).toLocaleString()} &bull; {b.sizeFormatted} &bull; v{b.version}
                      </p>
                      <div className="flex gap-2 text-[10px] text-purple-400 mt-1 font-mono">
                        <span>Usuarias: {b.itemCounts.users || 0}</span>
                        <span>Visitas: {b.itemCounts.visits || 0}</span>
                        <span>Diagnósticos: {b.itemCounts.analyses}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadBackup(b)}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('¿Restaurar este respaldo completo en la aplicación?')) {
                            const res = restoreBackup(b);
                            showToast(res.message);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Restaurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 11: MONITOREO */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-purple-400" />
                    <span>Monitoreo de Infraestructura & Servicios</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Latencias de endpoints, estado de Cloudflare D1/R2, Gemini AI y Firebase Auth.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serverMetrics.servicesHealth.map((srv, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-white">{srv.name}</h4>
                      <p className="text-[11px] text-stone-400">Latencia: {srv.latencyMs}ms &bull; Uptime: {srv.uptimePercent}%</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Operacional
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 12: API KEYS */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'apikeys' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-6 h-6 text-purple-400" />
                    <span>Gestión de API Keys & Credenciales</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Control de cuotas y consumo de tokens con avisos de umbral de 15 días.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{k.name}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                          {k.service}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-stone-400 mt-1">{k.keyMasked}</p>
                      <p className="text-[11px] text-purple-400 mt-0.5">
                        Consumo: {k.consumptionTokens.toLocaleString()} / {k.limitTokens.toLocaleString()} tokens
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 13: ROLES & PERMISOS */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'roles' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-purple-400" />
                <span>Matriz de Roles & Permisos (RBAC)</span>
              </h2>

              <div className="space-y-4">
                {roles.map((r) => (
                  <div key={r.id} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white">{r.name}</h4>
                      {r.isSystem && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                          Rol de Sistema
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400">{r.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {Object.entries(r.permissions).map(([permKey, hasPerm]) => (
                        <span key={permKey} className={`px-2 py-1 rounded-md text-[10px] font-semibold ${
                          hasPerm ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-stone-900 text-stone-600 line-through'
                        }`}>
                          {permKey}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 14: ALERTAS & NOTIFICACIONES */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-purple-400" />
                <span>Alertas de Umbrales & Renovaciones VIP (15 Días)</span>
              </h2>

              <div className="space-y-3">
                {systemAlerts.length === 0 ? (
                  <div className="p-8 text-center bg-stone-950 rounded-2xl border border-stone-800 text-stone-400 text-xs">
                    No hay alertas críticas en este momento. Todos los umbrales están dentro de los parámetros seguros.
                  </div>
                ) : (
                  systemAlerts.map((alt) => (
                    <div key={alt.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            alt.severity === 'critical' ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {alt.severity.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-xs text-white">{alt.title}</h4>
                        </div>
                        <p className="text-xs text-stone-400">{alt.message}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {alt.targetUserId && (
                          <button
                            onClick={() => {
                              sendSubscriptionExpiryNotice(alt.targetUserId!, 'whatsapp');
                              showToast('Recordatorio enviado por WhatsApp.');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Avisar WhatsApp</span>
                          </button>
                        )}
                        <button
                          onClick={() => dismissAlert(alt.id)}
                          className="px-2.5 py-1.5 bg-stone-800 text-stone-400 hover:text-white rounded-xl text-xs cursor-pointer"
                        >
                          Descartar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 15: DESCARGAS & REPORTES */}
          {/* ═══════════════════════════════════════════════════════ */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Download className="w-6 h-6 text-purple-400" />
                <span>Descargas, Código Fuente & Reportes del Atelier</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-xs text-white">Manual Completo (PDF)</h4>
                  <p className="text-xs text-stone-400">11 capítulos con portada y formato editorial listo para imprimir.</p>
                  <button
                    onClick={() => exportManualToPDF(manualChapters)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Descargar PDF
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-xs text-white">Manual en Word (.doc)</h4>
                  <p className="text-xs text-stone-400">Documento editable para Microsoft Word o Google Docs.</p>
                  <button
                    onClick={() => exportManualToWord(manualChapters)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Descargar Word
                  </button>
                </div>

                <div className="p-5 rounded-3xl bg-stone-950 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-xs text-white">Base de Datos (SQL D1 Dump)</h4>
                  <p className="text-xs text-stone-400">Estructura completa de schema.sql con todas las tablas.</p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/schema.sql';
                      link.download = 'schema_d1_styledbywilma.sql';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Descargar schema.sql
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
