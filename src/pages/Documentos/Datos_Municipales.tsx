{/*import { useState, useEffect } from 'react';
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
import Client from '@/components/client';
import Card from '@/cards/Documento';
import Footer from '@/sections/footer';
import NavBar from '@/navigation/NavBar';
import SmallNavBar from '@/navigation/SmallNavBar';
import InfoModal from '@/modals/modal';
import { useUser } from '@/context/usertype';

interface BoletinData {
  id: string;
  nombre: string;
  etiqueta: string;
  fecha: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Datos_Municipales() {
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

  const etiquetaFiltro = 'Datos Municipales';
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
      if (!boletinTitle || !file) alert(t('CompletarBoletin'));
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
      setMessage(
        `${t('DatoMunicipal')} "${boletinTitle}" ${t('fueCreadoConExito')}`
      );
      setInfoModal(true);
      mutate();
    } catch (err) {
      console.error(t('Error1'), err);
      setModalTitle(t('Error2'));
      setMessage(t('Error3'));
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

  const datosFiltrados = boletines
    .filter((b) => b.etiqueta === etiquetaFiltro)
    .filter((b) => normalize(b.nombre).includes(normalize(searchTerm)));

  const listaParaRender = isReversed
    ? datosFiltrados.slice().reverse()
    : datosFiltrados;

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
                <h2>{t('DatosMunicipales')}</h2>
                {mounted && user?.admin && (
                  <Button
                    variant="btn btn-orange"
                    onClick={() => setShowModal(true)}
                    disabled={isUploading}
                  >
                    {t('AgregarDatoMunicipal')}
                  </Button>
                )}
              </div>

              <div
                className="d-flex align-items-center"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                <div style={{ width: '50%' }}>
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <FormControl
                      placeholder={t('Buscar Datos Municipales')}
                      aria-label="Buscar datos municipales"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </div>

                <div className="ms-auto">
                  <Button variant="outline-secondary" size="sm" onClick={toggleReverse}>
                    {isReversed ? t('Orden Ascendente') : t('Orden Descendente')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="card-gallery pt-0 Documentos px-5">
              {listaParaRender.length === 0 ? (
                <p className="text-center">{t('NoDatosMunicipales')}</p>
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
                <Modal.Title>{t('AgregarDatoMunicipal')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="boletinTitle" className="mb-3">
                    <Form.Label>{t('Titulo')}</Form.Label>
                    <Form.Control
                      type="text"
                      value={boletinTitle}
                      onChange={(e) => setBoletinTitle(e.target.value)}
                      placeholder="Ej: Dato Municipal"
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
                        <p>{t('Suelta el archivo aqui')}</p>
                      ) : file ? (
                        <p>{file.name}</p>
                      ) : (
                        <p>
                          {t(
                            'Arrastrar y soltar un archivo PDF aquí o hacer clic para seleccionarlo'
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
                    t('Guardar')
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
}*/}
import React, { useState, useRef } from 'react';
import useSWR from 'swr';
import LanguageSelector from '@/buttons/LanguageSelector';
import NavBar from '@/navigation/NavBar';
import SmallNavBar from '@/navigation/SmallNavBar';
import Footer from '@/sections/footer';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface DataItem {
  Departamento: string;
  Municipio: string;
  [year: string]: string | undefined;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TablasTasas() {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const levelOptions = [
    'Básica I Ciclo',
    'Básica II Ciclo',
    'Básica I-II Ciclo',
    'Básica III Ciclo',
    'Básica I-II-III Ciclo',
    'Media',
    'Pre-básica',
  ] as const;
  type LevelOption = typeof levelOptions[number];

  const metricOptions = [
    { label: 'Tasa de Deserción',      path: 'desercionMunicipios' },
    { label: 'Tasa de Repitencia',     path: 'repitenciaMunicipios' },
    { label: 'Tasa de Aprobación',     path: 'aprobacionMunicipios' },
    { label: 'Tasa de Reprobación',    path: 'reprobacionMunicipios' },
    { label: 'Tasa Bruta de Matrícula', path: 'tasabrutaMunicipios' },
    { label: 'Tasa Neta de Matrícula',  path: 'tasaNetaMunicipios' },
  ] as const;
  type MetricOption = typeof metricOptions[number];

  const [selectedLevel,  setSelectedLevel]  = useState<LevelOption>(levelOptions[0]);
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(metricOptions[0]);
  const [searchTerm,     setSearchTerm]     = useState('');

  const { data = [], error } = useSWR<DataItem[]>(
    `${API_URL}/${selectedMetric.path}?nivel=${encodeURIComponent(selectedLevel)}`,
    fetcher
  );

  // para imprimir / exportar
  const tableRef = useRef<HTMLTableElement>(null);

  // 1) Imprimir tabla
  const handlePrint = () => {
    if (!tableRef.current) return;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${selectedMetric.label} - ${selectedLevel}</title>
        </head>
        <body>
          ${tableRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // 2) Exportar a Excel
  const handleExportExcel = () => {
    const keys = Object.keys(data[0] || {});
    const yearKeys = keys.filter(k => k !== 'Departamento' && k !== 'Municipio').sort();
    // prepara JSON para XLSX
    const sheetData = data.map(item => {
      const row: Record<string, any> = {
        Departamento: item.Departamento,
        Municipio: item.Municipio,
      };
      yearKeys.forEach(y => { row[y] = item[y] ?? ''; });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(sheetData, { header: ['Departamento','Municipio', ...yearKeys] });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${selectedMetric.label}-${selectedLevel}.xlsx`);
  };

  // 3) Exportar a PDF
  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    const canvas = await html2canvas(tableRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape','pt','a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedMetric.label}-${selectedLevel}.pdf`);
  };

  if (error) return <div className="p-5">Error cargando datos.</div>;
  if (!data)  return <div className="p-5">Cargando…</div>;

  const keys     = Object.keys(data[0] || {});
  const yearKeys = keys.filter(k => k !== 'Departamento' && k !== 'Municipio').sort();

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const term     = normalize(searchTerm);
  const filtered = data.filter(item => {
    const dept = normalize(item.Departamento || '');
    const muni = normalize(item.Municipio   || '');
    return dept.includes(term) || muni.includes(term);
  });

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

          <div className="px-5 py-4">
            <Form className="d-flex gap-3 mb-3">
              <Form.Select
                value={selectedMetric.path}
                onChange={e => {
                  const sel = metricOptions.find(m => m.path === e.target.value);
                  if (sel) setSelectedMetric(sel);
                }}
                style={{ maxWidth: 240 }}
              >
                {metricOptions.map(m => (
                  <option key={m.path} value={m.path}>
                    {m.label}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value as LevelOption)}
                style={{ maxWidth: 300 }}
              >
                {levelOptions.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Form.Select>

              <Form.Control
                type="search"
                placeholder="Buscar departamento o municipio…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ flexGrow: 1 }}
              />
            </Form>

            {/* Botones de impresión/export */}
            <div className="mb-3">
              <Button variant="btn btn-orange" className="me-2" onClick={handlePrint}>
                Imprimir Tabla
              </Button>
              <Button variant="btn btn-orange" className="me-2" onClick={handleExportExcel}>
                Exportar a Excel
              </Button>
              <Button variant="btn btn-orange" onClick={handleExportPDF}>
                Exportar a PDF
              </Button>
            </div>

            <Table
              striped
              bordered
              hover
              responsive
              ref={tableRef}
            >
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  {yearKeys.map(y => <th key={y}>{y}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i}>
                    <td>{item.Departamento}</td>
                    <td>{item.Municipio}</td>
                    {yearKeys.map(y => <td key={y}>{item[y] ?? '-'}</td>)}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
