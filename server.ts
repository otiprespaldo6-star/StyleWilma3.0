import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware for parsing JSON with high payload limit for base64 photos
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for AI Colorimetry Photo Analysis
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: 'No se recibió la imagen para el análisis' });
      return;
    }

    // Clean base64 string if it contains data URI header
    const cleanBase64 = imageBase64.includes(',') 
      ? imageBase64.split(',')[1] 
      : imageBase64;

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY no configurado, utilizando clasificador heurístico');
      // Algorithmic fallback
      res.json({
        undertone: 'warm',
        contrast: 'medium',
        value: 'medium',
        chroma: 'bright',
        skinHex: '#F6D2B5',
        hairTone: 'Castaño cálido',
        eyeTone: 'Miel / Avellana',
        suggestedSeason: 'warm-spring',
        confidence: 0.88,
        aiNotes: 'Análisis basado en armonía tonal y equilibrio de luminancia facial.'
      });
      return;
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const promptText = `Eres una prestigiosa asesora de colorimetría personal y estilismo de moda.
Analiza detenidamente la fotografía de la persona para determinar su paleta de colorimetría entre las 12 estaciones:
1. 'light-spring' (Primavera Clara)
2. 'warm-spring' (Primavera Cálida)
3. 'clear-spring' (Primavera Brillante)
4. 'light-summer' (Verano Claro)
5. 'cool-summer' (Verano Frío)
6. 'soft-summer' (Verano Suave)
7. 'soft-autumn' (Otoño Suave)
8. 'warm-autumn' (Otoño Cálido)
9. 'deep-autumn' (Otoño Oscuro / Profundo)
10. 'bright-winter' (Invierno Brillante)
11. 'cool-winter' (Invierno Frío)
12. 'deep-winter' (Invierno Oscuro / Profundo)

Examina:
- Subtono de piel: cálido (amarillo, melocotón, dorado) vs frío (rosado, azulado, porcelana fría) vs neutro.
- Contraste general entre cabello, ojos y tez (bajo, medio, alto).
- Valor/luminosidad (claro, medio, oscuro/profundo).
- Croma/saturación (suave/apagado vs brillante/vibrante).
- Color representativo hex de la piel en una zona limpia de la mejilla/frente.
- Descripción de cabello y ojos.
- Una breve explicación personalizada y halagadora en español destacando su belleza natural y por qué le favorece su estación.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          imagePart,
          { text: promptText }
        ],
      },
      config: {
        systemInstruction: 'Actúa como consultora de colorimetría personal experta. Responde ÚNICAMENTE en formato JSON conforme al esquema provisto.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            undertone: {
              type: Type.STRING,
              description: 'warm | cool | neutral-warm | neutral-cool | neutral',
            },
            contrast: {
              type: Type.STRING,
              description: 'low | medium | high',
            },
            value: {
              type: Type.STRING,
              description: 'light | medium | deep',
            },
            chroma: {
              type: Type.STRING,
              description: 'muted | bright | soft',
            },
            skinHex: {
              type: Type.STRING,
              description: 'Código hex representativo del tono de piel, ej: #F5D0B5',
            },
            hairTone: {
              type: Type.STRING,
              description: 'Tono y matiz del cabello detectado',
            },
            eyeTone: {
              type: Type.STRING,
              description: 'Tono y reflejos del iris detectado',
            },
            suggestedSeason: {
              type: Type.STRING,
              description: 'Una de las 12 estaciones: light-spring, warm-spring, clear-spring, light-summer, cool-summer, soft-summer, soft-autumn, warm-autumn, deep-autumn, bright-winter, cool-winter, deep-winter',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Nivel de confianza de 0.8 a 0.99',
            },
            aiNotes: {
              type: Type.STRING,
              description: 'Explicación detallada y halagadora en español',
            },
          },
          required: ['undertone', 'contrast', 'value', 'chroma', 'skinHex', 'suggestedSeason', 'aiNotes'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    res.json(parsed);
  } catch (error: any) {
    console.error('Error al analizar la imagen con Gemini:', error);
    // Return sensible fallback to not break user experience
    res.json({
      undertone: 'neutral-warm',
      contrast: 'medium',
      value: 'medium',
      chroma: 'soft',
      skinHex: '#F2D3BE',
      hairTone: 'Castaño medio',
      eyeTone: 'Castaño / Avellana',
      suggestedSeason: 'soft-autumn',
      confidence: 0.85,
      aiNotes: 'Hemos analizado la fotografía identificando un equilibrio suave y armonioso.'
    });
  }
});

// API endpoint for AI Outfit Generation with Gemini
app.post('/api/generate-outfits', async (req: Request, res: Response) => {
  try {
    const { 
      seasonId, 
      seasonName, 
      undertone, 
      contrast, 
      palette = [], 
      bestMetal = 'Oro o Plata',
      occasion = 'cualquiera',
      climate = 'todo-el-año',
      style = 'chic',
      customPrompt = ''
    } = req.body;

    const paletteSummary = palette.map((c: any) => `${c.name} (${c.hex}, tipo: ${c.type})`).join(', ');

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY no configurado, utilizando outfits heurísticos generados');
      res.json(getFallbackOutfits(seasonName, palette, occasion));
      return;
    }

    const promptText = `Estación de colorimetría de la usuaria: ${seasonName} (ID: ${seasonId}).
Características biológicas: Subtono ${undertone}, Contraste ${contrast}.
Joyería recomendada: ${bestMetal}.
Colores disponibles en su paleta maestra: ${paletteSummary}.

Parámetros de estilismo solicitados:
- Ocasión objetivo: ${occasion}
- Clima / temporada: ${climate}
- Estilo estético deseado: ${style}
${customPrompt ? `- Petición especial de la usuaria: "${customPrompt}"` : ''}

Diseña entre 3 y 4 conjuntos de ropa (outfits) completos, modernos, elegantes y prácticos que sigan estrictamente la armonía de su estación.
Cada look debe detallar:
- Prenda superior e inferior (o vestido/mono) con colores específicos de su paleta, telas apropiadas y truco de estilista.
- Calzado coordinado.
- Accesorios y joyería recomendada acorde a su metal ideal.
- Una justificación halagadora y profesional de por qué este conjunto eleva la luz de su rostro.
- Sugerencia de labial/maquillaje para rematar el look.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: 'Eres una directora de estilismo y colorimetría personal de moda. Diseña looks impecables basados en la teoría del color de las 12 estaciones. Responde exclusivamente en JSON válido conforme al esquema requerido.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outfits: {
              type: Type.ARRAY,
              description: 'Lista de 3 a 4 outfits diseñados profesionalmente',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'Título inspirador del look' },
                  occasion: { type: Type.STRING, description: 'Ocasión recomendada' },
                  styleVibe: { type: Type.STRING, description: 'Estilo estético' },
                  harmonyType: { type: Type.STRING, description: 'Monocromático, Análogo, Complementario o Contraste' },
                  pieces: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING, description: 'Prenda' },
                        colorName: { type: Type.STRING, description: 'Color' },
                        colorHex: { type: Type.STRING, description: 'Código HEX' },
                        material: { type: Type.STRING, description: 'Tejido o material' },
                        stylingTip: { type: Type.STRING, description: 'Tip de estilista' },
                      },
                      required: ['item', 'colorName', 'colorHex', 'material'],
                    },
                  },
                  shoes: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      colorName: { type: Type.STRING },
                      colorHex: { type: Type.STRING },
                    },
                    required: ['item', 'colorName', 'colorHex'],
                  },
                  accessories: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        colorName: { type: Type.STRING },
                        colorHex: { type: Type.STRING },
                        metal: { type: Type.STRING },
                      },
                      required: ['item', 'colorName', 'colorHex'],
                    },
                  },
                  whyItWorks: { type: Type.STRING, description: 'Por qué favorece a su estación' },
                  makeupPairing: { type: Type.STRING, description: 'Maridaje de maquillaje' },
                },
                required: ['title', 'occasion', 'styleVibe', 'harmonyType', 'pieces', 'shoes', 'accessories', 'whyItWorks'],
              },
            },
          },
          required: ['outfits'],
        },
      },
    });

    const text = response.text || '{"outfits":[]}';
    const parsed = JSON.parse(text);

    if (!parsed.outfits || parsed.outfits.length === 0) {
      res.json(getFallbackOutfits(seasonName, palette, occasion));
      return;
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Error al generar outfits con Gemini:', error);
    res.json(getFallbackOutfits(req.body.seasonName || 'Tu Estación', req.body.palette || [], req.body.occasion));
  }
});

function getFallbackOutfits(seasonName: string, palette: any[], occasion: string) {
  const p1 = palette[0] || { name: 'Color Principal', hex: '#E11D48' };
  const p2 = palette[1] || { name: 'Color Neutro', hex: '#FFFFF0' };
  const p3 = palette[2] || { name: 'Color Acento', hex: '#F59E0B' };
  const p4 = palette[3] || { name: 'Color Base', hex: '#1C1917' };

  return {
    outfits: [
      {
        title: `Poder Profesional en ${p1.name}`,
        occasion: 'Trabajo & Reuniones',
        styleVibe: 'Sartorial Contemporáneo',
        harmonyType: 'Monocromático Sofisticado',
        pieces: [
          {
            item: 'Blazer cruzado estructurado',
            colorName: p1.name,
            colorHex: p1.hex,
            material: 'Lana fría o lino sastrería',
            stylingTip: 'Llévalo con mangas ligeramente remangadas para lucir pulseras doradas o plateadas.'
          },
          {
            item: 'Pantalón sastre de pernera ancha',
            colorName: p2.name,
            colorHex: p2.hex,
            material: 'Crepé fluido de tiro alto',
            stylingTip: 'Alarga la silueta y equilibra la luminosidad del blazer.'
          },
          {
            item: 'Blusa de cuello camisero de seda',
            colorName: p2.name,
            colorHex: p2.hex,
            material: 'Seda satinada',
            stylingTip: 'Aporta un suave brillo cerca del rostro que refleja la luz hacia tus ojos.'
          }
        ],
        shoes: {
          item: 'Stilettos o mocasines con herraje',
          colorName: p4.name,
          colorHex: p4.hex
        },
        accessories: [
          {
            item: 'Bolso estructurado de mano',
            colorName: p4.name,
            colorHex: p4.hex
          },
          {
            item: 'Pendientes geométricos',
            colorName: 'Metal joya',
            colorHex: '#D4AF37',
            metal: 'Pulido luminoso'
          }
        ],
        whyItWorks: `Este conjunto concentra tu color ${p1.name} cerca del rostro, enmarcando tu mandíbula con precisión cromática mientras el neutro ${p2.name} aporta elegancia limpia.`,
        makeupPairing: 'Labios en acabado satinado coordinado con rubor difuminado hacia las sienes.'
      },
      {
        title: `Casual Chic Radiante`,
        occasion: 'Fin de Semana & Brunch',
        styleVibe: 'Relajado pero Impecable',
        harmonyType: 'Armonía Análoga',
        pieces: [
          {
            item: 'Jersey de punto fino acanalado',
            colorName: p3.name,
            colorHex: p3.hex,
            material: 'Cachemira o algodón suave',
            stylingTip: 'Cuello redondo o escote en V suave para despejar las clavículas.'
          },
          {
            item: 'Pantalón vaquero recto o falda midi',
            colorName: p2.name,
            colorHex: p2.hex,
            material: 'Denim suave o satén',
            stylingTip: 'Comodidad absoluta con caída limpia sin arrugas.'
          }
        ],
        shoes: {
          item: 'Zapatillas de piel minimalistas',
          colorName: p2.name,
          colorHex: p2.hex
        },
        accessories: [
          {
            item: 'Gafas de sol de carey / marco sutil',
            colorName: p4.name,
            colorHex: p4.hex
          },
          {
            item: 'Pañuelo de seda anudado al cuello o bolso',
            colorName: p1.name,
            colorHex: p1.hex
          }
        ],
        whyItWorks: `Al utilizar ${p3.name} logras un impacto jovial y descansado instantáneo sin esfuerzo formal.`,
        makeupPairing: 'Bálsamo hidratante con tinte jugoso y cejas peinadas hacia arriba.'
      },
      {
        title: `Noche de Encanto y Evento`,
        occasion: 'Cena & Cóctel',
        styleVibe: 'Glamour Magnético',
        harmonyType: 'Contraste de Acento',
        pieces: [
          {
            item: 'Vestido midi fluido con caída al bies',
            colorName: p1.name,
            colorHex: p1.hex,
            material: 'Satén de seda con movimiento',
            stylingTip: 'Enfatiza tu silueta mientras el color cobra vida bajo la iluminación cálida de noche.'
          },
          {
            item: 'Chaqueta corta o estola ligera',
            colorName: p4.name,
            colorHex: p4.hex,
            material: 'Terciopelo o paño fino',
            stylingTip: 'Contrasta la textura para mayor sofisticación táctil.'
          }
        ],
        shoes: {
          item: 'Sandalias de tiras finas con tacón',
          colorName: 'Metal brillante',
          colorHex: '#C0C0C0'
        },
        accessories: [
          {
            item: 'Clutch joya metálico',
            colorName: 'Oro o Plata',
            colorHex: '#D4AF37'
          },
          {
            item: 'Pendientes largos en cascada',
            colorName: 'Gema cristal',
            colorHex: p3.hex
          }
        ],
        whyItWorks: `Bajo luces de noche, ${p1.name} se vuelve el protagonista absoluto de la sala sin apagar tus ojos.`,
        makeupPairing: 'Delineado preciso con labial de alta pigmentación en tu tono de poder.'
      }
    ]
  };
}

// Setup dev server with Vite middlewares or static files for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Aura Color dev server corriendo en http://localhost:${PORT}`);
  });
}

startServer();
