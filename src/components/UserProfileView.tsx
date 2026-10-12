import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Crown, 
  Calendar, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cloud,
  Check,
  AlertCircle,
  FileText,
  PauseCircle,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  LogOut,
  UserX,
  Dna
} from 'lucide-react';
import { WhatsAppBackupCard } from './WhatsAppBackupCard';
import { AGE_GROUPS_CONFIG } from '../data/ageGroups';

export const UserProfileView: React.FC = () => {
  const { 
    user, 
    analyses, 
    setCurrentAnalysis, 
    deleteAnalysis, 
    setCurrentView, 
    setIsPremiumModalOpen,
    deactivateAccount,
    scheduleAccountDeletion,
    cancelAccountDeletion,
    permanentlyDeleteAccount
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'analyses' | 'dna' | 'backup' | 'account'>('analyses');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <User className="w-12 h-12 text-stone-400 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          Inicia sesión para ver tu perfil
        </h2>
        <p className="text-stone-500 text-xs mb-6">
          Guarda tus análisis de colorimetría para consultarlos en cualquier momento.
        </p>
      </div>
    );
  }

  const handleDeactivate = () => {
    const res = deactivateAccount(user.uid);
    setShowDeactivateModal(false);
    if (res.success) {
      setFeedbackMessage({ text: res.message, type: 'warning' });
    }
  };

  const handleScheduleDelete = () => {
    const res = scheduleAccountDeletion(user.uid, 30);
    setShowDeleteModal(false);
    if (res.success) {
      setFeedbackMessage({ text: res.message, type: 'warning' });
    }
  };

  const handleCancelDeletion = () => {
    const res = cancelAccountDeletion(user.uid);
    if (res.success) {
      setFeedbackMessage({ text: 'Eliminación cancelada. Tu cuenta se encuentra activa nuevamente.', type: 'success' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Feedback Banner if any */}
      {feedbackMessage && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedbackMessage.text}</span>
          </div>
          <button 
            onClick={() => setFeedbackMessage(null)}
            className="text-stone-500 hover:text-stone-800 font-bold px-2 py-0.5"
          >
            ×
          </button>
        </div>
      )}

      {/* Account Deletion Notice Banner if in 30-day grace period */}
      {user.status === 'scheduled_deletion' && user.deletionScheduledDate && (
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-3xl p-6 shadow-md space-y-3">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Cuenta en periodo de gracia para eliminación (tipo Facebook)</span>
          </div>
          <p className="text-xs text-white/90">
            Tu cuenta está programada para eliminarse de forma permanente el <strong>{new Date(user.deletionScheduledDate).toLocaleDateString()}</strong> (dentro de 30 días). Mientras no venza el plazo, puedes retomar tu cuenta con un solo clic.
          </p>
          <div className="pt-2">
            <button
              onClick={handleCancelDeletion}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-stone-50 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancelar Eliminación y Retomar Cuenta</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-[3px] shadow-md shrink-0">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-rose-50 rounded-full flex items-center justify-center text-rose-700 font-serif text-2xl font-bold">
                {user.firstName?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-900">
                {user.displayName}
              </h1>

              {/* VIP Badge */}
              {user.plan === 'premium' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-500" />
                  <span>VIP Activo</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600">
                  Plan Gratuito
                </span>
              )}

              {/* Verification Badge */}
              {user.isEmailVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Cuenta Verificada</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Email Pendiente de Validación</span>
                </span>
              )}

              {/* Status Badge */}
              {user.status === 'deactivated' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  En Pausa (Tipo Facebook)
                </span>
              )}

              {/* Provider Badge */}
              {user.provider && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-200">
                  {user.provider === 'facebook' && 'Facebook'}
                  {user.provider === 'google' && 'Google'}
                  {user.provider === 'email' && 'Correo'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-purple-600 font-bold">@{user.username || 'usuario'}</span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-stone-600 font-semibold">{user.age || 29} años</span>
              {user.ageGroup && AGE_GROUPS_CONFIG[user.ageGroup] && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {AGE_GROUPS_CONFIG[user.ageGroup].title} ({AGE_GROUPS_CONFIG[user.ageGroup].range})
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500">{user.email}</p>
            {user.location && (
              <p className="text-[11px] text-stone-500">{user.location}</p>
            )}
            <p className="text-[10px] text-stone-400">
              Miembro desde {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Upgrade or Plan badge */}
        <div>
          {user.plan !== 'premium' ? (
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-stone-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Mejorar a VIP ($4.99/mes)</span>
            </button>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Suscripción VIP Activa</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs between Analyses, DNA, Backup and Account Security */}
      <div className="flex border-b border-stone-200 gap-4 sm:gap-6 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('analyses')}
          className={`pb-3 px-1 transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'analyses'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Mis Análisis ({analyses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dna')}
          className={`pb-3 px-1 transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'dna'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Dna className="w-4 h-4 text-teal-600" />
          <span>Style DNA (7 Dimensiones)</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`pb-3 px-1 transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'backup'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-600" />
          <span>Copia WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 px-1 transition-all border-b-2 cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'account'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
          <span>Pausar / Cerrar Cuenta</span>
        </button>
      </div>

      {/* TAB 1: Analyses History Section */}
      {activeTab === 'analyses' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Historial de Paletas Guardadas
              </h2>
              <p className="text-xs text-stone-500">
                Consulta tus resultados previos o repite el test si tu tono cambia en verano/invierno.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('analyzer-select')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nuevo Análisis</span>
            </button>
          </div>

          {analyses.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-2xl">
              <Sparkles className="w-8 h-8 text-rose-300 mx-auto mb-2" />
              <p className="text-stone-600 text-xs font-semibold">No tienes diagnósticos guardados aún.</p>
              <p className="text-stone-400 text-[11px] mt-1">Realiza tu primer test de colorimetría con IA o con el cuestionario.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {analyses.map(item => (
                <div 
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-rose-300 bg-stone-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        {item.season.spanishTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        {item.season.subfamily}
                      </span>
                    </div>

                    {/* Swatches strip */}
                    <div className="flex gap-1.5">
                      {item.season.palette.slice(0, 6).map((c, i) => (
                        <div 
                          key={i} 
                          className="w-5 h-5 rounded shadow-2xs border border-black/5" 
                          style={{ backgroundColor: c.hex }} 
                          title={c.name}
                        />
                      ))}
                    </div>

                    <p className="text-[11px] text-stone-400">
                      Realizado el {new Date(item.createdAt).toLocaleDateString()} • Método: {item.method === 'photo' ? 'Foto con IA' : 'Cuestionario'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setCurrentAnalysis(item);
                        setCurrentView('result');
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-stone-300 hover:border-rose-400 text-xs font-bold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Ver Resultado</span>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-500" />
                    </button>

                    <button
                      onClick={() => deleteAnalysis(item.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Eliminar análisis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Style DNA (7 Dimensiones) */}
      {activeTab === 'dna' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-1">
                <Dna className="w-3.5 h-3.5 text-teal-600" />
                <span>Tu Perfil Biológico y de Imagen</span>
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Tus 7 Dimensiones de Style DNA
              </h2>
              <p className="text-xs text-stone-500">
                Personalizado para tu grupo: {user.ageGroup ? AGE_GROUPS_CONFIG[user.ageGroup]?.title : 'Adulta Joven'} ({user.age || 29} años).
              </p>
            </div>

            <button
              onClick={() => setCurrentView('dna-survey')}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Dna className="w-3.5 h-3.5" />
              <span>{user.styleDNA ? 'Actualizar Diagnóstico' : 'Realizar Diagnóstico'}</span>
            </button>
          </div>

          {user.styleDNA ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                <span className="text-[10px] font-bold text-rose-700 uppercase">1. Color DNA</span>
                <p className="font-bold text-xs text-stone-900">{user.styleDNA.color.seasonName || 'Invierno'}</p>
                <p className="text-[11px] text-stone-500">Metal: {user.styleDNA.color.bestMetal}</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold text-purple-700 uppercase">2. Body DNA</span>
                <p className="font-bold text-xs text-stone-900 capitalize">{user.styleDNA.body.silhouette?.replace(/_/g, ' ') || 'Equilibrada'}</p>
                <p className="text-[11px] text-stone-500">Corte: {user.styleDNA.body.fitPreference}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase">3. Style DNA</span>
                <p className="font-bold text-xs text-stone-900">{user.styleDNA.style.archetypes.join(', ')}</p>
                <p className="text-[11px] text-stone-500">Arquetipos clave</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1">
                <span className="text-[10px] font-bold text-teal-700 uppercase">4. Lifestyle DNA</span>
                <p className="font-bold text-xs text-stone-900">{user.styleDNA.lifestyle.occupationType}</p>
                <p className="text-[11px] text-stone-500">Clima: {user.styleDNA.lifestyle.climateZone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">5. Comfort DNA</span>
                <p className="font-bold text-xs text-stone-900 capitalize">{user.styleDNA.comfort.heelTolerance?.replace(/_/g, ' ')}</p>
                <p className="text-[11px] text-stone-500">Telas nobles preferidas</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase">6 & 7. Shopping & Wardrobe</span>
                <p className="font-bold text-xs text-stone-900 capitalize">{user.styleDNA.shopping.shoppingBudgetTier} presupuesto</p>
                <p className="text-[11px] text-stone-500">Clóset: {user.styleDNA.wardrobe.organizationLevel}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <Dna className="w-10 h-10 text-teal-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Aún no has completado tu diagnóstico de Style DNA
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Toma solo 2 minutos responder las preguntas sobre tus proporciones, comodidad y estilo para que la app adapte cada recomendación a tu edad y silueta.
              </p>
              <button
                onClick={() => setCurrentView('dna-survey')}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Comenzar Test de Style DNA
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WhatsApp Style Backup & Restore for User Profile */}
      {activeTab === 'backup' && (
        <WhatsAppBackupCard 
          scope="profile" 
          title="Copia de Seguridad de tu Perfil y Paletas"
          subtitle="Respaldo seguro tipo WhatsApp de tus análisis, fotos y paletas personalizadas para restaurar en cualquier móvil o PC."
        />
      )}

      {/* TAB 3: Facebook Style Account Deactivation & Deletion */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Desactivación y Eliminación de Cuenta (Modelo Facebook)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Controla la visibilidad y permanencia de tu cuenta. Puedes pausarla temporalmente para retomarla en cualquier momento, o solicitar su eliminación con 30 días de gracia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Option 1: Deactivate / Pause (retomable en cualquier momento) */}
            <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <PauseCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Desactivar Cuenta Temporalmente
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Esta acción es reversible. Tu perfil, paletas y suscripciones se congelarán y no serán visibles públicamente. Podrás <strong>retomar tu cuenta en cualquier momento</strong> simplemente volviendo a iniciar sesión con tu correo, Google o Facebook.
                </p>
              </div>

              <button
                onClick={() => setShowDeactivateModal(true)}
                className="w-full py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PauseCircle className="w-4 h-4 text-amber-700" />
                <span>Desactivar Temporalmente</span>
              </button>
            </div>

            {/* Option 2: Schedule Deletion (30-day grace period) */}
            <div className="p-6 rounded-2xl border border-red-200 bg-red-50/30 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                  <UserX className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Eliminar Cuenta (Período de Gracia de 30 Días)
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Si decides no usar más la plataforma, tu cuenta entrará en una cuenta regresiva de <strong>30 días tipo Facebook</strong>. Si inicias sesión antes de que se cumplan los 30 días, la solicitud de eliminación se cancelará automáticamente y mantendrás tus datos.
                </p>
              </div>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2.5 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Solicitar Eliminación (30 días)</span>
              </button>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-stone-100/70 text-stone-600 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Seguridad y Privacidad:</strong> Tus datos y diagnósticos están protegidos con cifrado. Las copias de seguridad de WhatsApp se mantienen hasta que confirmes el borrado irreversible.
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deactivate */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <PauseCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl font-bold text-stone-900">¿Pausar tu cuenta en Styled By Wilma?</h3>
              <p className="text-xs text-stone-500">
                Tu perfil quedará en pausa. No se borrará ninguna paleta ni diagnóstico. Podrás retomar tu cuenta en el momento que desees al iniciar sesión nuevamente.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeactivate}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Pausar Cuenta Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for 30-Day Scheduled Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl font-bold text-stone-900">Confirmar Eliminación con Gracia</h3>
              <p className="text-xs text-stone-500">
                Se iniciará el proceso de eliminación programada tipo Facebook con <strong>30 días de gracia</strong>. Si te arrepientes, sólo ingresa nuevamente a tu cuenta antes de los 30 días para cancelarla.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Mantener Cuenta
              </button>
              <button
                onClick={handleScheduleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Programar Eliminación (30d)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
