import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  X, 
  ExternalLink, 
  Edit3, 
  Phone, 
  Sparkles,
  Clock,
  Send
} from 'lucide-react';

export const SupportAdvisorWidget: React.FC = () => {
  const { 
    isSupportModalOpen, 
    setIsSupportModalOpen, 
    socialConfig,
    appearanceConfig,
    setCurrentView,
    user
  } = useAuth();

  const [copiedLink, setCopiedLink] = useState(false);

  // If floating WhatsApp button is deactivated by superadmin in settings, return null (unless modal is open)
  if (!socialConfig.whatsappActive && !isSupportModalOpen) {
    return null;
  }

  const handleOpenWhatsApp = () => {
    const cleanPhone = (socialConfig.whatsappNumber || '').replace(/[^0-9]/g, '');
    const prefilledText = encodeURIComponent(
      socialConfig.whatsappMessage || 
      '¡Hola Wilma! Te contacto desde la app Styled By Wilma (Concepción, Chile) para consultar sobre asesoría de colorimetría personal y estilo.'
    );

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${prefilledText}`, '_blank');
    } else {
      window.open(`https://api.whatsapp.com/send?text=${prefilledText}`, '_blank');
    }
  };

  const positionClass = socialConfig.whatsappPosition === 'left' 
    ? 'left-4 sm:left-6' 
    : 'right-4 sm:right-6';

  return (
    <>
      {/* Floating Action Button (Configurable Position & Active State) */}
      {socialConfig.whatsappActive && (
        <button
          onClick={() => setIsSupportModalOpen(true)}
          style={{ backgroundColor: socialConfig.whatsappColor || '#25D366' }}
          className={`fixed bottom-20 sm:bottom-6 ${positionClass} z-40 text-white px-3.5 py-2.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-2 border-white/40 group animate-in slide-in-from-bottom-3`}
          title="WhatsApp de Asesoría & Soporte con Wilma Hernández"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 fill-white" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[11px] font-bold leading-tight">WhatsApp Asesoría</p>
            <p className="text-[9px] text-white/90 leading-tight">Wilma Hernández • Concepción</p>
          </div>
        </button>
      )}

      {/* Support & Advisor Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-stone-200 relative">
            
            {/* Close button */}
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Master Superusuario Badge */}
            <div className="text-center space-y-2 pt-1">
              <div className="relative inline-block">
                <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 p-[3px] mx-auto shadow-md">
                  <div className="w-full h-full bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 font-serif text-2xl font-bold overflow-hidden">
                    {appearanceConfig.advisorPhotoUrl ? (
                      <img 
                        src={appearanceConfig.advisorPhotoUrl} 
                        alt="Wilma Hernández" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      'WH'
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Asesora Máster Verificada">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Asesora de Imagen & Titular
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                  Wilma Hernández
                </h3>
                <p className="text-xs text-stone-500 flex items-center justify-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{socialConfig.direccion || 'Concepción, Región del Biobío, Chile'}</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Atención Personalizada en Concepción & Remota</span>
              </div>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                Coordina tu sesión de asesoría presencial en nuestro atelier en Concepción o resuelve dudas directas sobre tu informe cromático y recomendaciones de guardarropa.
              </p>
            </div>

            {/* WhatsApp Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Canal Oficial de WhatsApp</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">En línea</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-100 text-xs space-y-1">
                <div className="flex justify-between items-center text-stone-600 text-[11px]">
                  <span>Número:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {socialConfig.whatsappNumber || '(Por configurar en panel de Superadministrador)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-600 text-[11px]">
                  <span>Horario de atención:</span>
                  <span className="font-medium text-stone-700">
                    {socialConfig.whatsappHours || 'Lunes a Sábado 10:00 - 19:00 hrs'}
                  </span>
                </div>
              </div>

              {/* Superadmin button if phone is still blank */}
              {!socialConfig.whatsappNumber && (user?.role === 'master' || user?.role === 'admin') && (
                <button
                  onClick={() => {
                    setIsSupportModalOpen(false);
                    setCurrentView('admin');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configurar tu Número de WhatsApp en Panel Superadmin</span>
                </button>
              )}

              <button
                onClick={handleOpenWhatsApp}
                style={{ backgroundColor: socialConfig.whatsappColor || '#25D366' }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Abrir Chat de WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Additional Contact details */}
            <div className="space-y-1 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <p className="flex items-center gap-1.5 text-stone-600">
                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                <span>{socialConfig.direccion || 'Concepción, Región del Biobío, Chile'}</span>
              </p>
              {socialConfig.telefono && (
                <p className="flex items-center gap-1.5 text-stone-600">
                  <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="font-semibold text-stone-700">Teléfono:</span>
                  <span>{socialConfig.telefono}</span>
                </p>
              )}
              {socialConfig.emailSoporte && (
                <p className="flex items-center gap-1.5 text-stone-600">
                  <span className="font-semibold text-stone-700">Email:</span>
                  <span>{socialConfig.emailSoporte}</span>
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
