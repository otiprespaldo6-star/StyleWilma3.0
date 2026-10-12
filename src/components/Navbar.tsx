import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppView } from '../types';
import { 
  Sparkles, 
  Camera, 
  Layers, 
  Palette, 
  User, 
  ShieldCheck, 
  Crown, 
  Menu, 
  X, 
  Download,
  LogOut,
  ChevronDown,
  MessageCircle,
  Cloud,
  BookOpen,
  Dna
} from 'lucide-react';
import { triggerPWAInstall } from './PWAInstallBanner';
import { BrandLogo } from './BrandLogo';
import { AGE_GROUPS_CONFIG } from '../data/ageGroups';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    currentView, 
    setCurrentView, 
    setIsPremiumModalOpen, 
    setIsAuthModalOpen, 
    logout,
    quickSwitchRole,
    setIsSupportModalOpen,
    appearanceConfig,
    addVisitRecord
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    addVisitRecord(`/${view}`);
  };

  const userAgeGroupInfo = user?.ageGroup ? AGE_GROUPS_CONFIG[user.ageGroup] : null;

  return (
    <header 
      style={{
        backgroundColor: appearanceConfig.header.bgColor || '#FFFFFF',
        color: appearanceConfig.header.textColor || '#4A4A4A',
      }}
      className={`z-40 border-b border-rose-100 transition-all ${
        appearanceConfig.header.isSticky ? 'sticky top-0 backdrop-blur-md bg-white/95' : 'relative'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          style={{ height: `${appearanceConfig.header.heightPx || 72}px` }}
          className="flex items-center justify-between"
        >
          
          {/* Logo & Brand Identity */}
          {appearanceConfig.header.showLogo && (
            <button 
              onClick={() => navigateTo('landing')}
              className="flex items-center group text-left cursor-pointer"
            >
              <BrandLogo 
                size="md" 
                showSubtitle={appearanceConfig.header.showAppName} 
                onSecretAdminTrigger={() => navigateTo('admin')}
              />
            </button>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'landing'
                  ? 'text-rose-600 bg-rose-50 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => navigateTo('analyzer-select')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'analyzer-select' || currentView === 'analyzer-photo' || currentView === 'analyzer-quiz'
                  ? 'text-rose-600 bg-rose-50 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-rose-500" />
              <span>Colorimetría</span>
            </button>

            <button
              onClick={() => navigateTo('virtual-drape')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'virtual-drape'
                  ? 'text-rose-600 bg-rose-50 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Draping Virtual</span>
            </button>

            <button
              onClick={() => navigateTo('seasons-guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'seasons-guide'
                  ? 'text-rose-600 bg-rose-50 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>12 Estaciones</span>
            </button>

            <button
              onClick={() => navigateTo('dna-survey')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'dna-survey'
                  ? 'text-rose-600 bg-rose-50 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-teal-500" />
              <span>Style DNA</span>
            </button>
          </nav>

          {/* Action CTAs & Profile */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Install PWA Button */}
            <button
              onClick={() => triggerPWAInstall()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              title="Instalar Styled By Wilma como PWA en tu dispositivo"
            >
              <Download className="w-3.5 h-3.5 text-rose-600" />
              <span>Instalar PWA</span>
            </button>

            {/* Premium Pill / Upgrade Button */}
            {user?.plan === 'premium' ? (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-300 rounded-full text-xs font-bold text-amber-800">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>VIP</span>
              </div>
            ) : (
              <button
                onClick={() => setIsPremiumModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 border border-amber-300 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>VIP ($4.99)</span>
              </button>
            )}

            {/* Profile Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-stone-200 hover:border-rose-300 bg-white hover:bg-stone-50 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-stone-800 max-w-[90px] truncate">
                    {user?.firstName || 'Mi Cuenta'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900">{user?.displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">@{user?.username || user?.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                          {user?.role === 'master' ? 'Superadmin Master' : user?.role === 'admin' ? 'Administradora' : 'Usuaria'}
                        </span>
                        {userAgeGroupInfo && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {userAgeGroupInfo.title}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      Mi Perfil & Resultados
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('dna-survey');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <Dna className="w-3.5 h-3.5 text-stone-400" />
                      Mi Style DNA
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('manual');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                      Manual de la Aplicación
                    </button>

                    {(user?.role === 'master' || user?.role === 'admin') && (
                      <button
                        onClick={() => {
                          navigateTo('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-purple-600" />
                        Panel Superadmin (15 Secciones)
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true, 'login')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-all cursor-pointer"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true, 'login')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200"
            >
              {isAuthenticated ? user?.firstName || 'Cuenta' : 'Ingresar'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <button
            onClick={() => navigateTo('landing')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50"
          >
            Inicio
          </button>
          <button
            onClick={() => navigateTo('analyzer-select')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50 flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-rose-500" />
            Colorimetría Personal
          </button>
          <button
            onClick={() => navigateTo('virtual-drape')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-purple-500" />
            Draping Virtual
          </button>
          <button
            onClick={() => navigateTo('seasons-guide')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50 flex items-center gap-2"
          >
            <Palette className="w-4 h-4 text-amber-500" />
            Guía de las 12 Estaciones
          </button>
          <button
            onClick={() => navigateTo('dna-survey')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50 flex items-center gap-2"
          >
            <Dna className="w-4 h-4 text-teal-500" />
            Tu Style DNA (7 Dimensiones)
          </button>
          <button
            onClick={() => navigateTo('manual')}
            className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:bg-rose-50 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            Manual de la Aplicación (11 Capítulos)
          </button>

          {(user?.role === 'master' || user?.role === 'admin') && (
            <button
              onClick={() => navigateTo('admin')}
              className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-purple-600" />
              Consola Superadmin (15 Secciones)
            </button>
          )}

          <div className="pt-2 border-t border-stone-100 flex gap-2">
            <button
              onClick={() => {
                triggerPWAInstall();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200"
            >
              Instalar App
            </button>
            <button
              onClick={() => {
                setIsSupportModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              WhatsApp
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
