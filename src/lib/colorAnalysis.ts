import { SEASONS_DATA, SeasonData } from '../data/seasons';

export interface AnalysisInput {
  undertone: 'warm' | 'cool' | 'neutral-warm' | 'neutral-cool' | 'neutral';
  contrast: 'low' | 'medium' | 'high';
  value: 'light' | 'medium' | 'deep';
  chroma: 'muted' | 'bright' | 'soft';
  skinHex?: string;
  hairTone?: string;
  eyeTone?: string;
  method?: 'photo' | 'quiz';
}

export interface AnalysisResult {
  id: string;
  seasonId: string;
  season: SeasonData;
  undertone: string;
  contrast: string;
  value: string;
  chroma: string;
  skinHex: string;
  confidence: number;
  method: 'photo' | 'quiz';
  createdAt: string;
  aiNotes?: string;
  scores: {
    warmth: number; // 0 (100% cool) to 100 (100% warm)
    brightness: number; // 0 (soft/muted) to 100 (bright/clear)
    depth: number; // 0 (light) to 100 (deep)
    contrast: number; // 0 (low) to 100 (high)
  };
}

// 12-Season Matrix Mapping
export function classifySeason(input: AnalysisInput): AnalysisResult {
  let seasonId = 'cool-summer';

  const undertoneIsWarm = input.undertone === 'warm' || input.undertone === 'neutral-warm';
  const undertoneIsCool = input.undertone === 'cool' || input.undertone === 'neutral-cool' || input.undertone === 'neutral';

  if (undertoneIsWarm) {
    if (input.value === 'light') {
      seasonId = 'light-spring';
    } else if (input.value === 'deep') {
      seasonId = 'deep-autumn';
    } else {
      // Medium value
      if (input.chroma === 'bright') {
        seasonId = input.contrast === 'high' ? 'clear-spring' : 'warm-spring';
      } else if (input.chroma === 'soft' || input.chroma === 'muted') {
        seasonId = 'soft-autumn';
      } else {
        seasonId = input.contrast === 'low' ? 'soft-autumn' : 'warm-autumn';
      }
    }
  } else {
    // Undertone is cool
    if (input.value === 'light') {
      seasonId = 'light-summer';
    } else if (input.value === 'deep') {
      seasonId = 'deep-winter';
    } else {
      // Medium value
      if (input.chroma === 'bright') {
        seasonId = input.contrast === 'high' ? 'bright-winter' : 'cool-winter';
      } else if (input.chroma === 'soft' || input.chroma === 'muted') {
        seasonId = 'soft-summer';
      } else {
        seasonId = input.contrast === 'high' ? 'cool-winter' : 'cool-summer';
      }
    }
  }

  // Refinements for edge cases
  if (input.contrast === 'high' && input.chroma === 'bright') {
    if (undertoneIsWarm) {
      seasonId = 'clear-spring';
    } else {
      seasonId = 'bright-winter';
    }
  }

  if (input.contrast === 'low' && (input.chroma === 'soft' || input.chroma === 'muted')) {
    if (undertoneIsWarm) {
      seasonId = 'soft-autumn';
    } else {
      seasonId = 'soft-summer';
    }
  }

  const season = SEASONS_DATA[seasonId] || SEASONS_DATA['cool-summer'];

  // Calculate percentage gauges
  const warmthScore = undertoneIsWarm 
    ? (input.undertone === 'warm' ? 88 : 68) 
    : (input.undertone === 'cool' ? 12 : 35);
  
  const brightnessScore = input.chroma === 'bright' ? 90 : (input.chroma === 'muted' ? 25 : 45);
  const depthScore = input.value === 'deep' ? 88 : (input.value === 'light' ? 20 : 54);
  const contrastScore = input.contrast === 'high' ? 85 : (input.contrast === 'low' ? 25 : 55);

  const defaultSkinHex = undertoneIsWarm ? '#F3D2B8' : '#F5D0C5';

  return {
    id: 'analysis_' + Math.random().toString(36).substring(2, 9),
    seasonId: season.id,
    season,
    undertone: input.undertone,
    contrast: input.contrast,
    value: input.value,
    chroma: input.chroma,
    skinHex: input.skinHex || defaultSkinHex,
    confidence: input.method === 'photo' ? 0.94 : 0.88,
    method: input.method || 'quiz',
    createdAt: new Date().toISOString(),
    scores: {
      warmth: warmthScore,
      brightness: brightnessScore,
      depth: depthScore,
      contrast: contrastScore
    }
  };
}

// Client-side image color sampler helper for canvas inspection
export async function sampleDominantSkinTone(imageElement: HTMLImageElement | HTMLVideoElement): Promise<{
  hex: string;
  brightness: number;
  undertoneHint: 'warm' | 'cool';
}> {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not available');

    const width = 120;
    const height = 120;
    canvas.width = width;
    canvas.height = height;

    // Draw center region (typical face location)
    ctx.drawImage(imageElement, 0, 0, width, height);
    
    // Sample 20x20 in center
    const imageData = ctx.getImageData(width * 0.35, height * 0.35, width * 0.3, height * 0.3);
    const data = imageData.data;
    
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Filter out extreme highlights or dark shadows
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 40 && lum < 235) {
        rSum += r;
        gSum += g;
        bSum += b;
        count++;
      }
    }

    if (count === 0) {
      return { hex: '#F3D2B8', brightness: 70, undertoneHint: 'warm' };
    }

    const rAvg = Math.round(rSum / count);
    const gAvg = Math.round(gSum / count);
    const bAvg = Math.round(bSum / count);

    const hex = `#${((1 << 24) + (rAvg << 16) + (gAvg << 8) + bAvg).toString(16).slice(1).toUpperCase()}`;
    const brightness = Math.round((0.299 * rAvg + 0.587 * gAvg + 0.114 * bAvg) / 2.55);
    
    // Warm tones typically have r > g > b with higher red-yellow saturation
    const isWarm = (rAvg - bAvg) > 35 && (gAvg - bAvg) > 15;

    return {
      hex,
      brightness,
      undertoneHint: isWarm ? 'warm' : 'cool'
    };
  } catch {
    return { hex: '#F3D2B8', brightness: 70, undertoneHint: 'warm' };
  }
}
