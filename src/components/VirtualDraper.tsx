import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SEASONS_LIST, SEASONS_DATA } from '../data/seasons';
import { PhotoGuideTutorial } from './PhotoGuideTutorial';
import { 
  Layers, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  HelpCircle,
  Eye,
  Sliders,
  ArrowRight,
  Camera,
  Upload
} from 'lucide-react';

const DRAPING_MODELS = [
  {
    name: 'Valeria',
    subfamily: 'Primavera',
    undertone: 'Cálido',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Elena',
    subfamily: 'Verano',
    undertone: 'Frío',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lucía',
    subfamily: 'Otoño',
    undertone: 'Cálido',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Camila',
    subfamily: 'Invierno',
    undertone: 'Frío',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80'
  }
];

const PRESET_DUELS = [
  {
    title: 'Duelo Térmico: Coral vs Fucsia',
    description: '¿Tu piel resplandece con la calidez del coral o la frescura del fucsia?',
    colorA: { name: 'Coral Cálido', hex: '#FF6F59', thermal: 'Cálido' },
    colorB: { name: 'Fucsia Frío', hex: '#E0115F', thermal: 'Frío' }
  },
  {
    title: 'Duelo Metálico: Oro vs Plata',
    description: 'Comprueba el halo luminoso del oro amarillo contra la plata helada.',
    colorA: { name: 'Oro Radiante', hex: '#D4AF37', thermal: 'Cálido' },
    colorB: { name: 'Plata Fría', hex: '#C0C0C0', thermal: 'Frío' }
  },
  {
    title: 'Duelo de Claridad: Marfil vs Blanco Puro',
    description: '¿Te dulcifica el marfil crema o te da vigor el blanco óptico?',
    colorA: { name: 'Marfil Crema', hex: '#FFFFF0', thermal: 'Cálido' },
    colorB: { name: 'Blanco Óptico', hex: '#FFFFFF', thermal: 'Frío' }
  },
  {
    title: 'Duelo Terroso: Naranja vs Frambuesa',
    description: 'Compara tonos otoñales ricos contra frambuesas de verano.',
    colorA: { name: 'Naranja Tostado', hex: '#D35400', thermal: 'Cálido' },
    colorB: { name: 'Frambuesa Fría', hex: '#C2185B', thermal: 'Frío' }
  }
];

export const VirtualDraper: React.FC = () => {
  const { currentAnalysis, setCurrentView } = useAuth();
  
  const [selectedModel, setSelectedModel] = useState<typeof DRAPING_MODELS[0]>(DRAPING_MODELS[0]);
  const [customUserPhoto, setCustomUserPhoto] = useState<string | null>(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [activeColorHex, setActiveColorHex] = useState<string>('#FF6F59');
  const [activeColorName, setActiveColorName] = useState<string>('Coral Cálido');
  const [selectedDuelIndex, setSelectedDuelIndex] = useState(0);
  const [compareMode, setCompareMode] = useState<'single' | 'split'>('single');
  const [splitPosition, setSplitPosition] = useState(50);

  const activeDuel = PRESET_DUELS[selectedDuelIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-3 border border-purple-200">
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Simulador de Draping Virtual</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-3">
          El Probador de Telas y Colorimetría
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Experimenta cómo diferentes tonos colocados junto al rostro alteran la percepción de la piel, ojeras y luminosidad del iris.
        </p>
      </div>

      {/* Tutorial Callout Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 rounded-3xl p-5 sm:p-6 border border-purple-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
              Tutorial Interactivo Paso a Paso
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              ¿Quieres probar con tu propia foto?
            </h3>
            <p className="text-xs text-stone-600">
              Aprende a preparar la iluminación natural de ventana, encuadre nivelado y rostro sin maquillaje para una precisión absoluta.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTutorialModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-stretch md:self-auto justify-center"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Abrir Tutorial: Cómo Tomar la Foto</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Draping Studio Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          
          {/* Main Visual Display */}
          <div className="relative aspect-4/5 max-w-md mx-auto rounded-3xl overflow-hidden bg-stone-950 border-4 border-stone-100 shadow-inner">
            
            {/* The Model / Face */}
            <img 
              src={selectedModel.url} 
              alt={selectedModel.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Virtual Drape Scarf / Collar Frame */}
            {compareMode === 'single' ? (
              <div 
                className="absolute bottom-0 left-0 right-0 h-44 rounded-t-[50%] transition-colors duration-500 shadow-2xl flex flex-col items-center justify-end pb-4 border-t-4 border-white/20"
                style={{ backgroundColor: activeColorHex }}
              >
                <div className="bg-black/50 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[11px] font-bold shadow-xs">
                  {activeColorName}
                </div>
              </div>
            ) : (
              /* Split comparison mode */
              <div className="absolute bottom-0 left-0 right-0 h-44 flex border-t-4 border-white/20 shadow-2xl overflow-hidden rounded-t-[40%]">
                <div 
                  className="h-full flex items-end justify-center pb-3 border-r border-white/30"
                  style={{ width: `${splitPosition}%`, backgroundColor: activeDuel.colorA.hex }}
                >
                  <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-bold">
                    {activeDuel.colorA.name}
                  </span>
                </div>
                <div 
                  className="h-full flex items-end justify-center pb-3"
                  style={{ width: `${100 - splitPosition}%`, backgroundColor: activeDuel.colorB.hex }}
                >
                  <span className="bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-bold">
                    {activeDuel.colorB.name}
                  </span>
                </div>
              </div>
            )}

            {/* Watermark badge */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Modelo: {selectedModel.name} ({selectedModel.subfamily})
            </div>
          </div>

          {/* Model selection thumbnails */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Rostro para el Draping:
              </span>
              <button
                onClick={() => setShowTutorialModal(true)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Tomar / Subir con Guía</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {/* Custom User Photo if available */}
              {customUserPhoto && (
                <button
                  onClick={() =>
                    setSelectedModel({
                      name: 'Tú',
                      subfamily: 'Personal',
                      undertone: 'Tu piel',
                      url: customUserPhoto,
                    })
                  }
                  className={`p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedModel.url === customUserPhoto
                      ? 'border-purple-600 bg-purple-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img
                    src={customUserPhoto}
                    alt="Tu foto"
                    className="w-12 h-12 rounded-xl object-cover border border-purple-300"
                  />
                  <span className="text-[11px] font-bold text-purple-800">Tu Rostro</span>
                  <span className="text-[9px] text-purple-600">Personal</span>
                </button>
              )}

              {DRAPING_MODELS.map(m => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModel(m)}
                  className={`p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedModel.name === m.name && selectedModel.url !== customUserPhoto
                      ? 'border-rose-500 bg-rose-50 shadow-xs' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img 
                    src={m.url} 
                    alt={m.name} 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <span className="text-[11px] font-bold text-stone-800">{m.name}</span>
                  <span className="text-[9px] text-stone-500">{m.subfamily}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Controls and Drape Palettes */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Preset Duels Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Duelos Cromáticos Clásicos
              </h3>
              <div className="flex gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setCompareMode('single')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${compareMode === 'single' ? 'bg-white font-bold shadow-2xs' : 'text-stone-500'}`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setCompareMode('split')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${compareMode === 'split' ? 'bg-white font-bold shadow-2xs' : 'text-stone-500'}`}
                >
                  Comparar
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {PRESET_DUELS.map((duel, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDuelIndex(idx);
                    setActiveColorHex(duel.colorA.hex);
                    setActiveColorName(duel.colorA.name);
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                    selectedDuelIndex === idx 
                      ? 'border-purple-500 bg-purple-50/40' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">{duel.title}</span>
                    {selectedDuelIndex === idx && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </div>
                  <p className="text-[11px] text-stone-500">{duel.description}</p>
                  
                  {/* Swatches pair */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColorHex(duel.colorA.hex);
                        setActiveColorName(duel.colorA.name);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1.5 shadow-2xs"
                      style={{ backgroundColor: duel.colorA.hex }}
                    >
                      <span>{duel.colorA.name}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColorHex(duel.colorB.hex);
                        setActiveColorName(duel.colorB.name);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1.5 shadow-2xs"
                      style={{ backgroundColor: duel.colorB.hex }}
                    >
                      <span>{duel.colorB.name}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Swatch Bar: Probar colores de tu estación analizada si existe */}
          {currentAnalysis && (
            <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">
                  Colores de tu estación ({currentAnalysis.season.spanishTitle}):
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {currentAnalysis.season.palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveColorHex(c.hex);
                      setActiveColorName(c.name);
                      setCompareMode('single');
                    }}
                    className="h-8 rounded-lg shadow-2xs border border-black/10 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Educational Note */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <span className="font-bold block">💡 Cómo evaluar el efecto:</span>
            <p>1. Observa el área bajo los ojos: ¿Se atenúan las ojeras o se oscurecen?</p>
            <p>2. Mira la línea de la mandíbula: ¿El óvalo facial se ve firme o desdibujado?</p>
            <p>3. El color correcto hace que tú destaques primero; el color erróneo llama la atención antes que tu mirada.</p>
          </div>

        </div>

      </div>

      {/* Interactive Step-by-Step Photo Guide Tutorial Modal */}
      <PhotoGuideTutorial
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onUsePhotoInDraper={(photoUrl) => {
          setCustomUserPhoto(photoUrl);
          setSelectedModel({
            name: 'Tú',
            subfamily: 'Personal',
            undertone: 'Tu piel',
            url: photoUrl,
          });
        }}
        onGoToAnalysis={() => setCurrentView('analyzer-photo')}
      />

    </div>
  );
};
