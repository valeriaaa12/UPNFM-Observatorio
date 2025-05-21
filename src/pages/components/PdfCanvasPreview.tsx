'use client';

import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  // Usa la misma versión de la API y el worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;
}

interface PdfCanvasPreviewProps {
  pdf: string;
}

export default function PdfCanvasPreview({ pdf }: PdfCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        const loadedPdf = await pdfjsLib.getDocument(pdf).promise;
        const page = await loadedPdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
        }
      } catch (error) {
        console.error('Error al cargar el PDF:', error);
      }
    };

    renderPdf();
  }, [pdf]);

  return (
    <canvas
      ref={canvasRef}
      className="card-img-top"
      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
    />
  );
}
