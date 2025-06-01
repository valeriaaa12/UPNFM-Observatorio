import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import MessageModal from '@/modals/modal';

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

export default function Card({ id, title, pdf, mutateList, index, etiqueta }: BoletinProps) {
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [titleM, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleConfirmDelete = () => {
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_URL}/eliminarPDF/${id}`, { method: 'DELETE' });

      setShowConfirmModal(false);
      setTitle('¡Éxito!');
      setMessage('Se ha eliminado el boletín con éxito.');
      setShowModal(true);

      mutateList();
    } catch (error) {
      setShowConfirmModal(false);
      setTitle('¡Error!');
      setMessage('Ocurrió un problema al eliminar el boletín.');
      setShowModal(true);
      setDeleting(false);
    } finally {
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
    <>
      <div className="card mb-2 hover-effect" style={{ width: '100%' }}>
        <PdfCanvasPreview pdf={pdf} />
        <div className="card-body">
          <p className="text-secondary mb-1">{etiqueta} {index}</p>
          <h5 className="card-title">{title}</h5>
          <div className="d-flex gap-2 align-items-center">
            <a href={pdf} target="_blank" rel="noopener noreferrer" className="btn btn-orange btn-small">
              Ver PDF
            </a>
            <button type="button" onClick={handleDownload} className="btn btn-outline-blue btn-small">
              Descargar PDF
            </button>
            <Button className="ms-auto btn-rojo btn-small" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Borrando...' : 'Borrar Boletín'}
            </Button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <MessageModal
          title="Confirmación de Eliminación"
          message="¿Está seguro de que desea eliminar el boletín?"
          show={showConfirmModal}
          onHide={() => setShowConfirmModal(false)}
          footer={
            <>
              <button className="btn btn-outline-blue" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-rojo"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Confirmar'}
              </button>
            </>
          }
        />
      )}

      {showModal && <MessageModal title={titleM} message={message} show={showModal} onHide={() => setShowModal(false)} />}
    </>
  );
}

