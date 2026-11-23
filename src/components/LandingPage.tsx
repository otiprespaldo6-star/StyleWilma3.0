import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SEASONS_LIST } from '../data/seasons';
import { 
  Sparkles, 
  Camera, 
  HelpCircle, 
  Check, 
  Crown, 
  ChevronRight, 
  Layers, 
  Heart, 
  Eye, 
  Palette,
  ArrowRight,
  Dna,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    user,
    setCurrentView, 
    setIsPremiumModalOpen, 
    setIsAuthModalOpen, 
    isAuthenticated,
    appearanceConfig,
    plans
  } = useAuth();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeSeasonTab, setActiveSeasonTab] = useState<'Primavera' | 'Verano' | 'Otoño' | 'Invierno'>('Primavera');

  const filteredSeasons = SEASONS_LIST.filter(s => s.subfamily === activeSeasonTab);
  const activePlans = (plans || []).filter(p => p.isActive);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Soft Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-200/40 via-pink-100/50 to-amber-100/40 blur-3xl -z-10 rounded-full pointer-events-none" />

        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold tracking-wide uppercase shadow-xs mb-8 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>La Nueva Era de la Colorimetría Personal</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.1] mb-6">
          Descubre los colores que te hacen{' '}
          <span className="italic bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
            brillar con luz propia
          </span>
        </h1>

        <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          ¿Te has preguntado por qué ciertas prendas te hacen ver radiante mientras otras te apagan? Nuestro análisis con IA clasifica tu piel en una de las <strong className="text-stone-900 font-semibold">12 estaciones maestras</strong> para revelarte tu paleta perfecta, outfits y maquillaje ideal.
        </p>

        {/* Custom Hero Banner (If uploaded by Superadmin) */}
        {appearanceConfig.heroBannerUrl && (
          <div className="max-w-4xl mx-auto mb-10 rounded-3xl overflow-hidden shadow-xl border border-stone-200 aspect-[21/9] bg-stone-100 animate-in fade-in">
            <img 
              src={appearanceConfig.heroBannerUrl} 
              alt="Atelier Concepción — Styled By Wilma" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => setCurrentView('analyzer-photo')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-base shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Camera className="w-5 h-5 text-rose-200 group-hover:scale-110 transition-transform" />
            <span>Analizar mi Foto con IA</span>
            <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setCurrentView('analyzer-quiz')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base border border-stone-200 shadow-xs hover:border-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-rose-500" />
            <span>Test Manual (7 pasos)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-stone-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Análisis Básico 100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Metodología 12 Estaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>PWA Instalable en tu móvil</span>
          </div>
        </div>
      </section>

      {/* Interactive Visual Comparison: El Efecto del Color Correcto */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl p-6 sm:p-12 text-white shadow-2xl border border-stone-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
              Ciencia y Armonía Óptica
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-3">
              ¿Qué cambia cuando usas tu colorimetría ideal?
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              El color equivocado resalta ojeras, enrojece la piel y produce sombras cansadas. El color correcto ilumina tu mirada y da un efecto lifting natural.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual simulation card: Color Desfavorable */}
            <div className="rounded-2xl bg-stone-800/60 p-6 border border-stone-700/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800">
                  Color Discordante
                </span>
                <span className="text-xs text-stone-400">Ejemplo: Tono que choca con tu subtono</span>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden bg-stone-800 flex items-center justify-center border border-stone-700">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 to-black/80 z-10 flex flex-col justify-end p-5">
                  <h4 className="font-bold text-white text-base">Efectos en tu rostro:</h4>
                  <ul className="text-xs text-stone-300 space-y-1 mt-1.5">
                    <li>• La piel adquiere un aspecto cetrino o fatigado</li>
                    <li>• Se marcan las sombras bajo los ojos</li>
                    <li>• La prenda llama la atención antes que tú</li>
                  </ul>
                </div>
                <div className="w-full h-full bg-[#5C4033] opacity-70" />
              </div>
            </div>

            {/* Visual simulation card: Color Armonioso */}
            <div className="rounded-2xl bg-stone-800/60 p-6 border border-rose-500/30 space-y-4 relative">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                Tu Aura Radiante
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800">
                  Tu Paleta Correcta
                </span>
                <span className="text-xs text-stone-400">Armonía tonal exacta</span>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden bg-stone-800 flex items-center justify-center border border-rose-500/20">
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 to-black/80 z-10 flex flex-col justify-end p-5">
                  <h4 className="font-bold text-white text-base">Beneficios inmediatos:</h4>
                  <ul className="text-xs text-rose-200 space-y-1 mt-1.5">
                    <li>✨ El iris de tus ojos brilla con nitidez cristalina</li>
                    <li>✨ Tu cutis se ve descansado, uniforme y jovial</li>
                    <li>✨ Menor necesidad de base de maquillaje pesada</li>
                  </ul>
                </div>
                <div className="w-full h-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 opacity-60" />
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setCurrentView('virtual-drape')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-stone-900 hover:bg-rose-50 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Layers className="w-4 h-4 text-rose-600" />
              <span>Probar en el Simulador de Draping Virtual</span>
            </button>
          </div>
        </div>
      </section>

      {/* Exploration of the 12 Seasons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            El Sistema Integral
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-2 mb-4">
            Las 12 Estaciones de Colorimetría
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            La colorimetría moderna divide cada una de las 4 estaciones tradicionales en 3 subtonos específicos para dar con la armonía matemática de tu piel.
          </p>

          {/* Subfamily selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {(['Primavera', 'Verano', 'Otoño', 'Invierno'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSeasonTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeSeasonTab === tab
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Seasons Cards for Active Subfamily */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredSeasons.map((season) => (
            <div
              key={season.id}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {season.subfamily}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500">
                    {season.characteristics.undertone}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                  {season.spanishTitle}
                </h3>
                <p className="text-xs text-rose-600 font-medium italic mt-0.5 mb-3">
                  "{season.essence}"
                </p>

                <p className="text-xs text-stone-600 leading-relaxed mb-5 line-clamp-3">
                  {season.description}
                </p>

                {/* Palette preview chips */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Muestra de Paleta:
                  </span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {season.palette.slice(0, 6).map((color, i) => (
                      <div
                        key={i}
                        className="h-7 rounded-lg shadow-2xs border border-black/5"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Metals & Muses */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="font-semibold text-stone-900">Metal ideal:</span>
                    <span className="truncate max-w-[150px]">{season.metals.best[0]}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Musas:</span>
                    <span>{season.muses.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('analyzer-photo')}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Descubrir si es mi estación</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Age-Based Personalization: 6 Grupos de Edad (18 a 75+ años) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-100/60 via-amber-50/60 to-teal-50/60 rounded-3xl p-8 sm:p-12 border border-rose-200/80 shadow-md space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-rose-600" />
              <span>Estilismo Personalizado para Todas las Edades (18 a 75+)</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              "No analizamos solo cómo te ves; aprendemos quién eres para ayudarte a vestir"
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
              La armonía cromática y el vestuario cambian a lo largo de tu vida. Diseñamos recomendaciones exclusivas para cada etapa vital en Concepción, Chile y el mundo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                age: '18-25 años',
                name: '1. Joven',
                badge: 'Fresco & Tendencia',
                desc: 'Tendencias dinámicas, presupuestos inteligentes, prendas de alta rotación para estudiar o salir.',
                color: 'from-pink-500 to-rose-400'
              },
              {
                age: '26-35 años',
                name: '2. Adulta Joven',
                badge: 'Modernidad & Balance',
                desc: 'Equilibrio entre carrera profesional y vida personal. Looks versátiles de oficina a cóctel.',
                color: 'from-rose-500 to-purple-400'
              },
              {
                age: '36-45 años',
                name: '3. Adulta',
                badge: 'Confianza & Liderazgo',
                desc: 'Presencia ejecutiva de alto impacto, calidad sobre cantidad y cortes estructurados nobles.',
                color: 'from-purple-500 to-indigo-400'
              },
              {
                age: '46-55 años',
                name: '4. Madura',
                badge: 'Elegancia & Armonía',
                desc: 'Elegancia natural sin esfuerzo, confort térmico en el Biobío y tonos rejuvenecedores para la tez.',
                color: 'from-amber-500 to-rose-400'
              },
              {
                age: '56-65 años',
                name: '5. Senior',
                badge: 'Atemporal & Sofisticada',
                desc: 'Estilo clásico perdurable, fibras naturales suaves, ligereza visual y distinción auténtica.',
                color: 'from-teal-500 to-emerald-400'
              },
              {
                age: '66+ años',
                name: '6. Golden',
                badge: 'Clásica & Calidez',
                desc: 'Elegancia cálida y respetuosa, prendas de fácil postura, tipografía de alta legibilidad y nobleza.',
                color: 'from-yellow-500 to-amber-500'
              }
            ].map((grp, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-stone-500 font-mono">{grp.age}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {grp.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-stone-900">{grp.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">{grp.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Style DNA Callout Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Sistema Style DNA Completo
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Descubre tus 7 Dimensiones de Estilo
              </h3>
              <p className="text-xs text-stone-600 max-w-xl">
                Aprende tu ADN de Color, Cuerpo, Estilo, Estilo de Vida, Confort, Compras y Armario para construir un armario sin estrés.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('dna-survey')}
              className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Dna className="w-4 h-4 text-teal-200" />
              <span>Realizar Test de Style DNA</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-rose-50/50 py-20 border-y border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
              ¿Qué obtienes con tu resultado?
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-2">
              Tu Guía Completa de Imagen
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Paleta Maestra
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Los 12 tonos clave con códigos hexadecimales exactos para llevar en tu móvil cada vez que salgas de compras.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Tocador de Maquillaje
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tus tonos de labiales, rubores, sombras y bases exactos para dejar de acumular productos que no te favorecen.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Joyería y Metales
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                La respuesta definitiva a si tu piel brilla con oro amarillo de 18k, plata esterlina 925, oro rosa o bronce antiguo.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-100 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Armario Cápsula
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fórmulas de combinación para prendas neutras y colores de poder, diseñadas para que cualquier prenda combine entre sí.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Membership Plans Section (Plan Gratuito + Todos los Planes VIP Activos) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-3">
            <Crown className="w-3.5 h-3.5 text-rose-500" />
            <span>Membresías VIP & Asesoría Personalizada</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Planes Disponibles
          </h2>
          <p className="text-stone-600 text-sm">
            Comienza gratis con tu análisis básico activo o desbloquea tu membresía VIP con el dossier completo de estilismo y asesoría en Atelier Concepción.
          </p>

          {/* Superadmin quick edit link */}
          {(user?.role === 'master' || user?.role === 'admin') && (
            <div className="mt-3">
              <button
                onClick={() => setCurrentView('admin')}
                className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
              >
                <span>⚙️ Administrar, editar o crear nuevos planes en el Panel Superadmin</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Plans Grid */}
        <div className={`grid gap-6 items-stretch ${
          activePlans.length === 1 
            ? 'max-w-md mx-auto grid-cols-1' 
            : activePlans.length === 2 
            ? 'max-w-4xl mx-auto grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {activePlans.map((p) => {
            const isFree = p.price === 0;

            if (isFree) {
              return (
                <div 
                  key={p.id} 
                  className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {p.badge || 'Plan Gratuito Activo'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">Nuevos Usuarios</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      {p.name}
                    </h3>

                    <div className="mt-3 mb-4 flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold text-stone-900 font-serif">$0</span>
                      <span className="text-xs text-stone-500 font-medium">/ siempre gratis</span>
                    </div>

                    <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                      {p.description || 'Ideal para descubrir tu estación cromática y dar tus primeros pasos con tu paleta.'}
                    </p>

                    <div className="pt-4 border-t border-stone-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                        Incluye en este plan:
                      </span>
                      <ul className="space-y-2.5 text-xs text-stone-700">
                        {(p.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => setCurrentView('analyzer-photo')}
                      className="w-full py-3.5 rounded-xl border-2 border-stone-800 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Comenzar Gratis Ahora
                    </button>
                  </div>
                </div>
              );
            }

            // VIP / Premium Plans
            return (
              <div 
                key={p.id}
                className={`bg-gradient-to-b from-stone-900 via-rose-950 to-stone-950 rounded-3xl p-8 text-white shadow-xl border relative flex flex-col justify-between transition-all group ${
                  p.isPopular ? 'border-amber-400/80 shadow-rose-950/40 ring-1 ring-amber-400/30' : 'border-rose-500/30'
                }`}
              >
                {/* Popular Badge */}
                {p.isPopular && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-rose-400 text-stone-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-stone-950" />
                    <span>Más Popular</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/20">
                      {p.badge || 'Membresía VIP'}
                    </span>
                    <span className="text-[10px] text-rose-200/80 font-mono">
                      {p.currency || 'USD'}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white">
                    {p.name}
                  </h3>

                  <div className="mt-3 mb-4 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold font-serif text-amber-300">
                      ${p.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-rose-200">
                      / {p.billingPeriod === 'monthly' ? 'mes' : p.billingPeriod === 'yearly' ? 'año' : 'pago único'}
                    </span>
                  </div>

                  <p className="text-xs text-rose-100/80 mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="pt-4 border-t border-rose-900/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300/80 block mb-3">
                      Características VIP:
                    </span>
                    <ul className="space-y-2.5 text-xs text-stone-200">
                      {(p.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-stone-950 text-xs font-black shadow-lg shadow-rose-900/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-4 h-4 text-stone-950" />
                    <span>Elegir Plan {p.name} (${p.price.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-rose-50 rounded-3xl p-10 sm:p-14 border border-rose-200/80 shadow-xs space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            ¿Lista para enamorarte de tus colores?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            Solo toma 2 minutos. Sube una foto o responde a las preguntas y ten tu informe hoy mismo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => setCurrentView('analyzer-photo')}
              className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Iniciar Análisis Fotográfico
            </button>
            <button
              onClick={() => setCurrentView('analyzer-quiz')}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-sm transition-all cursor-pointer"
            >
              Hacer Cuestionario Manual
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
