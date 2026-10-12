import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Dna, 
  Sparkles, 
  Palette, 
  User, 
  Layers, 
  Heart, 
  ShoppingBag, 
  Home, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Crown,
  Share2
} from 'lucide-react';
import { CompleteStyleDNA } from '../types';
import { AGE_GROUPS_CONFIG } from '../data/ageGroups';

export const StyleDNASurvey: React.FC = () => {
  const { user, saveUserStyleDNA, setCurrentView } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  const userGroupInfo = user?.ageGroup ? AGE_GROUPS_CONFIG[user.ageGroup] : AGE_GROUPS_CONFIG['adulta_joven'];

  // Survey Local States
  const [colorSeason, setColorSeason] = useState('Invierno Brillante');
  const [bestMetal, setBestMetal] = useState<'Oro' | 'Plata' | 'Oro Rosa'>('Plata');
  const [bodySilhouette, setBodySilhouette] = useState<'reloj_de_arena' | 'triangulo' | 'triangulo_invertido' | 'rectangulo' | 'ovalo'>('reloj_de_arena');
  const [fitPreference, setFitPreference] = useState<'ajustado' | 'estructurado' | 'fluido' | 'holgado'>('estructurado');
  const [archetypes, setArchetypes] = useState<string[]>(['Elegante', 'Natural / Relajado']);
  const [occupation, setOccupation] = useState('Profesional / Ejecutiva');
  const [heelTolerance, setHeelTolerance] = useState<'solo_planos' | 'bajo_comodo' | 'tacones_medios' | 'altos_ocasional'>('bajo_comodo');
  const [shoppingTier, setShoppingTier] = useState<'accesible' | 'medio' | 'premium' | 'inversion'>('medio');
  const [organizationLevel, setOrganizationLevel] = useState<'impecable' | 'organizado' | 'desorden_moderado' | 'caos'>('organizado');

  const toggleArchetype = (name: string) => {
    if (archetypes.includes(name)) {
      setArchetypes(archetypes.filter(a => a !== name));
    } else {
      if (archetypes.length < 3) {
        setArchetypes([...archetypes, name]);
      }
    }
  };

  const handleCompleteSurvey = () => {
    const fullDNA: CompleteStyleDNA = {
      color: {
        seasonName: colorSeason,
        undertone: 'frío',
        contrastLevel: 'alto',
        bestMetal: bestMetal,
        bestNeutrals: ['Negro azabache', 'Blanco puro', 'Gris carbón'],
        colorsToAvoid: ['Naranja teja', 'Mostaza cálido']
      },
      body: {
        silhouette: bodySilhouette,
        fitPreference: fitPreference,
        preferredNecklines: ['Cuello en V', 'Escote barco'],
        preferredWaistlines: ['Tiro alto']
      },
      style: {
        archetypes,
        preferredOccasions: ['Trabajo', 'Salidas casuales'],
        fashionIcons: ['Carolina Herrera', 'Audrey Hepburn'],
        minimalistVsMaximalist: 3
      },
      lifestyle: {
        occupationType: occupation,
        climateZone: 'Templado oceánico / Biobío (Concepción)',
        socialActivitiesFrequency: 'moderada'
      },
      comfort: {
        heelTolerance,
        preferredFabrics: ['Algodón orgánico', 'Lino', 'Seda natural'],
        tightFittingTolerance: 'media'
      },
      shopping: {
        shoppingBudgetTier: shoppingTier,
        frequency: 'estacional',
        sustainablePriority: true
      },
      wardrobe: {
        capsulePiecesCount: 24,
        organizationLevel,
        unwornClothesPercent: 20
      },
      lastUpdated: new Date().toISOString()
    };

    saveUserStyleDNA(fullDNA);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Dna className="w-4 h-4 text-teal-600" />
            <span>Sistema Style DNA (7 Dimensiones)</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Diagnóstico de tu ADN de Estilo
          </h1>

          <p className="text-xs text-stone-500 max-w-lg mx-auto leading-relaxed">
            "No diseñamos una app que solo analiza cómo te ves; diseñamos una app que aprende quién eres para ayudarte a vestir".
          </p>

          {/* Age Group Personalized Tag */}
          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              Personalización para grupo: {userGroupInfo.title} ({userGroupInfo.range}) &bull; {userGroupInfo.badge}
            </span>
            <p className="text-[11px] text-stone-500 italic mt-1">
              "{userGroupInfo.stylingQuote}"
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between text-xs font-semibold text-stone-600">
          <span>Paso {currentStep} de 5</span>
          <div className="w-1/2 bg-stone-100 rounded-full h-2 overflow-hidden mx-4">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <span>{Math.round((currentStep / 5) * 100)}%</span>
        </div>

        {/* Survey Steps */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          
          {/* STEP 1: Color DNA */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 font-serif text-lg font-bold">
                <Palette className="w-5 h-5" />
                <h2>1. Tu Color DNA</h2>
              </div>
              <p className="text-xs text-stone-500">
                Determina tus metales de poder y tu estación principal.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Joyería & Metal Predominante:</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Plata', 'Oro', 'Oro Rosa'] as const).map((metal) => (
                    <button
                      key={metal}
                      type="button"
                      onClick={() => setBestMetal(metal)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        bestMetal === metal
                          ? 'border-rose-500 bg-rose-50/50 text-rose-800 shadow-xs'
                          : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Estación Asignada o Deseada:</label>
                <input
                  type="text"
                  value={colorSeason}
                  onChange={(e) => setColorSeason(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                  placeholder="ej. Invierno Brillante, Otoño Suave..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Body DNA */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 font-serif text-lg font-bold">
                <User className="w-5 h-5" />
                <h2>2. Tu Body DNA</h2>
              </div>
              <p className="text-xs text-stone-500">
                Tus proporciones naturales para armonizar cortes y largos.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Silueta Biológica:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'reloj_de_arena', label: 'Reloj de Arena (Curvilínea equilibrada)' },
                    { id: 'triangulo', label: 'Triángulo (Caderas protagonistas)' },
                    { id: 'triangulo_invertido', label: 'Triángulo Invertido (Hombros definidos)' },
                    { id: 'rectangulo', label: 'Rectángulo (Silueta lineal y atlética)' },
                    { id: 'ovalo', label: 'Óvalo (Zona media suave y redondeada)' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBodySilhouette(s.id as any)}
                      className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        bodySilhouette === s.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Caída de Prendas Preferida:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['ajustado', 'estructurado', 'fluido', 'holgado'] as const).map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setFitPreference(fit)}
                      className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold capitalize transition-all cursor-pointer ${
                        fitPreference === fit
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Style & Archetypes DNA */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 font-serif text-lg font-bold">
                <Sparkles className="w-5 h-5" />
                <h2>3. Tu Style DNA (Arquetipos)</h2>
              </div>
              <p className="text-xs text-stone-500">
                Elige hasta 2 o 3 arquetipos que reflejen cómo quieres que el mundo te perciba.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Clásico / Tradicional',
                  'Elegante / Sofisticado',
                  'Natural / Relajado',
                  'Romántico / Femenino',
                  'Dramático / Vanguardista',
                  'Creativo / Expresivo',
                  'Seductor / Magnético'
                ].map((arch) => {
                  const isSelected = archetypes.includes(arch);
                  return (
                    <button
                      key={arch}
                      type="button"
                      onClick={() => toggleArchetype(arch)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 text-rose-800 shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{arch}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Lifestyle & Comfort DNA */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 font-serif text-lg font-bold">
                <Home className="w-5 h-5" />
                <h2>4. Lifestyle & Comfort DNA</h2>
              </div>
              <p className="text-xs text-stone-500">
                Adaptado al clima particular del Biobío (Concepción) y a tu rutina diaria.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Actividad Principal:</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Profesional / Ejecutiva">Oficina / Corporativo / Ejecutiva</option>
                  <option value="Emprendedora / Negocio propio">Emprendedora / Negocio independiente</option>
                  <option value="Cuidado del Hogar / Familia">Cuidado del hogar y familia activa</option>
                  <option value="Estudiante universitaria">Estudiante de educación superior</option>
                  <option value="Salud / Docencia">Salud, Medicina o Docencia activa</option>
                  <option value="Creativa / Artista">Diseño, Arte o Comunicación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Tolerancia a Tacones y Calzado:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'solo_planos', label: 'Solo planos / Zapatillas' },
                    { id: 'bajo_comodo', label: 'Tacón bajo cómodo (3-4 cm)' },
                    { id: 'tacones_medios', label: 'Tacones medios (5-7 cm)' },
                    { id: 'altos_ocasional', label: 'Tacón alto para eventos' }
                  ].map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHeelTolerance(h.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        heelTolerance === h.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Shopping & Wardrobe DNA */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-600 font-serif text-lg font-bold">
                <ShoppingBag className="w-5 h-5" />
                <h2>5. Shopping & Wardrobe DNA</h2>
              </div>
              <p className="text-xs text-stone-500">
                Optimiza tus compras inteligentes y la rotación de tu clóset.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Presupuesto Habitual de Ropa:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'accesible', label: 'Accesible / Fast Fashion inteligente' },
                    { id: 'medio', label: 'Gama media / Marcas nacionales' },
                    { id: 'premium', label: 'Premium / Marcas de autor' },
                    { id: 'inversion', label: 'Piezas de inversión y alta costura' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setShoppingTier(p.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        shoppingTier === p.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">Organización de tu Armario Actual:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'impecable', label: 'Impecable y por colores' },
                    { id: 'organizado', label: 'Bastante organizado' },
                    { id: 'desorden_moderado', label: 'Desorden moderado' },
                    { id: 'caos', label: 'Caos matutino' }
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOrganizationLevel(o.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        organizationLevel === o.id
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteSurvey}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Mi ADN de Estilo</span>
              </button>
            )}
          </div>

          {/* Confirmation Box */}
          {isSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-base font-bold text-emerald-900">
                ¡Tu Style DNA de 7 Dimensiones ha sido guardado!
              </h3>
              <p className="text-xs text-emerald-800">
                Ahora el motor de estilismo adaptará todas las recomendaciones de looks y compras según tu grupo de edad ({userGroupInfo.title}) y proporciones.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Ver en Mi Perfil
                </button>
                <button
                  onClick={() => setCurrentView('virtual-drape')}
                  className="px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  Ir al Draping Virtual
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
