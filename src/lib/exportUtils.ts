import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { ManualChapter, VisitRecord, UserProfile } from '../types';
import { AnalysisResult } from './colorAnalysis';

/**
 * Helper to convert HEX to RGB for jsPDF fill
 */
function parseHexToRgb(hex: string): [number, number, number] {
  if (!hex) return [140, 140, 140];
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return [140, 140, 140];
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [isNaN(r) ? 140 : r, isNaN(g) ? 140 : g, isNaN(b) ? 140 : b];
}

/**
 * Export any array of objects to Excel .xlsx file
 */
export function exportToExcel(data: Record<string, any>[], fileName: string, sheetName: string = 'Datos') {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return false;
  }
}

/**
 * Export the complete 11-chapter application manual to PDF
 */
export function exportManualToPDF(chapters: ManualChapter[]) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 35;

    // Cover page
    doc.setFillColor(232, 180, 184); // Soft rose #E8B4B8
    doc.rect(0, 0, pageWidth, 15, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(74, 74, 74);
    doc.text('Styled By Wilma', margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(138, 138, 138);
    doc.text('Manual Oficial de la Aplicación & Guía de Asesoría de Imagen', margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.text('Wilma Hernández — Concepción, Región del Biobío, Chile | Versión 3.0 PWA', margin, y);
    y += 15;

    // Line separator
    doc.setDrawColor(212, 165, 116); // Soft gold
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Table of contents summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(74, 74, 74);
    doc.text('Índice de Capítulos', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    chapters.forEach(ch => {
      doc.text(`Capítulo ${ch.capitulo}: ${ch.titulo}`, margin + 5, y);
      y += 6;
    });

    y += 10;

    // Chapters content
    chapters.forEach(ch => {
      // Check page overflow
      if (y > 240) {
        doc.addPage();
        y = 25;
      }

      doc.setFillColor(250, 247, 242);
      doc.rect(margin - 2, y - 5, contentWidth + 4, 12, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(168, 80, 90);
      doc.text(`CAPÍTULO ${ch.capitulo} — ${ch.titulo}`, margin, y + 2);
      y += 14;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(ch.descripcion, margin, y);
      y += 8;

      ch.secciones.forEach(sec => {
        if (y > 250) {
          doc.addPage();
          y = 25;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(50, 50, 50);
        doc.text(`${sec.subseccion} ${sec.titulo}`, margin + 3, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(70, 70, 70);

        sec.contenido.forEach(paragraph => {
          const splitLines = doc.splitTextToSize(paragraph, contentWidth - 6);
          if (y + splitLines.length * 4.5 > 275) {
            doc.addPage();
            y = 25;
          }
          doc.text(splitLines, margin + 5, y);
          y += splitLines.length * 4.5 + 2;
        });

        if (sec.tips && sec.tips.length > 0) {
          sec.tips.forEach(tip => {
            const tipText = `• Tip: ${tip}`;
            const tipLines = doc.splitTextToSize(tipText, contentWidth - 10);
            if (y + tipLines.length * 4 > 275) {
              doc.addPage();
              y = 25;
            }
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(130, 90, 50);
            doc.text(tipLines, margin + 8, y);
            y += tipLines.length * 4 + 2;
          });
        }

        y += 4;
      });

      y += 6;
    });

    // Save
    doc.save('Manual-StyledByWilma-v3.0.pdf');
    return true;
  } catch (err) {
    console.error('Error generando PDF:', err);
    return false;
  }
}

/**
 * Export the complete application manual to Word (.doc formatted)
 */
export function exportManualToWord(chapters: ManualChapter[]) {
  try {
    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Manual Styled By Wilma</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #4A4A4A; line-height: 1.6; }
          h1 { color: #E8B4B8; border-bottom: 2px solid #D4A574; padding-bottom: 8px; font-size: 26pt; }
          h2 { color: #A8505A; background: #FAF7F2; padding: 6px 10px; margin-top: 24pt; font-size: 16pt; }
          h3 { color: #333333; margin-top: 14pt; font-size: 12pt; }
          p { margin: 6pt 0; font-size: 10pt; }
          .tip { color: #8A6530; font-style: italic; background: #FFFDF9; padding: 4px 8px; border-left: 3px solid #D4A574; }
          .footer { margin-top: 30pt; border-top: 1px solid #EAE5DC; font-size: 8pt; color: #8A8A8A; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Styled By Wilma — Manual Oficial</h1>
        <p><strong>Autora:</strong> Wilma Hernández &bull; Concepción, Región del Biobío, Chile</p>
        <p><strong>Versión:</strong> 3.0 PWA Multi-Edad (18 a 75+ años)</p>
        <hr/>
    `;

    chapters.forEach(ch => {
      htmlContent += `<h2>CAPÍTULO ${ch.capitulo}: ${ch.titulo}</h2>`;
      htmlContent += `<p><em>${ch.descripcion}</em></p>`;

      ch.secciones.forEach(sec => {
        htmlContent += `<h3>${sec.subseccion} ${sec.titulo}</h3>`;
        sec.contenido.forEach(p => {
          htmlContent += `<p>${p}</p>`;
        });
        if (sec.tips) {
          sec.tips.forEach(t => {
            htmlContent += `<p class="tip">Consejo de Estilista: ${t}</p>`;
          });
        }
      });
    });

    htmlContent += `
        <div class="footer">
          <p>© 2026 Styled By Wilma. Todos los derechos reservados. Desarrollado para mujeres del Gran Concepción y el mundo.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Manual-StyledByWilma-v3.0.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Error generando documento Word:', err);
    return false;
  }
}

/**
 * Export visits registry to PDF
 */
export function exportVisitsToPDF(visits: VisitRecord[]) {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(74, 74, 74);
    doc.text('Styled By Wilma — Reporte de Visitas y Audiencia', 15, y);
    y += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(138, 138, 138);
    doc.text(`Generado el ${new Date().toLocaleString()} | Total de registros exportados: ${visits.length}`, 15, y);
    y += 12;

    // Header row
    doc.setFillColor(232, 180, 184);
    doc.rect(15, y - 4, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('ID', 17, y + 1);
    doc.text('IP (Hash)', 35, y + 1);
    doc.text('País / Ciudad', 65, y + 1);
    doc.text('Página', 115, y + 1);
    doc.text('Dispositivo / OS', 155, y + 1);
    doc.text('Hora / Fecha', 205, y + 1);
    doc.text('Duración', 245, y + 1);
    doc.text('Usuario', 265, y + 1);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);

    visits.forEach(v => {
      if (y > 190) {
        doc.addPage();
        y = 20;
      }
      doc.text(v.id, 17, y);
      doc.text(v.ipHash, 35, y);
      doc.text(`${v.pais} (${v.ciudad})`, 65, y);
      doc.text(v.pagina, 115, y);
      doc.text(`${v.dispositivo} - ${v.navegador}`, 155, y);
      doc.text(`${v.horaEntrada} ${v.fecha}`, 205, y);
      doc.text(`${v.duracionSegundos}s`, 245, y);
      doc.text(v.displayName || 'Anónimo', 265, y);
      y += 6;
    });

    doc.save('Registro-Visitas-StyledByWilma.pdf');
    return true;
  } catch (err) {
    console.error('Error generando PDF de visitas:', err);
    return false;
  }
}

/**
 * Export complete color analysis dossier as a beautifully styled, downloadable PDF
 */
export function exportColorAnalysisToPDF(
  analysis: AnalysisResult,
  user?: UserProfile | null,
  options?: { customFileName?: string }
): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm
    const season = analysis.season;
    const userName = user?.displayName || user?.firstName || 'Usuaria de Atelier';
    const primaryHex = season.palette[0]?.hex || '#E11D48';
    const [themeR, themeG, themeB] = parseHexToRgb(primaryHex);

    // ═══════════════════════════════════════════════════════════════════════
    // PÁGINA 1: PORTADA & RESUMEN DE ESTACIÓN & PALETA CROMÁTICA MAESTRA
    // ═══════════════════════════════════════════════════════════════════════

    // 1. Top Atelier Brand Header Bar
    doc.setFillColor(24, 20, 22);
    doc.rect(0, 0, pageWidth, 20, 'F');

    // Decorative Gold Accent Strip
    doc.setFillColor(212, 165, 116);
    doc.rect(0, 19, pageWidth, 1.2, 'F');

    // Atelier Brandmark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(245, 235, 230);
    doc.text('STYLED BY WILMA', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(200, 190, 185);
    doc.text('ATELIER DE COLORIMETRÍA PERSONAL & ASESORÍA DE IMAGEN • CONCEPCIÓN, CHILE', margin, 15.5);

    // Document Code / Seal on top right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(212, 165, 116);
    doc.text('INFORME CROMÁTICO OFICIAL', pageWidth - margin, 11, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(170, 160, 155);
    doc.text(`CERTIFICADO #${analysis.id.slice(-6).toUpperCase()}`, pageWidth - margin, 15.5, { align: 'right' });

    let y = 26;

    // 2. Client Dossier Summary Card
    doc.setFillColor(250, 248, 246);
    doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'F');
    doc.setDrawColor(235, 225, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'S');

    // Column 1: Client Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 120, 115);
    doc.text('CLIENTE / TITULAR:', margin + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(40, 30, 35);
    doc.text(userName, margin + 4, y + 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 110, 105);
    doc.text(`Subtono detectado: ${season.characteristics.undertone}`, margin + 4, y + 18);

    // Column 2: Diagnostic Method & Date
    const col2X = margin + 70;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 120, 115);
    doc.text('MÉTODO DE DIAGNÓSTICO:', col2X, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 40, 45);
    doc.text(analysis.method === 'photo' ? 'Escaneo Facial con IA (Biometría)' : 'Cuestionario de 7 Pasos', col2X, y + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 110, 105);
    const dateFormatted = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
    doc.text(`Fecha de emisión: ${dateFormatted}`, col2X, y + 18);

    // Column 3: Confidence Score Badge
    const col3X = pageWidth - margin - 38;
    doc.setFillColor(242, 248, 244);
    doc.roundedRect(col3X, y + 3, 34, 16, 2, 2, 'F');
    doc.setDrawColor(180, 220, 195);
    doc.roundedRect(col3X, y + 3, 34, 16, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(40, 120, 70);
    doc.text('AFINIDAD CROMÁTICA', col3X + 17, y + 8, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`${Math.round(analysis.confidence * 100)}% MATCH`, col3X + 17, y + 15, { align: 'center' });

    y += 26;

    // 3. Hero Season Card
    doc.setFillColor(28, 22, 26);
    doc.roundedRect(margin, y, contentWidth, 42, 3, 3, 'F');

    // Colored accent left border
    doc.setFillColor(themeR, themeG, themeB);
    doc.roundedRect(margin, y, 4, 42, 1, 1, 'F');

    // Season Subfamily Pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(212, 165, 116);
    doc.text(`FAMILIA DE LAS 12 ESTACIONES • ${season.subfamily.toUpperCase()}`, margin + 8, y + 8);

    // Main Season Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(255, 255, 255);
    doc.text(season.spanishTitle.toUpperCase(), margin + 8, y + 16);

    // Power Quote
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(240, 210, 215);
    const quoteLines = doc.splitTextToSize(`"${season.powerQuote}"`, contentWidth - 16);
    doc.text(quoteLines, margin + 8, y + 22);

    // Essence / Description excerpt
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(210, 205, 205);
    const descLines = doc.splitTextToSize(season.description, contentWidth - 16);
    doc.text(descLines.slice(0, 2), margin + 8, y + 31);

    y += 46;

    // 4. Four Technical Dimension Indicators
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(70, 60, 65);
    doc.text('PARÁMETROS CROMÁTICOS DE TU ARMONÍA:', margin, y + 1);
    y += 4;

    const metricBoxW = (contentWidth - 6) / 4;
    const metrics = [
      { label: 'Temperatura', val: season.characteristics.undertone, sub: `${analysis.scores.warmth}% Cálido` },
      { label: 'Claridad', val: season.characteristics.value, sub: `${analysis.scores.depth}% Profundo` },
      { label: 'Saturación', val: season.characteristics.chroma, sub: `${analysis.scores.brightness}% Saturación` },
      { label: 'Contraste', val: season.characteristics.contrast, sub: `${analysis.scores.contrast}% Contraste` },
    ];

    metrics.forEach((m, idx) => {
      const bx = margin + idx * (metricBoxW + 2);
      doc.setFillColor(252, 250, 248);
      doc.roundedRect(bx, y, metricBoxW, 14, 1.5, 1.5, 'F');
      doc.setDrawColor(230, 222, 218);
      doc.setLineWidth(0.2);
      doc.roundedRect(bx, y, metricBoxW, 14, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(140, 120, 115);
      doc.text(m.label.toUpperCase(), bx + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(40, 30, 35);
      doc.text(m.val, bx + 3, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 100, 95);
      doc.text(m.sub, bx + 3, y + 12.5);
    });

    y += 18;

    // 5. Paleta Cromática Maestra (Visual Swatches with Exact Hex & Names)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 30, 35);
    doc.text('PALETA CROMÁTICA MAESTRA (MUESTRAS DE COLOR & CÓDIGOS HEX)', margin, y + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(130, 115, 110);
    doc.text('Lleva estos códigos cuando compres prendas, telas o accesorios para garantizar armonía absoluta.', margin, y + 6);
    y += 9;

    // Palette grid: 6 columns x 2 rows
    const cols = 6;
    const swatchW = (contentWidth - (cols - 1) * 3) / cols; // ~27.8mm
    const swatchH = 26; // total height per item
    const paletteItems = season.palette.slice(0, 12);

    paletteItems.forEach((swatch, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const sx = margin + col * (swatchW + 3);
      const sy = y + row * (swatchH + 2.5);

      const [sr, sg, sb] = parseHexToRgb(swatch.hex);

      // Outer container card
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(sx, sy, swatchW, swatchH, 1.8, 1.8, 'F');
      doc.setDrawColor(230, 220, 215);
      doc.setLineWidth(0.25);
      doc.roundedRect(sx, sy, swatchW, swatchH, 1.8, 1.8, 'S');

      // Top colored swatch block
      doc.setFillColor(sr, sg, sb);
      doc.roundedRect(sx + 1.2, sy + 1.2, swatchW - 2.4, 15, 1.2, 1.2, 'F');
      doc.setDrawColor(210, 200, 195);
      doc.roundedRect(sx + 1.2, sy + 1.2, swatchW - 2.4, 15, 1.2, 1.2, 'S');

      // Swatch Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(40, 30, 35);
      const truncatedName = swatch.name.length > 14 ? swatch.name.slice(0, 13) + '…' : swatch.name;
      doc.text(truncatedName, sx + swatchW / 2, sy + 19.5, { align: 'center' });

      // Hex Code
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(120, 105, 100);
      doc.text(swatch.hex.toUpperCase(), sx + swatchW / 2, sy + 23.5, { align: 'center' });
    });

    y += 2 * (swatchH + 2.5) + 3;

    // 6. Quick Rules of Season Banner
    doc.setFillColor(248, 244, 240);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
    doc.setDrawColor(230, 215, 205);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 70, 75);
    doc.text('REGLAS DE ORO PARA TU ESTACIÓN:', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(70, 60, 60);
    const rule1 = `• Contraste Personal: Tu mejor imagen surge con contraste ${season.characteristics.contrast.toLowerCase()}. Evita prendas que neutralicen tu brillo.`;
    const rule2 = `• Bases Neutras: Utiliza los tonos neutros de tu paleta como pilares para abrigos, sastrería y calzado.`;
    const rule3 = `• Color de Poder: Lleva tus colores más vibrantes cerca del rostro para resaltar tu luminosidad natural.`;
    doc.text(rule1, margin + 4, y + 10.5);
    doc.text(rule2, margin + 4, y + 15);
    doc.text(rule3, margin + 4, y + 19.5);

    // Page 1 Footer
    doc.setFillColor(212, 165, 116);
    doc.rect(margin, pageHeight - 12, contentWidth, 0.4, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 130, 125);
    doc.text('Styled By Wilma • Concepción, Región del Biobío, Chile • Atelier de Colorimetría Personal', margin, pageHeight - 7);
    doc.text('Página 1 de 2 • Conserva este informe', pageWidth - margin, pageHeight - 7, { align: 'right' });

    // ═══════════════════════════════════════════════════════════════════════
    // PÁGINA 2: GUÍA DE ESTILISMO, JOYERÍA, MAQUILLAJE & ALERTAS CROMÁTICAS
    // ═══════════════════════════════════════════════════════════════════════
    doc.addPage();

    // Page 2 Top Header
    doc.setFillColor(24, 20, 22);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setFillColor(212, 165, 116);
    doc.rect(0, 15, pageWidth, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(245, 235, 230);
    doc.text('STYLED BY WILMA — DOSSIER DE APLICACIÓN, JOYERÍA Y MAQUILLAJE', margin, 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(212, 165, 116);
    doc.text(`ESTACIÓN: ${season.spanishTitle.toUpperCase()}`, pageWidth - margin, 10.5, { align: 'right' });

    y = 22;

    // SECTION A: Joyería & Metales
    doc.setFillColor(252, 249, 245);
    doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'F');
    doc.setDrawColor(230, 220, 210);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(140, 80, 85);
    doc.text('1. JOYERÍA Y METALES IDEALES PARA TU SUBTONO', margin + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 40, 45);
    doc.text(`Metales recomendados: ${season.metals.best.join(' • ')}`, margin + 4, y + 12);
    doc.text(`Acabado óptimo: ${season.metals.finish}`, margin + 4, y + 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(90, 80, 80);
    const metalDescLines = doc.splitTextToSize(season.metals.description, contentWidth - 8);
    doc.text(metalDescLines, margin + 4, y + 22);

    y += 34;

    // SECTION B: Tocador de Maquillaje (Labios, Rubor, Ojos)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 30, 35);
    doc.text('2. GUÍA DE MAQUILLAJE Y TONOS COSMÉTICOS', margin, y + 2);
    y += 5;

    const makeupItems = season.makeup.slice(0, 3);
    const mCardW = (contentWidth - (makeupItems.length - 1) * 3) / makeupItems.length;
    const mCardH = 46;

    makeupItems.forEach((mItem, idx) => {
      const mx = margin + idx * (mCardW + 3);

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(mx, y, mCardW, mCardH, 2, 2, 'F');
      doc.setDrawColor(235, 225, 220);
      doc.setLineWidth(0.2);
      doc.roundedRect(mx, y, mCardW, mCardH, 2, 2, 'S');

      // Category Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(160, 60, 75);
      doc.text(mItem.title.toUpperCase(), mx + 3, y + 6);

      // Shades List with mini color dots
      let syOffset = y + 11;
      mItem.shades.slice(0, 3).forEach((sh) => {
        const [cr, cg, cb] = parseHexToRgb(sh.hex);
        doc.setFillColor(cr, cg, cb);
        doc.circle(mx + 5, syOffset + 1.5, 2, 'F');
        doc.setDrawColor(200, 190, 185);
        doc.circle(mx + 5, syOffset + 1.5, 2, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(40, 35, 35);
        const nameTrunc = sh.name.length > 18 ? sh.name.slice(0, 17) + '…' : sh.name;
        doc.text(nameTrunc, mx + 9, syOffset + 2.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(130, 120, 115);
        doc.text(`${sh.finish} • ${sh.hex}`, mx + 9, syOffset + 6);

        syOffset += 8;
      });

      // Makeup Tip
      doc.setFillColor(250, 246, 242);
      doc.roundedRect(mx + 2, y + 35, mCardW - 4, 9, 1, 1, 'F');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(5.5);
      doc.setTextColor(110, 85, 75);
      const tipLines = doc.splitTextToSize(`Tip: ${mItem.tip}`, mCardW - 6);
      doc.text(tipLines.slice(0, 2), mx + 3, y + 38.5);
    });

    y += mCardH + 5;

    // SECTION C: Armario Cápsula & Fórmulas de Outfits
    doc.setFillColor(248, 247, 245);
    doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'F');
    doc.setDrawColor(230, 222, 215);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 40, 45);
    doc.text('3. ARMARIO CÁPSULA Y FÓRMULAS DE COMBINACIÓN DE WILMA', margin + 4, y + 6);

    // Left Column: Capsule Essentials
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(140, 70, 80);
    doc.text('Prendas Básicas Clave:', margin + 4, y + 11);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(70, 65, 65);
    const capsuleExcerpts = season.capsuleWardrobe.slice(0, 4);
    capsuleExcerpts.forEach((item, cIdx) => {
      const truncatedItem = item.length > 55 ? item.slice(0, 53) + '…' : item;
      doc.text(`• ${truncatedItem}`, margin + 4, y + 16 + cIdx * 4.5);
    });

    // Right Column: Outfit Formula
    const outColX = margin + 94;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(140, 70, 80);
    doc.text('Fórmula de Look Recomendada:', outColX, y + 11);
    const formula = season.outfitFormulas[0] || {
      title: 'Monocromático Texturizado',
      description: 'Combina tonos de tu paleta variando texturas de tela para máxima sofisticación.'
    };
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(40, 35, 40);
    doc.text(formula.title, outColX, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(80, 75, 75);
    const formLines = doc.splitTextToSize(formula.description, contentWidth - 98);
    doc.text(formLines, outColX, y + 21);

    y += 40;

    // SECTION D: Alertas Cromáticas (Colores a Evitar)
    doc.setFillColor(254, 246, 246);
    doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');
    doc.setDrawColor(245, 215, 215);
    doc.setLineWidth(0.25);
    doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(190, 40, 60);
    doc.text('4. ALERTAS CROMÁTICAS: TONOS QUE DESFAVORECEN TU PIEL', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 70, 70);
    doc.text('Estos tonos suelen proyectar sombras o hacerte ver fatigada. Úsalos lejos del rostro o en calzado:', margin + 4, y + 10.5);

    const avoidItems = season.avoidColors.slice(0, 3);
    const aBoxW = (contentWidth - 8 - (avoidItems.length - 1) * 3) / avoidItems.length;

    avoidItems.forEach((av, aIdx) => {
      const ax = margin + 4 + aIdx * (aBoxW + 3);
      const [ar, ag, ab] = parseHexToRgb(av.hex);

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(ax, y + 13, aBoxW, 16, 1.5, 1.5, 'F');
      doc.setDrawColor(240, 220, 220);
      doc.setLineWidth(0.2);
      doc.roundedRect(ax, y + 13, aBoxW, 16, 1.5, 1.5, 'S');

      // Color badge
      doc.setFillColor(ar, ag, ab);
      doc.roundedRect(ax + 2, y + 15, 10, 12, 1, 1, 'F');
      doc.setDrawColor(210, 190, 190);
      doc.roundedRect(ax + 2, y + 15, 10, 12, 1, 1, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(160, 40, 50);
      doc.text(av.name, ax + 14, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(110, 80, 80);
      const reasonLines = doc.splitTextToSize(av.reason, aBoxW - 16);
      doc.text(reasonLines.slice(0, 2), ax + 14, y + 22);
    });

    y += 36;

    // SECTION E: Sello de Validación del Atelier Concepción
    doc.setFillColor(25, 20, 24);
    doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');

    doc.setFillColor(212, 165, 116);
    doc.rect(margin, y, 3, 25, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(245, 225, 210);
    doc.text('CERTIFICACIÓN DE COLORIMETRÍA PERSONAL — ATELIER CONCEPCIÓN', margin + 6, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(210, 195, 190);
    doc.text('Diagnóstico emitido bajo el protocolo de las 12 estaciones de Styled By Wilma.', margin + 6, y + 12);
    doc.text('Wilma Hernández • Asesora de Imagen & Consultora Cromática • Concepción, Región del Biobío, Chile', margin + 6, y + 16.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(212, 165, 116);
    doc.text('www.styledbywilma.com • Documento Válido para Asesoría & Compras', margin + 6, y + 21);

    // Page 2 Footer
    doc.setFillColor(212, 165, 116);
    doc.rect(margin, pageHeight - 12, contentWidth, 0.4, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 130, 125);
    doc.text('Styled By Wilma • Concepción, Región del Biobío, Chile • Atelier de Colorimetría Personal', margin, pageHeight - 7);
    doc.text('Página 2 de 2 • Fin del Dossier Oficial', pageWidth - margin, pageHeight - 7, { align: 'right' });

    // Download PDF
    const cleanSeasonName = season.spanishTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = options?.customFileName || `Styled_By_Wilma_Analisis_${cleanSeasonName}.pdf`;
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generando PDF de colorimetría:', error);
    return false;
  }
}

