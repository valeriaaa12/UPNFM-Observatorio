'use client';

import { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.js'; 

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfCanvasPreviewProps {
  pdf: string;
}

export default function PdfCanvasPreview({ pdf }: PdfCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdf, disableStream: true });
        const loadedPdf = await loadingTask.promise;
        const page = await loadedPdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.8 });

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
          }

          renderTaskRef.current = page.render({ canvasContext: context, viewport });
          await renderTaskRef.current.promise;
        }
      } catch (error) {
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          (error as any).name === 'RenderingCancelledException'
        ) {
          console.log('Render cancelado');
        } else {
          console.error('Error al renderizar el PDF:', error);
        }
      }
    };

    renderPdf();

    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdf]);

  return (
    <canvas
      ref={canvasRef}
      className="card-img-top"
      style={{ width: '100%', height: 'auto', aspectRatio: '4 / 3', objectFit: 'cover' }}
    />
  );
}
