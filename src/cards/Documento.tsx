import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import MessageModal from '@/modals/modal';
import { useUser } from '@/context/usertype';
import { useDropzone } from 'react-dropzone';

const PdfCanvasPreview = dynamic(
  () => import('@/cards/PdfCanvasPreview'),
  { ssr: false }
);

interface BoletinProps {
  id: string;
  etiqueta: string;
  title: string;
  pdf: string;
  mutateList: () => void;
  index: number;
  onEdit?: () => void;
}

export default function Card({
  id,
  title,
  pdf,
  mutateList,
  index,
  etiqueta,
  onEdit,
}: BoletinProps) {
  const { user } = useUser();
  const [deleting, setDeleting] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // estados de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleOpenEdit = () => {
    setNewTitle(title);
    setNewFile(null);
    setShowEditModal(true);
  };

  const onDropEdit = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type !== 'application/pdf') {
        alert(t("Solo se permiten archivos PDF."));
        return;
      }
      setNewFile(file);
    }
  }, [t]);

  const {
    getRootProps: getEditRootProps,
    getInputProps: getEditInputProps,
    isDragActive: isEditDragActive,
  } = useDropzone({
    onDrop: onDropEdit,
    accept: { 'application/pdf': [] },
    multiple: false,
  });

  // --- VALIDACIÓN AL CREAR BOLETÍN ---
  const handleGuardarBoletin = async () => {
    // uso title en creación
    if (!newTitle.trim()) {
      alert(t("El título no puede estar vacío."));
      return;
    }
    if (!newFile) {
      alert(t("Debe seleccionar un PDF."));
      return;
    }
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append('nombre', newTitle.trim());
      formData.append('etiqueta', etiqueta);
      formData.append('pdf', newFile);
      await fetch(`${API_URL}/subirPDF`, {
        method: 'POST',
        body: formData,
      });
      setShowEditModal(false);
      setInfoTitle('¡Éxito!');
      setInfoMessage(`Se ha creado ${etiqueta} con éxito.`);
      setShowInfoModal(true);
      mutateList();
    } catch (err) {
      console.error('Error al crear:', err);
      setShowEditModal(false);
      setInfoTitle('¡Error!');
      setInfoMessage(`Ocurrió un problema al crear ${etiqueta}.`);
      setShowInfoModal(true);
    } finally {
      setIsEditing(false);
    }
  };

  // --- VALIDACIÓN AL EDITAR BOLETÍN ---
  const handleEdit = async () => {
  // 1) Si NO cambiaste título Y NO subiste PDF, no haces nada
  if (newTitle.trim() === title.trim() && !newFile) {
    return alert(t("Debe cambiar el título o seleccionar un PDF para editar."));
  }
  // 2) Si cambiaste título pero quedó vacío
  if (!newTitle.trim()) {
    return alert(t("El título no puede quedar vacío."));
  }

  setIsEditing(true);
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', newTitle.trim());
    if (newFile) {
      formData.append('pdf', newFile);
    }
    
    await fetch(`${API_URL}/editarPDF/${id}`, {
      method: 'PUT',
      body: formData,
    });

    setShowEditModal(false);
    setInfoTitle('¡Éxito!');
    setInfoMessage(`Se ha modificado ${etiqueta} con éxito.`);
    setShowInfoModal(true);
    mutateList();  // re-carga la lista
  } catch (err) {
    console.error('Error al editar:', err);
    setShowEditModal(false);
    setInfoTitle('¡Error!');
    setInfoMessage(`Ocurrió un problema al editar ${etiqueta}.`);
    setShowInfoModal(true);
  } finally {
    setIsEditing(false);
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
              {t("Ver PDF")}
            </a>
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-outline-blue btn-small"
            >
              {t("Descargar PDF")}
            </button>
            {user?.admin && (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-small"
                  onClick={handleOpenEdit}
                  disabled={isEditing}
                  title={t("Editar boletín")}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-rojo btn-small ms-1"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  title={t("Eliminar boletín")}
                >
                  {deleting ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    <i className="bi bi-trash"></i>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Confirmación de eliminación */}
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
            variant="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? t("Eliminando…") : t("Confirmar")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de crear/editar */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {newFile ? t("Editar Boletín") : t("Editar Boletín")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editTitle" className="mb-3">
              <Form.Label>{t("Título")}</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group controlId="editPdf" className="mb-3">
              <Form.Label>{t("PDF")}</Form.Label>
              <div
                {...getEditRootProps()}
                className={`border rounded p-4 text-center ${
                  isEditDragActive ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer', minHeight: '120px' }}
              >
                <input {...getEditInputProps()} disabled={isEditing} />
                {isEditDragActive ? (
                  <p>{t("Suelta el archivo aquí…")}</p>
                ) : newFile ? (
                  <p><strong>{newFile.name}</strong></p>
                ) : (
                  <p>{t("Arrastra un PDF aquí o haz clic para seleccionarlo")}</p>
                )}
              </div>
              <Form.Text className="text-muted">
                {t("Solo se permiten archivos PDF. Dejar en blanco para mantener el actual.")}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-outline-blue"
            onClick={() => setShowEditModal(false)}
            disabled={isEditing}
          >
            {t("Cancelar")}
          </Button>
          <Button
            variant="btn btn-orange"
            onClick={handleEdit}
            disabled={isEditing}
          >
            {isEditing
              ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{' '}
                  {t("Guardando…")}
                </>
              )
              : t("Guardar Cambios")
            }
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
