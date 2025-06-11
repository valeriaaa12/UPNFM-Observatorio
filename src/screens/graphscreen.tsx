import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import ListGroup from 'react-bootstrap/ListGroup';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FuenteDeDatos from '@/components/FuenteDeDatos';

const BarGraph = dynamic(() => import("@/graphs/BarGraph"), { ssr: false });
const LineGraph2 = dynamic(() => import("@/graphs/LineGraph2"), { ssr: false });
const PieGraph = dynamic(() => import("@/graphs/PieGraph"), { ssr: false });

interface Department {
  name: string;
  legend: string;
  value: number;
  year: string;
  level: string;
}

interface Params {
  title: string;
  extensionData: string;
  extensionLimits: string;
}

interface Legend {
  level: string;
  message: string;
  lowerLimit: number;
  upperLimit: number;
  color: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits }: Params) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

  // Estados
  const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
  const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredData, setFilteredData] = useState<Department[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGraph, setActiveGraph] = useState<'bar' | 'line' | 'pie'>('bar');
  const [activeFilter, setActiveFilter] = useState<'year' | 'department'>('year');
  const [isHovered, setIsHovered] = useState(false);

  const levels = [
    t("Ninguno"),
    t("Pre-basica"),
    t("BasicaI"),
    t("BasicaII"),
    t("BasicaIII"),
    t("Basica1y2"),
    t("Basica1,2,3"),
    t("Media"),
  ];

  // Auxiliares
  const capitalizeWords = (str: string) =>
    str
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const assignColorsToLegends = (legendsData: Legend[]): Legend[] => {
    const colorMap: Record<string, string> = {
      "Mucho mejor que la meta": "#008000",
      "Dentro de la meta": "#27ae60",
      "Lejos de la meta": "#FFC300",
      "Muy lejos de la meta": "#e41a1c",
      "N/A": "#808080",
    };
    return legendsData.map(l => ({
      ...l,
      color: colorMap[l.message] || "#808080",
    }));
  };

  // Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } };
      const [dataRes, limitsRes, yearsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`, config),
      ]);

      const deps: Department[] = dataRes.data.map((item: any) => ({
        name: capitalizeWords(item.departamento),
        legend: item.leyenda,
        value: parseFloat(item.tasa) || 0,
        year: item.periodo_anual,
        level: item.nivel,
      }));

      const legs: Legend[] = limitsRes.data.map((item: any) => ({
        level: item.nivel,
        message: item.leyenda,
        lowerLimit: parseFloat(item.min),
        upperLimit: parseFloat(item.max),
        color: "",
      }));

      setDepartments(deps);
      setLegends(assignColorsToLegends(legs));
      setYears(yearsRes.data);
      applyFilters(deps, selectedYear, selectedLevel, selectedDepartment);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado
  const applyFilters = (
    data: Department[],
    year: string,
    level: string,
    department: string
  ) => {
    let result = [...data];

    if (activeGraph === 'bar' || activeGraph === 'pie') {
      if (year !== "Ninguno") result = result.filter(d => d.year === year);
    } else {
      if (department !== "Ninguno")
        result = result.filter(d => d.name.toLowerCase() === department.toLowerCase());
    }

    if (level !== "Ninguno") result = result.filter(d => d.level === level);

    setFilteredData(result);
    if (activeGraph === 'bar' || activeGraph === 'pie') {
      setShowGraph(year !== "Ninguno" && level !== "Ninguno");
    } else {
      setShowGraph(department !== "Ninguno" && level !== "Ninguno");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      applyFilters(departments, selectedYear, selectedLevel, selectedDepartment);
    }
  }, [selectedYear, selectedLevel, selectedDepartment, departments, activeGraph]);

  // Render graph
  const renderGraph = () => {
    if (activeGraph === 'bar') {
      return (
        <BarGraph
          data={filteredData.map(d => ({
            name: d.name,
            value: d.value,
            legend: d.legend,
            year: d.year,
            level: d.level,
          }))}
          xAxisKey="name"
          yAxisKey="value"
          legendKey="legend"
          legends={legends}
        />
      );
    }
    if (activeGraph === 'line') {
      const lineData = filteredData
        .sort((a, b) => parseInt(a.year) - parseInt(b.year))
        .map(({ year, value, name, legend }) => ({
          departamento: name,
          year,
          value,
          legend,
        }));
      return (
        <LineGraph2
          data={lineData}
          xAxisKey="year"
          yAxisKey="value"
          legendKey="legend"
          legends={legends}
        />
      );
    }
    return (
      <PieGraph
        data={filteredData.map(d => ({
          name: d.name,
          value: d.value,
          legend: d.legend,
          year: d.year,
          level: d.level,
        }))}
      />
    );
  };

  // handlers
  const handleDownloadImage = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const link = document.createElement("a");
    const filenameParts = [title];
    if (selectedLevel !== "Ninguno") filenameParts.push(selectedLevel);
    if (selectedYear !== "Ninguno") filenameParts.push(selectedYear);
    link.download = filenameParts.join(" - ") + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDownloadPDF = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", undefined, "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`);
  };

  const handlePrint = async () => {
  if (!exportRef.current) return;

  const canvas = await html2canvas(exportRef.current);
  const imgData = canvas.toDataURL('image/png');

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  const titleText = [
    title,
    selectedLevel !== 'Ninguno' ? ` - ${selectedLevel}` : '',
    selectedYear  !== 'Ninguno' ? ` (${selectedYear})` : ''
  ].join('');
  printWindow.document.write(`
    <html>
      <head>
        <title>${titleText}</title>
        <style>
          body { margin: 0; padding: 20px; text-align: center; }
          h2 { margin-bottom: 20px; font-family: sans-serif; }
          img { max-width: 100%; height: auto; border: none; }
        </style>
      </head>
      <body>
        <h2>${titleText}</h2>
        <img src="${imgData}" alt="Gráfico para imprimir" />
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  

  // Filter select
  const renderFilter = () => {
    if (activeFilter === 'year') {
      return (
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {t("Año")}:
          </label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="Ninguno">{t("Ninguno")}</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {t("Departamento")}:
          </label>
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="Ninguno">{t("Ninguno")}</option>
            {[...new Set(departments.map(d => d.name))]
              .sort()
              .map(dep => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
          </select>
        </div>
      );
    }
  };

  return (
    <Client>
      <div className="font">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', padding: '20px', position: 'relative' }}>
            {/* filtros en pantalla, NO exportarlos */}
            <div
              style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}
              data-html2canvas-ignore
            >
              {/* Nivel */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  {t("Nivel Educativo")}:
                </label>
                <select
                  value={selectedLevel}
                  onChange={e => setSelectedLevel(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              {renderFilter()}
            </div>

            {/* ZONA EXPORTABLE */}
            <div id="export-area" ref={exportRef}>
              <h2 style={{ marginBottom: '20px' }}>
                {title}
                {selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}
                {selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}
              </h2>

              <div
                style={{
                  height: '500px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {showGraph ? (
                  <>
                    <div style={{ display: 'flex', flex: 1, gap: '20px', minHeight: 0 }}>
                      <div
                        style={{
                          flex: 1,
                          minWidth: '300px',
                          position: 'relative',
                          overflow: 'hidden',
                          height: '100%',
                        }}
                      >
                        {renderGraph()}
                      </div>
                    </div>
                    <FuenteDeDatos />
                  </>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      color: '#666',
                    }}
                  >
                    No hay datos disponibles para los filtros seleccionados
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                right: '20px',
                top: '160px',
                width: '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              data-html2canvas-ignore
            >
              <ListGroup>
                <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico de Barras</Tooltip>}>
                  <ListGroup.Item
                    action
                    className="graphsMenu"
                    active={activeGraph === 'bar'}
                    onClick={() => {
                      setActiveGraph('bar');
                      setActiveFilter('year');
                    }}
                  >
                    <i className="bi bi-bar-chart-line" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico de Líneas</Tooltip>}>
                  <ListGroup.Item
                    action
                    className="graphsMenu"
                    active={activeGraph === 'line'}
                    onClick={() => {
                      setActiveGraph('line');
                      setActiveFilter('department');
                    }}
                  >
                    <i className="bi bi-graph-up" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico Circular</Tooltip>}>
                  <ListGroup.Item
                    action
                    className="graphsMenu"
                    active={activeGraph === 'pie'}
                    onClick={() => {
                      setActiveGraph('pie');
                      setActiveFilter('year');
                    }}
                  >
                    <i className="bi bi-pie-chart" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Guardar como imagen</Tooltip>}>
                  <ListGroup.Item action className="graphsMenu" onClick={handleDownloadImage}>
                    <i className="bi bi-download" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Descargar PDF</Tooltip>}>
                  <ListGroup.Item action className="graphsMenu" onClick={handleDownloadPDF}>
                    <i className="bi bi-filetype-pdf" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Imprimir</Tooltip>}>
                  <ListGroup.Item action className="graphsMenu" onClick={handlePrint}>
                    <i className="bi bi-printer" />
                  </ListGroup.Item>
                </OverlayTrigger>

                <OverlayTrigger placement="left" overlay={<Tooltip>Exportar a Excel</Tooltip>}>
                  <ListGroup.Item
                    action
                    className="graphsMenu d-flex align-items-center justify-content-center"
                    style={{ height: '40px' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      src={isHovered ? "images/excel1.png" : "images/excel2.png"}
                      alt="Excel"
                      width={30}
                      height={30}
                    />
                  </ListGroup.Item>
                </OverlayTrigger>
              </ListGroup>
            </div>
          </div>
        )}
        <LanguageSelector />
      </div>

       
    </Client>
  );
}
