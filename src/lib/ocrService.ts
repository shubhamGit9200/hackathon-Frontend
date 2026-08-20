import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractTextFromFile(
  file: File,
  onProgress?: (progress: number, stage: string) => void
): Promise<string> {
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(file.name);
  const isText = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv');
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

  if (isText) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result || '');
      };
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  if (isImage) {
    try {
      if (onProgress) onProgress(15, 'Scanning report image via in-browser OCR...');
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            const p = Math.round(15 + m.progress * 50);
            onProgress(p, `Scanning document text... (${Math.round(m.progress * 100)}%)`);
          }
        },
      });

      return result.data.text || '';
    } catch (err) {
      console.error('Tesseract OCR error:', err);
      throw new Error('Could not read text from image. Please ensure image is clear or paste the text.');
    }
  }

  if (isPdf) {
    try {
      if (onProgress) onProgress(15, 'Reading PDF document structure...');
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        if (onProgress) onProgress(Math.round(20 + (i / numPages) * 50), `Extracting PDF page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // Group text items by Y position to reconstruct exact table lines
        const linesMap = new Map<number, string[]>();
        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const y = Math.round(item.transform[5]);
          if (!linesMap.has(y)) linesMap.set(y, []);
          linesMap.get(y)!.push(item.str);
        }

        const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
        for (const y of sortedY) {
          const lineStr = linesMap.get(y)!.join(' ').trim();
          if (lineStr) fullText += lineStr + '\n';
        }
      }

      // If PDF has no digital text (scanned PDF image), run OCR on canvas
      if (fullText.trim().length < 20) {
        if (onProgress) onProgress(40, 'PDF contains scanned images. Running OCR scan...');
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;

        const ocrResult = await Tesseract.recognize(canvas, 'eng');
        fullText = ocrResult.data.text || '';
      }

      return fullText;
    } catch (err) {
      console.error('PDF parsing error:', err);
      // Fallback
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = e.target?.result as ArrayBuffer;
          const decoder = new TextDecoder('utf-8', { fatal: false });
          const raw = decoder.decode(buffer);
          const printableMatches = raw.match(/[a-zA-Z0-9\s:,\.\(\)\-\/\%]{4,}/g);
          resolve(printableMatches && printableMatches.length > 5 ? printableMatches.join('\n') : '');
        };
        reader.onerror = () => resolve('');
        reader.readAsArrayBuffer(file);
      });
    }
  }

  return '';
}
