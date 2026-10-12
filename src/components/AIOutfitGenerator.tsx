import React, { useState } from 'react';
import { AnalysisResult } from '../lib/colorAnalysis';
import { 
  Sparkles, 
  Shirt, 
  Briefcase, 
  Coffee, 
  Heart, 
  Wine, 
  Sun, 
  CloudSnow, 
  Check, 
  Copy, 
  Layers, 
  RotateCcw, 
  ChevronRight, 
  Gem,
  Bookmark,
  Send
} from 'lucide-react';

export interface AIOutfitPiece {
  item: string;
  colorName: string;
  colorHex: string;
  material: string;
  stylingTip?: string;
}

export interface AIOutfitItem {
  title: string;
  occasion: string;
  styleVibe: string;
  harmonyType: string;
  pieces: AIOutfitPiece[];
  shoes: {
    item: string;
    colorName: string;
    colorHex: string;
  };
  accessories: {
    item: string;
    colorName: string;
    colorHex: string;
    metal?: string;
  }[];
  whyItWorks: string;
  makeupPairing?: string;
}

interface AIOutfitGeneratorProps {
  analysis: AnalysisResult;
  onNavigateToDrape?: () => void;
}

export const AIOutfitGenerator: React.FC<AIOutfitGeneratorProps> = ({
  analysis,
  onNavigateToDrape,
}) => {
  const season = analysis.season;

  const [occasion, setOccasion] = useState<string>('trabajo');
  const [climate, setClimate] = useState<string>('todo-el-año');
  const [style, setStyle] = useState<string>('chic');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [outfits, setOutfits] = useState<AIOutfitItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<string[]>([]);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const occasions = [
    { id: 'trabajo', label: 'Trabajo & Reuniones', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'casual', label: 'Casual & Diario', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'cita', label: 'Cita Romántica / Cena', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'fiesta', label: 'Evento Especial / Cóctel', icon: <Wine className="w-3.5 h-3.5" /> },
    { id: 'cualquiera', label: 'Mix Variado', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const climates = [
    { id: 'todo-el-año', label: 'Todo el Año', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'primavera-verano', label: 'Primavera / Verano', icon: <Sun className="w-3 h-3" /> },
    { id: 'otoño-invierno', label: 'Otoño / Invierno', icon: <CloudSnow className="w-3 h-3" /> },
  ];

  const styles = [
    { id: 'chic', label: 'Chic Contemporáneo' },
    { id: 'lujo-silencioso', label: 'Lujo Silencioso (Minimal)' },
    { id: 'creativo', label: 'Creativo & Color Blocking' },
    { id: 'romantico', label: 'Romántico & Sofisticado' },
  ];

  const loadingSteps = [
    'Consultando con Gemini 2.5 y analizando tu paleta...',
    `Calibrando prendas con el subtono ${season.characteristics.undertone}...`,
    `Alineando contraste ${season.characteristics.contrast} y calzado ideal...`,
    'Coordinando accesorios con tu metal predilecto...',
  ];

  const generateOutfits = async () => {
    setIsLoading(true);
    setLoadingStepIndex(0);

    const stepInterval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/generate-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seasonId: season.id,
          seasonName: season.spanishTitle,
          undertone: season.characteristics.undertone,
          contrast: season.characteristics.contrast,
          palette: season.palette,
          bestMetal: season.metals.best[0],
          occasion,
          climate,
          style,
          customPrompt: customPrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servicio de IA');
      }

      const data = await response.json();
      if (data.outfits && data.outfits.length > 0) {
        setOutfits(data.outfits);
      }
    } catch (err) {
      console.error('Error generando outfits:', err);
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const copyOutfitText = (outfit: AIOutfitItem, index: number) => {
    const text = `✨ Look: ${outfit.title} (${outfit.occasion})\nEstilo: ${outfit.styleVibe} • ${outfit.harmonyType}\n\nPrendas:\n${outfit.pieces
      .map((p) => `• ${p.item}: ${p.colorName} (${p.colorHex}) en ${p.material}`)
      .join('\n')}\n• Calzado: ${outfit.shoes.item} (${outfit.shoes.colorName})\n• Accesorios: ${outfit.accessories
      .map((a) => `${a.item} (${a.colorName})`)
      .join(', ')}\n\n💡 Por qué funciona: ${outfit.whyItWorks}\n💄 Maquillaje: ${outfit.makeupPairing || 'Labial a juego'}`;

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleFavorite = (title: string) => {
    setSavedFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-200/90 shadow-md space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Motor de Estilismo Multimodal • Gemini AI</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Outfit IA: Asesora de Moda Personal
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Combinaciones de prendas diseñadas con la matemática del color de tu estación ({season.spanishTitle}).
          </p>
        </div>

        {outfits.length > 0 && (
          <button
            onClick={generateOutfits}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Generar Nuevas Fórmulas</span>
          </button>
        )}
      </div>

      {/* Control Filters Area */}
      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
        
        {/* Occasion Selector */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            1. Elige la Ocasión:
          </label>
          <div className="flex flex-wrap gap-2">
            {occasions.map((occ) => (
              <button
                key={occ.id}
                onClick={() => setOccasion(occ.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  occasion === occ.id
                    ? 'bg-rose-600 text-white shadow-xs font-bold'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {occ.icon}
                <span>{occ.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Climate & Style Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Climate */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">
              2. Clima / Temporada:
            </label>
            <div className="flex flex-wrap gap-2">
              {climates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClimate(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    climate === c.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Style Vibe */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-2">
              3. Vibra Estética:
            </label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    style === s.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Free text custom prompt input */}
        <div className="pt-2">
          <label className="text-xs font-bold text-stone-700 block mb-1.5">
            4. Petición Especial a la Estilista IA (Opcional):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ej: Tengo una entrevista con clientes y quiero pantalón cómodo pero sofisticado..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-rose-400 text-stone-800 placeholder:text-stone-400"
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && generateOutfits()}
            />
            <button
              onClick={generateOutfits}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-rose-200" />
              <span>{isLoading ? 'Creando Looks...' : 'Crear Outfits con IA'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Loading State with animated steps */}
      {isLoading && (
        <div className="py-14 text-center space-y-4 bg-stone-50/60 rounded-3xl border border-stone-200">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] mx-auto shadow-md animate-bounce">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shirt className="w-7 h-7 text-rose-600 animate-pulse" />
            </div>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-stone-900">
              Diseñando tus looks exclusivos con Gemini...
            </h4>
            <p className="text-xs text-rose-600 font-medium mt-1 animate-pulse">
              {loadingSteps[loadingStepIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Initial Empty State before first generation */}
      {!isLoading && outfits.length === 0 && (
        <div className="py-12 px-6 text-center bg-gradient-to-br from-rose-50/40 via-white to-amber-50/40 rounded-3xl border border-dashed border-rose-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="font-serif text-xl font-bold text-stone-900">
              ¿Lista para ver cómo vestir tu estación?
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Gemini analizará los {season.palette.length} colores de tu paleta {season.spanishTitle} para armar conjuntos elegantes para tu estilo de vida.
            </p>
          </div>
          <button
            onClick={generateOutfits}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-rose-200" />
            <span>Generar Primeros Outfits</span>
          </button>
        </div>
      )}

      {/* Generated Outfits Display Grid */}
      {!isLoading && outfits.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              {outfits.length} Looks Generados para {season.spanishTitle}
            </span>
            <span className="text-xs text-stone-400">
              Basados en subtono {season.characteristics.undertone}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {outfits.map((outfit, index) => {
              const isSaved = savedFavorites.includes(outfit.title);
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={index}
                  className="bg-stone-50/60 rounded-3xl p-6 border border-stone-200 hover:border-rose-300 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group space-y-5"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            {outfit.occasion}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-200 text-stone-700">
                            {outfit.harmonyType}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                          {outfit.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium">
                          Estilo: {outfit.styleVibe}
                        </p>
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={() => toggleFavorite(outfit.title)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-white'
                        }`}
                        title={isSaved ? 'Guardado en favoritos' : 'Guardar outfit'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Color Swatches Palette Bar of this Outfit */}
                    <div className="p-2.5 bg-white rounded-2xl border border-stone-200/80 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                        Paleta cromática de este conjunto:
                      </span>
                      <div className="flex gap-2 items-center flex-wrap">
                        {outfit.pieces.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-50 border border-stone-200 text-[10px]"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 shrink-0"
                              style={{ backgroundColor: p.colorHex }}
                            />
                            <span className="font-medium text-stone-700">{p.colorName}</span>
                          </div>
                        ))}
                        {outfit.shoes && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-50 border border-stone-200 text-[10px]">
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-2xs border border-black/10 shrink-0"
                              style={{ backgroundColor: outfit.shoes.colorHex }}
                            />
                            <span className="font-medium text-stone-700">{outfit.shoes.colorName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Garments & Pieces Breakdown */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-900 block">
                        Desglose de Prendas y Telas:
                      </span>
                      <div className="space-y-2">
                        {outfit.pieces.map((piece, pIdx) => (
                          <div
                            key={pIdx}
                            className="p-3 rounded-2xl bg-white border border-stone-200 flex items-start gap-3 text-xs"
                          >
                            <div
                              className="w-7 h-7 rounded-xl shrink-0 shadow-2xs border border-black/10 mt-0.5"
                              style={{ backgroundColor: piece.colorHex }}
                            />
                            <div className="space-y-0.5 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900">{piece.item}</span>
                                <span className="text-[10px] font-mono text-stone-400">{piece.colorHex}</span>
                              </div>
                              <p className="text-[11px] text-rose-700 font-medium">
                                Color: {piece.colorName} • Tejido: {piece.material}
                              </p>
                              {piece.stylingTip && (
                                <p className="text-[11px] text-stone-500 leading-snug pt-0.5">
                                  💡 <em>Tip:</em> {piece.stylingTip}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shoes and Accessories Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Shoes */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg shadow-2xs border border-black/10 shrink-0"
                          style={{ backgroundColor: outfit.shoes.colorHex }}
                        />
                        <div className="truncate">
                          <span className="font-bold text-stone-900 block truncate">{outfit.shoes.item}</span>
                          <span className="text-[10px] text-stone-500">{outfit.shoes.colorName}</span>
                        </div>
                      </div>

                      {/* Accessories */}
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Joyería y Accesorios:
                        </span>
                        <div className="space-y-0.5 text-[11px] text-stone-700">
                          {outfit.accessories.map((acc, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-1.5 truncate">
                              <Gem className="w-3 h-3 text-amber-500 shrink-0" />
                              <span className="truncate">{acc.item} ({acc.colorName})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Why It Works Box */}
                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-stone-700 space-y-1">
                      <p>
                        <strong>Por qué te favorece:</strong> {outfit.whyItWorks}
                      </p>
                      {outfit.makeupPairing && (
                        <p className="text-[11px] text-rose-800 pt-1 border-t border-rose-200/50">
                          💄 <strong>Maquillaje sugerido:</strong> {outfit.makeupPairing}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyOutfitText(outfit, index)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? '¡Copiado!' : 'Copiar Look'}</span>
                    </button>

                    {onNavigateToDrape && (
                      <button
                        onClick={onNavigateToDrape}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Ver en Draping</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
