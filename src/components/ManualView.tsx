import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Search, 
  Download, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { exportManualToPDF, exportManualToWord } from '../lib/exportUtils';

export const ManualView: React.FC = () => {
  const { manualChapters, setCurrentView } = useAuth();
  const [activeChapterId, setActiveChapterId] = useState(manualChapters[0]?.id || 'cap_1');
  const [searchQuery, setSearchQuery] = useState('');
  const [readSections, setReadSections] = useState<Record<string, boolean>>({});

  const toggleRead = (sectionId: string) => {
    setReadSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const activeChapter = manualChapters.find(ch => ch.id === activeChapterId) || manualChapters[0];

  // Filter sections by search query
  const filteredChapters = searchQuery.trim() === ''
    ? manualChapters
    : manualChapters.map(ch => ({
        ...ch,
        secciones: ch.secciones.filter(sec => 
          sec.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.contenido.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(ch => ch.secciones.length > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb & Actions Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <button 
                onClick={() => setCurrentView('landing')}
                className="hover:text-rose-600 transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span className="text-stone-800 font-semibold">Manual Oficial de la Aplicación</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-rose-500" />
              Manual Styled By Wilma v3.0
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Guía maestra estructurada paso por paso: 11 capítulos con asesoría, colorimetría y configuración técnica.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => exportManualToPDF(manualChapters)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
              title="Descargar manual completo en PDF con portada y formato editorial"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>

            <button
              onClick={() => exportManualToWord(manualChapters)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-200 transition-all cursor-pointer"
              title="Descargar documento de Word (.doc compatible)"
            >
              <FileText className="w-4 h-4" />
              <span>Descargar Word</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs transition-colors cursor-pointer"
              title="Imprimir manual"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en los 11 capítulos del manual (ej. foto correcta, draping, subtono, WhatsApp, planes)..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-stone-200/90 shadow-xs text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Split View: Left Chapters Nav + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table of Contents Nav */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-2 sticky top-24 max-h-[80vh] overflow-y-auto">
            <h3 className="font-serif text-sm font-bold text-stone-900 uppercase tracking-wider px-3 py-1 mb-2">
              Índice de Capítulos (1-11)
            </h3>

            {filteredChapters.map((ch) => {
              const isActive = ch.id === activeChapterId;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterId(ch.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-50 to-amber-50/50 border border-rose-200 text-stone-900 shadow-xs'
                      : 'hover:bg-stone-50 text-stone-600 border border-transparent'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {ch.capitulo}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold leading-tight ${isActive ? 'text-rose-900' : 'text-stone-800'}`}>
                      {ch.titulo}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">
                      {ch.descripcion}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                    isActive ? 'text-rose-600 translate-x-0.5' : 'text-stone-300'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {activeChapter ? (
              <div className="bg-white rounded-3xl p-6 sm:p-9 border border-stone-200 shadow-xs space-y-8">
                
                {/* Chapter Banner */}
                <div className="border-b border-stone-100 pb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Capítulo {activeChapter.capitulo} de 11</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    {activeChapter.titulo}
                  </h2>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {activeChapter.descripcion}
                  </p>
                </div>

                {/* Subsections List */}
                <div className="space-y-8">
                  {activeChapter.secciones.map((sec) => {
                    const isRead = !!readSections[sec.id];
                    return (
                      <div 
                        key={sec.id} 
                        id={sec.id}
                        className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-3.5 transition-all hover:bg-stone-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                            <span className="text-rose-600 font-mono text-sm">{sec.subseccion}</span>
                            <span>{sec.titulo}</span>
                          </h3>

                          <button
                            onClick={() => toggleRead(sec.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isRead 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-white text-stone-500 hover:text-stone-800 border border-stone-200'
                            }`}
                            title="Marcar este punto como leído"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-600 fill-emerald-100' : 'text-stone-400'}`} />
                            <span>{isRead ? 'Leído' : 'Marcar leído'}</span>
                          </button>
                        </div>

                        {/* Content paragraphs */}
                        <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                          {sec.contenido.map((para, idx) => (
                            <p key={idx}>{para}</p>
                          ))}
                        </div>

                        {/* Action Steps if present */}
                        {sec.pasos && sec.pasos.length > 0 && (
                          <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5">
                            <span className="text-[11px] font-bold text-stone-800 uppercase tracking-wider block">
                              Pasos de Ejecución:
                            </span>
                            <ol className="list-decimal list-inside space-y-1 text-xs text-stone-600">
                              {sec.pasos.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Stylist Tips Box */}
                        {sec.tips && sec.tips.length > 0 && (
                          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                            <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                              Consejos de la Asesora Wilma Hernández:
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-950">
                              {sec.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Chapter Switcher Navigation */}
                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  {activeChapter.capitulo > 1 ? (
                    <button
                      onClick={() => {
                        const prev = manualChapters.find(c => c.capitulo === activeChapter.capitulo - 1);
                        if (prev) setActiveChapterId(prev.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>&larr; Capítulo {activeChapter.capitulo - 1}</span>
                    </button>
                  ) : <div />}

                  {activeChapter.capitulo < manualChapters.length && (
                    <button
                      onClick={() => {
                        const next = manualChapters.find(c => c.capitulo === activeChapter.capitulo + 1);
                        if (next) setActiveChapterId(next.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Capítulo {activeChapter.capitulo + 1} &rarr;</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
                <p>No se encontraron resultados para "{searchQuery}".</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
