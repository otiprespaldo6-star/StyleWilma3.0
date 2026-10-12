import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AppView } from '../types';
import { 
  Sparkles, 
  Camera, 
  Layers, 
  Palette, 
  User, 
  ShieldCheck, 
  MessageCircle 
} from 'lucide-react';

export const BottomMobileNav: React.FC = () => {
  const { currentView, setCurrentView, user, setIsSupportModalOpen } = useAuth();

  const isCurrent = (view: AppView) => {
    if (view === 'analyzer-select') {
      return (
        currentView === 'analyzer-select' || 
        currentView === 'analyzer-photo' || 
        currentView === 'analyzer-quiz' ||
        currentView === 'result'
      );
    }
    return currentView === view;
  };

  return (
    <nav 
      aria-label="Navegación Móvil Principal"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Inicio */}
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isCurrent('landing') ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isCurrent('landing') ? 'bg-rose-100 scale-105' : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Inicio</span>
        </button>

        {/* 2. Análisis */}
        <button
          onClick={() => setCurrentView('analyzer-select')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isCurrent('analyzer-select') ? 'text-rose-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isCurrent('analyzer-select') ? 'bg-rose-100 scale-105' : ''}`}>
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Análisis</span>
        </button>

        {/* 3. Draping Virtual */}
        <button
          onClick={() => setCurrentView('virtual-drape')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isCurrent('virtual-drape') ? 'text-purple-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isCurrent('virtual-drape') ? 'bg-purple-100 scale-105' : ''}`}>
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Draping</span>
        </button>

        {/* 4. 12 Estaciones */}
        <button
          onClick={() => setCurrentView('seasons-guide')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isCurrent('seasons-guide') ? 'text-amber-600 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isCurrent('seasons-guide') ? 'bg-amber-100 scale-105' : ''}`}>
            <Palette className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">Estaciones</span>
        </button>

        {/* 5. Asesoría y Soporte Wilma Hernández */}
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer text-emerald-700 relative group"
          title="Asesoría y Soporte: Wilma Hernández (Concepción, Chile)"
        >
          <div className="p-1 rounded-xl bg-emerald-100 group-hover:scale-105 transition-all relative">
            <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="text-[10px] mt-0.5 leading-tight font-bold">Asesora</span>
        </button>

        {/* 6. Perfil / Admin */}
        <button
          onClick={() => setCurrentView(user?.role === 'admin' ? 'admin' : 'profile')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            isCurrent('profile') || isCurrent('admin') ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${isCurrent('profile') || isCurrent('admin') ? 'bg-stone-200 scale-105' : ''}`}>
            {user?.role === 'admin' ? (
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">
            {user?.role === 'admin' ? 'Admin' : 'Perfil'}
          </span>
        </button>

      </div>
    </nav>
  );
};
