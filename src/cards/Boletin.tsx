import dynamic from 'next/dynamic';
import Button from 'react-bootstrap/Button';

const PdfCanvasPreview = dynamic(() => import("@/pages/cards/PdfCanvasPreview"), {
  ssr: false,
});

interface Boletin {
  title: string;
  pdf: string;
}

export default function Card({ title, pdf }: Boletin) {
  return (
    <div className="card mb-2" style={{ width: '28rem' }}>
      <PdfCanvasPreview pdf={pdf} />

      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="d-flex gap-2">
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn orange text-white"
          >
            Ver PDF
          </a>
          <a href={pdf} download className="btn btn-outline-dark">
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  ); 
}
