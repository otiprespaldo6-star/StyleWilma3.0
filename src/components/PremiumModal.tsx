import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Shield, 
  Settings, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanDefinition } from '../types';

export const PremiumModal: React.FC = () => {
  const { 
    isPremiumModalOpen, 
    setIsPremiumModalOpen, 
    upgradeToPremium, 
    plans,
    user,
    setCurrentView 
  } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_monthly_vip');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPremiumModalOpen) return null;

  const activePlans = plans.filter(p => p.isActive);
  const currentSelectedPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[0] || plans[0];
  const isSuperadmin = user?.role === 'master' || user?.role === 'admin';

  const handleSubscribe = (plan: PlanDefinition) => {
    if (plan.price === 0) {
      // Free plan is already active
      setIsPremiumModalOpen(false);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPremium();
      setIsProcessing(false);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    }, 700);
  };

  const handleGoToAdminPlans = () => {
    setIsPremiumModalOpen(false);
    setCurrentView('admin');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-stone-900 rounded-3xl max-w-2xl w-full text-white p-5 sm:p-7 space-y-5 shadow-2xl border border-rose-500/30 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPremiumModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Membresías VIP & Plan Gratuito Inicial</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Elige tu Plan de Imagen Personal
          </h2>
          <p className="text-xs text-rose-200/80 max-w-md mx-auto">
            El Plan Gratuito está activo para todas las nuevas usuarias. Desbloquea planes VIP para obtener tu dossier completo de 12 sub-estaciones.
          </p>
        </div>

        {/* Superadmin Quick Access Banner inside VIP Option */}
        {isSuperadmin && (
          <div className="p-3 rounded-2xl bg-purple-950/70 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-purple-200">
              <Settings className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-[11px]">
                <strong>Panel Superusuario:</strong> Puedes editar precios, nombres, características, eliminar y crear nuevos planes.
              </span>
            </div>
            <button
              onClick={handleGoToAdminPlans}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
            >
              Gestionar Planes (Superadmin)
            </button>
          </div>
        )}

        {/* Plan Selector Carousel / Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
          {activePlans.map((plan) => {
            const isSelected = plan.id === currentSelectedPlan?.id;
            const isFree = plan.price === 0;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 text-stone-300'
                }`}
              >
                {plan.badge && (
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md inline-block w-fit mb-1 ${
                    isFree 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' 
                      : 'bg-amber-400 text-stone-950 font-bold'
                  }`}>
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h4 className="font-bold text-xs leading-snug line-clamp-1 text-white">
                    {plan.name}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-base font-extrabold text-amber-300">
                      {isFree ? 'Gratis' : `$${plan.price}`}
                    </span>
                    {!isFree && (
                      <span className="text-[10px] text-stone-400">
                        /{plan.billingPeriod === 'monthly' ? 'mes' : plan.billingPeriod === 'yearly' ? 'año' : 'único'}
                      </span>
                    )}
                  </div>
                </div>

                {isFree && (
                  <span className="mt-2 text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Activo Nuevos
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Plan Details & Features Card */}
        {currentSelectedPlan && (
          <div className="bg-stone-800/60 rounded-2xl p-4 sm:p-5 border border-stone-700/60 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-700/60">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {currentSelectedPlan.name}
                  </h3>
                  {currentSelectedPlan.badge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {currentSelectedPlan.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  {currentSelectedPlan.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xl sm:text-2xl font-black text-amber-300">
                  {currentSelectedPlan.price === 0 ? '$0.00' : `$${currentSelectedPlan.price.toFixed(2)}`}
                  <span className="text-xs font-normal text-stone-400 ml-1">
                    {currentSelectedPlan.currency || 'USD'}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {currentSelectedPlan.price === 0 
                    ? 'Plan activo de inicio' 
                    : `Cobro ${currentSelectedPlan.billingPeriod === 'monthly' ? 'mensual' : currentSelectedPlan.billingPeriod === 'yearly' ? 'anual' : 'único'}`}
                </span>
              </div>
            </div>

            {/* Feature List (Dynamic features edited by superadmin) */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Características & Beneficios Incluidos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(currentSelectedPlan.features || []).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-stone-900/50 p-2 rounded-xl border border-stone-800">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-stone-200 text-[11px]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe / Activate Action Button */}
            <div className="pt-2">
              {currentSelectedPlan.price === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Plan Gratuito Activo por Defecto</span>
                  </p>
                  <p className="text-[11px] text-stone-300">
                    Tu cuenta ya tiene este plan activo para realizar pruebas de colorimetría básica sin costo alguno.
                  </p>
                </div>
              ) : (
                <button
                  disabled={isProcessing}
                  onClick={() => handleSubscribe(currentSelectedPlan)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 hover:from-amber-300 hover:to-rose-400 text-stone-950 font-extrabold text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>
                    {isProcessing 
                      ? 'Activando Membresía VIP...' 
                      : `Suscribirme al ${currentSelectedPlan.name} ($${currentSelectedPlan.price.toFixed(2)} ${currentSelectedPlan.currency})`}
                  </span>
                </button>
              )}
            </div>

          </div>
        )}

        {/* Footer Guarantee */}
        <p className="text-[10px] text-center text-stone-400 flex items-center justify-center gap-1 pt-1">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Pago seguro SSL. Cancela en cualquier momento con 1 clic. El superusuario puede modificar planes en cualquier momento.</span>
        </p>

      </div>
    </div>
  );
};
