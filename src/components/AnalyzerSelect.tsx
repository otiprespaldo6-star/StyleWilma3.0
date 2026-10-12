import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, HelpCircle, Sparkles, Check, ArrowRight } from 'lucide-react';

export const AnalyzerSelect: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-3 border border-rose-200">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Elige tu método de diagnóstico</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-4">
          ¿Cómo deseas descubrir tu estación?
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Ambos métodos están fundamentados en la teoría del color de las 12 estaciones de colorimetría personal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Method 1: AI Photo Analysis */}
        <div 
          onClick={() => setCurrentView('analyzer-photo')}
          className="bg-white rounded-3xl p-8 border-2 border-stone-200 hover:border-rose-400 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-amber-400 text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
            Recomendado
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors mb-2">
              Análisis Fotográfico con IA
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Sube una selfie o usa tu cámara web. Nuestro modelo multimodal evalúa la temperatura de tu piel, contraste y saturación con precisión instantánea.
            </p>

            <ul className="space-y-2.5 text-xs text-stone-600 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Extracción de código HEX de tu tono de piel</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Sin sesgos personales: diagnóstico objetivo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Listo en menos de 10 segundos</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3.5 rounded-xl bg-rose-600 group-hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
            <span>Subir o tomar foto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Method 2: Manual Quiz */}
        <div 
          onClick={() => setCurrentView('analyzer-quiz')}
          className="bg-white rounded-3xl p-8 border-2 border-stone-200 hover:border-rose-400 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-7 h-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors mb-2">
              Cuestionario de 7 Pasos
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Responde a preguntas guiadas con ilustraciones sobre tus venas, reacción al sol, joyas, blanco puro vs crema y color de iris.
            </p>

            <ul className="space-y-2.5 text-xs text-stone-600 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No necesitas cámara ni subir fotos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Aprende los fundamentos de colorimetría en cada paso</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Compara tus respuestas paso a paso</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3.5 rounded-xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 group-hover:text-amber-900 font-bold text-xs transition-all flex items-center justify-center gap-2">
            <span>Iniciar cuestionario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
