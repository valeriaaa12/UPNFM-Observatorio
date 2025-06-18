import html2canvas from "html2canvas";
import ComboBox from "@/components/combobox";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from "react-bootstrap";
import * as XLSX from 'xlsx';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import MapModal from "@/modals/mapmodal";
import MessageModal from "@/modals/modal";
//imports needed for map pdf export

//pruebas para exportar pdf

//interfaces
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
//fin pruebas para exportar pdf

interface params {
  title: string;
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
  deptName: string,
  geojson: string
}




export default function MapFilters({ title, mapaElegido, setMapaElegido, level, setLevel, selectedYear, setSelectedYear, years, mapa, setMapa, departments, legends }: params) {
  const { t, i18n } = useTranslation('common');
  const [select, setSelect] = useState("Honduras");
  const [include, setInclude] = useState(false);
  const [show, setShow] = useState(false);
  const [menuName, setMenuName] = useState(t("Ninguno"));
  const changeLevel = (value: string) => {
    const levels = [
      { name: t("Ninguno"), value: "Ninguno" }, { name: t("Pre-basica"), value: "Pre-básica" }, { name: t("BasicaI"), value: "Básica I Ciclo" }, { name: t("BasicaII"), value: "Básica II Ciclo" }, { name: t("BasicaIII"), value: "Básica III Ciclo" }, { name: t("Basica1y2"), value: "Básica I-II Ciclo" }, { name: t("Basica1,2,3"), value: "Básica I-II-III Ciclo" }, { name: t("Media"), value: "Media" }];
    setMenuName(levels.find(level => level.name === value)?.name || t("Ninguno"));
    setLevel(levels.find(level => level.name === value)?.value || "Ninguno");
  }
  const deptList: deptMaps[] = [
    { deptName: "Honduras", geojson: "/others/hn.json" },
    { deptName: "Atlántida", geojson: "/others/hn-municipios-01-atlantida.geo.json" },
    { deptName: "Colón", geojson: "/others/hn-municipios-02-colon.geo.json" },
    { deptName: "Comayagua", geojson: "/others/hn-municipios-03-comayagua.geo.json" },
    { deptName: "Copán", geojson: "/others/hn-municipios-04-copan.geo.json" },
    { deptName: "Cortés", geojson: "/others/hn-municipios-05-cortes.geo.json" },
    { deptName: "Choluteca", geojson: "/others/hn-municipios-06-choluteca.geo.json" },
    { deptName: "El Paraíso", geojson: "/others/hn-municipios-07-elparaiso.geo.json" },
    { deptName: "Francisco Morazán", geojson: "/others/hn-municipios-08-franciscomorazan.geo.json" },
    { deptName: "Gracias a Dios", geojson: "/others/hn-municipios-09-graciasadios.geo.json" },
    { deptName: "Intibucá", geojson: "/others/hn-municipios-10-intibuca.geo.json" },
    { deptName: "Islas de la Bahía", geojson: "/others/hn-municipios-11-islasdelabahia.geo.json" },
    { deptName: "La Paz", geojson: "/others/hn-municipios-12-lapaz.geo.json" },
    { deptName: "Lempira", geojson: "/others/hn-municipios-13-lempira.geo.json" },
    { deptName: "Ocotepeque", geojson: "/others/hn-municipios-14-ocotepeque.geo.json" },
    { deptName: "Olancho", geojson: "/others/hn-municipios-15-olancho.geo.json" },
    { deptName: "Santa Bárbara", geojson: "/others/hn-municipios-16-santabarbara.geo.json" },
    { deptName: "Valle", geojson: "/others/hn-municipios-17-valle.geo.json" },
    { deptName: "Yoro", geojson: "/others/hn-municipios-18-yoro.geo.json" }
  ];
  const deptNames: string[] = [
    "Honduras", "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
  ];
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  // 0) Función de estilo reutilizable (ya tenías algo parecido)
  const styleFeature = (feature: any) => {
    const deptName = feature.properties.NOMBRE || feature.properties.name;
    return {
      fillColor: getDeptColor(deptName),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.85,
      color: 'black'
    };
  };

  // 1) Función para imprimir sólo el mapa + encabezados
  const handlePrintMapa = async () => {
    if (typeof window === 'undefined') return;

    // crear contenedor oculto
    const printContainer = document.createElement('div');
    Object.assign(printContainer.style, {
      position: 'fixed',
      top: '0',
      left: '-9999px',
      width: '800px',
      height: '600px',
      background: 'white',
      overflow: 'hidden'
    });
    document.body.appendChild(printContainer);

    // clonar mapa en Leaflet
    const L = (await import('leaflet')).default;
    const mapClone = L.map(printContainer, {
      zoomControl: false,
      attributionControl: false,
      center: [14.8, -86.8],
      zoom: 7,
      renderer: L.canvas()
    });
    const resp = await fetch(mapa);
    const geoData = await resp.json();
    const layer = L.geoJSON(geoData, { style: styleFeature }).addTo(mapClone);
    mapClone.fitBounds((layer as any).getBounds());

    // clonar títulos, límites, leyendas e info
    (['Titulo', 'limits-container', 'legends-container', 'info-container'] as const)
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) printContainer.appendChild(el.cloneNode(true));
      });

    // Agrega la fuente al final del printContainer
    const fuente = document.createElement('div');
    fuente.style.textAlign = "center";
    fuente.style.width = '100%';
    fuente.style.backgroundColor = "#e0e0e0";
    fuente.style.marginTop = '40px';
    fuente.style.padding = '10px';
    fuente.style.fontSize = '13px';
    fuente.textContent = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados. La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu.hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados.";
    printContainer.appendChild(fuente);

    // esperar render Leaflet
    await new Promise(r => setTimeout(r, 500));

    // capturar con html2canvas
    const canvas = await html2canvas(printContainer, { scale: 2, useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');

    // abrir ventana de impresión
    const pw = window.open('', '_blank', 'width=900,height=650');
    if (pw) {
      pw.document.write(`
      <html>
        <head><title>Imprimir Mapa</title></head>
        <body style="margin:0;padding:0;text-align:center;">
          <img src="${dataUrl}" style="width:100%;height:auto;"/>
        </body>
      </html>
    `);
      pw.document.close();
      pw.focus();
      pw.print();
      pw.close();
    }

    // limpiar
    document.body.removeChild(printContainer);
  };


  const exportPNG = async (title?: string) => {
    try {
      if (!departments || selectedYear === "Ninguno" || level === "Ninguno") {
        setShow(true);
        return;
      }
      const baseTitle = title?.trim() || "Indicador Educativo";
      const includeLocation = !baseTitle.includes(mapaElegido) && mapaElegido !== "Honduras" && mapaElegido !== "Ninguno";
      const extraLocation = includeLocation ? ` en ${mapaElegido}` : "";

      const titleText = `${baseTitle}${extraLocation}`;

      // Ocultar elementos con clase .no-print
      const noPrintElements = document.querySelectorAll('.no-print');
      noPrintElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      const L = (await import("leaflet")).default;
      const html2canvas = (await import("html2canvas")).default;

      // Crear contenedor principal oculto
      const pngContainer = document.createElement("div");
      pngContainer.style.position = "fixed";
      pngContainer.style.left = "-9999px";
      pngContainer.style.width = "850px";
      pngContainer.style.height = 'auto';
      pngContainer.style.backgroundColor = "white";
      pngContainer.style.display = "flex";
      pngContainer.style.flexDirection = "column";
      pngContainer.style.alignItems = "center";
      pngContainer.style.padding = "20px";
      pngContainer.style.gap = "15px";
      document.body.appendChild(pngContainer);

      // Título azul
      const titleDIV = document.createElement("div");
      titleDIV.style.backgroundColor = "#2c3e50";
      titleDIV.style.color = "white";
      titleDIV.style.textAlign = "center";
      titleDIV.style.padding = "12px";
      titleDIV.style.width = "100%";
      titleDIV.style.fontSize = "20px";
      titleDIV.style.fontWeight = "bold";
      titleDIV.textContent = titleText;
      pngContainer.appendChild(titleDIV);

      // Mapa dinámico
      const mapContainer = document.createElement("div");
      mapContainer.id = "map-container";
      mapContainer.style.width = "100%";
      mapContainer.style.height = "500px";
      mapContainer.style.backgroundColor = "white";
      pngContainer.appendChild(mapContainer);

      const map = L.map("map-container", {
        zoomControl: false,
        zoom: 7,
        center: [14.8, -86.8],
        renderer: L.canvas(),
        attributionControl: false
      });

      const styleFeature = (feature: any) => {
        const deptName = feature.properties.NOMBRE || feature.properties.name;
        return {
          fillColor: getDeptColor(deptName),
          weight: 1,
          color: "black",
          fillOpacity: 0.85
        };
      };

      if (mapa) {
        const response = await fetch(mapa);
        const data = await response.json();
        const geoJsonLayer = L.geoJSON(data, {
          style: styleFeature
        }).addTo(map);

        map.fitBounds(geoJsonLayer.getBounds());
      }

      // Leyenda y límites (clonados)
      const limitsClone = document.getElementById("limits-container")?.cloneNode(true) as HTMLElement;
      const legendClone = document.getElementById("legends-container")?.cloneNode(true) as HTMLElement;

      // Ajustar estilos para prevenir problemas de posición
      limitsClone.style.position = "static";
      legendClone.style.position = "static";
      limitsClone.style.margin = '0 20px 0 0'; // espacio solo entre ellos
      legendClone.style.margin = '0';

      const legendRow = document.createElement("div");
      legendRow.style.display = "flex";
      legendRow.style.justifyContent = "space-between";
      legendRow.style.alignItems = "start";
      legendRow.style.marginTop = "4px"; // ⬅️ reduce espacio arriba
      legendRow.style.width = "100%";
      legendRow.style.gap = "30px";
      legendRow.appendChild(limitsClone);
      legendRow.appendChild(legendClone);

      pngContainer.appendChild(legendRow);

      // Footer
      const footer = document.createElement("div");
      footer.style.textAlign = "center";
      footer.style.backgroundColor = "#e0e0e0";
      footer.style.borderRadius = "10px";
      footer.style.marginTop = "30px";
      footer.style.padding = "10px";
      footer.style.width = "100%";
      footer.style.fontSize = "10px";
      footer.textContent =
        "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados. " +
        "La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu.hn). " +
        "El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. " +
        "El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados.";
      pngContainer.appendChild(footer);

      // Esperar a que Leaflet cargue todo
      await new Promise(resolve => {
        map.whenReady(() => {
          setTimeout(resolve, 500);
        });
      });

      // Captura del contenedor
      const canvas = await html2canvas(pngContainer, {
        allowTaint: true,
        useCORS: true,
        scale: 2
      });

      const link = document.createElement("a");
      const fileName = `${titleText.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      // Restaurar visibilidad
      noPrintElements.forEach(el => {
        (el as HTMLElement).style.display = '';
      });

      // Limpieza
      document.body.removeChild(pngContainer);
      if (document.body.contains(limitsClone)) {
        document.body.removeChild(limitsClone);
      }
      if (document.body.contains(legendClone)) {
        document.body.removeChild(legendClone);
      }

    } catch (error) {
      console.error("Error al exportar PNG:", error);
    }
  };

  const exportPDF = async (titleText?: string) => {
    try {
      if (typeof window === 'undefined' || !document) return;
      if (!departments || selectedYear == "Ninguno" || level == "Ninguno") {
        setShow(true);
        return
      }

      const mapContainer = document.createElement("div");
      mapContainer.id = "map-container";
      const L = (await import('leaflet')).default;
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // hide controls
      const controls = document.querySelectorAll('.leaflet-control-container');
      controls.forEach(control => (control as HTMLElement).style.visibility = 'hidden');

      // pdf container creation
      const pdfContainer = document.createElement('div');

      pdfContainer.style.position = 'fixed';
      pdfContainer.style.left = '-9999px';
      pdfContainer.style.width = '800px';
      pdfContainer.style.height = '1100px';

      document.body.appendChild(pdfContainer);
      const pdfContainer2 = document.createElement('div');

      pdfContainer2.style.position = 'fixed';
      pdfContainer2.style.right = '-9999px';
      pdfContainer2.style.width = '800px';
      pdfContainer2.style.height = '1100px';

      //copying elements to be appended
      const mapClone = mapContainer.cloneNode(true) as HTMLElement;
      const createLegendAndLimitsRow = () => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'flex-start';
        row.style.width = '100%';
        row.style.gap = '30px';

        const createBox = (title: string, items: { color: string, label: string }[]) => {
          const box = document.createElement('div');
          Object.assign(box.style, {
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            border: '1px solid #ccc',
            minWidth: '180px',
            boxSizing: 'border-box'
          });

          const header = document.createElement('div');
          header.textContent = title;
          header.style.fontWeight = 'bold';
          header.style.marginBottom = '5px';
          box.appendChild(header);

          items.forEach(item => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.margin = '3px 0';
            row.style.gap = '5px';
            row.style.minHeight = '20px';
            row.style.lineHeight = '1.2';

            const square = document.createElement('div');
            square.style.width = '14px';
            square.style.height = '14px';
            square.style.backgroundColor = item.color;
            square.style.flexShrink = '0';

            const label = document.createElement('span');
            label.style.whiteSpace = 'nowrap';
            label.style.maxWidth = 'calc(100% - 20px)';
            label.style.overflow = 'hidden';
            label.textContent = item.label;
            label.style.lineHeight = '1.2';
            label.style.margin = '0';
            label.style.padding = '0';

            row.appendChild(square);
            row.appendChild(label);
            box.appendChild(row);
          });

          return box;
        };

        const limitsBox = createBox("Límites", [
          { color: '#008000', label: '62.88 - 100' },
          { color: '#27ae60', label: '50 - 61.87' },
          { color: '#FFC300', label: '38.12 - 49.99' },
          { color: '#e41a1c', label: '0 - 38.11' }
        ]);

        const legendBox = createBox("Nivel de Cumplimiento", [
          { color: '#008000', label: 'Mucho mejor que la meta' },
          { color: '#27ae60', label: 'Dentro de la meta' },
          { color: '#FFC300', label: 'Lejos de la meta' },
          { color: '#e41a1c', label: 'Muy lejos de la meta' }
        ]);

        row.appendChild(limitsBox);
        row.appendChild(legendBox);

        return row;
      };

      mapClone.style.width = '100%';
      mapClone.style.height = '500px';

      //      limitsClone.style.margin = '10px 0'; trying out stuff

      const levelAndYear = `${level} ${selectedYear}`;
      const cleanedTitle = (titleText ?? "").replace(levelAndYear, '').trim().replace(/[-–—]\s*$/, '').trim();
      const title = document.createElement('h2');
      title.textContent = cleanedTitle || 'Indicador Educativo';
      title.style.textAlign = 'center';
      title.style.marginBottom = '20px';

      const subtitle = document.createElement('h3');
      subtitle.textContent = `${level} ${selectedYear}`;
      subtitle.style.textAlign = 'center';
      subtitle.style.marginBottom = '6px';

      const footer = document.createElement('div');
      footer.style.textAlign = "center"
      footer.style.width = '100%'
      footer.style.backgroundColor = "#e0e0e0"
      footer.style.borderRadius = '20px'
      footer.style.height = '180px';
      footer.textContent = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados \n La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados."
      footer.style.marginBottom = '100px'
      footer.style.padding = '10px'
      footer.style.borderBottomRightRadius = '20px'

      const mapDiv = document.createElement("div");
      mapDiv.style.height = '700px'
      mapDiv.appendChild(mapClone)
      mapDiv.appendChild(createLegendAndLimitsRow());

      mapDiv.style.position = 'relative'
      mapDiv.style.minHeight = '300px'
      //tabla con valored
      if (include) {
        const tableDiv = document.createElement("div")
        tableDiv.style.position = "relative"
        tableDiv.style.marginBottom = '50px'

        const table = document.createElement("table")
        table.style.width = '100%';
        table.style.fontSize = '12px';


        //columnas
        const thead = document.createElement("thead")
        const headRow = document.createElement("tr")
        const deptCol = document.createElement("th")
        deptCol.textContent = (mapaElegido == "Honduras") ? "Departamento" : "Municipio"
        deptCol.style.border = '1px solid #000';
        deptCol.style.padding = '6px';
        deptCol.style.backgroundColor = '#f0f0f0';
        deptCol.style.textAlign = 'center';

        headRow.appendChild(deptCol)

        const valCol = document.createElement("th")
        valCol.textContent = "Tasa"
        valCol.style.border = '1px solid #000';
        valCol.style.padding = '6px';
        valCol.style.backgroundColor = '#f0f0f0';
        valCol.style.textAlign = 'center';
        headRow.appendChild(valCol)

        thead.appendChild(headRow)
        table.appendChild(thead)

        //valores
        const tBody = document.createElement("tbody")
        departments?.forEach(dept => {
          const row = document.createElement("tr")
          const name = document.createElement("td")
          name.style.border = "1px solid black";
          name.style.textAlign = "center"
          name.style.padding = "6px";
          name.textContent = capitalizeWords(dept.name)

          const value = document.createElement("td")
          value.style.border = "1px solid black";
          value.style.padding = "6px";
          value.style.textAlign = "center"
          value.textContent = String(dept.value) + "%"

          row.appendChild(name)
          row.appendChild(value)
          tBody.appendChild(row)

        });
        table.appendChild(tBody)
        tableDiv.appendChild(table)
        //appends al contenedor
        pdfContainer.appendChild(title);
        //pdfContainer.appendChild(subtitle);
        pdfContainer.appendChild(mapDiv);
        document.body.appendChild(pdfContainer2);
        pdfContainer2.appendChild(tableDiv);
        pdfContainer2.appendChild(footer);
      } else {
        pdfContainer.appendChild(title);
        //pdfContainer.appendChild(subtitle);
        pdfContainer.appendChild(mapDiv);
        pdfContainer.appendChild(footer);
      }

      //map clone for resizing (so it prints the same size regardless of any user zoom in)
      const cloneMap = L.map("map-container", {
        zoomControl: false,
        zoom: 7,
        center: [14.8, -86.8],
        renderer: L.canvas(),
        attributionControl: false

      });

      // Set white background
      const container = document.getElementById('map-container');
      if (container) {
        container.style.backgroundColor = 'white';
      }


      // Style function for GeoJSON
      const styleFeature = (feature: any) => {
        const deptName = feature.properties.NOMBRE || feature.properties.name;
        return {
          fillColor: getDeptColor(deptName),
          weight: 1,
          opacity: 1,
          fillOpacity: 0.85,
          color: 'black'
        };
      };

      // Add GeoJSON layer if mapa exists
      if (mapa) {
        const response = await fetch(mapa);
        const data = await response.json();
        console.log("data : " + data)
        const geoJsonLayer = L.geoJSON(data, {
          style: styleFeature,
          onEachFeature: (feature, layer) => {
            // Add tooltip or popup if needed
            const deptName = feature.properties.NOMBRE || feature.properties.name;
            const deptData = departments?.find(item => item.name.toLowerCase() === deptName.toLowerCase());

            if (deptData) {
              layer.bindTooltip(`
          <div>
            <strong>${deptName}</strong><br/>
            Value: ${deptData.value}<br/>
            Level: ${deptData.level}
          </div>
        `);
            }
          }
        }).addTo(cloneMap);

        cloneMap.fitBounds(geoJsonLayer.getBounds());
      }
      //end map clone
      await new Promise(resolve => setTimeout(resolve, 1000));



      // Generate PDF
      const canvas = await html2canvas(pdfContainer, {
        allowTaint: true,
        useCORS: true,
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      if (include) {
        const canvas2 = await html2canvas(pdfContainer2, {
          allowTaint: true,
          useCORS: true,
          scale: 2 // Better quality
        })
        const imgData2 = canvas2.toDataURL('image/png');
        const imgWidth2 = 190;
        const imgHeight2 = (canvas.height * imgWidth) / canvas.width;
        pdf.addPage()
        pdf.addImage(imgData2, 'PNG', 10, 10, imgWidth2, imgHeight2)
      }
      const exportName = document.getElementById("Titulo")?.textContent + ".pdf";
      pdf.save(exportName);


      document.body.removeChild(pdfContainer);
      if (include) {
        document.body.removeChild(pdfContainer2);
      }
      controls.forEach((control, i) => {
        (control as HTMLElement).style.visibility = 'visible';
      });
    } catch (error) {
      console.log(error)
    }
  }

  const exportExcel = async () => {
    const nombre = (mapaElegido == "Honduras") ? "Departamento" : "Municipio"
    if (!departments || selectedYear == "Ninguno" || level == "Ninguno") {
      setShow(true);
      return
    }

    const excelFile = new ExcelJS.Workbook();
    const excelSheet = excelFile.addWorksheet(document.getElementById("Titulo")?.textContent || "Datos");
    excelSheet.columns = [
      { header: nombre, key: 'name', width: 30 },
      { header: 'Tasa', key: 'value', width: 15 },
      { header: 'Leyenda', key: 'legend', width: 50 },
      { header: 'Color', key: 'color', width: 30 },
    ]

    excelSheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { bold: true, size: 12 };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
      }

      cell.border = {
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
    let number = 1;
    departments.forEach((dept) => {
      const tempRow = excelSheet.addRow({
        name: capitalizeWords(dept.name),
        value: dept.value + "%",
        legend: dept.legend,
        Color: ""
      })

      const tempCell = tempRow.getCell('color')

      tempCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: getDeptColor(dept.name).substring(1) },
      }
      number++;
    })
    number += 2;
    excelSheet.mergeCells(`A${number}: D${number}`);


    const cell = excelSheet.getCell(`A${number}`);
    excelSheet.getRow(number).alignment = { wrapText: true, horizontal: 'center' }
    excelSheet.getRow(number).height = 100;
    cell.value = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados \n La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados."

    const buffer = await excelFile.xlsx.writeBuffer();
    const fileName = document.getElementById("Titulo")?.textContent + ".xlsx";
    saveAs(new Blob([buffer]), fileName);
  }

  //inicio pruebas exportar pdf
  const fallback: legend = {
    level: "",
    message: "",
    lowerLimit: 0,
    upperLimit: 0
  }

  const getDeptColor = (deptName: string): string => {
    const currentDep = departments?.find((item) =>
      item.name == deptName.toLowerCase()
    )

    const value = currentDep ? currentDep.value : -1;

    const darkgreen: legend = legends?.find((item) =>
      item.message === "Mucho mejor que la meta" && item.level === level
    ) ?? fallback;

    const green: legend = legends?.find((item) =>
      item.message === "Dentro de la meta" && item.level === level
    ) ?? fallback;

    const yellow: legend = legends?.find((item) =>
      item.message === "Lejos de la meta" && item.level === level
    ) ?? fallback;

    const red: legend = legends?.find((item) =>
      item.message === "Muy lejos de la meta" && item.level === level
    ) ?? fallback;


    if (level == "Ninguno" || selectedYear == "Ninguno") return '#808080';
    if (value >= darkgreen.lowerLimit && value <= darkgreen!.upperLimit) return '#008000'; //verde oscuro
    if (value >= green!.lowerLimit && value <= green!.upperLimit) return '#27ae60'; //verde
    if (value >= yellow!.lowerLimit && value <= yellow!.upperLimit) return '#FFC300'; //amarillo
    if (value == -1) return '#808080'; //gris
    return '#e41a1c'; //rojo 
  };

  //fin pruebas exportar pdf
  const changeValue = (value: string) => {
    console.clear();
    setSelect(value)
    const dept = deptList.find((item) => item.deptName == value)

    setMapa(dept ? dept.geojson : "/others/hn.json")
    setMapaElegido(dept ? value : "Honduras")
    setSelectedYear("Ninguno")
    setLevel("Ninguno")
    console.log("value: " + value)
    console.log("mapa: " + mapa)
  }
  const setValue = () => {
    const dept = deptList.find((item) => item.geojson == mapa)
    return dept ? dept.deptName : "Honduras"
  }
  console.log('Current language:', i18n.language);

  const baseTitle = title?.replace(/\s+en\s+Honduras/i, '').trim() || "Indicador Educativo";
  const titleText =
    baseTitle +
    (mapaElegido !== "Ninguno" ? ` en ${mapaElegido}` : "") +
    (level !== "Ninguno" ? ` - ${level}` : "") +
    (selectedYear !== "Ninguno" ? ` ${selectedYear}` : "");

  return (
    <>
      {/* Menú*/}
      <div style={{
        width: '250px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #dee2e6',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{t("OpcionesMapa")}</h2>

        {/* Filtros */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>{t("Filtro")}</h4>
          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title={t("Nivel Educativo")}
              options={[t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")]}
              value={menuName}
              onChange={changeLevel}
            >
            </ComboBox>
          </div>


          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title={t("Año")}
              options={[t("Ninguno"), ...years]}
              value={selectedYear}
              onChange={setSelectedYear}>
            </ComboBox>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title={"Mapa Seleccionado"}
              options={deptNames}
              value={setValue()}
              onChange={changeValue}>
            </ComboBox>
          </div>
        </div>

        {/* Visualización */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>{t("Visualizacion")}</h4>
          <button style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {t("ReiniciarVista")}
          </button>

          <button
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#e9ecef',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => exportPDF(titleText)}>
            {t("Descargar")}
          </button>
          <button
            onClick={() => exportPNG(titleText)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#e9ecef',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Descargar Mapa
          </button>

          <Form>
            <div key="default-checkbox" style={{ marginTop: '10px' }}>
              <Form.Check
                type={"checkbox"}
                onClick={() => setInclude(!include)}
                label={`Incluir porcentajes`}
              />
            </div>
          </Form>

          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer'
          }}

            onClick={() => exportExcel()}>
            {t("exportExcel")}
          </button>

        </div>
      </div>

      <MapModal showModal={show} setShowModal={setShow}></MapModal>
    </>
  )

}