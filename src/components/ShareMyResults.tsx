import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AnalysisResult } from '../lib/colorAnalysis';
import { UserProfile } from '../types';
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Smartphone, 
  Square, 
  ExternalLink,
  Camera,
  Heart,
  Palette,
  CheckCircle2,
  X
} from 'lucide-react';

export interface ShareMyResultsProps {
  analysis: AnalysisResult;
  user: UserProfile | null;
  mode?: 'card' | 'modal';
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const ShareMyResults: React.FC<ShareMyResultsProps> = ({
  analysis,
  user,
  mode = 'modal',
  isOpen = true,
  onClose,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [hasWebShare, setHasWebShare] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const season = analysis.season;
  const userName = user?.firstName || user?.displayName || 'Mi';

  // Check Web Share API capability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setHasWebShare(true);
    }
  }, []);

  // Draw luxurious summary image on canvas
  const generateSummaryCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setShareError(null);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions for high-resolution retina export
    const width = 1080;
    const height = aspectRatio === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Base Gradient Background (Deep editorial luxury)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#151013');
    bgGrad.addColorStop(0.35, '#201319');
    bgGrad.addColorStop(0.7, '#181216');
    bgGrad.addColorStop(1, '#0D0A0C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Chromatic Atmospheric Glow Rings based on season's palette
    const p1 = season.palette[0]?.hex || '#E11D48';
    const p2 = season.palette[1]?.hex || '#F59E0B';
    const p3 = season.palette[2]?.hex || '#E8B4B8';

    // Top-Right Radial Aura Glow
    const glowTop = ctx.createRadialGradient(width * 0.85, height * 0.18, 60, width * 0.85, height * 0.18, 550);
    glowTop.addColorStop(0, p1 + '66');
    glowTop.addColorStop(0.6, p1 + '15');
    glowTop.addColorStop(1, '#00000000');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, width, height);

    // Bottom-Left Radial Aura Glow
    const glowBottom = ctx.createRadialGradient(width * 0.15, height * 0.78, 50, width * 0.15, height * 0.78, 520);
    glowBottom.addColorStop(0, p2 + '55');
    glowBottom.addColorStop(0.6, p3 + '15');
    glowBottom.addColorStop(1, '#00000000');
    ctx.fillStyle = glowBottom;
    ctx.fillRect(0, 0, width, height);

    // 3. Luxurious Border Frames
    ctx.strokeStyle = '#FFFFFF18';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 44);
    ctx.stroke();

    ctx.strokeStyle = p1 + '35';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, 54, 54, width - 108, height - 108, 32);
    ctx.stroke();

    // 4. Header: Brand Badge & Subtitle
    ctx.textAlign = 'center';
    const topY = aspectRatio === 'story' ? 140 : 100;

    // Header Pill Badge
    ctx.fillStyle = '#FFFFFF12';
    drawRoundedRect(ctx, width / 2 - 220, topY, 440, 42, 21);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF22';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, width / 2 - 220, topY, 440, 42, 21);
    ctx.stroke();

    ctx.fillStyle = '#F472B6';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('✨ STYLED BY WILMA • COLORIMETRÍA', width / 2, topY + 27);
    ctx.letterSpacing = '0px';

    // User greeting subhead
    const subheadY = topY + 84;
    ctx.fillStyle = '#E5E7EB';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Diagnóstico de Imagen de ${userName}`, width / 2, subheadY);

    // 5. Main Season Title (Haute-couture serif)
    const titleY = subheadY + 75;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(season.spanishTitle.toUpperCase(), width / 2, titleY);

    // Season essence quote
    const essenceY = titleY + 45;
    ctx.fillStyle = '#FBCFE8';
    ctx.font = 'italic 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`"${season.essence}"`, width / 2, essenceY);

    // 6. Characteristics Badges Bar
    const tagsY = essenceY + 50;
    const tagText = `${season.characteristics.undertone.toUpperCase()}  •  CONTRASTE ${season.characteristics.contrast.toUpperCase()}  •  ${season.metals.best[0].toUpperCase()}`;
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(tagText, width / 2, tagsY);
    ctx.letterSpacing = '0px';

    // 7. Grid of Seasonal Swatches
    const paletteStartY = tagsY + 55;
    const colorsToShow = aspectRatio === 'story' ? season.palette.slice(0, 12) : season.palette.slice(0, 8);

    const cols = 4;
    const rows = Math.ceil(colorsToShow.length / cols);
    const gridPaddingX = 85;
    const availableW = width - gridPaddingX * 2;
    const cardGap = 18;
    const cardW = (availableW - (cols - 1) * cardGap) / cols;
    const cardH = aspectRatio === 'story' ? 140 : 105;

    colorsToShow.forEach((c, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = gridPaddingX + col * (cardW + cardGap);
      const y = paletteStartY + row * (cardH + cardGap);

      // Card shadow
      ctx.fillStyle = '#00000045';
      drawRoundedRect(ctx, x + 3, y + 4, cardW, cardH, 20);
      ctx.fill();

      // Main color swatch
      ctx.fillStyle = c.hex;
      drawRoundedRect(ctx, x, y, cardW, cardH, 20);
      ctx.fill();

      // Gloss reflection on top half
      const gloss = ctx.createLinearGradient(x, y, x, y + cardH * 0.45);
      gloss.addColorStop(0, '#FFFFFF35');
      gloss.addColorStop(1, '#FFFFFF00');
      ctx.fillStyle = gloss;
      drawRoundedRect(ctx, x, y, cardW, cardH * 0.45, 20);
      ctx.fill();

      // Delicate card border
      ctx.strokeStyle = '#FFFFFF40';
      ctx.lineWidth = 1.5;
      drawRoundedRect(ctx, x, y, cardW, cardH, 20);
      ctx.stroke();

      // Chip caption container
      ctx.fillStyle = '#00000088';
      drawRoundedRect(ctx, x + 8, y + cardH - 40, cardW - 16, 32, 10);
      ctx.fill();

      // Chip color name & hex
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(truncateText(ctx, c.name, cardW - 20), x + cardW / 2, y + cardH - 22);

      ctx.fillStyle = '#E5E7EB';
      ctx.font = '500 11px monospace';
      ctx.fillText(c.hex, x + cardW / 2, y + cardH - 10);
    });

    // 8. Power Colors Spotlight (Only in Story 9:16 format)
    if (aspectRatio === 'story') {
      const powerY = paletteStartY + rows * (cardH + cardGap) + 40;

      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('👑 COLORES DE MÁXIMO PODER', width / 2, powerY);
      ctx.letterSpacing = '0px';

      const powerColors = season.palette.filter(p => p.type === 'power').slice(0, 3);
      const pwCols = powerColors.length || 3;
      const pwGap = 20;
      const pwTotalW = pwCols * 170 + (pwCols - 1) * pwGap;
      const pwStartX = (width - pwTotalW) / 2;

      powerColors.forEach((pColor, i) => {
        const px = pwStartX + i * (170 + pwGap);
        const py = powerY + 18;

        ctx.fillStyle = pColor.hex;
        drawRoundedRect(ctx, px, py, 170, 68, 16);
        ctx.fill();

        ctx.strokeStyle = '#FDE04790';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, px, py, 170, 68, 16);
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(pColor.name, px + 85, py + 40);
      });
    }

    // 9. Footer: Atelier Credit & Watermark
    const footerY = height - 90;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F3F4F6';
    ctx.font = 'bold 22px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Styled By Wilma — Asesoría de Imagen & Colorimetría', width / 2, footerY);

    ctx.fillStyle = '#9CA3AF';
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Wilma Hernández • Concepción, Chile • 12 Estaciones Maestras', width / 2, footerY + 28);

    // Convert to Blob and DataURL
    canvas.toBlob((blob) => {
      if (blob) {
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setGeneratedImageUrl(url);
      }
      setIsGenerating(false);
    }, 'image/png', 1.0);
  }, [aspectRatio, season, userName]);

  // Re-generate canvas when open, ratio, or analysis changes
  useEffect(() => {
    if (mode === 'modal' && !isOpen) return;
    generateSummaryCanvas();
  }, [mode, isOpen, aspectRatio, generateSummaryCanvas]);

  // Helper drawing functions
  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

  // Action: Web Share API Execution with Image File
  const handleShareWithWebShareAPI = async () => {
    setIsSharing(true);
    setShareError(null);
    setShareSuccess(false);

    try {
      const shareTitle = `Mi Estación de Color: ${season.spanishTitle} | Styled By Wilma`;
      const shareText = `¡Descubrí mis colores de poder con Styled By Wilma! Mi estación es ${season.spanishTitle} (${season.characteristics.undertone}, contraste ${season.characteristics.contrast}). ✨ Descubre la tuya:`;
      const shareUrl = window.location.origin;

      // 1. Prepare image file from generated canvas blob
      let fileToShare: File | null = null;
      if (imageBlob) {
        fileToShare = new File(
          [imageBlob], 
          `colorimetria-${season.id}-${aspectRatio}.png`, 
          { type: 'image/png' }
        );
      }

      // 2. Check if browser can share files via Web Share API
      if (fileToShare && navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
          files: [fileToShare],
        });
        setShareSuccess(true);
      } else if (navigator.share) {
        // Fallback: Web Share without files support
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        // Also download the image so user has it ready
        handleDownloadPNG();
        setShareSuccess(true);
      } else {
        // Web Share not supported: fallback to download + clipboard
        handleDownloadPNG();
        handleCopyShareCaption();
        setShareError('Tu navegador no soporta el menú nativo de compartir. Hemos descargado tu tarjeta visual y copiado el texto al portapapeles.');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Error en Web Share API:', err);
        setShareError('No se pudo completar el envío. Puedes descargar la imagen o enviarla por WhatsApp.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Action: Download Image
  const handleDownloadPNG = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.download = `styled-by-wilma-${season.id}-${aspectRatio}.png`;
    a.href = generatedImageUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Action: WhatsApp Direct Link
  const handleWhatsAppShare = () => {
    const text = `¡Descubrí mi colorimetría personal con Styled By Wilma! ✨\n\nMi estación es *${season.spanishTitle}* (${season.characteristics.undertone}).\nMi metal ideal es *${season.metals.best[0]}* y mis colores de poder son ${season.palette.slice(0, 3).map(c => c.name).join(', ')}.\n\nDescubre tu paleta aquí: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Action: Copy Caption for Instagram
  const handleCopyShareCaption = () => {
    const caption = `✨ Descubrí mis colores ideales con Styled By Wilma (@styledbywilma) ✨\n\nMi estación de colorimetría es ${season.spanishTitle} (${season.characteristics.undertone}).\n\n"${season.powerQuote}"\n\n• Contraste: ${season.characteristics.contrast}\n• Metal predilecto: ${season.metals.best[0]}\n• Colores clave: ${season.palette.slice(0, 4).map(c => c.name).join(', ')}\n\n¿Ya conoces tu estación de color? Asesórate con Styled By Wilma • Concepción, Chile\n\n#Colorimetria #StyledByWilma #WilmaHernandez #${season.name.replace(/\s+/g, '')} #Estilismo #PaletaDeColor #ModaYBelleza`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2200);
  };

  // Action: Copy App Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  if (mode === 'modal' && !isOpen) return null;

  // The inner content shared between modal and card layouts
  const innerContent = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Web Share & Tarjeta Visual</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Comparte tus Resultados
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Generamos automáticamente una tarjeta de alta resolución de tu estación <strong>{season.spanishTitle}</strong> para compartir en tus historias o feed.
          </p>
        </div>

        {mode === 'modal' && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Format Selector Pills (Story vs Square) */}
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

      {/* Visual Live Preview Box */}
      <div className="bg-stone-950 rounded-2xl p-4 flex items-center justify-center shadow-inner overflow-hidden max-h-[380px] relative">
        {generatedImageUrl ? (
          <img 
            src={generatedImageUrl} 
            alt={`Tarjeta de colorimetría ${season.spanishTitle}`} 
            className={`rounded-xl shadow-2xl object-contain max-h-[350px] transition-all duration-300 ${
              aspectRatio === 'story' ? 'aspect-9/16' : 'aspect-square'
            }`}
          />
        ) : (
          <div className="py-20 text-stone-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-rose-400" />
            <span>Generando tarjeta visual de colorimetría...</span>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center text-xs text-white gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-rose-400" />
            <span>Actualizando tarjeta...</span>
          </div>
        )}
      </div>

      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Feedback Messages */}
      {shareSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Resultados compartidos exitosamente!</span>
        </div>
      )}

      {shareError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{shareError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        
        {/* Main CTA: Web Share API native sheet */}
        <button
          onClick={handleShareWithWebShareAPI}
          disabled={isSharing || isGenerating}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-700 hover:via-pink-700 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          <span>
            {isSharing ? 'Preparando archivo...' : 'Compartir Resultados con Web Share API'}
          </span>
        </button>

        {/* Secondary Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Download Image */}
          <button
            onClick={handleDownloadPNG}
            className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Guardar archivo PNG en tu teléfono o computador"
          >
            <Download className="w-3.5 h-3.5 text-rose-300" />
            <span>Descargar PNG</span>
          </button>

          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Compartir mensaje por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          {/* Copy Caption */}
          <button
            onClick={handleCopyShareCaption}
            className="py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Copiar texto formateado para pie de foto en Instagram"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copiedCaption ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>

        {/* Link sharing */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
          <span>Enlace a la app: {window.location.origin}</span>
          <button
            onClick={handleCopyLink}
            className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer flex items-center gap-1"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <ExternalLink className="w-3 h-3" />}
            <span>{copiedLink ? 'Enlace copiado' : 'Copiar link'}</span>
          </button>
        </div>

      </div>

    </div>
  );

  // If used as modal
  if (mode === 'modal') {
    return (
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
        <div className={`bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-6 ${className}`}>
          {innerContent}
        </div>
      </div>
    );
  }

  // If used as inline card
  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 ${className}`}>
      {innerContent}
    </div>
  );
};
