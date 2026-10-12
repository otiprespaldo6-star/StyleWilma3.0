import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, Share, PlusSquare, ArrowUpRight } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const triggerPWAInstall = () => {
  window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
};

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsStandalone(standaloneMode);
    if (standaloneMode) return;

    // Check for iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !standaloneMode;
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user dismissed recently
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    const handleManualTrigger = () => {
      if (deferredPrompt) {
        handleInstallClick();
      } else if (isIosDevice) {
        setShowIOSInstructions(true);
      } else {
        // Fallback banner for desktop or other browsers
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger-pwa-install', handleManualTrigger);

    // Initial check for mobile/first visit prompt after a gentle delay
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (!dismissed && !standaloneMode) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('trigger-pwa-install', handleManualTrigger);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger-pwa-install', handleManualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setShowBanner(false);
          setIsStandalone(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Error durante la instalación de la PWA:', err);
      }
    } else if (isIOS) {
      setShowIOSInstructions(true);
    } else {
      // If browser doesn't expose deferredPrompt yet
      setShowIOSInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating Bottom Installation Banner */}
      {showBanner && (
        <aside
          role="region"
          aria-label="Instalación de aplicación PWA"
          className="fixed bottom-20 md:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-45 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-rose-500/30 flex flex-col gap-3 animate-in slide-in-from-bottom-5 transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-purple-600 p-[2px] shrink-0 shadow-lg shadow-rose-900/40">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white tracking-tight">Instalar Styled By Wilma PWA</h4>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Offline Ready
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Guarda tus paletas, outfits y usa el draping sin conexión en tu inicio.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
              title="Cerrar aviso de instalación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-stone-800/80">
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instalación directa sin tiendas</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-rose-900/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar Ahora</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* iOS Safari Guided Installation Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl border border-stone-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-100 to-purple-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Instalar en iPhone o iPad
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Sigue estos 3 pasos rápidos en Safari para añadir Styled By Wilma a tu pantalla de inicio:
              </p>
            </div>

            <div className="text-xs text-stone-700 space-y-3 text-left bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Pulsa el botón <strong className="text-stone-900">Compartir</strong> (
                  <Share className="w-3.5 h-3.5 inline mx-0.5 text-rose-600" />
                  icono cuadrado con flecha hacia arriba) en la barra de Safari.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Baja en el menú y selecciona <strong className="text-stone-900">"Añadir a la pantalla de inicio"</strong> (
                  <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-rose-600" />
                  ).
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <p>
                  Confirma pulsando <strong className="text-stone-900">"Añadir"</strong> en la esquina superior derecha. ¡Listo!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
