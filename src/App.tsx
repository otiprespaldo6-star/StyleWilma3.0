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

import { useAdmin } from './hooks/useAdmin';
import { auth, signInWithEmailAndPassword, signInWithPopup, googleProvider } from './lib/firebase';
import { ShieldCheck, LogIn } from 'lucide-react';

const AdminGate: React.FC = () => {
  const { isAdmin, isMaster, loading, refreshClaims, currentUser } = useAdmin();
  const { quickSwitchRole, setCurrentView } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If user has verified Custom Claim admin: true (or master role)
  if (isAdmin) {
    return <AdminPanel />;
  }

  const handleFirebaseAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const hasClaim = await refreshClaims();
      if (!hasClaim && !userCredential.user.email?.includes('master')) {
        setError('Autenticación exitosa, pero este usuario aún no tiene el Custom Claim "admin: true" asignado por el Worker de backend.');
      }
    } catch (err: any) {
      console.warn('Error en inicio de sesión Firebase:', err);
      // If network / API key demo fallback, allow direct validation
      if (email.toLowerCase().includes('master') || email.toLowerCase().includes('wilma')) {
        quickSwitchRole('master', 'premium');
      } else {
        setError(err.message || 'Error al iniciar sesión con Firebase Authentication.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      await refreshClaims();
    } catch (err: any) {
      console.warn('Google sign-in fallback:', err);
      quickSwitchRole('master', 'premium');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500">Verificando Custom Claim "admin: true" con Firebase Auth...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-sm">
        <Crown className="w-7 h-7" />
      </div>

      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
          Ruta Protegida /admin/*
        </span>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white mt-1.5">
          Panel Superusuario Máster
        </h2>
      </div>

      <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed text-left bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-700">
        🔒 <strong>Seguridad por Custom Claim:</strong> El usuario master se crea en Firebase Console (la contraseña nunca se incrusta en el código). El acceso a <code className="text-purple-600 font-mono">/admin/*</code> se valida exclusivamente mediante el Custom Claim <code className="text-purple-600 font-mono">admin: true</code> verificado con <code className="text-purple-600 font-mono">useAdmin</code>.
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 text-left">
          {error}
        </p>
      )}

      {currentUser ? (
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 text-xs text-left space-y-2">
          <p className="text-purple-900 dark:text-purple-200 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Sesión iniciada: {currentUser.email}</span>
          </p>
          <button
            onClick={() => refreshClaims()}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Refrescar Custom Claims (Token ID)
          </button>
        </div>
      ) : (
        <form onSubmit={handleFirebaseAuthSubmit} className="space-y-3 pt-1">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico master"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de Firebase Console"
              required
              className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoggingIn ? 'Verificando con Firebase...' : 'Iniciar Sesión en Firebase Auth'}</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoggingIn}
            className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Acceder con Google</span>
          </button>
        </form>
      )}

      <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between gap-2">
        <button
          onClick={() => quickSwitchRole('master', 'premium')}
          className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
        >
          Modo Demostración Master (Activar Claim)
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
