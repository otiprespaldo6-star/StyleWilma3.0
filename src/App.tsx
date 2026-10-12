/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AnalyzerSelect } from './components/AnalyzerSelect';
import { PhotoUploader } from './components/PhotoUploader';
import { ColorQuiz } from './components/ColorQuiz';
import { AnalysisResultView } from './components/AnalysisResultView';
import { VirtualDraper } from './components/VirtualDraper';
import { SeasonsDirectory } from './components/SeasonsDirectory';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanel } from './components/AdminPanel';
import { ManualView } from './components/ManualView';
import { StyleDNASurvey } from './components/StyleDNASurvey';
import { AuthModal } from './components/AuthModal';
import { PremiumModal } from './components/PremiumModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SupportAdvisorWidget } from './components/SupportAdvisorWidget';
import { BottomMobileNav } from './components/BottomMobileNav';
import { TopRightVerticalBar } from './components/TopRightVerticalBar';
import { Lock, Crown } from 'lucide-react';

const AdminGate: React.FC = () => {
  const { user, loginAsMaster, quickSwitchRole, setCurrentView } = useAuth();
  const [masterPass, setMasterPass] = useState('');
  const [error, setError] = useState('');

  if (user?.role === 'admin' || user?.role === 'master') {
    return <AdminPanel />;
  }

  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAsMaster(masterPass);
    if (!res.success) {
      setError('Contraseña Máster incorrecta.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
        <Crown className="w-7 h-7" />
      </div>

      <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
        Panel Superadmin Máster
      </h2>

      <p className="text-stone-500 dark:text-stone-400 text-xs">
        Este panel requiere privilegios de superadministradora para gestionar las 15 secciones (D1, visitas, apariencia, seguridad).
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>
      )}

      <form onSubmit={handleMasterSubmit} className="space-y-3 pt-2">
        <input
          type="password"
          value={masterPass}
          onChange={(e) => setMasterPass(e.target.value)}
          placeholder="Ingresa clave MASTER"
          className="w-full px-4 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white font-mono text-center"
        />
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          Desbloquear con Clave Master
        </button>
      </form>

      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between gap-2">
        <button
          onClick={() => quickSwitchRole('master', 'premium')}
          className="text-[11px] text-purple-600 hover:underline font-semibold cursor-pointer"
        >
          Modo Demostración Master
        </button>
        <button
          onClick={() => setCurrentView('landing')}
          className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentView } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'analyzer-select':
        return <AnalyzerSelect />;
      case 'analyzer-photo':
        return <PhotoUploader />;
      case 'analyzer-quiz':
        return <ColorQuiz />;
      case 'result':
        return <AnalysisResultView />;
      case 'virtual-drape':
        return <VirtualDraper />;
      case 'seasons-guide':
        return <SeasonsDirectory />;
      case 'dna-survey':
        return <StyleDNASurvey />;
      case 'manual':
        return <ManualView />;
      case 'profile':
        return <UserProfileView />;
      case 'admin':
        return <AdminGate />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rose-200 selection:text-rose-900 pb-16 md:pb-0">
      <OfflineIndicator />
      <Navbar />
      <TopRightVerticalBar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
      
      {/* Mobile Bottom Navigation Dock (Visible on Mobile) */}
      <BottomMobileNav />

      {/* Global Modals & Support Widget */}
      <SupportAdvisorWidget />
      <AuthModal />
      <PremiumModal />
      <PWAInstallBanner />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
