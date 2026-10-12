import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Camera, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Trash2,
  Eye,
  Video,
  StopCircle
} from 'lucide-react';

export const PRESET_LOGO_EXAMPLE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='200' height='200'><defs><linearGradient id='goldG' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23F5D061'/><stop offset='50%25' stop-color='%23E11D48'/><stop offset='100%25' stop-color='%239333EA'/></linearGradient></defs><rect width='200' height='200' rx='44' fill='%231C1917'/><circle cx='100' cy='100' r='75' stroke='url(%23goldG)' stroke-width='3' stroke-dasharray='4 4' fill='none'/><path d='M50 65 L70 140 L100 85 L130 140 L150 65' stroke='url(%23goldG)' stroke-width='10' stroke-linecap='round' stroke-linejoin='round' fill='none'/><text x='100' y='165' text-anchor='middle' font-family='serif' font-size='12' font-weight='bold' fill='%23F5D061' letter-spacing='3'>STYLED BY WILMA</text></svg>";

export const PRESET_SAMPLE_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";

interface ImageUploaderWidgetProps {
  label: string;
  sublabel?: string;
  currentImageUrl?: string;
  onImageChange: (dataUrl: string) => void;
  presetExampleUrl?: string;
  presetExampleLabel?: string;
  recommendedSize?: string;
  aspectRatio?: 'square' | 'wide' | 'avatar';
}

export const ImageUploaderWidget: React.FC<ImageUploaderWidgetProps> = ({
  label,
  sublabel,
  currentImageUrl,
  onImageChange,
  presetExampleUrl,
  presetExampleLabel = 'Cargar Ejemplo Personalizado',
  recommendedSize = '512 x 512 px',
  aspectRatio = 'square'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Compress and resize image to lightweight Data URI for clean persistent storage
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = aspectRatio === 'wide' ? 1200 : 800;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.88);
          onImageChange(compressedDataUrl);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so same file can be re-selected if desired
    e.target.value = '';
  };

  // Live Camera Stream modal for desktop/tablet/mobile camera capture
  const startLiveCamera = async () => {
    setCameraError(null);
    setIsLiveCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Live camera permission or device error, using native file fallback:', err);
      setCameraError('No se pudo acceder a la cámara directamente. Puedes usar el botón de captura nativa.');
    }
  };

  const capturePhotoFromLiveStream = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/webp', 0.9);
      onImageChange(dataUrl);
      stopLiveCamera();
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsLiveCameraOpen(false);
  };

  return (
    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>{label}</span>
          </h4>
          {sublabel && (
            <p className="text-[11px] text-stone-400">{sublabel}</p>
          )}
        </div>
        <span className="text-[10px] font-mono text-stone-500">
          Rec: {recommendedSize}
        </span>
      </div>

      {/* Hidden inputs: 1 for standard file/gallery, 1 for native mobile camera */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input 
        ref={cameraInputRef}
        type="file" 
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview & Action Center */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Visual Preview Box */}
        <div className={`relative shrink-0 rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 flex items-center justify-center p-2 ${
          aspectRatio === 'wide' ? 'w-full sm:w-48 h-28' : 'w-24 h-24 sm:w-28 sm:h-28'
        }`}>
          {currentImageUrl ? (
            <img 
              src={currentImageUrl} 
              alt={label}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-2 text-stone-500">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <span className="text-[10px] block leading-tight">Sin imagen</span>
            </div>
          )}

          {currentImageUrl && (
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 shadow-md cursor-pointer transition-colors"
              title="Quitar imagen"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Buttons to upload from PC, Phone, Tablet, Camera, or Preset */}
        <div className="flex-1 w-full space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* 1. Subir desde Computadora / Archivos */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Subir archivo desde tu computadora, tablet o galería móvil"
            >
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              <span>Desde Archivos</span>
            </button>

            {/* 2. Subir desde Teléfono / Galería */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Abrir galería de fotos en teléfono móvil o tablet"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Móvil / Tablet</span>
            </button>

            {/* 3. Tomar con Cámara */}
            <button
              type="button"
              onClick={() => {
                // Try live camera stream or trigger native camera capture input
                if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                  startLiveCamera();
                } else {
                  cameraInputRef.current?.click();
                }
              }}
              className="col-span-2 sm:col-span-1 p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-700 text-purple-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Tomar fotografía con la cámara de tu teléfono, tablet o webcam de computadora"
            >
              <Camera className="w-3.5 h-3.5 text-purple-300" />
              <span>Usar Cámara</span>
            </button>
          </div>

          {/* Optional Preset Example */}
          {presetExampleUrl && (
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onImageChange(presetExampleUrl)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{presetExampleLabel}</span>
              </button>
              
              {currentImageUrl === presetExampleUrl && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" />
                  Ejemplo aplicado
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live Camera Snapshot Modal */}
      {isLiveCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-950 rounded-3xl max-w-md w-full p-5 border border-purple-500/40 space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Capturar Foto con Cámara</span>
              </div>
              <button
                type="button"
                onClick={stopLiveCamera}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-200 space-y-2">
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={() => {
                    stopLiveCamera();
                    cameraInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer"
                >
                  Abrir Cámara Nativa del Dispositivo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-stone-800">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={capturePhotoFromLiveStream}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Tomar Foto y Guardar</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopLiveCamera}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 text-stone-400 hover:text-white text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
