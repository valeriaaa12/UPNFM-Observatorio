import { useState } from 'react';
import useSWR from 'swr';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/buttons/LanguageSelector";
import Card from '@/cards/Documento';
import Footer from '@/sections/footer';
import NavBar from '@/navigation/NavBar';
import SmallNavBar from '@/navigation/SmallNavBar';
import InfoModal from '@/modals/modal';
import Client from '@/components/client';
import { useUser } from '@/context/usertype';

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
  const etiquetaFiltro = 'Boletín';
  const { t } = useTranslation("common");
  const { user } = useUser();
  console.log('🚦 user en Boletines:', user);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: false,
    onDrop: acceptedFiles => {
      const selected = acceptedFiles[0];
      if (selected && selected.type === 'application/pdf') setFile(selected);
      else alert(t("SeleccionarValido"));
    }
  });

  const handleGuardarBoletin = async () => {
    if (!boletinTitle || !file) {
      alert(t("CompletarTitulo"));
      return;
    }
    const formData = new FormData();
    formData.append(t("Nombre"), boletinTitle);
    formData.append(t("Etiqueta"), etiquetaFiltro);
    formData.append("PDF", file);

    try {
      await axios.post(`${API_URL}/subirPDF`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModalTitle(t("BoletinCreado"));
      setMessage(t("ElBoletin") + ` "${boletinTitle}" ` + t("fueCreadoConExito"));
      setInfoModal(true);
      mutate();
    } catch (err) {
      console.error(t("ErrorBoletin2"), err);
      setModalTitle(t("ErrorBoletin"));
      setMessage(t("ErrorBoletin3"));
      setInfoModal(true);
    } finally {
      setShowModal(false);
      setFile(null);
      setBoletinTitle('');
    }
  };

  return (
    <Client>
      <>
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
                <h2>{t("Boletines")}</h2>
                {user?.admin && (
                  <Button variant="btn btn-orange" onClick={() => setShowModal(true)}>
                    {t("Nuevo Boletin")}
                  </Button>
                )}

              </div>
              <div className="card-gallery pt-0 Documentos">
                {boletines.filter(b => b.etiqueta === etiquetaFiltro).length === 0 ? (
                  <p>{t("NoBoletines")}</p>
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
              <Client>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{t("Agregar Boletín")}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="boletinTitle" className="mb-3">
                        <Form.Label>{t("Titulo")}</Form.Label>
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
                            <p>{t("Suelta el archivo aqui")}</p>
                          ) : file ? (
                            <p>{file.name}</p>
                          ) : (
                            <p>{t("Arrastrar y soltar un archivo PDF aquí o hacer clic para seleccionarlo")}</p>
                          )}
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="btn btn-outline-blue" onClick={() => setShowModal(false)}>
                      {t("Cerrar")}
                    </Button>
                    <Button variant="btn btn-orange" onClick={handleGuardarBoletin}>
                      {t("Guardar Boletin")}
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{t("Agregar Boletín")}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="boletinTitle" className="mb-3">
                        <Form.Label>{t("Titulo")}</Form.Label>
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
                            <p>{t("Suelta el archivo aqui")}</p>
                          ) : file ? (
                            <p>{file.name}</p>
                          ) : (
                            <p>{t("Arrastrar y soltar un archivo PDF aquí o hacer clic para seleccionarlo")}</p>
                          )}
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="btn outline-blue" onClick={() => setShowModal(false)}>
                      {t("Cerrar")}
                    </Button>
                    <Button variant="btn orange text-white" onClick={handleGuardarBoletin}>
                      {t("Guardar Boletin")}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Client >
            </div>
          </div>
          <Footer />
        </div>
      </>
    </Client>
  );
}