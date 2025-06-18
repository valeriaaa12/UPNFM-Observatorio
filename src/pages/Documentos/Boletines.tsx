import { useState, useEffect } from 'react';
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Boletines() {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const { t } = useTranslation('common');
  const { user } = useUser();
  const { data: boletines = [], mutate } = useSWR<BoletinData[]>(
    `${API_URL}/pdfs`,
    fetcher
  );

  const [showModal, setShowModal]       = useState(false);
  const [file, setFile]                 = useState<File | null>(null);
  const [boletinTitle, setBoletinTitle] = useState('');
  const [editingId, setEditingId]       = useState<string | null>(null);

  const [infoModal, setInfoModal]       = useState(false);
  const [modalTitle, setModalTitle]     = useState('');
  const [message, setMessage]           = useState('');

  const [searchTerm, setSearchTerm]     = useState('');
  const [isUploading, setIsUploading]   = useState(false);
  const [isReversed, setIsReversed]     = useState(false);

  const etiquetaFiltro = 'Boletín';

  useEffect(() => {
    // nada especial
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: false,
    onDrop: acceptedFiles => {
      const sel = acceptedFiles[0];
      if (sel && sel.type === 'application/pdf') {
        setFile(sel);
      } else {
        alert(t('SeleccionarValido'));
      }
    },
  });

  const normalize = (str: string) =>
    str.toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '');

  const boletinesFiltrados = boletines
    .filter(b => b.etiqueta === etiquetaFiltro)
    .filter(b => normalize(b.nombre).includes(normalize(searchTerm)));

  const listaParaRender = isReversed
    ? boletinesFiltrados.slice().reverse()
    : boletinesFiltrados;

  const openNewModal = () => {
    setEditingId(null);
    setBoletinTitle('');
    setFile(null);
    setShowModal(true);
  };

  const openEditModal = (b: BoletinData) => {
    setEditingId(b.id);
    setBoletinTitle(b.nombre);
    setFile(null);
    setShowModal(true);
  };

  const handleGuardarBoletin = async () => {
    // Validamos que el título no esté vacío ni solo espacios
    if (!boletinTitle.trim() || !file) {
      alert(t('CompletarTitulo'));
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('nombre', boletinTitle.trim());
    formData.append('etiqueta', etiquetaFiltro);
    formData.append('pdf', file!);

    try {
      if (editingId) {
        // editar existente
        await axios.put(
          `${API_URL}/pdfs/${editingId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setModalTitle(t('BoletinActualizado'));
        setMessage(t('BoletinActualizadoConExito'));
      } else {
        // crear nuevo
        await axios.post(
          `${API_URL}/subirPDF`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setModalTitle(t('BoletinCreado'));
        setMessage(`${t('ElBoletin')} "${boletinTitle.trim()}" ${t('fueCreadoConExito')}`);
      }

      setInfoModal(true);
      await mutate();            // refresca lista SWR
    } catch (err) {
      console.error(err);
      if (editingId) {
        setModalTitle(t('ErrorActualizar'));
        setMessage(t('ErrorActualizarTexto'));
      } else {
        setModalTitle(t('ErrorBoletin'));
        setMessage(t('ErrorBoletin3'));
      }
      setInfoModal(true);
    } finally {
      setIsUploading(false);
      setShowModal(false);
      setFile(null);
      setBoletinTitle('');
      setEditingId(null);
    }
  };

  return (
    <Client>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <LanguageSelector />
          <div className="font">
            <div className="blue blueNavbar">
              <NavBar />
              <div className="orange d-none d-md-block" style={{ height: '0.5rem' }} />
            </div>
            <SmallNavBar />

            <div className="px-5 py-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2>{t('Boletines')}</h2>
                {user?.admin && (
                  <Button
                    variant="btn btn-orange"
                    onClick={openNewModal}
                    disabled={isUploading}
                  >
                    {t('Nuevo Boletin')}
                  </Button>
                )}
              </div>

              <div className="d-flex align-items-center" style={{ marginTop: '1rem', width: '100%' }}>
                <div style={{ width: '50%' }}>
                  <InputGroup size="sm">
                    <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
                    <FormControl
                      placeholder={t('Buscar Boletines')}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="ms-auto">
                  <Button variant="outline-secondary" size="sm" onClick={() => setIsReversed(r => !r)}>
                    {isReversed ? t('Mas Reciente') : t('Mas Antiguo')}
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
                    onEdit={() => openEditModal(b)}
                  />
                ))
              )}
            </div>

            {/* Modal de crear / editar */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  {editingId ? t('EditarBoletin') : t('AgregarBoletin')}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="boletinTitle" className="mb-3">
                    <Form.Label>{t('Título')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={boletinTitle}
                      onChange={e => setBoletinTitle(e.target.value)}
                      placeholder="Ej: Boletín #"
                      disabled={isUploading}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>PDF</Form.Label>
                    <div
                      {...getRootProps()}
                      className={`border rounded p-4 text-center ${isDragActive ? 'bg-light' : ''}`}
                      style={{ cursor: 'pointer', minHeight: '120px' }}
                    >
                      <input {...getInputProps()} disabled={isUploading} />
                      {isDragActive
                        ? <p>{t('Suelta el archivo aquí')}</p>
                        : file
                          ? <p>{file.name}</p>
                          : <p>{t('Arrastra y suelta un archivo PDF aquí o haz clic para seleccionarlo')}</p>
                      }
                    </div>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="btn btn-outline-blue" onClick={() => setShowModal(false)} disabled={isUploading}>
                  {t('Cerrar')}
                </Button>
                <Button variant="btn btn-orange" onClick={handleGuardarBoletin} disabled={isUploading}>
                  {isUploading
                    ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    : editingId ? t('Actualizar') : t('Guardar Boletín')
                  }
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal informativo */}
            <InfoModal
              show={infoModal}
              onHide={() => setInfoModal(false)}
              title={modalTitle}
              message={message}
            />

          </div>
        </div>
        <Footer />
      </div>
    </Client>
  );
}
