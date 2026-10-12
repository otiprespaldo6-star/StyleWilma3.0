import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { ManualChapter, VisitRecord } from '../types';

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
