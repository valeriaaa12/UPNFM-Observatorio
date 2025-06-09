
import ComboBox from "@/components/combobox";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from "react-bootstrap";
import * as XLSX from 'xlsx';


import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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




export default function MapFilters({mapaElegido, setMapaElegido, level, setLevel, selectedYear, setSelectedYear, years, mapa, setMapa, departments, legends}: params) {
  const { t, i18n } = useTranslation('common');
  const [select, setSelect] = useState("Honduras");
  const [include, setInclude] = useState(false);
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
  "Honduras", "Atlántida","Choluteca","Colón", "Comayagua","Copán","Cortés","El Paraíso","Francisco Morazán","Gracias a Dios","Intibucá","Islas de la Bahía","La Paz","Lempira", "Ocotepeque","Olancho","Santa Bárbara","Valle","Yoro"
];
const capitalizeWords = (str: string) => {
        return str.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};

const exportPDF = async () => {
  try{
    if (typeof window === 'undefined' || !document) return;
    const mapContainer = document.createElement("div");
    mapContainer.id = "map-container";
    const L = (await import('leaflet')).default;
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');
        

    const legendContainer = document.getElementById('legends-container') as HTMLElement;
    const limitsContainer = document.getElementById('limits-container') as HTMLElement;
    const infoContainer = document.getElementById('info-container') as HTMLElement;

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
    const legendClone = legendContainer.cloneNode(true) as HTMLElement;
    const limitsClone = limitsContainer.cloneNode(true) as HTMLElement;
    
 
    mapClone.style.width = '100%';
    mapClone.style.height = '500px';
    legendClone.style.margin = '10px 0';

    limitsClone.style.margin = '10px 0';

    
    const title = document.createElement('h2');
    title.textContent = document.getElementById("Titulo")?.textContent || 'Map Export';
    const subtitle = document.createElement('h3');
    subtitle.textContent = level +" " + selectedYear
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    subtitle.style.textAlign = 'center';
    subtitle.style.marginBottom = '20px';

    const footer = document.createElement('div');
    footer.style.textAlign = "center"
    footer.style.width = '100%'
    footer.style.backgroundColor = "#e0e0e0"
    footer.style.borderRadius = '20px'
    footer.style.height ='180px';
    footer.textContent = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados \n La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados."
    footer.style.marginBottom = '100px'
    footer.style.padding = '10px'
    footer.style.borderBottomRightRadius = '20px'

    const mapDiv = document.createElement("div");
    mapDiv.style.height = '700px'
    mapDiv.appendChild(mapClone)
    mapDiv.appendChild(legendClone)
    mapDiv.appendChild(limitsClone)
    mapDiv.style.position = 'relative'
    mapDiv.style.minHeight = '300px'
    //tabla con valored
    if(include){
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
          name.style.textAlign="center"
          name.style.padding = "6px";
          name.textContent = capitalizeWords(dept.name)

          const value = document.createElement("td")
          value.style.border = "1px solid black";
          value.style.padding = "6px";
          value.style.textAlign="center"
          value.textContent = String(dept.value) + "%"

          row.appendChild(name)
          row.appendChild(value)
          tBody.appendChild(row)

      });
      table.appendChild(tBody)
      tableDiv.appendChild(table)
      //appends al contenedor
      pdfContainer.appendChild(title);
      pdfContainer.appendChild(subtitle);
      pdfContainer.appendChild(mapDiv);
      document.body.appendChild(pdfContainer2);
      pdfContainer2.appendChild(tableDiv);
      pdfContainer2.appendChild(footer); 
    }else{
      pdfContainer.appendChild(title);
      pdfContainer.appendChild(subtitle);
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


    if (infoContainer) {
      const infoClone = infoContainer.cloneNode(true) as HTMLElement;
      infoClone.style.margin = '10px 0';
      pdfContainer.appendChild(infoClone);
    }
    
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
    if(include){
      const canvas2 = await html2canvas(pdfContainer2,{
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
    const exportName = document.getElementById("Titulo")?.textContent + "_" + level + "_" + selectedYear +".pdf"
    pdf.save(exportName);

 
    document.body.removeChild(pdfContainer);
    if(include){
      document.body.removeChild(pdfContainer2);
    }
     controls.forEach((control, i) => {
    (control as HTMLElement).style.visibility = 'visible';
  });
  }catch(error){
    console.log(error)
  }
}

const exportExcel = async () =>{
  
  const nombre = (mapaElegido == "Honduras") ? "Departamento" : "Municipio"

  if(!departments){
    return
  }
  
  const excelFile = new ExcelJS.Workbook();
  const excelSheet = excelFile.addWorksheet(document.getElementById("Titulo")?.textContent || "Datos");
  excelSheet.columns = [
    { header: nombre, key: 'name', width: 30 },
    { header: 'Tasa', key : 'value', width: 15 },
    { header: 'Leyenda', key: 'legend', width: 50 },
  ]

  excelSheet.getRow(1).eachCell((cell) => {
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.font = {bold: true, size: 12};
  
    cell.fill = {
      type: 'pattern',
      pattern: 'solid', 
      fgColor: { argb: '4472C4' } 
    }
    
    cell.border = {
      left: {style:'thin'},
      right: {style:'thin'}
    }
  })

  departments.forEach((dept) => {
    excelSheet.addRow({
      name: capitalizeWords(dept.name),
      value: dept.value + "%",
      legend: dept.legend
    });
  });

  excelSheet.addRow({
    name : "",
    value: "",
    legend: ""
  })

  excelSheet.addRow({
    name : "",
    value: "",
    legend: ""
  })

  excelSheet.addRow({
    name : "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados \n La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados.",
    value: "",
    legend: ""
  })
  const buffer = await excelFile.xlsx.writeBuffer();
  const fileName = document.getElementById("Titulo")?.textContent+"_"+level+"_"+selectedYear+".xlsx";
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
  
    const value = currentDep? currentDep.value : -1;
    
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
  const changeValue = (value:string) => {
    console.clear();
    setSelect(value)
    const dept = deptList.find((item)=>item.deptName==value)

    setMapa(dept ? dept.geojson : "/others/hn.json")
    setMapaElegido(dept ? value : "Honduras")
    setSelectedYear("Ninguno")
    setLevel("Ninguno")
    console.log("value: " + value )
    console.log("mapa: " + mapa)
  }
  const setValue = () => {
    const dept = deptList.find((item) => item.geojson == mapa)
    return dept ? dept.deptName : "Honduras"
  }
  console.log('Current language:', i18n.language);
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
              value={level}
              onChange={setLevel}
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

          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          
          onClick={()=>exportPDF()}>
            {t("Imprimir")}
          </button>

          <Form>
            <div key="default-checkbox" style={{marginTop: '10px'}}>
              <Form.Check 
                type={"checkbox"}
                onClick={()=>setInclude(!include)}
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
          
          onClick={()=>exportExcel()}>
            {t("exportExcel")}
          </button>
          
        </div>
      </div>
    </>
  )

}
