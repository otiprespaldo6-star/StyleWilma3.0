export interface ColorSwatch {
  name: string;
  hex: string;
  type: 'neutral' | 'accent' | 'power' | 'basic';
}

export interface MakeupRecommendation {
  category: 'labios' | 'mejillas' | 'ojos' | 'base';
  title: string;
  shades: { name: string; hex: string; finish: string }[];
  tip: string;
}

export interface OutfitFormula {
  title: string;
  description: string;
  colors: string[];
}

export interface SeasonData {
  id: string;
  name: string;
  spanishTitle: string;
  subfamily: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';
  essence: string;
  description: string;
  characteristics: {
    undertone: 'Cálido' | 'Frío' | 'Neutro cálido' | 'Neutro frío';
    value: 'Claro' | 'Medio' | 'Oscuro / Profundo';
    chroma: 'Brillante' | 'Suave / Apagado' | 'Medio';
    contrast: 'Bajo' | 'Medio' | 'Alto';
  };
  palette: ColorSwatch[];
  avoidColors: { name: string; hex: string; reason: string }[];
  metals: {
    best: string[];
    description: string;
    finish: string;
  };
  makeup: MakeupRecommendation[];
  outfitFormulas: OutfitFormula[];
  capsuleWardrobe: string[];
  muses: string[];
  powerQuote: string;
  virtualDrapes: {
    flattering: { name: string; hex: string }[];
    unflattering: { name: string; hex: string }[];
  };
}

export const SEASONS_DATA: Record<string, SeasonData> = {
  'light-spring': {
    id: 'light-spring',
    name: 'Light Spring',
    spanishTitle: 'Primavera Clara',
    subfamily: 'Primavera',
    essence: 'Luminosa, delicada y radiante',
    description: 'Tu colorimetría se define por la claridad y una calidez suave y sutil. Tu piel tiene un brillo melocotón o marfil translúcido. Los colores pasteles cálidos y luminosos realzan la luz natural de tu rostro sin sobrecargarte.',
    characteristics: {
      undertone: 'Neutro cálido',
      value: 'Claro',
      chroma: 'Brillante',
      contrast: 'Bajo'
    },
    palette: [
      { name: 'Melocotón Pastel', hex: '#FFBE98', type: 'accent' },
      { name: 'Coral Suave', hex: '#F88379', type: 'power' },
      { name: 'Verde Menta Cálido', hex: '#98FB98', type: 'accent' },
      { name: 'Amarillo Manteca', hex: '#FFF275', type: 'accent' },
      { name: 'Turquesa Claro', hex: '#40E0D0', type: 'accent' },
      { name: 'Rosa Salmón', hex: '#FF9999', type: 'power' },
      { name: 'Marfil Crema', hex: '#FFFFF0', type: 'neutral' },
      { name: 'Arena Cálido', hex: '#E6D7B9', type: 'neutral' },
      { name: 'Camel Claro', hex: '#C19A6B', type: 'neutral' },
      { name: 'Azul Aguamarina', hex: '#7FFFD4', type: 'accent' },
      { name: 'Lavanda Cálido', hex: '#E6E6FA', type: 'accent' },
      { name: 'Gris Perla Cálido', hex: '#DCD0C0', type: 'neutral' }
    ],
    avoidColors: [
      { name: 'Negro Azabache', hex: '#0B0B0B', reason: 'Apaga tu luminosidad natural y endurece los rasgos' },
      { name: 'Burdeos Oscuro', hex: '#4A0E17', reason: 'Resulta demasiado pesado y crea sombras bajo los ojos' },
      { name: 'Gris Carbón', hex: '#36454F', reason: 'Roba calidez a tu cutis dejándolo cetrino' }
    ],
    metals: {
      best: ['Oro amarillo claro (14k)', 'Oro rosa delicado', 'Latón pulido suave'],
      description: 'Prefiere metales brillantes con acabado fino antes que piezas rústicas o plata helada.',
      finish: 'Brillante y ligero'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labiales Suaves y Jugosos',
        shades: [
          { name: 'Nectar Coral', hex: '#FA8072', finish: 'Satinado o Gloss' },
          { name: 'Peach Glow', hex: '#FFB380', finish: 'Bálsamo hidratante' },
          { name: 'Pink Guava', hex: '#F08080', finish: 'Cremoso' }
        ],
        tip: 'Evita los labiales mate oscuros o morados; busca texturas con brillo húmedo.'
      },
      {
        category: 'mejillas',
        title: 'Colorete Melocotón',
        shades: [
          { name: 'Albaricoque Radiante', hex: '#FFB899', finish: 'Crema iluminadora' },
          { name: 'Coral Dulce', hex: '#FF9478', finish: 'Polvo satinado' }
        ],
        tip: 'Aplica en la manzana de las mejillas para conseguir un efecto saludable instantáneo.'
      },
      {
        category: 'ojos',
        title: 'Sombras y Delineados',
        shades: [
          { name: 'Vainilla Brillante', hex: '#FDF5E6', finish: 'Shimmer suave' },
          { name: 'Oro Champán', hex: '#F7E7CE', finish: 'Metálico sutil' },
          { name: 'Marrón Caramelo', hex: '#8B5A2B', finish: 'Delineador cremoso' }
        ],
        tip: 'Sustituye la máscara y delineador negros por tonos marrón chocolate claro o moca.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Look Fresco y Luminoso',
        description: 'Blusa en tono Coral Suave con pantalón sastre en Marfil Crema y accesorios en oro claro.',
        colors: ['#F88379', '#FFFFF0', '#C19A6B']
      },
      {
        title: 'Monocromático Primaveral',
        description: 'Vestido fluido en Verde Menta Cálido con sandalias arena y bolso en melocotón pastel.',
        colors: ['#98FB98', '#E6D7B9', '#FFBE98']
      }
    ],
    capsuleWardrobe: [
      'Trench coat ligero color marfil cálido',
      'Camisa de seda en tono coral suave o salmón',
      'Blazer fluido en camel claro',
      'Top de punto acanalado verde menta',
      'Pantalón palazzo en tono arena',
      'Vestido vaporoso melocotón pastel'
    ],
    muses: ['Amanda Seyfried', 'Blake Lively', 'Taylor Swift'],
    powerQuote: 'Tu belleza reside en la ligereza, la luz dorada matinal y la frescura efervescente.',
    virtualDrapes: {
      flattering: [
        { name: 'Coral Melocotón', hex: '#F88379' },
        { name: 'Verde Menta Cálido', hex: '#98FB98' },
        { name: 'Marfil Dorado', hex: '#FAF4E6' }
      ],
      unflattering: [
        { name: 'Negro Puro', hex: '#000000' },
        { name: 'Gris Plomo', hex: '#3A3F44' },
        { name: 'Azul Tinta Frío', hex: '#1A237E' }
      ]
    }
  },

  'warm-spring': {
    id: 'warm-spring',
    name: 'Warm Spring',
    spanishTitle: 'Primavera Cálida',
    subfamily: 'Primavera',
    essence: 'Vibrante, solar y apasionada',
    description: 'Eres 100% cálida. Tu cutis posee reflejos dorados y bronceados naturales. Te favorecen los tonos vivos con base amarilla intensa como el naranja albaricoque, coral amapola y verde lima cálido.',
    characteristics: {
      undertone: 'Cálido',
      value: 'Medio',
      chroma: 'Brillante',
      contrast: 'Medio'
    },
    palette: [
      { name: 'Coral Vibrante', hex: '#FF6F59', type: 'power' },
      { name: 'Oro Cálido', hex: '#FFD700', type: 'accent' },
      { name: 'Naranja Albaricoque', hex: '#FF8C42', type: 'accent' },
      { name: 'Verde Césped', hex: '#70C160', type: 'accent' },
      { name: 'Amarillo Narciso', hex: '#F4D03F', type: 'power' },
      { name: 'Rosa Flamenco', hex: '#F3687F', type: 'accent' },
      { name: 'Camel Dorado', hex: '#C68B59', type: 'neutral' },
      { name: 'Crema Mantequilla', hex: '#FFF3CD', type: 'neutral' },
      { name: 'Azul Turquesa Cálido', hex: '#20B2AA', type: 'accent' },
      { name: 'Rojo Amapola Cálido', hex: '#E74C3C', type: 'power' },
      { name: 'Terracota Claro', hex: '#D97443', type: 'neutral' },
      { name: 'Marrón Caramelo', hex: '#8F4A23', type: 'neutral' }
    ],
    avoidColors: [
      { name: 'Plata Fría', hex: '#C0C0C0', reason: 'Te da un aspecto apagado y sin energía' },
      { name: 'Fucsia Azulado', hex: '#D80064', reason: 'Choca directamente con el tono dorado de tu piel' },
      { name: 'Gris Ratón', hex: '#708090', reason: 'Neutraliza tu viveza y oscurece el cutis' }
    ],
    metals: {
      best: ['Oro amarillo rico (18k)', 'Cobre pulido', 'Bronce cálido'],
      description: 'El oro amarillo pulido es tu firma inconfundible. Evita la plata azulada o el platino frío.',
      finish: 'Cálido, radiante y solar'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labiales Cálidos y Energéticos',
        shades: [
          { name: 'Warm Papaya', hex: '#FF5E36', finish: 'Satinado' },
          { name: 'Coral Sunset', hex: '#FF7052', finish: 'Cremoso intenso' },
          { name: 'Terracotta Shine', hex: '#CC4E26', finish: 'Gloss jugoso' }
        ],
        tip: 'Los rojos cálidos con base anaranjada son tus mejores aliados de noche.'
      },
      {
        category: 'mejillas',
        title: 'Colorete Melocotón Dorado',
        shades: [
          { name: 'Gold Peach', hex: '#FF8C66', finish: 'Con destellos dorados' },
          { name: 'Coral Pop', hex: '#FF6B50', finish: 'Rubor en crema' }
        ],
        tip: 'Un toque de iluminador champán dorado en pómulos magnifica tu glow.'
      },
      {
        category: 'ojos',
        title: 'Ojos Cálidos y Vivos',
        shades: [
          { name: 'Bronce Suave', hex: '#CD7F32', finish: 'Metálico' },
          { name: 'Oro Amarillo', hex: '#E6C687', finish: 'Satinado' },
          { name: 'Marrón Canela', hex: '#7B3F00', finish: 'Mate definidor' }
        ],
        tip: 'Opta por delineador café profundo o cobre en lugar de negro frío.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Poder Solar & Elegancia',
        description: 'Traje en camel dorado combinado con blusa en rojo amapola y joyería maxi dorada.',
        colors: ['#C68B59', '#E74C3C', '#FFD700']
      },
      {
        title: 'Casual Chic Tropical',
        description: 'Top en naranja albaricoque con falda turquesa cálido y sandalias cuero caramelo.',
        colors: ['#FF8C42', '#20B2AA', '#8F4A23']
      }
    ],
    capsuleWardrobe: [
      'Blazer sastre en camel dorado',
      'Camisa fluida en coral vibrante',
      'Pantalón de lino crema mantequilla',
      'Vestido rojo amapola cálido',
      'Falda midi en verde césped o turquesa',
      'Cinturón y bolso de piel caramelo'
    ],
    muses: ['Amy Adams', 'Jessica Chastain', 'Nicole Kidman'],
    powerQuote: 'Tu presencia desprende alegría, magnetismo natural y calidez radiante.',
    virtualDrapes: {
      flattering: [
        { name: 'Coral Amapola', hex: '#FF6F59' },
        { name: 'Oro Rico', hex: '#FFD700' },
        { name: 'Verde Césped', hex: '#70C160' }
      ],
      unflattering: [
        { name: 'Fucsia Helado', hex: '#C2185B' },
        { name: 'Azul Glaciar', hex: '#81D4FA' },
        { name: 'Gris Ceniza', hex: '#616161' }
      ]
    }
  },

  'clear-spring': {
    id: 'clear-spring',
    name: 'Bright Spring',
    spanishTitle: 'Primavera Brillante',
    subfamily: 'Primavera',
    essence: 'Impactante, cristalina y magnética',
    description: 'Tienes una mirada chispeante y un contraste alto entre cabello, piel y ojos. Combina la calidez de la primavera con la nitidez y saturación del invierno. Brillas con tonos eléctricos cálidos y contrastes audaces.',
    characteristics: {
      undertone: 'Neutro cálido',
      value: 'Medio',
      chroma: 'Brillante',
      contrast: 'Alto'
    },
    palette: [
      { name: 'Rojo Sandía Brillante', hex: '#FC4445', type: 'power' },
      { name: 'Coral Neón Sofisticado', hex: '#FF5252', type: 'power' },
      { name: 'Turquesa Eléctrico', hex: '#00D2D3', type: 'accent' },
      { name: 'Verde Esmeralda Cálido', hex: '#10AC84', type: 'accent' },
      { name: 'Amarillo Limón Cálido', hex: '#FED330', type: 'accent' },
      { name: 'Fucsia Cálido', hex: '#EE5253', type: 'power' },
      { name: 'Blanco Cálido Brillante', hex: '#FAF9F6', type: 'neutral' },
      { name: 'Azul Klein Cálido', hex: '#2E86DE', type: 'accent' },
      { name: 'Marrón Chocolate Amargo', hex: '#3B1E08', type: 'neutral' },
      { name: 'Gris Carbón Brillante', hex: '#485460', type: 'neutral' },
      { name: 'Oro Luminoso', hex: '#F9CA24', type: 'accent' },
      { name: 'Crema Nieve', hex: '#F8F9FA', type: 'neutral' }
    ],
    avoidColors: [
      { name: 'Tonos Tierra Apagados', hex: '#8D6E63', reason: 'Hacen que tu mirada pierda su brillo cristalino' },
      { name: 'Beige Polvoriento', hex: '#C7B198', reason: 'Borra el hermoso contraste de tus facciones' },
      { name: 'Gris Rata Mate', hex: '#7F8C8D', reason: 'Te da un aspecto enfermizo o descolorido' }
    ],
    metals: {
      best: ['Oro amarillo ultra pulido', 'Oro blanco combinado con oro amarillo', 'Platino espejado'],
      description: 'El secreto está en el brillo y acabado espejo. Las piezas de alta reflectividad te sientan de maravilla.',
      finish: 'Ultra brillante y facetado'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Joya de Alto Impacto',
        shades: [
          { name: 'Bright Poppy', hex: '#FF2A42', finish: 'Satinado luminoso' },
          { name: 'Electric Coral', hex: '#FF4757', finish: 'Cremoso intenso' },
          { name: 'Watermelon Glaze', hex: '#FC427B', finish: 'Laca de labios' }
        ],
        tip: 'Te favorecen los labiales nítidos y definidos; no temas a un rojo sandía para el día a día.'
      },
      {
        category: 'mejillas',
        title: 'Colorete Nítido',
        shades: [
          { name: 'Vivid Guava', hex: '#FF6B6B', finish: 'Satinado' },
          { name: 'Coral Luminoso', hex: '#FF7F50', finish: 'Líquido glow' }
        ],
        tip: 'Mantén la piel muy limpia y fresca para que el rubor sea un destello sutil.'
      },
      {
        category: 'ojos',
        title: 'Mirada Cristalina',
        shades: [
          { name: 'Champán Claro', hex: '#FFF3CD', finish: 'Glitter fino' },
          { name: 'Turquesa Delineador', hex: '#00D2D3', finish: 'Lápiz de precisión' },
          { name: 'Chocolate Profundo', hex: '#2C1B18', finish: 'Definidor mate' }
        ],
        tip: 'Una buena máscara de pestañas bien negra o marrón-negro resalta tus pupilas translúcidas.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Alto Contraste Sofisticado',
        description: 'Pantalón chocolate amargo con blusa en fucsia cálido y accesorios en oro pulido.',
        colors: ['#3B1E08', '#EE5253', '#F9CA24']
      },
      {
        title: 'Color Blocking de Pasarela',
        description: 'Blazer turquesa eléctrico sobre vestido rojo sandía con stilettos crema nieve.',
        colors: ['#00D2D3', '#FC4445', '#F8F9FA']
      }
    ],
    capsuleWardrobe: [
      'Blazer entallado rojo sandía o coral brillante',
      'Pantalón sastre blanco cálido o chocolate amargo',
      'Camisa turquesa eléctrico de seda',
      'Vestido midi fucsia cálido con escote cruzado',
      'Jersey de cuello cisne verde esmeralda cálido',
      'Zapatos joya con brillo'
    ],
    muses: ['Emma Stone', 'Heather Graham', 'Rose McGowan'],
    powerQuote: 'Eres una gema brillante: no estás hecha para esconderte en neutros apagados.',
    virtualDrapes: {
      flattering: [
        { name: 'Rojo Sandía', hex: '#FC4445' },
        { name: 'Turquesa Eléctrico', hex: '#00D2D3' },
        { name: 'Blanco Cálido Brillante', hex: '#FAF9F6' }
      ],
      unflattering: [
        { name: 'Beige Polvoriento', hex: '#C7B198' },
        { name: 'Gris Cemento Mate', hex: '#7F8C8D' },
        { name: 'Marrón Barro Apagado', hex: '#6D4C41' }
      ]
    }
  },

  'light-summer': {
    id: 'light-summer',
    name: 'Light Summer',
    spanishTitle: 'Verano Claro',
    subfamily: 'Verano',
    essence: 'Etérea, fresca, serena y poética',
    description: 'Posees una paleta suave, delicada y predominantemente fría con un nivel de luminosidad alto. Tu piel es de porcelana rosada o marfil frío. Los tonos pasteles con subtono azul o gris te dan una apariencia aristocrática y fresca.',
    characteristics: {
      undertone: 'Neutro frío',
      value: 'Claro',
      chroma: 'Suave / Apagado',
      contrast: 'Bajo'
    },
    palette: [
      { name: 'Rosa Pastel Frío', hex: '#F4C2C2', type: 'power' },
      { name: 'Azul Cielo Empolvado', hex: '#A0C4E2', type: 'power' },
      { name: 'Lavanda Suave', hex: '#C5A3FF', type: 'accent' },
      { name: 'Verde Menta Pastel', hex: '#A8E6CF', type: 'accent' },
      { name: 'Gris Perla Suave', hex: '#D6D6D6', type: 'neutral' },
      { name: 'Blanco Tiza Frío', hex: '#F0F3F4', type: 'neutral' },
      { name: 'Azul Bebé Claro', hex: '#B5D5E8', type: 'accent' },
      { name: 'Malva Claro', hex: '#D7BDE2', type: 'accent' },
      { name: 'Gris Topo Claro', hex: '#BCAAA4', type: 'neutral' },
      { name: 'Rosa Orquídea Suave', hex: '#E8A7A1', type: 'accent' },
      { name: 'Azul Denim Lavado', hex: '#85A3B2', type: 'neutral' },
      { name: 'Frambuesa Suave', hex: '#C06C84', type: 'power' }
    ],
    avoidColors: [
      { name: 'Naranja Chillón', hex: '#FF6600', reason: 'Destruye la armonía fría y aporta aspecto amarillento' },
      { name: 'Mostaza Terroso', hex: '#D4AC0D', reason: 'Envejece la piel y apaga los ojos claros o cenizos' },
      { name: 'Negro Riguroso', hex: '#111111', reason: 'Genera un contraste demasiado agresivo para tus rasgos suaves' }
    ],
    metals: {
      best: ['Plata brillante 925', 'Oro blanco', 'Platino suave'],
      description: 'El brillo blanco y frío de la plata realza el halo celestial de tu piel.',
      finish: 'Pulido delicado y satinado frío'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Pétalo de Rosa',
        shades: [
          { name: 'Soft Rosewood', hex: '#DDA0DD', finish: 'Satinado' },
          { name: 'Pink Petal', hex: '#FFB6C1', finish: 'Bálsamo con brillo' },
          { name: 'Berry Sorbet', hex: '#DB7093', finish: 'Tinte sutil' }
        ],
        tip: 'Opta por labiales con subtono azul o malva y evita los nudes cálidos amarronados.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Rosa Frío',
        shades: [
          { name: 'Baby Pink', hex: '#F8BBD0', finish: 'Polvo sedoso' },
          { name: 'Rose Petal', hex: '#F48FB1', finish: 'Colorete líquido' }
        ],
        tip: 'Aporta un efecto "mejillas sonrosadas tras un paseo matinal fresco".'
      },
      {
        category: 'ojos',
        title: 'Mirada Acuarela',
        shades: [
          { name: 'Gris Perla', hex: '#E0E0E0', finish: 'Satinado' },
          { name: 'Lavanda Ahumado', hex: '#CE93D8', finish: 'Mate suave' },
          { name: 'Gris Pizarra', hex: '#78909C', finish: 'Delineador difuminado' }
        ],
        tip: 'Usa máscara de pestañas gris carbón o azul marino en lugar de negro rotundo.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Elegancia Etérea Monocroma',
        description: 'Pantalón gris perla suave con jersey de cachemira rosa pastel frío y foulard lavanda.',
        colors: ['#D6D6D6', '#F4C2C2', '#C5A3FF']
      },
      {
        title: 'Estilo Marinero Suave',
        description: 'Camisa azul cielo empolvado con falda blanca tiza y blazer azul denim lavado.',
        colors: ['#A0C4E2', '#F0F3F4', '#85A3B2']
      }
    ],
    capsuleWardrobe: [
      'Abrigo clásico en gris perla suave',
      'Camisa de lino o seda azul cielo empolvado',
      'Pantalón sastre blanco tiza frío',
      'Vestido vaporoso en lavanda o rosa pétalo',
      'Jersey de punto fino frambuesa suave',
      'Foulard de seda en tonos pastel'
    ],
    muses: ['Naomi Watts', 'Reese Witherspoon', 'Dakota Fanning'],
    powerQuote: 'Tu belleza susurra con la gracia de un amanecer nebuloso de verano.',
    virtualDrapes: {
      flattering: [
        { name: 'Azul Cielo Empolvado', hex: '#A0C4E2' },
        { name: 'Rosa Pastel Frío', hex: '#F4C2C2' },
        { name: 'Gris Perla', hex: '#D6D6D6' }
      ],
      unflattering: [
        { name: 'Naranja Fuego', hex: '#E65100' },
        { name: 'Mostaza Oscuro', hex: '#F57F17' },
        { name: 'Marrón Cuero Cálido', hex: '#5D4037' }
      ]
    }
  },

  'cool-summer': {
    id: 'cool-summer',
    name: 'Cool Summer',
    spanishTitle: 'Verano Frío',
    subfamily: 'Verano',
    essence: 'Refinada, noble, fresca y majestuosa',
    description: 'Tu subtono es enteramente frío, sin un solo matiz dorado. Tu color natural de cabello suele tener matices cenizos y tus ojos son azules, grises o avellana frío. Los tonos azulados puros, frambuesa y lavanda intenso son tu corona.',
    characteristics: {
      undertone: 'Frío',
      value: 'Medio',
      chroma: 'Medio',
      contrast: 'Medio'
    },
    palette: [
      { name: 'Frambuesa Fría', hex: '#C2185B', type: 'power' },
      { name: 'Azul Aciano', hex: '#4169E1', type: 'power' },
      { name: 'Rosa Orquídea Intensa', hex: '#DA70D6', type: 'accent' },
      { name: 'Gris Pizarra Frío', hex: '#708090', type: 'neutral' },
      { name: 'Azul Marino Suave', hex: '#2C3E50', type: 'neutral' },
      { name: 'Ciruela Claro', hex: '#8E44AD', type: 'accent' },
      { name: 'Verde Pino Grisáceo', hex: '#2E8B57', type: 'accent' },
      { name: 'Rosa Antiguo Frío', hex: '#BC6C7B', type: 'accent' },
      { name: 'Gris Marengo Suave', hex: '#546E7A', type: 'neutral' },
      { name: 'Blanco Suave Frío', hex: '#ECEFF1', type: 'neutral' },
      { name: 'Lavanda Intenso', hex: '#9370DB', type: 'accent' },
      { name: 'Borgoña Frío Aterciopelado', hex: '#722F37', type: 'power' }
    ],
    avoidColors: [
      { name: 'Naranja y Melocotón', hex: '#FF7043', reason: 'Destruyen la frescura de tu rostro y crean aspecto cansado' },
      { name: 'Camel Dorado', hex: '#B9770E', reason: 'Desentona con la base ceniza de tu cabello y piel' },
      { name: 'Oro Amarillo Puro', hex: '#D4AF37', reason: 'Resalta rojeces o imperfecciones en tu cutis' }
    ],
    metals: {
      best: ['Plata esterlina 925', 'Oro blanco 18k', 'Platino pulido'],
      description: 'Cualquier metal blanco y frío te corona. Evita completamente el oro amarillo y los cobres rojizos.',
      finish: 'Frío, plateado y distinguido'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Frambuesa & Ciruela',
        shades: [
          { name: 'Cool Raspberry', hex: '#C2185B', finish: 'Cremoso aterciopelado' },
          { name: 'Mauve Berry', hex: '#A0522D', finish: 'Satinado' },
          { name: 'True Orchid', hex: '#BA55D3', finish: 'Semimate' }
        ],
        tip: 'Los tonos ciruela y frambuesa iluminan tu mirada al instante.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Malva Rosa',
        shades: [
          { name: 'Cool Mauve', hex: '#CE93D8', finish: 'Polvo mineral' },
          { name: 'Berry Kiss', hex: '#AD1457', finish: 'Tinte mejillas' }
        ],
        tip: 'Mantén el rubor estrictamente frío; los tonos melocotón no te favorecen.'
      },
      {
        category: 'ojos',
        title: 'Ahumado Frío Elegante',
        shades: [
          { name: 'Gris Carbón Frío', hex: '#455A64', finish: 'Mate' },
          { name: 'Plata Satinada', hex: '#CFD8DC', finish: 'Shimmer' },
          { name: 'Azul Aciano Sutil', hex: '#5C6BC0', finish: 'Lápiz de ojos' }
        ],
        tip: 'Un delineador azul medianoche o grafito hace resaltar tus ojos.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Poder Ejecutivo Cool',
        description: 'Traje en gris pizarra frío con camisa de seda frambuesa y broche en plata de ley.',
        colors: ['#708090', '#C2185B', '#ECEFF1']
      },
      {
        title: 'Cocktail & Evento Noble',
        description: 'Vestido midi azul aciano con chal en lavanda intenso y pendientes de plata con zafiros.',
        colors: ['#4169E1', '#9370DB', '#2C3E50']
      }
    ],
    capsuleWardrobe: [
      'Blazer entallado en azul marino suave',
      'Camisa de seda blanco frío',
      'Pantalón sastre gris marengo suave',
      'Vestido envolvente frambuesa fría',
      'Jersey de cuello barco lavanda intenso',
      'Bolso estructurado en azul medianoche'
    ],
    muses: ['Emily Blunt', 'Kate Middleton', 'Paulina Porizkova'],
    powerQuote: 'Tu porte es aristocrático, fresco y naturalmente distinguido.',
    virtualDrapes: {
      flattering: [
        { name: 'Frambuesa Fría', hex: '#C2185B' },
        { name: 'Azul Aciano', hex: '#4169E1' },
        { name: 'Gris Pizarra Frío', hex: '#708090' }
      ],
      unflattering: [
        { name: 'Naranja Vivo', hex: '#FF5722' },
        { name: 'Camel Dorado', hex: '#B9770E' },
        { name: 'Oro Amarillo', hex: '#D4AF37' }
      ]
    }
  },

  'soft-summer': {
    id: 'soft-summer',
    name: 'Soft Summer',
    spanishTitle: 'Verano Suave',
    subfamily: 'Verano',
    essence: 'Ahumada, misteriosa, sutil y elegante',
    description: 'En ti predomina la suavidad y el bajo contraste. Tu cutis tiene un tono neutro-frío aterciopelado. Te sientan increíbles los colores agrisados, el rosa viejo, el malva y el verde eucalipto.',
    characteristics: {
      undertone: 'Neutro frío',
      value: 'Medio',
      chroma: 'Suave / Apagado',
      contrast: 'Bajo'
    },
    palette: [
      { name: 'Malva Apagado', hex: '#9B59B6', type: 'power' },
      { name: 'Rosa Palo Empolvado', hex: '#D98880', type: 'power' },
      { name: 'Azul Humo', hex: '#5D6D7E', type: 'neutral' },
      { name: 'Gris Topo Neutro', hex: '#808B96', type: 'neutral' },
      { name: 'Verde Salvia Grisáceo', hex: '#7DCEA0', type: 'accent' },
      { name: 'Borgoña Apagado', hex: '#641E16', type: 'accent' },
      { name: 'Verde Eucalipto', hex: '#566573', type: 'neutral' },
      { name: 'Ciruela Suave', hex: '#7D3C98', type: 'accent' },
      { name: 'Beige Frío Ceniciento', hex: '#D5DBDB', type: 'neutral' },
      { name: 'Rosa Ceniza', hex: '#CD6155', type: 'power' },
      { name: 'Azul Pizarra Ahumado', hex: '#34495E', type: 'neutral' },
      { name: 'Lavanda Gris', hex: '#BB8FCE', type: 'accent' }
    ],
    avoidColors: [
      { name: 'Colores Neón o Eléctricos', hex: '#00FF00', reason: 'Opacan por completo tus delicados rasgos' },
      { name: 'Negro Azabache Intenso', hex: '#000000', reason: 'Te hace parecer cansada y marca sombras en el rostro' },
      { name: 'Amarillo Brillante', hex: '#FFFF00', reason: 'Desentona con la sutileza aterciopelada de tu piel' }
    ],
    metals: {
      best: ['Plata envejecida o cepillada', 'Oro rosa mate', 'Peltre suave'],
      description: 'Los acabados mate y cepillados reflejan tu sofisticación silenciosa.',
      finish: 'Satinado mate, envejecido y sutil'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Nudes Rosados y Malvas Ahumados',
        shades: [
          { name: 'Dusty Mauve', hex: '#A569BD', finish: 'Mate suave aterciopelado' },
          { name: 'Smoky Rose', hex: '#C0392B', finish: 'Cremoso empolvado' },
          { name: 'Soft Cashmere', hex: '#AF7AC5', finish: 'Bálsamo con color' }
        ],
        tip: 'Evita los brillos de purpurina estridente; los acabados aterciopelados son tu seña.'
      },
      {
        category: 'mejillas',
        title: 'Colorete Rosa Empolvado',
        shades: [
          { name: 'Dusty Rose', hex: '#EC7063', finish: 'Polvo sedoso' },
          { name: 'Plum Whisper', hex: '#AF7AC5', finish: 'Crema aterciopelada' }
        ],
        tip: 'Difumina hacia las sienes para un esculpido natural e integrado.'
      },
      {
        category: 'ojos',
        title: 'Ahumado de Día Suave',
        shades: [
          { name: 'Gris Topo Mate', hex: '#7F8C8D', finish: 'Mate difuminable' },
          { name: 'Malva Ahumado', hex: '#884EA0', finish: 'Satinado sutil' },
          { name: 'Marrón Ceniza', hex: '#4A235A', finish: 'Delineador cremoso' }
        ],
        tip: 'Difumina siempre las líneas de los ojos; las líneas gráficas duras te endurecen.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Lujo Silencioso Ahumado',
        description: 'Jersey de cuello alto en verde eucalipto con falda midi plisada en gris topo y botines rosa ceniza.',
        colors: ['#566573', '#808B96', '#CD6155']
      },
      {
        title: 'Romanticismo Contemporáneo',
        description: 'Vestido fluido en rosa palo empolvado con trench en azul humo y accesorios plata vieja.',
        colors: ['#D98880', '#5D6D7E', '#808B96']
      }
    ],
    capsuleWardrobe: [
      'Trench coat en tono azul humo o gris topo',
      'Camisa en rosa palo empolvado de modal',
      'Pantalón sastre en verde salvia grisáceo',
      'Vestido camisero en malva apagado',
      'Jersey oversize en beige frío ceniciento',
      'Bolso tote de ante gris topo'
    ],
    muses: ['Sarah Jessica Parker', 'Jennifer Aniston', 'Miley Cyrus'],
    powerQuote: 'Posees una elegancia enigmática y suave: el auténtico lujo silencioso.',
    virtualDrapes: {
      flattering: [
        { name: 'Rosa Palo Empolvado', hex: '#D98880' },
        { name: 'Azul Humo', hex: '#5D6D7E' },
        { name: 'Malva Apagado', hex: '#9B59B6' }
      ],
      unflattering: [
        { name: 'Verde Neón', hex: '#39FF14' },
        { name: 'Naranja Eléctrico', hex: '#FF5722' },
        { name: 'Negro Charol', hex: '#000000' }
      ]
    }
  },

  'soft-autumn': {
    id: 'soft-autumn',
    name: 'Soft Autumn',
    spanishTitle: 'Otoño Suave',
    subfamily: 'Otoño',
    essence: 'Terrosa, cálida, envolvente y acogedora',
    description: 'Combina la suavidad del verano con la calidez del otoño. Tu colorimetría es aterciopelada y rica, con tonos dorados apagados. El verde oliva suave, terracota empolvado y camel claro te sientan como un abrazo.',
    characteristics: {
      undertone: 'Neutro cálido',
      value: 'Medio',
      chroma: 'Suave / Apagado',
      contrast: 'Bajo'
    },
    palette: [
      { name: 'Verde Oliva Suave', hex: '#808000', type: 'power' },
      { name: 'Terracota Empolvado', hex: '#C0392B', type: 'power' },
      { name: 'Camel Claro', hex: '#D4AC0D', type: 'neutral' },
      { name: 'Mostaza Suave', hex: '#F1C40F', type: 'accent' },
      { name: 'Melocotón Apagado', hex: '#E59866', type: 'accent' },
      { name: 'Topo Cálido', hex: '#A08060', type: 'neutral' },
      { name: 'Teja Suave', hex: '#BA4A00', type: 'accent' },
      { name: 'Beige Cálido Almendra', hex: '#E8DAEF', type: 'neutral' },
      { name: 'Verde Caqui Claro', hex: '#7D8C62', type: 'neutral' },
      { name: 'Marrón Café con Leche', hex: '#6E2C00', type: 'neutral' },
      { name: 'Rosa Salmón Empolvado', hex: '#DC7633', type: 'accent' },
      { name: 'Oro Viejo Suave', hex: '#D4AC0D', type: 'accent' }
    ],
    avoidColors: [
      { name: 'Fucsia Eléctrico', hex: '#FF007F', reason: 'Resulta demasiado estridente y frío para tus facciones terrosas' },
      { name: 'Azul Cobalto Puro', hex: '#0020C2', reason: 'Crea una discordancia visual extrema con tu tez cálida' },
      { name: 'Blanco Puro Óptico', hex: '#FFFFFF', reason: 'Te hace lucir desvaída; prefiere blanco roto o mantequilla' }
    ],
    metals: {
      best: ['Oro viejo cepillado', 'Bronce mate', 'Latón cálido'],
      description: 'Los metales con pátina y acabado artesanal potencian tu calidez orgánica.',
      finish: 'Cepillado, satinado y envejecido'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Nudes Cálidos y Canela Suave',
        shades: [
          { name: 'Warm Cinnamon', hex: '#D35400', finish: 'Cremoso aterciopelado' },
          { name: 'Spiced Nude', hex: '#E59866', finish: 'Semimate' },
          { name: 'Peach Clay', hex: '#CA6F1E', finish: 'Bálsamo labial' }
        ],
        tip: 'Los tonos nude con matices tierra o melocotón ahumado son infalibles.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Terracota Suave',
        shades: [
          { name: 'Warm Terracotta', hex: '#DC7633', finish: 'Crema difuminada' },
          { name: 'Honey Peach', hex: '#F5B041', finish: 'Polvo mineral' }
        ],
        tip: 'Un toque de bronceador cálido mate enmarca tus pómulos con elegancia.'
      },
      {
        category: 'ojos',
        title: 'Tonos Tierra y Caqui',
        shades: [
          { name: 'Oliva Dorado', hex: '#7D8C62', finish: 'Satinado' },
          { name: 'Canela Mate', hex: '#A04000', finish: 'Transición suave' },
          { name: 'Café Cálido', hex: '#4A235A', finish: 'Lápiz difuminado' }
        ],
        tip: 'Evita el delineador negro duro; un marrón café tostado destaca tu iris.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Chic Safari Urbano',
        description: 'Sobrecamisa verde oliva suave sobre jersey camel claro y pantalón topo cálido.',
        colors: ['#808000', '#D4AC0D', '#A08060']
      },
      {
        title: 'Atardecer de Otoño',
        description: 'Vestido de punto terracota empolvado con botas de cuero marrón café y bolso mostaza suave.',
        colors: ['#C0392B', '#6E2C00', '#F1C40F']
      }
    ],
    capsuleWardrobe: [
      'Cazadora safari en verde caqui claro',
      'Jersey de ochos en camel claro',
      'Pantalón fluido en topo cálido',
      'Vestido midi de canalé terracota empolvado',
      'Blusa fluida en melocotón apagado',
      'Botines de ante marrón café'
    ],
    muses: ['Gisele Bündchen', 'Drew Barrymore', 'Calista Flockhart'],
    powerQuote: 'Tienes el encanto magnético de las tardes doradas de octubre.',
    virtualDrapes: {
      flattering: [
        { name: 'Verde Oliva Suave', hex: '#808000' },
        { name: 'Terracota Empolvado', hex: '#C0392B' },
        { name: 'Camel Cálido', hex: '#D4AC0D' }
      ],
      unflattering: [
        { name: 'Fucsia Neón', hex: '#FF007F' },
        { name: 'Azul Klein', hex: '#0020C2' },
        { name: 'Blanco Óptico', hex: '#FFFFFF' }
      ]
    }
  },

  'warm-autumn': {
    id: 'warm-autumn',
    name: 'Warm Autumn',
    spanishTitle: 'Otoño Cálido',
    subfamily: 'Otoño',
    essence: 'Opulenta, dorada, rica y especiada',
    description: 'Eres la encarnación del otoño en su máxima plenitud. Tu piel y cabello vibran con reflejos cobrizos, dorados o ambarinos. Los colores de las hojas otoñales como el teja, mostaza intenso, óxido y verde musgo te coronan con majestuosidad.',
    characteristics: {
      undertone: 'Cálido',
      value: 'Medio',
      chroma: 'Medio',
      contrast: 'Medio'
    },
    palette: [
      { name: 'Teja Intenso', hex: '#B83B1B', type: 'power' },
      { name: 'Mostaza Especiado', hex: '#E5981A', type: 'power' },
      { name: 'Óxido Cobrizo', hex: '#C3521E', type: 'accent' },
      { name: 'Verde Musgo Profundo', hex: '#4B6F44', type: 'accent' },
      { name: 'Naranja Calabaza', hex: '#D35400', type: 'accent' },
      { name: 'Chocolate Especiado', hex: '#5B3A29', type: 'neutral' },
      { name: 'Camel Tostado', hex: '#AF703D', type: 'neutral' },
      { name: 'Oro Rico Otoñal', hex: '#D4AC0D', type: 'accent' },
      { name: 'Canela Quemada', hex: '#873600', type: 'neutral' },
      { name: 'Crema Caliente', hex: '#F9E79F', type: 'neutral' },
      { name: 'Berenjena Cálido', hex: '#512E5F', type: 'accent' },
      { name: 'Rojo Tomate Maduro', hex: '#C0392B', type: 'power' }
    ],
    avoidColors: [
      { name: 'Rosa Chicle Frío', hex: '#FF69B4', reason: 'Produce un choque térmico desfavorecedor' },
      { name: 'Azul Marino Frío Puro', hex: '#000080', reason: 'Apaga el resplandor cobrizo y vital de tu piel' },
      { name: 'Gris Plateado', hex: '#BDC3C7', reason: 'Enfría tu tez creando aspecto de fatiga' }
    ],
    metals: {
      best: ['Oro amarillo 18k a 24k', 'Cobre auténtico', 'Bronce envejecido rico'],
      description: 'El cobre y el oro amarillo denso armonizan orgánicamente con tu pigmentación.',
      finish: 'Rico, cálido, labrado o pulido'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Rojos Ladrillo y Cobrizos',
        shades: [
          { name: 'Brick Red', hex: '#A93226', finish: 'Cremoso intenso' },
          { name: 'Spiced Copper', hex: '#BA4A00', finish: 'Satinado dorado' },
          { name: 'Warm Terracotta', hex: '#D35400', finish: 'Mate confortable' }
        ],
        tip: 'Un labial teja o ladrillo es el arma secreta para iluminar toda tu cara.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Ámbar y Canela',
        shades: [
          { name: 'Amber Clay', hex: '#CA6F1E', finish: 'Polvo luminoso' },
          { name: 'Warm Copper', hex: '#B9770E', finish: 'Crema tostada' }
        ],
        tip: 'El iluminador debe ser obligatoriamente dorado o bronce, jamás plateado.'
      },
      {
        category: 'ojos',
        title: 'Ojos Ahumados Cobrizos',
        shades: [
          { name: 'Cobre Metálico', hex: '#B87333', finish: 'Foil intenso' },
          { name: 'Verde Musgo', hex: '#4B6F44', finish: 'Satinado' },
          { name: 'Chocolate Tostado', hex: '#4A235A', finish: 'Delineador cremoso' }
        ],
        tip: 'Prueba un delineador verde musgo o marrón teja para realzar destellos en tus ojos.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Majestuosidad Otoñal',
        description: 'Abrigo sastre en teja intenso con vestido en chocolate especiado y collar de eslabones de oro.',
        colors: ['#B83B1B', '#5B3A29', '#D4AC0D']
      },
      {
        title: 'Boho Chic Refinado',
        description: 'Blusa en mostaza especiado con pantalón en verde musgo profundo y botines de piel camel.',
        colors: ['#E5981A', '#4B6F44', '#AF703D']
      }
    ],
    capsuleWardrobe: [
      'Abrigo de paño estructurado color teja o canela',
      'Jersey grueso de lana merino en mostaza especiado',
      'Pantalón sastre en chocolate especiado',
      'Vestido camisero en verde musgo profundo',
      'Camisa de seda en crema caliente o marfil',
      'Botas altas en piel camel tostado'
    ],
    muses: ['Julianne Moore', 'Susan Sarandon', 'Mariska Hargitay'],
    powerQuote: 'Tu belleza es generosa, profunda y cálida como el fuego de hogar.',
    virtualDrapes: {
      flattering: [
        { name: 'Teja Intenso', hex: '#B83B1B' },
        { name: 'Mostaza Especiado', hex: '#E5981A' },
        { name: 'Verde Musgo', hex: '#4B6F44' }
      ],
      unflattering: [
        { name: 'Rosa Bebé Frío', hex: '#FFB6C1' },
        { name: 'Azul Zafiro Frío', hex: '#0020C2' },
        { name: 'Gris Plata', hex: '#BDC3C7' }
      ]
    }
  },

  'deep-autumn': {
    id: 'deep-autumn',
    name: 'Dark Autumn',
    spanishTitle: 'Otoño Oscuro / Profundo',
    subfamily: 'Otoño',
    essence: 'Misteriosa, profunda, rica y sofisticada',
    description: 'Posees un contraste medio-alto y una colorimetría dominada por la profundidad cálida. Tu cabello y ojos suelen ser castaños profundos, negros cálidos o avellana oscuro. Brillas con tonos oscuros y saturados con matices de madera noble y piedras preciosas.',
    characteristics: {
      undertone: 'Neutro cálido',
      value: 'Oscuro / Profundo',
      chroma: 'Medio',
      contrast: 'Alto'
    },
    palette: [
      { name: 'Verde Bosque Cálido', hex: '#194D33', type: 'power' },
      { name: 'Granate Cálido Profundo', hex: '#6E1A24', type: 'power' },
      { name: 'Berenjena Cálido Oscuro', hex: '#4A154B', type: 'accent' },
      { name: 'Marrón Café Espresso', hex: '#2C1D11', type: 'neutral' },
      { name: 'Mostaza Quemado', hex: '#B8860B', type: 'accent' },
      { name: 'Rojo Teja Oscuro', hex: '#87261B', type: 'power' },
      { name: 'Azul Petróleo Cálido', hex: '#164E63', type: 'accent' },
      { name: 'Negro Marrón Cálido', hex: '#1A1110', type: 'neutral' },
      { name: 'Camel Oscuro', hex: '#8C5A2B', type: 'neutral' },
      { name: 'Crema Vainilla Tostada', hex: '#F5EEC8', type: 'neutral' },
      { name: 'Oro Viejo Intenso', hex: '#B8860B', type: 'accent' },
      { name: 'Óxido Profundo', hex: '#7C2D12', type: 'accent' }
    ],
    avoidColors: [
      { name: 'Pasteles Helados', hex: '#E0F2FE', reason: 'Te hacen lucir apagada y sin fuerza' },
      { name: 'Plata Fría Brillante', hex: '#E2E8F0', reason: 'Choca con tu riqueza térmica de base' },
      { name: 'Celeste Bebé', hex: '#BAE6FD', reason: 'Debilita el impacto dramático de tu mirada' }
    ],
    metals: {
      best: ['Oro amarillo envejecido', 'Bronce oscuro', 'Oro rosa profundo'],
      description: 'Metales pesados, opulentos y con peso visual que acompañen tu riqueza.',
      finish: 'Bruñido, envejecido y noble'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Vamp Cálidos y Borgoña',
        shades: [
          { name: 'Dark Burgundy', hex: '#721C24', finish: 'Mate satinado' },
          { name: 'Warm Blackberry', hex: '#581845', finish: 'Cremoso opulento' },
          { name: 'Spiced Mahogany', hex: '#641E16', finish: 'Satinado' }
        ],
        tip: 'Los tonos granates y cereza oscuro con matiz cálido te quedan de ensueño.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Caoba Suave',
        shades: [
          { name: 'Warm Fig', hex: '#78281F', finish: 'Crema aterciopelada' },
          { name: 'Terracotta Dark', hex: '#A04000', finish: 'Polvo compacto' }
        ],
        tip: 'Aplica en diagonal para un contorno sofisticado y dimensional.'
      },
      {
        category: 'ojos',
        title: 'Ahumado Noble Nocturno',
        shades: [
          { name: 'Bronce Antiguo', hex: '#8C6239', finish: 'Metálico rico' },
          { name: 'Verde Bosque Profundo', hex: '#194D33', finish: 'Satinado' },
          { name: 'Café Espresso', hex: '#1B120C', finish: 'Delineador cremoso' }
        ],
        tip: 'Puedes llevar un ahumado intenso incluso de día sin sobrecargar tus facciones.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Elegancia Profunda y Nocturna',
        description: 'Traje en verde bosque cálido con top de seda en granate profundo y brazalete de oro viejo.',
        colors: ['#194D33', '#6E1A24', '#B8860B']
      },
      {
        title: 'Contraste Especiado de Día',
        description: 'Abrigo en marrón café espresso sobre blusa mostaza quemado y pantalón teja oscuro.',
        colors: ['#2C1D11', '#B8860B', '#87261B']
      }
    ],
    capsuleWardrobe: [
      'Abrigo sastre largo en marrón café espresso',
      'Blazer estructurado en verde bosque cálido',
      'Pantalón sastre en granate profundo',
      'Camisa de seda en crema vainilla tostada',
      'Falda lápiz de cuero en óxido profundo',
      'Botas altas de caña rígida en cuero chocolate'
    ],
    muses: ['Penélope Cruz', 'Eva Mendes', 'Halle Berry'],
    powerQuote: 'Tu presencia es cautivadora, segura de sí misma y profundamente regia.',
    virtualDrapes: {
      flattering: [
        { name: 'Verde Bosque Cálido', hex: '#194D33' },
        { name: 'Granate Profundo', hex: '#6E1A24' },
        { name: 'Café Espresso', hex: '#2C1D11' }
      ],
      unflattering: [
        { name: 'Celeste Bebé', hex: '#BAE6FD' },
        { name: 'Rosa Pastel Frío', hex: '#FCE7F3' },
        { name: 'Gris Nube Claro', hex: '#F1F5F9' }
      ]
    }
  },

  'bright-winter': {
    id: 'bright-winter',
    name: 'Bright Winter',
    spanishTitle: 'Invierno Brillante',
    subfamily: 'Invierno',
    essence: 'Eléctrica, deslumbrante, nítida y vibrante',
    description: 'La reina del contraste y de la luz pura. Tu mirada tiene una claridad penetrante y tu cabello crea un marco definido sobre tu piel de fondo frío. Los tonos neón sofisticados, fucsia magenta, azul eléctrico y blanco puro óptico cobran vida en ti.',
    characteristics: {
      undertone: 'Neutro frío',
      value: 'Medio',
      chroma: 'Brillante',
      contrast: 'Alto'
    },
    palette: [
      { name: 'Fucsia Magenta Eléctrico', hex: '#E0115F', type: 'power' },
      { name: 'Azul Cobalto Real', hex: '#0047AB', type: 'power' },
      { name: 'Rojo Rubí Puro', hex: '#D10047', type: 'power' },
      { name: 'Verde Esmeralda Puro', hex: '#009B77', type: 'accent' },
      { name: 'Amarillo Ácido Frío', hex: '#E4F400', type: 'accent' },
      { name: 'Blanco Puro Óptico', hex: '#FFFFFF', type: 'neutral' },
      { name: 'Negro Azabache Espejo', hex: '#000000', type: 'neutral' },
      { name: 'Púrpura Vibrante', hex: '#8B008B', type: 'accent' },
      { name: 'Plata Brillante Glaciar', hex: '#E5E4E2', type: 'neutral' },
      { name: 'Gris Carbón Frío', hex: '#2C3E50', type: 'neutral' },
      { name: 'Cereza Neón', hex: '#DE3163', type: 'power' },
      { name: 'Turquesa Glaciar Intenso', hex: '#00CED1', type: 'accent' }
    ],
    avoidColors: [
      { name: 'Mostaza Terroso y Apagado', hex: '#B58900', reason: 'Apaga por completo tu resplandor y crea sombras oscuras' },
      { name: 'Marrón Cuero Cálido', hex: '#8B5A2B', reason: 'Se ve sucio frente a tu piel fría y nítida' },
      { name: 'Beige Polvoriento', hex: '#D2B48C', reason: 'Drena toda tu vitalidad visual' }
    ],
    metals: {
      best: ['Plata pulida efecto espejo', 'Platino', 'Oro blanco 18k'],
      description: 'El brillo blanco y reflectante es imprescindible para igualar tu nitidez.',
      finish: 'Ultra pulido, brillante y cromado'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Joya de Impacto',
        shades: [
          { name: 'Electric Magenta', hex: '#D81B60', finish: 'Cremoso luminoso' },
          { name: 'Ruby Glaze', hex: '#C2185B', finish: 'Satinado de alta pigmentación' },
          { name: 'True Scarlet', hex: '#E53935', finish: 'Mate líquido nítido' }
        ],
        tip: 'Un labial fucsia o rubí te viste por completo sin necesidad de maquillar los ojos.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Frambuesa Fresco',
        shades: [
          { name: 'Vivid Berry', hex: '#C2185B', finish: 'Tinte mejillas' },
          { name: 'Cool Pink Glow', hex: '#EC407A', finish: 'Polvo satinado' }
        ],
        tip: 'Aplica poco producto bien difuminado para un rubor cristalino.'
      },
      {
        category: 'ojos',
        title: 'Delineado Gráfico y Pestañas Infinitas',
        shades: [
          { name: 'Negro Azabache Carbón', hex: '#000000', finish: 'Eyeliner líquido' },
          { name: 'Plata Glaciar', hex: '#ECEFF1', finish: 'Satinado brillante' },
          { name: 'Azul Zafiro', hex: '#1A237E', finish: 'Lápiz de ojos' }
        ],
        tip: 'Los delineados limpios y el contraste negro puro sobre párpado despejado son tu firma.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Impacto Monocromo Eléctrico',
        description: 'Traje negro azabache con camisa fucsia magenta eléctrica y stilettos charol.',
        colors: ['#000000', '#E0115F', '#FFFFFF']
      },
      {
        title: 'Color Blocking de Alta Costura',
        description: 'Abrigo azul cobalto real sobre vestido blanco puro óptico y accesorios plata espejo.',
        colors: ['#0047AB', '#FFFFFF', '#009B77']
      }
    ],
    capsuleWardrobe: [
      'Smoking o traje sastre negro azabache impecable',
      'Camisa de seda en blanco puro óptico almidonado',
      'Abrigo de corte recto en azul cobalto real',
      'Vestido cóctel fucsia magenta eléctrico',
      'Jersey de cuello vuelto en verde esmeralda puro',
      'Stilettos o botines de charol brillante'
    ],
    muses: ['Megan Fox', 'Katy Perry', 'Alexis Bledel'],
    powerQuote: 'Tienes la fuerza de un relámpago en una noche despejada.',
    virtualDrapes: {
      flattering: [
        { name: 'Fucsia Magenta Eléctrico', hex: '#E0115F' },
        { name: 'Azul Cobalto Real', hex: '#0047AB' },
        { name: 'Blanco Puro Óptico', hex: '#FFFFFF' }
      ],
      unflattering: [
        { name: 'Mostaza Terroso', hex: '#B58900' },
        { name: 'Marrón Cuero', hex: '#8B5A2B' },
        { name: 'Beige Arena Mate', hex: '#D2B48C' }
      ]
    }
  },

  'cool-winter': {
    id: 'cool-winter',
    name: 'Cool Winter',
    spanishTitle: 'Invierno Frío',
    subfamily: 'Invierno',
    essence: 'Gélida, aristocrática, pura e imponente',
    description: 'Eres 100% fría: nieve, hielo y contraste puro. Tu piel suele ser blanca de fondo rosado o porcelana fría, o ébano frío sin calidez. Eres de las pocas personas que lucen espectaculares en negro carbón, azul marino zafiro y rojo carmín frío.',
    characteristics: {
      undertone: 'Frío',
      value: 'Medio',
      chroma: 'Brillante',
      contrast: 'Alto'
    },
    palette: [
      { name: 'Azul Zafiro Puro', hex: '#082567', type: 'power' },
      { name: 'Rojo Carmín Frío', hex: '#960018', type: 'power' },
      { name: 'Magenta Helado', hex: '#FF0090', type: 'power' },
      { name: 'Verde Pino Frío', hex: '#014421', type: 'accent' },
      { name: 'Negro Carbón Puro', hex: '#050505', type: 'neutral' },
      { name: 'Blanco Nieve', hex: '#F9FBFD', type: 'neutral' },
      { name: 'Azul Hielo Glaciar', hex: '#AFEEEE', type: 'accent' },
      { name: 'Morado Real Frío', hex: '#4B0082', type: 'accent' },
      { name: 'Gris Plata Metálico', hex: '#A8A9AD', type: 'neutral' },
      { name: 'Azul Marino Noche', hex: '#000033', type: 'neutral' },
      { name: 'Rosa Fresa Frío', hex: '#E30B5C', type: 'accent' },
      { name: 'Gris Antracita Frío', hex: '#26282B', type: 'neutral' }
    ],
    avoidColors: [
      { name: 'Naranja en Todas sus Variantes', hex: '#FF7F00', reason: 'Antagónico con tu paleta fría pura' },
      { name: 'Camel y Tonos Dorados', hex: '#C19A6B', reason: 'Apaga tu contraste y aporta tinte enfermizo' },
      { name: 'Mostaza Cálido', hex: '#FFDB58', reason: 'Crea discordancia visual inmediata' }
    ],
    metals: {
      best: ['Plata pura 999', 'Platino pulido', 'Oro blanco puro'],
      description: 'El hielo de los metales fríos y diamantes refleja tu naturaleza soberana.',
      finish: 'Frío, plateado y cristalino'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Rojo Frío y Berenjena Helado',
        shades: [
          { name: 'True Crimson Red', hex: '#990000', finish: 'Mate impecable' },
          { name: 'Ice Berry', hex: '#880E4F', finish: 'Cremoso intenso' },
          { name: 'Frosted Plum', hex: '#4A148C', finish: 'Satinado' }
        ],
        tip: 'Un rojo con subtono azul puro hace que tus dientes parezcan visiblemente más blancos.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Pétalo Helado',
        shades: [
          { name: 'Icy Pink', hex: '#F06292', finish: 'Polvo microfino' },
          { name: 'Berry Frost', hex: '#AD1457', finish: 'Crema difuminada' }
        ],
        tip: 'Menos es más; un toque de rosa frío da el aspecto de mejillas tocadas por el frío invernal.'
      },
      {
        category: 'ojos',
        title: 'Contraste Plateado y Profundo',
        shades: [
          { name: 'Plata Hielo', hex: '#CFD8DC', finish: 'Metálico' },
          { name: 'Azul Noche Profundo', hex: '#0D47A1', finish: 'Mate definidor' },
          { name: 'Negro Tinta', hex: '#000000', finish: 'Máscara y eyeliner' }
        ],
        tip: 'El eyeliner negro clásico y pestañas bien curvadas completan tu mirada icónica.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Reina de las Nieves Urbano',
        description: 'Abrigo de corte masculino en blanco nieve con suéter azul zafiro puro y pantalón negro carbón.',
        colors: ['#F9FBFD', '#082567', '#050505']
      },
      {
        title: 'Glamour Nocturno Imperial',
        description: 'Vestido largo en rojo carmín frío con pendientes en cascada de plata pura y estola gris antracita.',
        colors: ['#960018', '#A8A9AD', '#26282B']
      }
    ],
    capsuleWardrobe: [
      'Abrigo de lana largo en negro carbón puro',
      'Camisa de popelín en blanco nieve impoluto',
      'Blazer en azul zafiro puro',
      'Vestido rojo carmín frío de cóctel',
      'Jersey de cuello perkins en magenta helado',
      'Pantalón sastre en gris antracita frío'
    ],
    muses: ['Liv Tyler', 'Anne Hathaway', 'Brooke Shields'],
    powerQuote: 'Tu presencia es majestuosa, pulcra y profundamente impactante.',
    virtualDrapes: {
      flattering: [
        { name: 'Rojo Carmín Frío', hex: '#960018' },
        { name: 'Azul Zafiro', hex: '#082567' },
        { name: 'Blanco Nieve', hex: '#F9FBFD' }
      ],
      unflattering: [
        { name: 'Naranja Puro', hex: '#FF7F00' },
        { name: 'Camel Dorado', hex: '#C19A6B' },
        { name: 'Mostaza Cálido', hex: '#FFDB58' }
      ]
    }
  },

  'deep-winter': {
    id: 'deep-winter',
    name: 'Dark Winter',
    spanishTitle: 'Invierno Oscuro / Profundo',
    subfamily: 'Invierno',
    essence: 'Dramática, magnética, misteriosa y regia',
    description: 'Posees la profundidad de la noche con un trasfondo frío e intenso. Tu cabello suele ser negro o castaño muy oscuro, y tus ojos son profundos y expresivos. Eres la dueña absoluta del negro, el borgoña intenso, el azul marino noche y el ciruela real.',
    characteristics: {
      undertone: 'Neutro frío',
      value: 'Oscuro / Profundo',
      chroma: 'Brillante',
      contrast: 'Alto'
    },
    palette: [
      { name: 'Negro Obsidiana', hex: '#080808', type: 'neutral' },
      { name: 'Borgoña Intenso', hex: '#58111A', type: 'power' },
      { name: 'Azul Marino Noche', hex: '#0A1128', type: 'neutral' },
      { name: 'Verde Petróleo Oscuro', hex: '#004953', type: 'accent' },
      { name: 'Cereza Oscuro', hex: '#5B0E2D', type: 'power' },
      { name: 'Ciruela Real Profundo', hex: '#3B0944', type: 'accent' },
      { name: 'Blanco Diamante', hex: '#F4F6F9', type: 'neutral' },
      { name: 'Rojo Vino Puro', hex: '#7E1926', type: 'power' },
      { name: 'Gris Carbón Pizarra', hex: '#1C2321', type: 'neutral' },
      { name: 'Azul Real Intenso', hex: '#1C39BB', type: 'accent' },
      { name: 'Esmeralda Nocturna', hex: '#043927', type: 'accent' },
      { name: 'Plata Lustrosa', hex: '#C5C6D0', type: 'neutral' }
    ],
    avoidColors: [
      { name: 'Tonos Pastel Deslavados', hex: '#FDE2E4', reason: 'Te restan protagonismo y te hacen lucir descolorida' },
      { name: 'Naranja Albaricoque Cálido', hex: '#F8961E', reason: 'Choca con tu profundidad fría dramática' },
      { name: 'Beige Dorado Claro', hex: '#E9D8A6', reason: 'Apaga la intensidad magnética de tus rasgos' }
    ],
    metals: {
      best: ['Plata envejecida lustrosa', 'Platino', 'Oro blanco 18k', 'Titanio pulido'],
      description: 'Metales pesados, fríos o con acabado brillante de alta calidad.',
      finish: 'Lustroso, plateado y rotundo'
    },
    makeup: [
      {
        category: 'labios',
        title: 'Labios Ciruela Oscuro y Vino Tinto',
        shades: [
          { name: 'Deep Plum Wine', hex: '#4A0E17', finish: 'Mate de larga duración' },
          { name: 'Dark Cherry Kiss', hex: '#5E0E2B', finish: 'Cremoso aterciopelado' },
          { name: 'Vamp Red', hex: '#630B1C', finish: 'Laca de labios' }
        ],
        tip: 'Llevar los labios en tono cereza oscuro o ciruela potencia tu aire misterioso natural.'
      },
      {
        category: 'mejillas',
        title: 'Rubor Ciruela Intenso',
        shades: [
          { name: 'Deep Berry', hex: '#6A1B4D', finish: 'Crema fundente' },
          { name: 'Plum Blush', hex: '#4A154B', finish: 'Polvo micronizado' }
        ],
        tip: 'Aplica en poca cantidad y difumina suavemente hacia arriba.'
      },
      {
        category: 'ojos',
        title: 'Smoky Eye Nocturno y Sofisticado',
        shades: [
          { name: 'Negro Carbón Mate', hex: '#0B0B0B', finish: 'Mate profundo' },
          { name: 'Ciruela Ahumado', hex: '#2E112D', finish: 'Satinado' },
          { name: 'Plata Diamante', hex: '#D1D5DB', finish: 'Destellos en lagrimal' }
        ],
        tip: 'Un smokey eye en negro o ciruela profunda te sienta de manera completamente natural.'
      }
    ],
    outfitFormulas: [
      {
        title: 'Poder Dramático Nocturno',
        description: 'Vestido largo en borgoña intenso con abrigo sastre negro obsidiana y accesorios de plata lustrosa.',
        colors: ['#58111A', '#080808', '#C5C6D0']
      },
      {
        title: 'Sartorial de Lujo',
        description: 'Traje en verde petróleo oscuro con blusa blanco diamante y botines de cuero negro.',
        colors: ['#004953', '#F4F6F9', '#080808']
      }
    ],
    capsuleWardrobe: [
      'Abrigo estructurado negro obsidiana de corte impecable',
      'Blazer en verde petróleo oscuro o azul marino noche',
      'Camisa de seda en blanco diamante',
      'Vestido midi en borgoña intenso con abertura',
      'Pantalón sastre de talle alto gris carbón',
      'Zapatos de salón de cuero negro con tacón de aguja'
    ],
    muses: ['Salma Hayek', 'Kim Kardashian', 'Lupita Nyong\'o'],
    powerQuote: 'Tu presencia es intensa, hipnótica y dotada de un dramatismo inolvidable.',
    virtualDrapes: {
      flattering: [
        { name: 'Borgoña Intenso', hex: '#58111A' },
        { name: 'Verde Petróleo Oscuro', hex: '#004953' },
        { name: 'Negro Obsidiana', hex: '#080808' }
      ],
      unflattering: [
        { name: 'Pastel Deslavado', hex: '#FDE2E4' },
        { name: 'Naranja Albaricoque', hex: '#F8961E' },
        { name: 'Beige Dorado', hex: '#E9D8A6' }
      ]
    }
  }
};

export const SEASONS_LIST = Object.values(SEASONS_DATA);
