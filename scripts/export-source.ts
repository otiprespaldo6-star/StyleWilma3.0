import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.aistudio',
  '.vite',
  'coverage',
  '.cache'
]);

const IGNORED_FILES = new Set([
  '.DS_Store',
  'npm-debug.log',
  'yarn-error.log',
  'styled-by-wilma-source.zip'
]);

async function addDirectoryToZip(zip: JSZip, currentDir: string, relativePath: string = '') {
  const items = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      if (IGNORED_DIRS.has(item.name)) continue;
      const folderZip = zip.folder(item.name);
      if (folderZip) {
        await addDirectoryToZip(folderZip, path.join(currentDir, item.name), path.join(relativePath, item.name));
      }
    } else {
      if (IGNORED_FILES.has(item.name)) continue;
      if (item.name.endsWith('.zip')) continue;

      const filePath = path.join(currentDir, item.name);
      const fileData = fs.readFileSync(filePath);
      zip.file(item.name, fileData);
    }
  }
}

export async function generateSourceZipBuffer(): Promise<Buffer> {
  const zip = new JSZip();
  await addDirectoryToZip(zip, rootDir);
  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
  return buffer;
}

async function main() {
  console.log('📦 Generando paquete ZIP del monorepo (excluyendo node_modules)...');
  const buffer = await generateSourceZipBuffer();
  const outputPath = path.join(rootDir, 'styled-by-wilma-source.zip');
  fs.writeFileSync(outputPath, buffer);
  const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
  console.log(`✅ Archivo ZIP generado exitosamente en: ${outputPath} (${sizeMB} MB)`);
}

// If executed directly from command line (npm run export:source)
if (process.argv[1] && process.argv[1].endsWith('export-source.ts')) {
  main().catch((err) => {
    console.error('❌ Error generando exportación de código fuente:', err);
    process.exit(1);
  });
}
