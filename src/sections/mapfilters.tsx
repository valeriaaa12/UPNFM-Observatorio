import ComboBox from "@/components/combobox";
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from "react-bootstrap";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import MapModal from "@/modals/mapmodal";
import MessageModal from "@/modals/modal";

// interfaces
interface department {
  name: string;
  legend: string;
  value: number;
  year: string;
  level: string;
}

interface legend {
  level: string;
  message: string;
  lowerLimit: number;
  upperLimit: number;
}

interface params {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  years: string[];
  setMapa: React.Dispatch<React.SetStateAction<string>>;
  mapa: string;
  mapaElegido: string;
  setMapaElegido: React.Dispatch<React.SetStateAction<string>>;
  departments: department[] | null;
  legends: legend[] | null;
}

interface deptMaps {
  deptName: string;
  geojson: string;
}

export default function MapFilters({
  mapaElegido,
  setMapaElegido,
  level,
  setLevel,
  selectedYear,
  setSelectedYear,
  years,
  mapa,
  setMapa,
  departments,
  legends
}: params) {
  const { t, i18n } = useTranslation('common');
  const [select, setSelect]     = useState("Honduras");
  const [include, setInclude]   = useState(false);
  const [show, setShow]         = useState(false);
  const printMapRef             = useRef<HTMLDivElement>(null);

  const deptList: deptMaps[] = [
    { deptName: "Honduras", geojson: "/others/hn.json" },
    /* … los demás … */
    { deptName: "Yoro",      geojson: "/others/hn-municipios-18-yoro.geo.json" }
  ];
  const deptNames = deptList.map(d => d.deptName);

  const capitalizeWords = (str: string) =>
    str.toLowerCase()
       .split(' ')
       .map(w => w[0].toUpperCase() + w.slice(1))
       .join(' ');
  const exportPDF = async () => {
    try {
      if (typeof window === 'undefined') return;
      // validación previa:
      if (!departments || selectedYear === "Ninguno" || level === "Ninguno") {
        setShow(true);
        return;
      }

      // 1) crear contenedores ocultos
      const pdfContainer  = document.createElement('div');
      const pdfContainer2 = document.createElement('div');
      Object.assign(pdfContainer.style, {
        position: 'fixed', left: '-9999px', width: '800px', height: '1100px'
      });
      Object.assign(pdfContainer2.style, {
        position: 'fixed', right: '-9999px', width: '800px', height: '1100px'
      });
      document.body.appendChild(pdfContainer);
      document.body.appendChild(pdfContainer2);

      // 2) clonar mapa / leyendas / límites
      const L = (await import('leaflet')).default;
      const mapClone = L.map('map-container', {
        zoomControl: false,
        attributionControl: false,
        center: [14.8, -86.8],
        zoom: 7,
        renderer: L.canvas()
      });
      const resp    = await fetch(mapa);
      const geoData = await resp.json();
      const layer   = L.geoJSON(geoData, { style: styleFeature }).addTo(mapClone);
      mapClone.fitBounds((layer as any).getBounds());

      // 3) clonar título / subtítulo / leyendas / límites
      (['Titulo','limits-container','legends-container','info-container'] as const)
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) pdfContainer.appendChild(el.cloneNode(true));
        });

      // 4) esperar render leaflet
      await new Promise(r => setTimeout(r, 500));

      // 5) html2canvas
      const canvas = await html2canvas(pdfContainer, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      // 6) construir PDF
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p','mm','a4');
      const imgW = 190;
      const imgH = canvas.height * imgW / canvas.width;
      pdf.addImage(imgData,'PNG',10,10,imgW,imgH);

      if (include) {
        const canvas2 = await html2canvas(pdfContainer2, { scale:2, useCORS:true });
        const img2 = canvas2.toDataURL('image/png');
        pdf.addPage();
        pdf.addImage(img2,'PNG',10,10,imgW,imgH);
      }

      const fname = `${document.getElementById("Titulo")?.textContent || 'map'}.pdf`;
      pdf.save(fname);

      // 7) limpiar
      document.body.removeChild(pdfContainer);
      document.body.removeChild(pdfContainer2);

    } catch(error) {
      console.log(error);
    }
  };  // <<<<<< fin exportPDF
  // 0) estilo común
  const styleFeature = (feature: any) => {
    const d = feature.properties.NOMBRE || feature.properties.name;
    return {
      fillColor: getDeptColor(d),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.85,
      color: 'black'
    };
  };

  // 1) imprimir sólo mapa
  const handlePrintMapa = async () => {
    if (typeof window === 'undefined') return;

    const printContainer = document.createElement('div');
    Object.assign(printContainer.style, {
      position: 'fixed', top:0, left:'-9999px',
      width:'800px', height:'600px', background:'white', overflow:'hidden'
    });
    document.body.appendChild(printContainer);

    const L = (await import('leaflet')).default;
    const mapClone = L.map(printContainer, {
      zoomControl: false,
      attributionControl: false,
      center: [14.8,-86.8],
      zoom: 7,
      renderer: L.canvas()
    });
    const resp    = await fetch(mapa);
    const geoData = await resp.json();
    const layer   = L.geoJSON(geoData,{ style: styleFeature }).addTo(mapClone);
    mapClone.fitBounds((layer as any).getBounds());

    await new Promise(r => setTimeout(r,300));
    const canvas = await html2canvas(printContainer, { scale:2, useCORS:true });
    const dataUrl= canvas.toDataURL('image/png');

    const pw = window.open('','_blank','width=900,height=650');
    if (pw) {
      pw.document.write(`
        <html><head><title>Imprimir Mapa</title></head>
        <body style="margin:0;padding:0;text-align:center;">
          <img src="${dataUrl}" style="width:100%;height:auto;"/>
        </body></html>
      `);
      pw.document.close();
      pw.focus(); pw.print(); pw.close();
    }

    document.body.removeChild(printContainer);
  };  // <<<<<< fin handlePrintMapa
  const exportExcel = async () => {
    const nombre = mapaElegido === "Honduras" ? "Departamento" : "Municipio";
    if (!departments || selectedYear === "Ninguno" || level === "Ninguno") {
      setShow(true);
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(
      document.getElementById("Titulo")?.textContent || "Datos"
    );
    sheet.columns = [
      { header: nombre, key: 'name', width: 30 },
      { header: 'Tasa',     key: 'value', width: 15 },
      { header: 'Leyenda',  key: 'legend', width: 50 },
      { header: 'Color',    key: 'color', width: 30 },
    ];
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold:true, size:12 };
      cell.alignment = { vertical:'middle', horizontal:'center' };
      cell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'4472C4' } };
      cell.border = { left:{style:'thin'}, right:{style:'thin'} };
    });
    let rowIndex = 2;
    departments.forEach(d => {
      const r = sheet.addRow({
        name:  capitalizeWords(d.name),
        value: d.value + "%",
        legend:d.legend,
        color: ""
      });
      r.getCell('color').fill = {
        type:'pattern', pattern:'solid',
        fgColor:{ argb: getDeptColor(d.name).substring(1) }
      };
      rowIndex++;
    });
    // pie de página…
    rowIndex += 2;
    sheet.mergeCells(`A${rowIndex}:D${rowIndex}`);
    const foot = sheet.getCell(`A${rowIndex}`);
    foot.value = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados …";
    sheet.getRow(rowIndex).alignment = { wrapText:true, horizontal:'center' };
    sheet.getRow(rowIndex).height = 100;

    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${document.getElementById("Titulo")?.textContent}.xlsx`);
  };

  const fallback: legend = { level:"", message:"", lowerLimit:0, upperLimit:0 };
  const getDeptColor = (deptName: string): string => {
    const cur = departments?.find(d => d.name.toLowerCase()===deptName.toLowerCase());
    const v   = cur? cur.value : -1;
    const dark   = legends?.find(l=>l.message==="Mucho mejor que la meta" && l.level===level) ?? fallback;
    const green  = legends?.find(l=>l.message==="Dentro de la meta" && l.level===level) ?? fallback;
    const yellow = legends?.find(l=>l.message==="Lejos de la meta" && l.level===level) ?? fallback;
    if (level==="Ninguno"||selectedYear==="Ninguno") return '#808080';
    if (v>=dark.lowerLimit&&v<=dark.upperLimit) return '#008000';
    if (v>=green.lowerLimit&&v<=green.upperLimit) return '#27ae60';
    if (v>=yellow.lowerLimit&&v<=yellow.upperLimit) return '#FFC300';
    if (v===-1) return '#808080';
    return '#e41a1c';
  };

  const changeValue = (value: string) => {
    setSelect(value);
    const d = deptList.find(x => x.deptName===value);
    setMapa(d?.geojson||"/others/hn.json");
    setMapaElegido(d?.deptName||"Honduras");
    setSelectedYear("Ninguno");
    setLevel("Ninguno");
  };

  const setValue = () => {
    const d = deptList.find(x => x.geojson===mapa);
    return d?.deptName||"Honduras";
  };

  return (
    <>
      {/* … tu menu vertical con ComboBox, botones, etc … */}
      <button onClick={exportPDF}>Imprimir</button>
      <button onClick={handlePrintMapa}>Imprimir Mapa</button>
      <button onClick={exportExcel}>exportExcel</button>
      {/* … el resto de tu JSX … */}
      <MapModal   showModal={show} setShowModal={setShow} />
    </>
  );
}
