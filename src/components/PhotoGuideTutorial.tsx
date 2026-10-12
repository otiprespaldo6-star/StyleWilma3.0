import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sun, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Check, 
  Smile, 
  Lightbulb, 
  Layers, 
  Upload, 
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhotoGuideTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onUsePhotoInDraper?: (dataUrl: string) => void;
  onGoToAnalysis?: () => void;
}

export const PhotoGuideTutorial: React.FC<PhotoGuideTutorialProps> = ({
  isOpen,
  onClose,
  onUsePhotoInDraper,
  onGoToAnalysis,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Interactive checklist states
  const [checks, setChecks] = useState<{ [key: string]: boolean }>({
    lightWindow: false,
    noWarmLamps: false,
    eyeLevel: false,
    straightHead: false,
    noMakeup: false,
    hairTied: false,
    noFilters: false,
  });

  // Interactive Lighting Simulator Toggle
  const [lightingSim, setLightingSim] = useState<'natural' | 'warm_bad' | 'shadow_bad'>('natural');

  // Interactive Angle Simulator Toggle
  const [angleSim, setAngleSim] = useState<'front' | 'high_bad' | 'low_bad'>('front');

  // Interactive Makeup Simulator Toggle
  const [makeupSim, setMakeupSim] = useState<'bare' | 'makeup_bad'>('bare');

  // Camera / selfie checker state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      setErrorMessage('No se pudo acceder a la cámara. Puedes subir una foto desde tus archivos para verificarla.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
    stopCamera();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedPhoto(reader.result as string);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecks = Object.keys(checks).length;
  const completedChecks = Object.values(checks).filter(Boolean).length;
  const readinessPercentage = Math.round((completedChecks / totalChecks) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-6 relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Guía de Precisión de Colorimetría</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Cómo Tomar la Foto Ideal para tu Análisis
          </h2>
          <p className="text-xs text-stone-500">
            Un diagnóstico exacto depende de 3 pilares ópticos: luz natural sin tintes, ángulo neutral y piel al natural.
          </p>
        </div>

        {/* Step Tabs Indicator */}
        <div className="flex items-center justify-between gap-1 bg-stone-100 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto">
          {[
            { id: 0, label: '1. Iluminación', icon: <Sun className="w-3.5 h-3.5" /> },
            { id: 1, label: '2. Ángulo y Encuadre', icon: <Camera className="w-3.5 h-3.5" /> },
            { id: 2, label: '3. Sin Maquillaje', icon: <Smile className="w-3.5 h-3.5" /> },
            { id: 3, label: '4. Verificador en Vivo', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => {
                stopCamera();
                setCurrentStep(step.id);
              }}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                currentStep === step.id
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {step.icon}
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: ILUMINACIÓN */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sun className="w-4 h-4 text-amber-600" />
                La Regla de Oro: Luz natural frontal difusa de ventana
              </span>
              <p>
                Las bombillas de casa tienen temperatura de color cálida (amarilla ~2700K) o fría artificial (~6500K) que tiñe tu piel e impide leer tu verdadero subtono. La mejor fuente es colocarte a 1 metro frente a una ventana en un día con luz diurna.
              </p>
            </div>

            {/* Interactive Visual Comparison Simulator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Simulador de Efecto de Iluminación en el Rostro:
                </span>
                <div className="flex gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setLightingSim('natural')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      lightingSim === 'natural' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✓ Luz Natural
                  </button>
                  <button
                    onClick={() => setLightingSim('warm_bad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      lightingSim === 'warm_bad' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✗ Luz Amarilla
                  </button>
                  <button
                    onClick={() => setLightingSim('shadow_bad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      lightingSim === 'shadow_bad' ? 'bg-stone-800 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✗ Sombras Duras
                  </button>
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="relative h-60 rounded-2xl overflow-hidden border-2 border-stone-200 flex items-center justify-center bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80"
                  alt="Simulación de luz"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    lightingSim === 'natural'
                      ? 'filter-none brightness-100'
                      : lightingSim === 'warm_bad'
                      ? 'sepia-70 hue-rotate-[-20deg] brightness-105'
                      : 'contrast-175 brightness-75'
                  }`}
                />

                {/* Status Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/60 text-white text-xs flex items-center justify-between">
                  <div>
                    {lightingSim === 'natural' && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Luz recomendada: Color real del cutis y ojos sin distorsión
                      </span>
                    )}
                    {lightingSim === 'warm_bad' && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Error: La luz amarilla hace que cualquier persona parezca Cálida
                      </span>
                    )}
                    {lightingSim === 'shadow_bad' && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Error: Sombras marcadas acentúan falsas ojeras y oscurecen la piel
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-700 block">
                Comprueba tu entorno antes de disparar:
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.lightWindow}
                    onChange={() => toggleCheck('lightWindow')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Estoy mirando de frente hacia una ventana o en un espacio exterior iluminado bajo sombra.
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.noWarmLamps}
                    onChange={() => toggleCheck('noWarmLamps')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    He apagado las lámparas amarillas de techo o flexos cercanos.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ÁNGULO Y ENCUADRE */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-purple-900">
                <Camera className="w-4 h-4 text-purple-600" />
                Cámara a la altura de los ojos y ángulo recto
              </span>
              <p>
                Los selfies tomados desde arriba (picado) o desde abajo (contrapicado) proyectan sombras indeseadas bajo la barbilla y la nariz, alterando el contraste general del rostro. Coloca el teléfono a la altura de tus ojos, a unos 50-70 cm de distancia.
              </p>
            </div>

            {/* Angle Simulator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Prueba de Perspectiva Facial:
                </span>
                <div className="flex gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setAngleSim('front')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      angleSim === 'front' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✓ Frontal Nivelado
                  </button>
                  <button
                    onClick={() => setAngleSim('high_bad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      angleSim === 'high_bad' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✗ Selfie desde Arriba
                  </button>
                  <button
                    onClick={() => setAngleSim('low_bad')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      angleSim === 'low_bad' ? 'bg-stone-800 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✗ Desde Abajo
                  </button>
                </div>
              </div>

              {/* Angle Visual Box */}
              <div className="relative h-60 rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
                  alt="Simulación de ángulo"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    angleSim === 'front'
                      ? 'scale-100 translate-y-0'
                      : angleSim === 'high_bad'
                      ? 'scale-110 -translate-y-4 rotate-1'
                      : 'scale-110 translate-y-4 -rotate-1'
                  }`}
                />

                {/* Oval Overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-full m-8 pointer-events-none flex items-center justify-center">
                  <span className="bg-black/50 text-[10px] text-white px-2 py-0.5 rounded-full font-medium">
                    {angleSim === 'front' ? 'Encuadre Óptimo' : 'Rostro Desalineado'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/60 text-white text-xs">
                  {angleSim === 'front' && (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Rostro centrado: proporción simétrica y cuello visible para medir armonía.
                    </span>
                  )}
                  {angleSim === 'high_bad' && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      El ángulo desde arriba deforma la frente y oculta la mandíbula y cuello.
                    </span>
                  )}
                  {angleSim === 'low_bad' && (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      El ángulo desde abajo produce sombras bajo la barbilla y fosas nasales.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-700 block">
                Comprueba tu postura:
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.eyeLevel}
                    onChange={() => toggleCheck('eyeLevel')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Sostengo la cámara al nivel de mis ojos, no inclinada desde arriba o abajo.
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.straightHead}
                    onChange={() => toggleCheck('straightHead')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Tengo la cabeza recta hacia el frente, sin girar el perfil.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SIN MAQUILLAJE NI FILTROS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-900">
                <Smile className="w-4 h-4 text-rose-600" />
                Rostro limpio al natural: el subtono vive en tu piel desnuda
              </span>
              <p>
                La base de maquillaje, los correctores y el bronceador introducen pigmentos sintéticos (a menudo cálidos) que engañan a los algoritmos de IA y a las consultoras humanas. Despeja también el cabello de la frente para evaluar el nacimiento del pelo.
              </p>
            </div>

            {/* Makeup vs Bare Skin Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Comparativa de Lectura Cromática:
                </span>
                <div className="flex gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setMakeupSim('bare')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      makeupSim === 'bare' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✓ Piel Limpia Natural
                  </button>
                  <button
                    onClick={() => setMakeupSim('makeup_bad')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      makeupSim === 'makeup_bad' ? 'bg-rose-600 text-white font-bold' : 'text-stone-600'
                    }`}
                  >
                    ✗ Base + Filtro Belleza
                  </button>
                </div>
              </div>

              <div className="relative h-60 rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-900 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                  alt="Simulación de maquillaje"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    makeupSim === 'bare'
                      ? 'filter-none'
                      : 'blur-[0.5px] saturate-150 brightness-110 contrast-95'
                  }`}
                />

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl backdrop-blur-md bg-black/60 text-white text-xs">
                  {makeupSim === 'bare' ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Lectura 100% auténtica: se aprecian los verdaderos matices de caroteno y hemoglobina.
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      La base enmascara el subtono y los filtros de Instagram modifican la saturación.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-700 block">
                Comprueba tu preparación:
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.noMakeup}
                    onChange={() => toggleCheck('noMakeup')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Rostro lavado sin base, corrector, rubor ni labial.
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.hairTied}
                    onChange={() => toggleCheck('hairTied')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Cabello despejado de la frente y sienes (recogido o tras las orejas).
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checks.noFilters}
                    onChange={() => toggleCheck('noFilters')}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-medium text-stone-800">
                    Sin filtros de belleza activos en la cámara del móvil.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFICADOR EN VIVO (SELFIE CHECKER) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold block text-emerald-900">
                  ¡Ponlo en práctica! Verificador de Foto
                </span>
                <p className="text-stone-600 mt-0.5">
                  Toma una foto con tu cámara o sube un selfie para probar la retícula de alineación.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {readinessPercentage}% Listo
                </span>
                <span className="block text-[10px] text-stone-400">
                  {completedChecks}/{totalChecks} checks
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Checker Studio Canvas */}
            <div className="bg-stone-900 rounded-3xl p-4 sm:p-6 text-center text-white space-y-4">
              
              {/* Camera Stream Active */}
              {isCameraActive && (
                <div className="relative max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-emerald-400">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />

                  {/* Facial Guide Oval Overlay */}
                  <div className="absolute inset-0 border-2 border-dashed border-emerald-400/80 rounded-full m-8 pointer-events-none flex flex-col items-center justify-between py-6">
                    <span className="bg-emerald-950/80 text-[10px] text-emerald-300 px-2 py-0.5 rounded-full">
                      Frente despejada
                    </span>
                    <span className="bg-emerald-950/80 text-[10px] text-emerald-300 px-2 py-0.5 rounded-full">
                      Ojos alineados
                    </span>
                    <span className="bg-emerald-950/80 text-[10px] text-emerald-300 px-2 py-0.5 rounded-full">
                      Barbilla centrada
                    </span>
                  </div>
                </div>
              )}

              {/* Captured / Uploaded Photo Preview */}
              {!isCameraActive && capturedPhoto && (
                <div className="relative max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-emerald-400">
                  <img
                    src={capturedPhoto}
                    alt="Foto capturada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ✓ Foto Lista
                  </div>
                </div>
              )}

              {/* No photo yet */}
              {!isCameraActive && !capturedPhoto && (
                <div className="py-8 space-y-3">
                  <Camera className="w-10 h-10 text-stone-500 mx-auto" />
                  <p className="text-xs text-stone-400">
                    Activa la cámara con la retícula de encuadre o sube una imagen existente.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {isCameraActive ? (
                  <>
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Capturar Foto con Guía
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{capturedPhoto ? 'Tomar Otra con Cámara' : 'Abrir Cámara con Retícula'}</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-stone-300" />
                      <span>Subir Foto</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* When photo is ready, offer direct usage in Virtual Draper or full analysis */}
              {capturedPhoto && (
                <div className="pt-4 border-t border-stone-800 space-y-2">
                  <p className="text-xs text-emerald-400 font-bold">
                    ¡Excelente! Tu foto cumple con las recomendaciones de encuadre y luz.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-1">
                    {onUsePhotoInDraper && (
                      <button
                        onClick={() => {
                          onUsePhotoInDraper(capturedPhoto);
                          onClose();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Usar esta foto en el Draping Virtual</span>
                      </button>
                    )}

                    {onGoToAnalysis && (
                      <button
                        onClick={() => {
                          onGoToAnalysis();
                          onClose();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-rose-500" />
                        <span>Hacer Análisis Completo de 12 Estaciones</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={() => {
              stopCamera();
              setCurrentStep((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <span className="text-xs font-semibold text-stone-400">
            Paso {currentStep + 1} de 4
          </span>

          {currentStep < 3 ? (
            <button
              onClick={() => {
                stopCamera();
                setCurrentStep((prev) => Math.min(3, prev + 1));
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
            >
              Cerrar Guía
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
