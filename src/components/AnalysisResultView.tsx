import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ColorSwatch, MakeupRecommendation } from '../data/seasons';
import { ShareMyResults } from './ShareMyResults';
import { AIOutfitGenerator } from './AIOutfitGenerator';
import { 
  Sparkles, 
  Crown, 
  Download, 
  Layers, 
  Copy, 
  Check, 
  AlertTriangle, 
  Gem, 
  Heart, 
  RotateCcw, 
  Palette, 
  Share2,
  X,
  Printer,
  Shirt
} from 'lucide-react';

export const AnalysisResultView: React.FC = () => {
  const { currentAnalysis, user, setCurrentView, setIsPremiumModalOpen } = useAuth();
  
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activePaletteFilter, setActivePaletteFilter] = useState<'all' | 'power' | 'neutral' | 'accent'>('all');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeMakeupTab, setActiveMakeupTab] = useState<'labios' | 'mejillas' | 'ojos'>('labios');

  if (!currentAnalysis) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <Palette className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
          No hay un análisis seleccionado
        </h2>
        <p className="text-stone-500 text-xs mb-6">
          Realiza un test rápido con foto o cuestionario para descubrir tu estación.
        </p>
        <button
          onClick={() => setCurrentView('analyzer-select')}
          className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-xs"
        >
          Iniciar Análisis
        </button>
      </div>
    );
  }

  const season = currentAnalysis.season;
  const isPremium = user?.plan === 'premium';

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const filteredPalette = season.palette.filter(item => {
    if (activePaletteFilter === 'all') return true;
    if (activePaletteFilter === 'power') return item.type === 'power';
    if (activePaletteFilter === 'neutral') return item.type === 'neutral';
    if (activePaletteFilter === 'accent') return item.type === 'accent';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      
      {/* Hero Result Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-rose-950 to-stone-950 text-white p-6 sm:p-12 shadow-2xl border border-rose-500/20">
        
        {/* Soft Aura Glow */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: season.palette[0]?.hex || '#E11D48' }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-rose-200 border border-white/20">
                Tu Estación Cromática
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {Math.round(currentAnalysis.confidence * 100)}% Coincidencia
              </span>
              <span className="text-[11px] text-stone-300">
                • Vía {currentAnalysis.method === 'photo' ? 'Escaneo con IA' : 'Cuestionario de 7 pasos'}
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              {season.spanishTitle}
            </h1>

            <p className="text-rose-200 text-sm sm:text-base font-serif italic">
              "{season.powerQuote}"
            </p>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              {season.description}
            </p>

            {currentAnalysis.aiNotes && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-rose-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span><strong>Nota de tu análisis:</strong> {currentAnalysis.aiNotes}</span>
              </div>
            )}
          </div>

          {/* Quick Action Box */}
          <div className="w-full lg:w-auto flex flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('outfit-ia-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Shirt className="w-4 h-4 text-rose-200 group-hover:scale-110 transition-transform" />
              <span>Outfit IA (Crear Looks con Gemini)</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-stone-950 font-extrabold text-xs shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Share2 className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
              <span>Compartir Mis Resultados (Web Share API)</span>
            </button>

            <button
              onClick={() => setCurrentView('virtual-drape')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-rose-300" />
              <span>Probar en Draping Virtual</span>
            </button>

            <button
              onClick={() => setShowWalletModal(true)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/15 text-stone-200 hover:text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-300" />
              <span>Tarjeta de Bolsillo para Compras</span>
            </button>

            <button
              onClick={() => setCurrentView('analyzer-select')}
              className="px-4 py-2 rounded-2xl text-stone-400 hover:text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repetir Análisis</span>
            </button>
          </div>

        </div>

      </div>

      {/* Technical Colorimetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Metric 1: Calidez */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Temperatura</span>
            <span className="font-bold text-stone-900">{season.characteristics.undertone}</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
            <div 
              className="bg-blue-400 h-full" 
              style={{ width: `${100 - currentAnalysis.scores.warmth}%` }}
              title="Porcentaje Frío" 
            />
            <div 
              className="bg-amber-400 h-full" 
              style={{ width: `${currentAnalysis.scores.warmth}%` }}
              title="Porcentaje Cálido" 
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>Frío</span>
            <span>Cálido</span>
          </div>
        </div>

        {/* Metric 2: Valor / Claridad */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Claridad</span>
            <span className="font-bold text-stone-900">{season.characteristics.value}</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-stone-300 to-stone-800 h-full" 
              style={{ width: `${currentAnalysis.scores.depth}%` }} 
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>Luminoso</span>
            <span>Profundo</span>
          </div>
        </div>

        {/* Metric 3: Croma / Saturación */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Saturación</span>
            <span className="font-bold text-stone-900">{season.characteristics.chroma}</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-stone-400 to-rose-500 h-full" 
              style={{ width: `${currentAnalysis.scores.brightness}%` }} 
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>Suave / Mate</span>
            <span>Brillante</span>
          </div>
        </div>

        {/* Metric 4: Tono de Piel Detectado */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 block">Tono de Piel</span>
            <span className="font-mono text-xs font-bold text-stone-900">{currentAnalysis.skinHex}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Contraste {season.characteristics.contrast}</span>
          </div>
          <div 
            className="w-10 h-10 rounded-xl shadow-xs border border-stone-300"
            style={{ backgroundColor: currentAnalysis.skinHex }}
          />
        </div>

      </div>

      {/* Section 1: Tu Paleta Maestra de Colores */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Tu Paleta Maestra de 12 Colores
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Haz clic sobre cualquier color para copiar su código hexadecimal exacto.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActivePaletteFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePaletteFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos (12)
            </button>
            <button
              onClick={() => setActivePaletteFilter('power')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePaletteFilter === 'power' ? 'bg-white text-rose-600 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              De Poder
            </button>
            <button
              onClick={() => setActivePaletteFilter('neutral')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePaletteFilter === 'neutral' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Neutros
            </button>
            <button
              onClick={() => setActivePaletteFilter('accent')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePaletteFilter === 'accent' ? 'bg-white text-amber-700 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acentos
            </button>
          </div>
        </div>

        {/* 12 Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPalette.map((color, idx) => {
            const isCopied = copiedHex === color.hex;

            return (
              <div
                key={idx}
                onClick={() => copyToClipboard(color.hex)}
                className="group p-3 rounded-2xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer bg-stone-50/50 hover:bg-white flex flex-col justify-between"
              >
                <div 
                  className="w-full h-24 rounded-xl shadow-2xs relative flex items-end justify-end p-2 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: color.hex }}
                >
                  <button 
                    className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copiar código HEX"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="pt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-900 truncate">
                      {color.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-stone-500">
                      {color.hex}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded-md font-medium ${
                      color.type === 'power' 
                        ? 'bg-rose-100 text-rose-700' 
                        : (color.type === 'neutral' ? 'bg-stone-200 text-stone-700' : 'bg-amber-100 text-amber-800')
                    }`}>
                      {color.type === 'power' ? 'Color de Poder' : (color.type === 'neutral' ? 'Neutro Base' : 'Acento')}
                    </span>
                    {isCopied && <span className="text-emerald-600 font-bold">¡Copiado!</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Section 2: Colores a Evitar y Metales Ideales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Colores a Evitar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-serif text-xl font-bold">
              Colores que debes evitar
            </h3>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Estos tonos chocan con tu subtono o saturan tus rasgos, creando sombras duras o apariencia cansada:
          </p>

          <div className="space-y-3">
            {season.avoidColors.map((avoid, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3.5"
              >
                <div 
                  className="w-12 h-12 rounded-xl shrink-0 shadow-2xs border border-black/10"
                  style={{ backgroundColor: avoid.hex }}
                />
                <div className="text-xs">
                  <span className="font-bold text-stone-900 block">{avoid.name}</span>
                  <p className="text-stone-500 text-[11px] leading-snug mt-0.5">{avoid.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metales y Joyería */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 text-amber-800">
            <Gem className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl font-bold">
              Tus Metales y Joyería Ideal
            </h3>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            {season.metals.description}
          </p>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
              Metales Recomendados:
            </span>
            <ul className="space-y-1.5 text-xs text-stone-800 font-medium">
              {season.metals.best.map((metal, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{metal}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-900 font-semibold">
              Acabado óptimo: <span className="text-stone-700 font-normal">{season.metals.finish}</span>
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600">
            <p><strong>Tip de estilista:</strong> Lleva tus piezas más luminosas cerca del cuello y rostro (aretes y collares) para maximizar el reflejo lumínico en tu piel.</p>
          </div>
        </div>

      </div>

      {/* Section 3: Tocador de Maquillaje (Makeup Vanity) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Belleza y Cosmética</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Tu Tocador de Maquillaje Personalizado
            </h2>
          </div>

          {/* Makeup Category Tabs */}
          <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            {(['labios', 'mejillas', 'ojos'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveMakeupTab(tab)}
                className={`px-4 py-2 rounded-lg transition-all capitalize cursor-pointer ${
                  activeMakeupTab === tab ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Active Makeup Recommendation Card */}
        {season.makeup.filter(m => m.category === activeMakeupTab).map((rec, i) => (
          <div key={i} className="space-y-6">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
              <span className="text-xs text-stone-700">
                <strong>Consejo clave para {rec.category}:</strong> {rec.tip}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rec.shades.map((shade, sIdx) => (
                <div 
                  key={sIdx}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-full shrink-0 shadow-sm border-2 border-white"
                    style={{ backgroundColor: shade.hex }}
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">{shade.name}</span>
                    <span className="text-[11px] font-mono text-stone-500 block">{shade.hex}</span>
                    <span className="text-[10px] text-stone-600 block mt-0.5">Acabado: {shade.finish}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section: Outfit IA (Generador de Estilismo con Gemini) */}
      <div id="outfit-ia-section">
        <AIOutfitGenerator
          analysis={currentAnalysis}
          onNavigateToDrape={() => setCurrentView('virtual-drape')}
        />
      </div>

      {/* Section 4: Fórmulas de Outfits y Armario Cápsula */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-8">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Fórmulas de Outfits y Armario Cápsula
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Combinaciones maestras probadas para crear looks impactantes sin esfuerzo diario.
          </p>
        </div>

        {/* Outfit formulas cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {season.outfitFormulas.map((outfit, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  {outfit.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {outfit.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-stone-200/60">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Paleta del Look:
                </span>
                <div className="flex gap-2">
                  {outfit.colors.map((cHex, cIdx) => (
                    <div
                      key={cIdx}
                      className="w-10 h-7 rounded-lg shadow-2xs border border-black/10"
                      style={{ backgroundColor: cHex }}
                      title={cHex}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Capsule Wardrobe Pieces */}
        <div className="pt-6 border-t border-stone-100">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-4">
            Las 6 Prendas Esenciales en las que Invertir:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {season.capsuleWardrobe.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-stone-100/70 border border-stone-200 text-xs font-medium text-stone-800 flex items-center gap-2.5"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Share Callout Card */}
      <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/15 to-amber-500/10 rounded-3xl p-6 sm:p-8 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="p-1 rounded-lg bg-rose-500 text-white">
              <Share2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Comparte tu Estación en Redes
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            ¡Muestra tus colores al mundo!
          </h3>
          <p className="text-xs text-stone-600 max-w-xl">
            Genera al instante una tarjeta visual estilizada con tu paleta de {season.spanishTitle} lista para compartir en Instagram Stories, WhatsApp Status o enviarla a tus amigas.
          </p>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir Mis Resultados (Web Share API)</span>
        </button>
      </div>

      {/* VIP Premium Upgrade Box if on free plan */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-3xl p-1 shadow-xl">
          <div className="bg-stone-900 rounded-[22px] p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>Pase VIP Desbloqueable</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Desbloquea el Dossier de Estilo Completo
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Obtén el generador de eventos, carta de tintes de cabello según tu estación, combinaciones monocromáticas y acceso sin límites por solo <strong className="text-white">$4.99/mes</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-stone-900 font-bold text-xs shadow-lg transition-all cursor-pointer shrink-0"
            >
              Mejorar a Plan VIP ($4.99)
            </button>
          </div>
        </div>
      )}

      {/* Digital Color Swatch Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Styled By Wilma Wallet
                </span>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Tarjeta Digital de Color ({season.spanishTitle})
                </h3>
              </div>
              <button 
                onClick={() => setShowWalletModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Lleva esta tarjeta en tu teléfono cuando vayas de compras para comparar las telas directamente bajo la luz de la tienda.
            </p>

            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif font-bold text-rose-300">{season.spanishTitle}</span>
                <span className="text-[10px] text-stone-400">{season.characteristics.undertone}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {season.palette.map((c, i) => (
                  <div key={i} className="text-center space-y-1">
                    <div 
                      className="h-10 rounded-lg shadow-2xs border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[9px] block truncate font-medium text-stone-300">{c.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 flex justify-between">
                <span>Metal: {season.metals.best[0]}</span>
                <span>Styled By Wilma</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-bold text-stone-700 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={() => setShowWalletModal(false)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share My Results (Web Share API & Visual Summary Image) */}
      <ShareMyResults
        analysis={currentAnalysis}
        user={user}
        mode="modal"
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

    </div>
  );
};
