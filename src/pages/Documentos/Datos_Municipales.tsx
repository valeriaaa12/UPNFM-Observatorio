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
import { useTranslation } from 'react-i18next';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface DataItem {
  Departamento: string;
  Municipio: string;
  [year: string]: string | undefined;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TablasTasas() {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
  const { t } = useTranslation('common');
  const tableRef = useRef<HTMLTableElement>(null);

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
 
 // Si data[0] existe tomo sus keys; si no, arreglo vacío.
  const keys: string[] = data.length > 0 ? Object.keys(data[0]) : [];
  const yearKeys = keys.filter(k => k !== 'Departamento' && k !== 'Municipio').sort();

  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const term     = normalize(searchTerm);
  const filtered = data.filter(item => {
    const dept = normalize(item.Departamento || '');
    const muni = normalize(item.Municipio   || '');
    return dept.includes(term) || muni.includes(term);
  });


  // Imprimir
  const handlePrint = () => {
    if (!tableRef.current) return;
    const pw = window.open('', '_blank', 'width=800,height=600');
    if (!pw) return;
    pw.document.write(`
      <html><head><title>${selectedMetric.label} - ${selectedLevel}</title></head>
      <body>${tableRef.current.outerHTML}</body></html>
    `);
    pw.document.close(); pw.focus(); pw.print(); pw.close();
  };

  // Exportar a Excel
  const handleExportExcel = async () => {
    if (!filtered.length) return;
    const headers = ['Departamento','Municipio', ...yearKeys];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Datos');
    sheet.columns = headers.map(h => ({ header: h, key: h, width: h.length + 2 }));
    // Cabecera coloreada
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.fill = { type:'pattern',pattern:'solid',fgColor:{argb:'FF4472C4'} };
    });
    // Datos
    filtered.forEach(item => {
      sheet.addRow([
        item.Departamento,
        item.Municipio,
        ...yearKeys.map(y => item[y] ?? '')
      ]);
    });
    // Ajuste ancho
    sheet.columns.forEach(col => {
      let max = 0;
      if (typeof col.eachCell === 'function') {
        col.eachCell({ includeEmpty: false }, cell => {
          const txt = cell.value?.toString()||'';
          if (txt.length > max) max = txt.length;
        });
      }
      col.width = max + 2;
    });
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${selectedMetric.label}-${selectedLevel}.xlsx`);
  };

  // Exportar a PDF
  const handleExportPDF = () => {
    if (!filtered.length) return;
    const doc = new jsPDF('landscape');
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFontSize(14);
    doc.text(`${selectedMetric.label} - ${selectedLevel}`, pageW/2, 15, { align: 'center' });
    autoTable(doc, {
      startY: 25,
      head: [['Departamento','Municipio',...yearKeys]],
      body: filtered.map(item => [
        item.Departamento,
        item.Municipio,
        ...yearKeys.map(y => item[y] ?? '-')
      ]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [22,160,133] },
      alternateRowStyles: { fillColor: [238,238,238] },
      margin: { left:15, right:15 },
    });
    doc.save(`${selectedMetric.label}-${selectedLevel}.pdf`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1">
        <LanguageSelector />
        <div className="font">
          <div className="blue blueNavbar">
            <NavBar />
            <div className="orange d-none d-md-block" style={{ height:'0.5rem' }} />
          </div>
          <SmallNavBar />

          <div className="px-5 py-4">
            {/* Responsive: comboboxes + search */}
            <Form className="row g-2 mb-3">
              <h2>{t('DatosMunicipales')}</h2>
              <div className="col-12 col-md-auto">
                <Form.Select
                  value={selectedMetric.path}
                  onChange={e => {
                    const sel = metricOptions.find(m => m.path === e.target.value);
                    if (sel) setSelectedMetric(sel);
                  }}
                  className="w-100"
                  style={{ maxWidth:240 }}
                >
                  {metricOptions.map(m => (
                    <option key={m.path} value={m.path}>{m.label}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-12 col-md-auto">
                <Form.Select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value as LevelOption)}
                  className="w-100"
                  style={{ maxWidth:300 }}
                >
                  {levelOptions.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-12 col-md">
                <Form.Control
                  type="search"
                  placeholder="Buscar departamento o municipio…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-100"
                />
              </div>
            </Form>

            {/* Responsive: botones */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-auto">
                <Button
                  variant="btn btn-orange w-100"
                  onClick={handlePrint}
                >
                  Imprimir Tabla
                </Button>
              </div>
              <div className="col-12 col-md-auto">
                <Button
                  variant="btn btn-orange w-100"
                  onClick={handleExportExcel}
                >
                  Exportar a Excel
                </Button>
              </div>
              <div className="col-12 col-md-auto">
                <Button
                  variant="btn btn-orange w-100"
                  onClick={handleExportPDF}
                >
                  Exportar a PDF
                </Button>
              </div>
            </div>

            <Table striped bordered hover responsive ref={tableRef}>
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  {yearKeys.map(y => <th key={y}>{y}</th>)}
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan={2 + yearKeys.length} className="text-center text-danger">
                      {t('Error cargando datos')}
                    </td>
                  </tr>
                ) : !data ? (
                  <tr>
                    <td colSpan={2 + yearKeys.length} className="text-center">
                      {t('Cargando…')}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={2 + yearKeys.length} className="text-center">
                      {t('NoDatosMunicipales')}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={i}>
                      <td>{item.Departamento}</td>
                      <td>{item.Municipio}</td>
                      {yearKeys.map(y => <td key={y}>{item[y] ?? '-'}</td>)}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
