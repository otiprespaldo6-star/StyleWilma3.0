import React, { useState } from 'react';
import { SEASONS_LIST, SeasonData } from '../data/seasons';
import { useAuth } from '../context/AuthContext';
import { 
  Palette, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  Gem, 
  Copy, 
  Search,
  Filter
} from 'lucide-react';

export const SeasonsDirectory: React.FC = () => {
  const { setCurrentView } = useAuth();
  
  const [selectedSubfamily, setSelectedSubfamily] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedSeason, setInspectedSeason] = useState<SeasonData | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const subfamilies = ['Todas', 'Primavera', 'Verano', 'Otoño', 'Invierno'];

  const filtered = SEASONS_LIST.filter(season => {
    const matchesFamily = selectedSubfamily === 'Todas' || season.subfamily === selectedSubfamily;
    const matchesSearch = season.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          season.spanishTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          season.essence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Enciclopedia Completa de Colorimetría</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mb-3">
          Las 12 Estaciones Maestras
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Explora cada estación cromática, sus tonos estrella, joyería predilecta, cosméticos y armonías sartoriales.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {subfamilies.map(fam => (
            <button
              key={fam}
              onClick={() => setSelectedSubfamily(fam)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedSubfamily === fam
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por estación..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Grid of 12 seasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(season => (
          <div
            key={season.id}
            onClick={() => setInspectedSeason(season)}
            className="bg-white rounded-3xl p-6 border border-stone-200/90 hover:border-rose-300 shadow-2xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  {season.subfamily}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {season.characteristics.undertone}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                  {season.spanishTitle}
                </h3>
                <p className="text-xs text-rose-600 italic font-serif mt-0.5">
                  "{season.essence}"
                </p>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                {season.description}
              </p>

              {/* 12 Swatches mini ribbon */}
              <div>
                <div className="grid grid-cols-6 gap-1.5">
                  {season.palette.map((c, i) => (
                    <div
                      key={i}
                      className="h-6 rounded-md shadow-2xs border border-black/5"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Metals & Muses line */}
              <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex justify-between">
                <span>Metal: <strong className="text-stone-800">{season.metals.best[0]}</strong></span>
                <span>{season.characteristics.contrast} contraste</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Ver ficha detallada</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal to inspect a season in full detail */}
      {inspectedSeason && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  {inspectedSeason.subfamily} • {inspectedSeason.characteristics.undertone}
                </span>
                <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
                  {inspectedSeason.spanishTitle} ({inspectedSeason.name})
                </h2>
                <p className="text-xs text-stone-500 italic mt-0.5 font-serif">
                  "{inspectedSeason.essence}"
                </p>
              </div>
              <button 
                onClick={() => setInspectedSeason(null)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {inspectedSeason.description}
            </p>

            {/* 12 Swatches */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 block">
                Paleta Completa de 12 Colores (haz clic para copiar HEX):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {inspectedSeason.palette.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => copyHex(c.hex)}
                    className="p-2 rounded-xl border border-stone-200 hover:border-rose-300 bg-stone-50 hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <div 
                      className="w-7 h-7 rounded-lg shadow-2xs border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="text-[10px] truncate">
                      <span className="font-bold text-stone-900 block truncate">{c.name}</span>
                      <span className="text-stone-500 font-mono">{copiedHex === c.hex ? '¡Copiado!' : c.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metals and avoid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Joyería Predilecta:</span>
                <p className="text-stone-700">{inspectedSeason.metals.best.join(', ')}</p>
                <p className="text-stone-500 text-[11px] mt-1">Acabado: {inspectedSeason.metals.finish}</p>
              </div>

              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                <span className="font-bold text-red-900 block mb-1">Colores Desfavorables:</span>
                <p className="text-stone-700">{inspectedSeason.avoidColors.map(a => a.name).join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                onClick={() => {
                  setInspectedSeason(null);
                  setCurrentView('analyzer-photo');
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              >
                Hacer mi Test para ver si es mi estación
              </button>
              <button
                onClick={() => setInspectedSeason(null)}
                className="px-4 py-2.5 rounded-xl text-stone-500 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
