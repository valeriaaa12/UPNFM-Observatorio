import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import {
  Modal,
  Button,
  Form,
  InputGroup,
  FormControl,
  Spinner,
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/buttons/LanguageSelector';
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Boletines() {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: boletines = [], mutate } = useSWR<BoletinData[]>(
    `${API_URL}/pdfs`,
    fetcher
  );

  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [boletinTitle, setBoletinTitle] = useState('');
  const [infoModal, setInfoModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [isReversed, setIsReversed] = useState(false);

  const etiquetaFiltro = 'Boletín';
  const { t } = useTranslation('common');
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (selected && selected.type === 'application/pdf') {
        setFile(selected);
      } else {
        alert(t('SeleccionarValido'));
      }
    },
  });

  const handleGuardarBoletin = async () => {
    if (!boletinTitle || !file || isUploading) {
      if (!boletinTitle || !file) alert(t('CompletarTitulo'));
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('nombre', boletinTitle);
    formData.append('etiqueta', etiquetaFiltro);
    formData.append('pdf', file);

    try {
      await axios.post(`${API_URL}/subirPDF`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setModalTitle(t('BoletinCreado'));
      setMessage(`${t('ElBoletin')} "${boletinTitle}" ${t('fueCreadoConExito')}`);
      setInfoModal(true);
      mutate();
    } catch (err) {
      console.error(t('ErrorBoletin2'), err);
      setModalTitle(t('ErrorBoletin'));
      setMessage(t('ErrorBoletin3'));
      setInfoModal(true);
    } finally {
      setIsUploading(false);
      setShowModal(false);
      setFile(null);
      setBoletinTitle('');
    }
  };

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const boletinesFiltrados = boletines
    .filter((b) => b.etiqueta === etiquetaFiltro)
    .filter((b) => normalize(b.nombre).includes(normalize(searchTerm)));

  const listaParaRender = isReversed
    ? boletinesFiltrados.slice().reverse()
    : boletinesFiltrados;

  const toggleReverse = () => {
    setIsReversed((prev) => !prev);
  };

  return (
    <Client>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <LanguageSelector />
          <div className="font">
            <div className="blue blueNavbar">
              <NavBar />
              <div
                className="orange d-none d-md-block"
                style={{ height: '0.5rem' }}
              />
            </div>

            <SmallNavBar />

            <div className="px-5 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2>{t('Boletines')}</h2>
                {mounted && user?.admin && (
                  <Button
                    variant="btn btn-orange"
                    onClick={() => setShowModal(true)}
                    disabled={isUploading}
                  >
                    {t('Nuevo Boletin')}
                  </Button>
                )}
              </div>

              {/* Contenedor flex para buscar + botón a la derecha */}
              <div
                className="d-flex align-items-center"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                {/* Barra de búsqueda al 50% */}
                <div style={{ width: '50%' }}>
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={t('Buscar Boletines')}
                      aria-label="Buscar boletines"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>

                {/* Se empuja a la derecha con ms-auto */}
                <div className="ms-auto">
                  <Button variant="outline-secondary" size="sm" onClick={toggleReverse}>
                    {isReversed ? t('Orden Ascendente') : t('Orden Descendente')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="card-gallery pt-0 Documentos px-5">
              {listaParaRender.length === 0 ? (
                <p className="text-center">{t('NoBoletines')}</p>
              ) : (
                listaParaRender.map((b, idx) => (
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{t('Agregar Boletín')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="boletinTitle" className="mb-3">
                    <Form.Label>{t('Título')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={boletinTitle}
                      onChange={(e) => setBoletinTitle(e.target.value)}
                      placeholder="Ej: Boletín #"
                      disabled={isUploading}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>PDF</Form.Label>
                    <div
                      {...getRootProps()}
                      className={`border rounded p-4 text-center ${
                        isDragActive ? 'bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer', minHeight: '120px' }}
                    >
                      <input {...getInputProps()} disabled={isUploading} />
                      {isDragActive ? (
                        <p>{t('Suelta el archivo aquí')}</p>
                      ) : file ? (
                        <p>{file.name}</p>
                      ) : (
                        <p>
                          {t(
                            'Arrastra y suelta un archivo PDF aquí o haz clic para seleccionarlo'
                          )}
                        </p>
                      )}
                    </div>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="btn btn-outline-blue"
                  onClick={() => setShowModal(false)}
                  disabled={isUploading}
                >
                  {t('Cerrar')}
                </Button>
                <Button
                  variant="btn btn-orange"
                  onClick={handleGuardarBoletin}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      {t('Subiendo')}
                    </>
                  ) : (
                    t('Guardar Boletín')
                  )}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <Footer />
      </div>
    </Client>
  );
}
