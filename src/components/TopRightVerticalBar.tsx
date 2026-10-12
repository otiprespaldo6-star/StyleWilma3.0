import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Crown, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  ChevronRight, 
  Sparkles,
  ChevronDown,
  Layers,
  Check,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { AgeGroup } from '../types';
import { AGE_GROUPS_CONFIG } from '../data/ageGroups';

export const TopRightVerticalBar: React.FC = () => {
  const { 
    user, 
    currentView, 
    setCurrentView, 
    quickSwitchRole, 
    activeAgeFilter, 
    quickSwitchAgeGroup,
    addVisitRecord 
  } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const handleNavigate = (view: 'manual' | 'admin') => {
    setCurrentView(view);
    addVisitRecord(`/${view}`);
  };

  const currentRole = user?.role || 'user';
  const currentAgeGroup = user?.ageGroup || (activeAgeFilter !== 'any' ? activeAgeFilter : undefined);

  if (isCollapsed) {
    return (
      <aside 
        aria-label="Panel rápido de control lateral"
        className="fixed top-20 right-2 z-40 flex flex-col items-end animate-in fade-in slide-in-from-right-3"
      >
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-rose-200 dark:border-stone-700 shadow-xl text-stone-800 dark:text-stone-100 hover:text-rose-600 transition-all cursor-pointer group text-xs font-bold"
          title="Abrir barra vertical superior derecha"
        >
          <PanelRightOpen className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-[11px]">Accesos Rápidos</span>
        </button>
      </aside>
    );
  }

  return (
    <aside 
      aria-label="Barra vertical superior derecha de navegación y controles"
      className="fixed top-20 right-2 sm:right-4 z-40 flex flex-col w-64 max-w-[calc(100vw-1rem)] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-rose-200/80 dark:border-stone-800 shadow-2xl p-2.5 space-y-2.5 animate-in fade-in slide-in-from-right-4 transition-all"
    >
      {/* Header bar / title & collapse */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 px-1">
        <div className="flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Accesos & Controles
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Minimizar barra lateral"
        >
          <PanelRightClose className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. OPCIÓN MANUAL */}
      <div>
        <button
          onClick={() => handleNavigate('manual')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            currentView === 'manual'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 shadow-xs'
              : 'bg-stone-50/80 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/80 hover:bg-rose-50/50 hover:text-rose-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>Manual de la App</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-500">
            11 Caps.
          </span>
        </button>
      </div>

      {/* 2. OPCIÓN SUPERADMINISTRADOR */}
      <div>
        <button
          onClick={() => handleNavigate('admin')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            currentView === 'admin'
              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800 shadow-xs'
              : 'bg-stone-50/80 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/80 hover:bg-purple-50/50 hover:text-purple-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-purple-600" />
            <span>Superadministrador</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-bold">
            Consola
          </span>
        </button>
      </div>

      {/* 3. SWITCHER DE ROL (Superadministrador / Usuario Administrador / Usuaria) */}
      <div className="bg-stone-50/80 dark:bg-stone-800/40 rounded-xl p-2 border border-stone-200/70 dark:border-stone-700/70 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300 px-0.5">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            <span>Rol Activo</span>
          </span>
          <span className="text-[10px] font-mono uppercase text-stone-500">
            {currentRole === 'master' ? 'Superadmin' : currentRole === 'admin' ? 'Admin' : 'Usuaria'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => quickSwitchRole('master', 'premium')}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer truncate ${
              currentRole === 'master'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-purple-50 hover:text-purple-700 border border-stone-200 dark:border-stone-700'
            }`}
            title="Superadministradora Máster"
          >
            Superadmin
          </button>

          <button
            onClick={() => quickSwitchRole('admin', 'premium')}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer truncate ${
              currentRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-indigo-50 hover:text-indigo-700 border border-stone-200 dark:border-stone-700'
            }`}
            title="Usuario Administrador"
          >
            Admin
          </button>

          <button
            onClick={() => quickSwitchRole('user', user?.plan || 'free')}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer truncate ${
              currentRole === 'user'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-600 border border-stone-200 dark:border-stone-700'
            }`}
            title="Usuaria Regular"
          >
            Usuaria
          </button>
        </div>
      </div>

      {/* 4. SWITCHER DE EDAD (Adulta 36 a 45 años / Cualquier edad / selector completo) */}
      <div className="bg-stone-50/80 dark:bg-stone-800/40 rounded-xl p-2 border border-stone-200/70 dark:border-stone-700/70 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 dark:text-stone-300 px-0.5">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Filtro de Edad</span>
          </span>
          <span className="text-[10px] text-stone-500 font-medium">
            {activeAgeFilter === 'any' ? 'Cualquier edad' : AGE_GROUPS_CONFIG[activeAgeFilter]?.range || '36-45 años'}
          </span>
        </div>

        {/* Quick direct buttons for "Adulta 36 a 45 años" & "Cualquier edad" as explicitly requested */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => quickSwitchAgeGroup('adulta')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer border ${
              activeAgeFilter === 'adulta' || (activeAgeFilter === 'any' && currentAgeGroup === 'adulta')
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 border-stone-200 dark:border-stone-700'
            }`}
            title="Configurar para Adulta: 36 a 45 años"
          >
            Adulta 36-45
          </button>

          <button
            onClick={() => quickSwitchAgeGroup('any')}
            className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all cursor-pointer border ${
              activeAgeFilter === 'any'
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 border-stone-200 dark:border-stone-700'
            }`}
            title="Cualquier edad (todas las edades)"
          >
            Cualquier edad
          </button>
        </div>

        {/* Expandable toggle for remaining age groups */}
        <div className="pt-1">
          <button
            onClick={() => setShowAgeDropdown(!showAgeDropdown)}
            className="w-full flex items-center justify-between text-[10px] font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 py-0.5 px-1 cursor-pointer"
          >
            <span>Ver los 6 rangos de edad</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showAgeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showAgeDropdown && (
            <div className="mt-1 space-y-1 pt-1 border-t border-stone-200/60 dark:border-stone-700/60 max-h-40 overflow-y-auto">
              {(Object.keys(AGE_GROUPS_CONFIG) as AgeGroup[]).map((key) => {
                const info = AGE_GROUPS_CONFIG[key];
                const isSelected = activeAgeFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      quickSwitchAgeGroup(key);
                      setShowAgeDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[10px] transition-colors cursor-pointer text-left ${
                      isSelected 
                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <span>{info.title} ({info.range})</span>
                    {isSelected && <Check className="w-3 h-3 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
