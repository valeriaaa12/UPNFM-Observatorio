import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import MessageModal from '@/modals/modal';
import { useUser } from '@/context/usertype';
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

export default function Card({
  id,
  title,
  pdf,
  mutateList,
  index,
  etiqueta,
}: BoletinProps) {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { t } = useTranslation("common");

  const handleConfirmDelete = () => {
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`${API_URL}/eliminarPDF/${id}`, { method: 'DELETE' });

      setShowConfirmModal(false);
      setInfoTitle('¡Éxito!');
      setInfoMessage(`Se ha eliminado ${etiqueta} con éxito.`);
      setShowInfoModal(true);

      mutateList();
    } catch (error) {
      setShowConfirmModal(false);
      setInfoTitle('¡Error!');
      setInfoMessage(`Ocurrió un problema al eliminar ${etiqueta}.`);
      setShowInfoModal(true);
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
          <p className="text-secondary mb-1">
            {etiqueta} {index}
          </p>
          <h5 className="card-title">{title}</h5>
          <div className="d-flex gap-2 align-items-center">
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-orange btn-small"
            >
              Ver PDF
            </a>
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-outline-blue btn-small"
            >
              Descargar PDF
            </button>
            {user?.admin &&
              <Button
                className="ms-auto btn-rojo btn-small"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Borrando...' : 'Eliminar'}
              </Button>}
          </div>
        </div>
      </div>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Confirmación de Eliminación")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t("¿Está seguro de que desea eliminar este boletín?")}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-outline-blue"
            onClick={() => setShowConfirmModal(false)}
          >
            {t("Cancelar")}
          </Button>

          <Button
            variant="btn btn-rojo"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? t("Eliminando…") : t("Confirmar")}
          </Button>
        </Modal.Footer>
      </Modal>

      {showInfoModal && (
        <MessageModal
          title={infoTitle}
          message={infoMessage}
          show={showInfoModal}
          onHide={() => setShowInfoModal(false)}
        />
      )}
    </>
  );
}
