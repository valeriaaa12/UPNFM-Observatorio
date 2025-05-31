import { useState } from 'react';
import useSWR from 'swr';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/buttons/LanguageSelector";

import Card from '@/cards/Boletin';
import Footer from '@/sections/footer';
import NavBar from '@/navigation/NavBar';
import SmallNavBar from '@/navigation/SmallNavBar';
import InfoModal from '@/modals/modal';

interface BoletinData {
  id: string;
  nombre: string;
  etiqueta: string;
  fecha: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Boletines() {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: boletines = [], mutate } = useSWR<BoletinData[]>(`${API_URL}/pdfs`, fetcher);

  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [boletinTitle, setBoletinTitle] = useState('');
  const [infoModal, setInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [message, setMessage] = useState('');
  const etiquetaFiltro = 'Boletin';
  const { t } = useTranslation("common");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: false,
    onDrop: acceptedFiles => {
      const selected = acceptedFiles[0];
      if (selected && selected.type === 'application/pdf') setFile(selected);
      else alert('Por favor selecciona un archivo PDF válido.');
    }
  });

  const handleGuardarBoletin = async () => {
    if (!boletinTitle || !file) {
      alert('Completa título y selecciona un PDF.');
      return;
    }
    const formData = new FormData();
    formData.append('nombre', boletinTitle);
    formData.append('etiqueta', etiquetaFiltro);
    formData.append('pdf', file);

    try {
      await axios.post(`${API_URL}/subirPDF`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModalTitle('Boletín creado');
      setMessage(`El boletín "${boletinTitle}" se creó con éxito.`);
      setInfoModal(true);
      mutate();
    } catch (err) {
      console.error('Error creando boletín:', err);
      setModalTitle('Error al crear boletín');
      setMessage('No se pudo crear el boletín. Inténtalo de nuevo.');
      setInfoModal(true);
    } finally {
      setShowModal(false);
      setFile(null);
      setBoletinTitle('');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <LanguageSelector />
        <div className="font">
          <div className="blue blueNavbar">
            <NavBar />
            <div className="orange d-none d-md-block" style={{ height: '0.5rem' }} />
          </div>

          <SmallNavBar />
          <div className="d-flex justify-content-between align-items-center px-5 py-4">
            <h2>Boletines</h2>
            <Button variant="btn orange" onClick={() => setShowModal(true)}>
              Nuevo Boletín
            </Button>
          </div>
          <div className="card-gallery pt-0 Boletines">
            {boletines.filter(b => b.etiqueta === etiquetaFiltro).length === 0 ? (
              <p className="w-100 text-center">No hay boletines disponibles.</p>
            ) : (
              boletines
                .filter(b => b.etiqueta === etiquetaFiltro)
                .map((b, idx) => (
                  <Card
                    key={b.id}
                    id={b.id}
                    etiqueta={b.etiqueta}
                    index={idx + 1}
                    title={b.nombre}
                    pdf={`${API_URL}/traerPDF/${b.id}`}
                    mutateList={mutate}
                  />
                ))
            )}
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t("Agregar Boletín")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="boletinTitle" className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={boletinTitle}
                  onChange={e => setBoletinTitle(e.target.value)}
                  placeholder="Ej: Boletín #"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>PDF</Form.Label>
                <div
                  {...getRootProps()}
                  className={`border rounded p-4 text-center ${isDragActive ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer', minHeight: '120px' }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Suelta aquí...</p>
                  ) : file ? (
                    <p>{file.name}</p>
                  ) : (
                    <p>Arrastra o haz clic para seleccionar un PDF</p>
                  )}
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="btn outline-blue" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
            <Button variant="btn orange" onClick={handleGuardarBoletin}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Footer />
      {infoModal && <InfoModal title={modalTitle} message={message} />}
    </div>
  );
}