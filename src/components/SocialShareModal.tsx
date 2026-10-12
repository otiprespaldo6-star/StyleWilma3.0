import React, { useRef, useState, useEffect } from 'react';
import { AnalysisResult } from '../lib/colorAnalysis';
import { UserProfile } from '../types';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles,
  Smartphone,
  Square
} from 'lucide-react';

interface SocialShareModalProps {
  analysis: AnalysisResult;
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  analysis,
  user,
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story');
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const season = analysis.season;
  const userName = user?.firstName || 'Mi';

  // Generate dynamic canvas image
  useEffect(() => {
    if (!isOpen) return;
    renderCanvas();
  }, [isOpen, aspectRatio, analysis, user]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = 1080;
    const height = aspectRatio === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background: Deep luxurious dark gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#120E10');
    bgGrad.addColorStop(0.5, '#1E1218');
    bgGrad.addColorStop(1, '#0C0A0B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Soft Aura Glow Circles behind content
    const primaryHex = season.palette[0]?.hex || '#E11D48';
    const accentHex = season.palette[1]?.hex || '#F59E0B';

    // Top Right Glow
    const glow1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 500);
    glow1.addColorStop(0, primaryHex + '55'); // 33% alpha
    glow1.addColorStop(1, '#00000000');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    // Bottom Left Glow
    const glow2 = ctx.createRadialGradient(width * 0.2, height * 0.75, 40, width * 0.2, height * 0.75, 450);
    glow2.addColorStop(0, accentHex + '44');
    glow2.addColorStop(1, '#00000000');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    // 3. Subtle outer gold/rose border
    ctx.strokeStyle = '#FFFFFF15';
    ctx.lineWidth = 4;
    roundRect(ctx, 40, 40, width - 80, height - 80, 48);
    ctx.stroke();

    // Inner subtle frame
    ctx.strokeStyle = primaryHex + '30';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 56, 56, width - 112, height - 112, 36);
    ctx.stroke();

    // 4. Header: Logo & Branding
    ctx.textAlign = 'center';

    // Pill badge at top
    const topY = aspectRatio === 'story' ? 150 : 110;
    ctx.fillStyle = '#FFFFFF14';
    roundRect(ctx, width / 2 - 210, topY, 420, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#F472B6';
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('✨ STYLED BY WILMA • COLORIMETRÍA', width / 2, topY + 28);
    ctx.letterSpacing = '0px';

    // User subhead
    const subheadY = topY + 90;
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Paleta Personal de ${userName}`, width / 2, subheadY);

    // 5. Season Title in Serif Luxury Font
    const titleY = subheadY + 75;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 74px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(season.spanishTitle.toUpperCase(), width / 2, titleY);

    // Subfamily & archetype quote
    const essenceY = titleY + 46;
    ctx.fillStyle = '#FBCFE8';
    ctx.font = 'italic 30px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`"${season.essence}"`, width / 2, essenceY);

    // 6. Characteristics Badges Bar
    const tagsY = essenceY + 50;
    const tagText = `${season.characteristics.undertone.toUpperCase()}  •  CONTRASTE ${season.characteristics.contrast.toUpperCase()}  •  ${season.metals.best[0].toUpperCase()}`;
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(tagText, width / 2, tagsY);
    ctx.letterSpacing = '0px';

    // 7. Palette Grid of Colors
    const paletteStartY = tagsY + 60;
    const colorsToShow = aspectRatio === 'story' ? season.palette.slice(0, 12) : season.palette.slice(0, 8);
    
    // Grid configuration
    const cols = 4;
    const rows = Math.ceil(colorsToShow.length / cols);
    const gridPaddingX = 90;
    const availableW = width - gridPaddingX * 2;
    const cardGap = 20;
    const cardW = (availableW - (cols - 1) * cardGap) / cols;
    const cardH = aspectRatio === 'story' ? 140 : 110;

    colorsToShow.forEach((c, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gridPaddingX + col * (cardW + cardGap);
      const y = paletteStartY + row * (cardH + cardGap);

      // Card Background / Shadow
      ctx.fillStyle = '#00000040';
      roundRect(ctx, x + 3, y + 4, cardW, cardH, 20);
      ctx.fill();

      // Color Block
      ctx.fillStyle = c.hex;
      roundRect(ctx, x, y, cardW, cardH, 20);
      ctx.fill();

      // Subtle gloss sheen
      const gloss = ctx.createLinearGradient(x, y, x, y + cardH * 0.4);
      gloss.addColorStop(0, '#FFFFFF30');
      gloss.addColorStop(1, '#FFFFFF00');
      ctx.fillStyle = gloss;
      roundRect(ctx, x, y, cardW, cardH * 0.4, 20);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#FFFFFF35';
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, y, cardW, cardH, 20);
      ctx.stroke();

      // Chip Text Container
      ctx.fillStyle = '#00000085';
      roundRect(ctx, x + 8, y + cardH - 42, cardW - 16, 34, 10);
      ctx.fill();

      // Name & Hex inside card
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(truncateText(ctx, c.name, cardW - 24), x + cardW / 2, y + cardH - 24);

      ctx.fillStyle = '#E5E7EB';
      ctx.font = '500 12px monospace';
      ctx.fillText(c.hex, x + cardW / 2, y + cardH - 10);
    });

    // 8. Power Colors Spotlight (Only in Story 9:16 format)
    if (aspectRatio === 'story') {
      const powerY = paletteStartY + rows * (cardH + cardGap) + 40;
      
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('👑 COLORES DE MÁXIMO PODER', width / 2, powerY);
      ctx.letterSpacing = '0px';

      const powerColors = season.palette.filter(p => p.type === 'power').slice(0, 3);
      const pwCols = powerColors.length || 3;
      const pwGap = 24;
      const pwTotalW = pwCols * 170 + (pwCols - 1) * pwGap;
      const pwStartX = (width - pwTotalW) / 2;

      powerColors.forEach((pColor, i) => {
        const px = pwStartX + i * (170 + pwGap);
        const py = powerY + 20;

        ctx.fillStyle = pColor.hex;
        roundRect(ctx, px, py, 170, 70, 16);
        ctx.fill();
        ctx.strokeStyle = '#FDE04790';
        ctx.lineWidth = 2;
        roundRect(ctx, px, py, 170, 70, 16);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(pColor.name, px + 85, py + 42);
      });
    }

    // 9. Footer: Call to Action & Watermark
    const footerY = height - 90;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F3F4F6';
    ctx.font = 'bold 22px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Styled By Wilma — Asesoría de Imagen & Colorimetría', width / 2, footerY);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Wilma Hernández • Concepción, Chile • 12 Estaciones', width / 2, footerY + 28);

    // Save data url for preview and sharing
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    setPreviewDataUrl(dataUrl);
    setIsGenerating(false);
  };

  // Helper function to draw rounded rectangles
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let t = text;
    while (t.length > 0 && ctx.measureText(t + '...').width > maxWidth) {
      t = t.slice(0, -1);
    }
    return t + '...';
  }

  // Action: Download image
  const handleDownloadImage = () => {
    if (!previewDataUrl) return;
    const link = document.createElement('a');
    link.download = `styled-by-wilma-${season.id}-${aspectRatio}.png`;
    link.href = previewDataUrl;
    link.click();
  };

  // Action: Direct Share via Web Share API
  const handleDirectShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `styled-by-wilma-${season.id}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Mi Estación de Color: ${season.spanishTitle}`,
            text: `¡Acabo de descubrir mi colorimetría personal con Styled By Wilma! Mi estación es ${season.spanishTitle} (${season.characteristics.undertone}). ✨ Descubre la tuya:`,
            url: window.location.origin,
            files: [file],
          });
        } else if (navigator.share) {
          // Native share without file attachment
          await navigator.share({
            title: `Mi Estación de Color: ${season.spanishTitle}`,
            text: `¡Acabo de descubrir mi colorimetría personal con Styled By Wilma! Mi estación es ${season.spanishTitle} (${season.characteristics.undertone}). ✨ Descubre la tuya:`,
            url: window.location.origin,
          });
          // Also trigger download of the card
          handleDownloadImage();
        } else {
          // Fallback to downloading
          handleDownloadImage();
        }
      }, 'image/png');
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.log('Share dismissed or not supported:', err);
        handleDownloadImage();
      }
    }
  };

  // Action: Share via WhatsApp link
  const handleWhatsAppShare = () => {
    const text = `¡Descubrí mi colorimetría personal con Styled By Wilma! ✨ Mi estación es *${season.spanishTitle}* (${season.characteristics.undertone}). Mi metal ideal es ${season.metals.best[0]} y mis colores estrella son ${season.palette.slice(0, 3).map(c => c.name).join(', ')}. Descubre tu paleta aquí: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Action: Copy caption text for Instagram
  const handleCopyCaption = () => {
    const caption = `✨ Descubrí mis colores ideales con Styled By Wilma (@styledbywilma) ✨\n\nMi estación de colorimetría es ${season.spanishTitle} (${season.characteristics.undertone}).\n\n"${season.powerQuote}"\n\n• Contraste: ${season.characteristics.contrast}\n• Metal predilecto: ${season.metals.best[0]}\n• Colores clave: ${season.palette.slice(0, 4).map(c => c.name).join(', ')}\n\n¿Ya conoces tu estación de color? Asesórate con Styled By Wilma\n\n#Colorimetria #StyledByWilma #WilmaHernandez #${season.name.replace(/\s+/g, '')} #Estilismo #PaletaDeColor #ModaYBelleza`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Compartir en Redes Sociales</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Tu Tarjeta Visual de Colorimetría
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Generada en alta resolución para Instagram Stories, WhatsApp Status o tu feed.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center justify-center gap-2 bg-stone-100 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setAspectRatio('story')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              aspectRatio === 'story' 
                ? 'bg-white text-stone-900 shadow-xs font-bold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-rose-500" />
            <span>Formato Historia / Estado (9:16)</span>
          </button>

          <button
            onClick={() => setAspectRatio('square')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              aspectRatio === 'square' 
                ? 'bg-white text-stone-900 shadow-xs font-bold' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Square className="w-4 h-4 text-purple-500" />
            <span>Formato Cuadrado (1:1)</span>
          </button>
        </div>

        {/* Visual Preview Box */}
        <div className="bg-stone-950 rounded-2xl p-4 flex items-center justify-center shadow-inner overflow-hidden max-h-[380px]">
          {previewDataUrl ? (
            <img 
              src={previewDataUrl} 
              alt="Vista previa para redes" 
              className={`rounded-xl shadow-2xl object-contain max-h-[350px] transition-all ${
                aspectRatio === 'story' ? 'aspect-9/16' : 'aspect-square'
              }`}
            />
          ) : (
            <div className="py-20 text-stone-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-rose-400" />
              <span>Generando imagen de alta resolución...</span>
            </div>
          )}
        </div>

        {/* Hidden Canvas for High-Res Generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Action: Direct Share / Native Sheet */}
            <button
              onClick={handleDirectShare}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir en Móvil (Instagram / WA)</span>
            </button>

            {/* Download PNG */}
            <button
              onClick={handleDownloadImage}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-rose-300" />
              <span>Descargar Imagen PNG (1080px)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct WhatsApp Message */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Enviar Resumen a WhatsApp</span>
            </button>

            {/* Copy Caption */}
            <button
              onClick={handleCopyCaption}
              className="w-full py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-400" />}
              <span>{copiedCaption ? '¡Texto Copiado!' : 'Copiar Texto para Caption'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
