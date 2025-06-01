import dynamic from 'next/dynamic';
import {useTranslation} from 'react-i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';

// Ajusta la ruta según tu estructura de carpetas
const PdfCanvasPreview = dynamic(() => import("@/cards/PdfCanvasPreview"), {
  ssr: false,
});

interface BoletinProps {
  id: string;
  etiqueta: string;
  title: string;
  pdf: string;
  mutateList: () => void;
  index: number;
}

export default function Card({ id, title, pdf, mutateList, index }: BoletinProps) {
  const [deleting, setDeleting] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de borrar este boletín?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/eliminarPDF/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      mutateList();
    } catch (error) {
      console.error('Error borrando boletín:', error);
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(pdf);
      if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('No se pudo descargar el PDF.');
    }
  };

  return (
    <div className="card mb-2 hover-effect" style={{ width: '100%' }}>
      <PdfCanvasPreview pdf={pdf} />
      <div className="card-body">
        <p className="text-secondary mb-1">Boletín {index}</p>
        <h5 className="card-title">{title}</h5>
        <div className="d-flex gap-2 align-items-center">
          <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn orange text-white">
            Ver PDF
          </a>
          <button type="button" onClick={handleDownload} className="btn btn-outline-dark">
            Descargar PDF
          </button>
          <Button className="ms-auto btn-rojo" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Borrando...' : 'Borrar boletín'}
          </Button>
        </div>
      </div>
    </div>
  );
}

