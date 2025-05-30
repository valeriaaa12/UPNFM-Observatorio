import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

// Ajusta la ruta según tu estructura de carpetas
const PdfCanvasPreview = dynamic(() => import("@/cards/PdfCanvasPreview"), {
  ssr: false,
});

interface Boletin {
  title: string;
  pdf: string;
}

export default function Card({ title, pdf }: Boletin) {
  const { t } = useTranslation('common');

  return (
    <div className="card mb-2 hover-effect" style={{ width: '100%', height: 'auto' }}>
      <PdfCanvasPreview pdf={pdf} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="d-flex flex-wrap gap-2">
          <a
            href={pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn orange text-white"
          >
            {t("Ver PDF")}
          </a>
          <a href={pdf} download className="btn btn-outline-dark">
            {t("Descargar PDF")}
          </a>
        </div>
      </div>
    </div>
  );
}

