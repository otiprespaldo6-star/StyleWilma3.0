import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { classifySeason, AnalysisInput } from '../lib/colorAnalysis';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Sun, 
  Droplet, 
  Gem, 
  Eye, 
  Sparkle, 
  Shirt, 
  Contrast 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: {
    label: string;
    description: string;
    value: string;
    tag?: string;
  }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: '¿Cómo reacciona tu piel cuando te expones al sol?',
    subtitle: 'La melanina y el comportamiento frente al bronceado revelan tu subtono biológico.',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    options: [
      {
        label: 'Me bronceo con facilidad en un tono dorado cálido',
        description: 'Casi nunca me quemo; mi piel adquiere un bronceado miel rápido.',
        value: 'sun-warm',
        tag: 'Subtono Cálido'
      },
      {
        label: 'Me quemo con rapidez y mi piel se enrojece',
        description: 'Me cuesta mucho broncearme y suelo pelarme o quedar con tono rosado.',
        value: 'sun-cool',
        tag: 'Subtono Frío'
      },
      {
        label: 'Me quemo ligeramente al principio y luego me bronceo suave',
        description: 'Mi piel tiene un comportamiento balanceado e intermedio.',
        value: 'sun-neutral',
        tag: 'Subtono Neutro'
      }
    ]
  },
  {
    id: 2,
    title: 'Observa las venas en la cara interna de tu muñeca con luz natural:',
    subtitle: 'El reflejo del torrente sanguíneo a través de la dermis es uno de los indicadores clásicos.',
    icon: <Droplet className="w-5 h-5 text-rose-500" />,
    options: [
      {
        label: 'Tienen un matiz claramente verdoso o aceitunado',
        description: 'La base amarilla de tu piel hace que el azul de la sangre se perciba verde.',
        value: 'vein-green',
        tag: 'Cálido'
      },
      {
        label: 'Son predominantemente azules, violáceas o púrpuras',
        description: 'La piel de subtono rosado o azulado deja ver el color frío puro.',
        value: 'vein-blue',
        tag: 'Frío'
      },
      {
        label: 'Veo una mezcla de verde y azul, me resulta difícil definir',
        description: 'Indica un equilibrio térmico neutro.',
        value: 'vein-neutral',
        tag: 'Neutro'
      }
    ]
  },
  {
    id: 3,
    title: 'Prueba de la joyería: ¿Qué metal hace resplandecer tu piel?',
    subtitle: 'Coloca una joya cerca de tu rostro sin maquillaje.',
    icon: <Gem className="w-5 h-5 text-amber-600" />,
    options: [
      {
        label: 'El oro amarillo tradicional me da vida y calor radiante',
        description: 'La plata me hace parecer descolorida o apagada.',
        value: 'metal-gold',
        tag: 'Cálido'
      },
      {
        label: 'La plata brillante o el oro blanco me iluminan como porcelana',
        description: 'El oro amarillo me parece demasiado pesado o chillón en mi piel.',
        value: 'metal-silver',
        tag: 'Frío'
      },
      {
        label: 'Puedo llevar oro amarillo, oro rosa y plata sin que ninguno desentone',
        description: 'Tengo versatilidad térmica.',
        value: 'metal-both',
        tag: 'Neutro'
      }
    ]
  },
  {
    id: 4,
    title: '¿Cuál es el color y reflejo natural de tu cabello?',
    subtitle: 'Toma como referencia tu color natural o el que tenías en tu juventud.',
    icon: <Sparkle className="w-5 h-5 text-purple-500" />,
    options: [
      {
        label: 'Rubio dorado, cobrizo, caoba o castaño con reflejos de miel',
        description: 'Bajo el sol despide chispas doradas, rojizas o ambarinas.',
        value: 'hair-warm-light',
        tag: 'Cálido Luminoso'
      },
      {
        label: 'Rubio ceniza, castaño grisáceo o castaño claro sin reflejo dorado',
        description: 'Tiene un acabado suave, mate o ahumado sin tintes cobrizos.',
        value: 'hair-cool-soft',
        tag: 'Frío Cenizo'
      },
      {
        label: 'Castaño chocolate oscuro cálido, castaño medio terroso o canela',
        description: 'Profundo y con rica pigmentación acogedora.',
        value: 'hair-warm-deep',
        tag: 'Cálido Profundo'
      },
      {
        label: 'Negro azabache intenso, castaño oscuro casi negro o blanco puro',
        description: 'Marcada presencia y contraste nítido con el cutis.',
        value: 'hair-cool-dark',
        tag: 'Frío Intenso'
      }
    ]
  },
  {
    id: 5,
    title: '¿Cómo describirías el tono y nitidez de tus ojos?',
    subtitle: 'Presta atención a la luminosidad del iris y al blanco del ojo (esclerótica).',
    icon: <Eye className="w-5 h-5 text-emerald-500" />,
    options: [
      {
        label: 'Claros y chispeantes (azul celeste, verde agua, miel luminosa)',
        description: 'Tienen una cualidad brillante, translúcida y vivaz.',
        value: 'eye-bright-light',
        tag: 'Brillante / Claro'
      },
      {
        label: 'Marrón avellana, miel cálida, verde oliva o ámbar suave',
        description: 'Tonalidad cálida y acogedora.',
        value: 'eye-warm',
        tag: 'Cálido Terroso'
      },
      {
        label: 'Azul grisáceo ahumado, verde salvia o marrón suave apacible',
        description: 'Mirada enigmática, aterciopelada y de saturación suave.',
        value: 'eye-soft',
        tag: 'Suave / Ahumado'
      },
      {
        label: 'Marrón café espresso muy oscuro, negro profundo o zafiro puro',
        description: 'Alto contraste entre el iris y el blanco puro del ojo.',
        value: 'eye-deep',
        tag: 'Profundo'
      }
    ]
  },
  {
    id: 6,
    title: 'Blanco puro almidonado vs Marfil / Crema cálido:',
    subtitle: 'Ponte una prenda blanca óptica y compárala con una prenda crema.',
    icon: <Shirt className="w-5 h-5 text-stone-700" />,
    options: [
      {
        label: 'El blanco óptico puro me da fuerza, poder y frescura',
        description: 'El crema me parece sucio o apagado.',
        value: 'white-pure',
        tag: 'Frío / Invierno'
      },
      {
        label: 'El blanco puro me hace lucir enferma; el marfil o crema me dulcifica',
        description: 'Los blancos rotos armonizan con la calidez de mi piel.',
        value: 'white-cream',
        tag: 'Cálido / Primavera u Otoño'
      },
      {
        label: 'Prefiero un gris perla suave o tiza antes que blanco cegador',
        description: 'Los tonos excesivamente nítidos endurecen mis facciones.',
        value: 'white-soft',
        tag: 'Suave / Verano'
      }
    ]
  },
  {
    id: 7,
    title: '¿Cuál es el nivel de contraste general en tu rostro?',
    subtitle: 'La diferencia de oscuridad/claridad entre tu piel, tus cejas, cabello y ojos.',
    icon: <Contrast className="w-5 h-5 text-indigo-500" />,
    options: [
      {
        label: 'Contraste Alto: Piel clara con cabello muy oscuro y ojos intensos',
        description: 'O piel oscura con ojos muy claros y dientes blancos llamativos.',
        value: 'contrast-high',
        tag: 'Alto Contraste'
      },
      {
        label: 'Contraste Medio: Equilibrio armónico natural entre facciones',
        description: 'Nada destaca de forma estridente sobre lo demás.',
        value: 'contrast-medium',
        tag: 'Contraste Medio'
      },
      {
        label: 'Contraste Bajo: Todos mis rasgos están en un rango similar de claridad o suavidad',
        description: 'Piel clara con cabello claro y ojos claros, o tonalidad homogénea.',
        value: 'contrast-low',
        tag: 'Bajo Contraste'
      }
    ]
  }
];

export const ColorQuiz: React.FC = () => {
  const { saveAnalysis, setCurrentView } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUESTIONS.length) * 100);

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsSubmitting(true);

    // Map quiz answers to colorimetry dimensions
    let warmPoints = 0;
    let coolPoints = 0;

    // Q1 sun
    if (answers[1] === 'sun-warm') warmPoints += 2;
    if (answers[1] === 'sun-cool') coolPoints += 2;
    if (answers[1] === 'sun-neutral') { warmPoints += 1; coolPoints += 1; }

    // Q2 vein
    if (answers[2] === 'vein-green') warmPoints += 2;
    if (answers[2] === 'vein-blue') coolPoints += 2;
    if (answers[2] === 'vein-neutral') { warmPoints += 1; coolPoints += 1; }

    // Q3 metal
    if (answers[3] === 'metal-gold') warmPoints += 2;
    if (answers[3] === 'metal-silver') coolPoints += 2;
    if (answers[3] === 'metal-both') { warmPoints += 1; coolPoints += 1; }

    // Q6 white vs cream
    if (answers[6] === 'white-cream') warmPoints += 2;
    if (answers[6] === 'white-pure') coolPoints += 2;
    if (answers[6] === 'white-soft') coolPoints += 1;

    const undertone: AnalysisInput['undertone'] = warmPoints > coolPoints + 2 
      ? 'warm' 
      : (coolPoints > warmPoints + 2 ? 'cool' : (warmPoints >= coolPoints ? 'neutral-warm' : 'neutral-cool'));

    // Contrast
    let contrast: AnalysisInput['contrast'] = 'medium';
    if (answers[7] === 'contrast-high') contrast = 'high';
    if (answers[7] === 'contrast-low') contrast = 'low';

    // Value (depth)
    let value: AnalysisInput['value'] = 'medium';
    if (answers[4] === 'hair-cool-dark' || answers[5] === 'eye-deep') {
      value = 'deep';
    } else if (answers[4] === 'hair-warm-light' || answers[4] === 'hair-cool-soft' || answers[7] === 'contrast-low') {
      value = 'light';
    }

    // Chroma (brightness vs softness)
    let chroma: AnalysisInput['chroma'] = 'bright';
    if (answers[5] === 'eye-soft' || answers[6] === 'white-soft' || answers[4] === 'hair-cool-soft') {
      chroma = 'soft';
    }

    const result = classifySeason({
      undertone,
      contrast,
      value,
      chroma,
      skinHex: undertone.includes('warm') ? '#F5D1B8' : '#F7D6D8',
      method: 'quiz'
    });

    result.aiNotes = 'Análisis calculado a partir de tus respuestas del test de 7 pasos de colorimetría.';

    setTimeout(() => {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
      saveAnalysis(result);
      setIsSubmitting(false);
    }, 600);
  };

  const isCurrentAnswered = !!answers[question.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Back button */}
      <button
        onClick={() => setCurrentView('analyzer-select')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a opciones de análisis</span>
      </button>

      {/* Progress header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
          <span className="flex items-center gap-1.5 text-rose-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}</span>
          </span>
          <span>{progressPercent}% completado</span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-200">
        
        {/* Title area */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-100">
            {question.icon}
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Paso {question.id}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
            {question.title}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            {question.subtitle}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = answers[question.id] === opt.value;

            return (
              <div
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/40 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-stone-900">
                      {opt.label}
                    </span>
                    {opt.tag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {opt.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                  isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-stone-300'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 text-xs font-bold transition-colors cursor-pointer"
          >
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered || isSubmitting}
            className="px-7 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentQuestionIndex === QUESTIONS.length - 1 
                ? (isSubmitting ? 'Calculando...' : 'Ver mi Paleta Final') 
                : 'Siguiente Pregunta'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
