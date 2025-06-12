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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const BarGraph = dynamic(() => import("@/graphs/BarGraph"), { ssr: false });
const LineGraph = dynamic(() => import("@/graphs/LineGraph2"), { ssr: false });
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

  const [selectedYear, setSelectedYear] = useState("Ninguno");
  const [selectedLevel, setSelectedLevel] = useState("Ninguno");
  const [selectedDepartment, setSelectedDepartment] = useState("Ninguno");
  const [showGraph, setShowGraph] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredData, setFilteredData] = useState<Department[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const levels = [
    t("Ninguno"),
    t("Pre-basica"),
    t("BasicaI"),
    t("BasicaII"),
    t("BasicaIII"),
    t("Basica1y2"),
    t("Basica1,2,3"),
    t("Media")
  ];

  const [activeGraph, setActiveGraph] = useState<'bar'|'line'|'pie'>('bar');
  const [activeFilter, setActiveFilter] = useState<'year'|'department'>('year');
  const [isHovered, setIsHovered] = useState(false);

  const displayTitle =
    title +
    (selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : "") +
    (selectedYear  !== "Ninguno" ? ` (${selectedYear})` : "");
  // Helpers
  const capitalizeWords = (s: string) =>
    s.toLowerCase()
     .split(' ')
     .map(w => w[0].toUpperCase() + w.slice(1))
     .join(' ');

  const assignColorsToLegends = (items: Legend[]): Legend[] => {
    const map: Record<string,string> = {
      "Mucho mejor que la meta":"#008000",
      "Dentro de la meta":"#27ae60",
      "Lejos de la meta":"#FFC300",
      "Muy lejos de la meta":"#e41a1c",
      "N/A":"#808080"
    };
    return items.map(l => ({ ...l, color: map[l.message] || "#808080" }));
  };

  const fallback: Legend = { level:"", message:"", lowerLimit:0, upperLimit:0, color:"#FFFFFF" };

  const getDeptColor = (name:string, year?:string):string => {
    let cur = filteredData.find(d =>
      d.name.toLowerCase()===name.toLowerCase() &&
      (activeGraph!=='line' || d.year===year)
    );
    const v = cur ? cur.value : -1;
    const dark   = legends.find(l=>l.message==="Mucho mejor que la meta"&&l.level===selectedLevel) ?? fallback;
    const green  = legends.find(l=>l.message==="Dentro de la meta"&&l.level===selectedLevel) ?? fallback;
    const yellow = legends.find(l=>l.message==="Lejos de la meta"&&l.level===selectedLevel) ?? fallback;
    if(selectedLevel==="Ninguno"||selectedYear==="Ninguno") return "#808080";
    if(v>=dark.lowerLimit&&v<=dark.upperLimit)   return "#008000";
    if(v>=green.lowerLimit&&v<=green.upperLimit) return "#27ae60";
    if(v>=yellow.lowerLimit&&v<=yellow.upperLimit) return "#FFC300";
    if(v===-1) return "#808080";
    return "#e41a1c";
  };

  // Exportar a Excel
  const exportExcel = async () => {
    const nombre = "Departamentos";
    if(!departments||selectedYear==="Ninguno"||selectedLevel==="Ninguno") return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(document.getElementById("Titulo")?.textContent||"Datos");

    if(activeGraph!=='line') {
      ws.columns = [
        {header:nombre, key:'name', width:30},
        {header:'Tasa',   key:'value',width:15},
        {header:'Leyenda',key:'legend',width:50},
        {header:'Color',  key:'color',width:30},
      ];
    } else {
      ws.columns = [
        {header:nombre, key:'name', width:30},
        {header:'Tasa',   key:'value',width:15},
        {header:'Leyenda',key:'legend',width:50},
        {header:'Año',    key:'año',  width:15},
        {header:'Color',  key:'color',width:30},
      ];
    }

    ws.getRow(1).eachCell(cell=>{
      cell.alignment={vertical:'middle',horizontal:'center'};
      cell.font={bold:true,size:12};
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'4472C4'}};
      cell.border={left:{style:'thin'}, right:{style:'thin'}};
    });

    filteredData.forEach(dept=>{
      const rowData: any = {
        name: capitalizeWords(dept.name),
        value: dept.value+"%",
        legend: dept.legend,
        Color: ""
      };
      if(activeGraph==='line') rowData.año = dept.year;
      const row = ws.addRow(rowData);
      row.getCell('color').fill = {
        type:'pattern',
        pattern:'solid',
        fgColor:{argb:getDeptColor(dept.name,dept.year).substring(1)}
      };
    });

    const fr = filteredData.length + 3;
    ws.mergeCells(`A${fr}:D${fr}`);
    ws.getCell(`A${fr}`).value = `© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados
La información y los formatos presentados...`;
    ws.getRow(fr).alignment={wrapText:true,horizontal:'center'};
    ws.getRow(fr).height = 100;

    const buf = await wb.xlsx.writeBuffer();
    const fn = `${displayTitle}.xlsx`;
    saveAs(new Blob([buf]), fn);
  };
  // Fetch de datos 
  const fetchData = async () => {
    setLoading(true);
    try {
      const cfg = { headers:{ 'Content-Type':'application/json','Accept':'application/json' } };
      const [dRes,lRes,yRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`,cfg),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`,cfg),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`,cfg),
      ]);
      const deps = dRes.data.map((i:any):Department=>({
        name: capitalizeWords(i.departamento),
        legend: i.leyenda,
        value: parseFloat(i.tasa)||0,
        year: i.periodo_anual,
        level: i.nivel
      }));
      const legs = lRes.data.map((i:any):Legend=>({
        level: i.nivel,
        message: i.leyenda,
        lowerLimit: parseFloat(i.min),
        upperLimit: parseFloat(i.max),
        color: ''
      }));
      setDepartments(deps);
      setLegends(assignColorsToLegends(legs));
      setYears(yRes.data);
      applyFilters(deps, selectedYear, selectedLevel, selectedDepartment);
    } catch(e) {
      console.error("Error fetching data:", e);
    }
    setLoading(false);
  };

  // Filtrar datos 
  const applyFilters = (data:Department[], year:string, level:string, dept:string) => {
    if((year==="Ninguno"&&level==="Ninguno")||(dept==="Ninguno"&&level==="Ninguno")){
      setFilteredData([]); return;
    }
    let res = [...data];
    if(activeGraph!=='line'){
      if(year!=="Ninguno") res = res.filter(d=>d.year===year);
    } else {
      if(dept!=="Ninguno") res = res.filter(d=>d.name.toLowerCase()===dept.toLowerCase());
    }
    if(level!=="Ninguno") res = res.filter(d=>d.level===level);
    res.sort((a,b)=>a.name.localeCompare(b.name));
    setFilteredData(res);
    setShowGraph(
      activeGraph!=='line'
        ? (year!=="Ninguno"&&level!=="Ninguno")
        : (dept!=="Ninguno"&&level!=="Ninguno")
    );
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    if(departments.length>0){
      applyFilters(departments, selectedYear, selectedLevel, selectedDepartment);
    }
  }, [selectedYear, selectedLevel, selectedDepartment, departments, activeGraph]);
  // renderGraph
  const renderGraph = () => {
    if(activeGraph==='bar'){
      return (
        <BarGraph
          data={filteredData.map(d=>({
            name:d.name, value:d.value, legend:d.legend, year:d.year, level:d.level
          }))}
          xAxisKey="name"
          yAxisKey="value"
          legendKey="legend"
          legends={legends}
        />
      );
    }
    if(activeGraph==='line'){
      const ld = filteredData
        .sort((a,b)=>parseInt(a.year)-parseInt(b.year))
        .map(d=>({ departamento:d.name, year:d.year, value:d.value, legend:d.legend }));
      return (
        <LineGraph
          data={ld}
          xAxisKey="year"
          yAxisKey="value"
          legendKey="legend"
          legends={legends}
        />
      );
    }
    return (
      <PieGraph
        data={filteredData.map(d=>({
          name:d.name, value:d.value, legend:d.legend, year:d.year, level:d.level
        }))}
      />
    );
  };

  // renderFilter
  const renderFilter = () =>
    activeFilter==='year' ? (
      <div style={{ flex:1, minWidth:'200px' }}>
        <label style={{ display:'block', marginBottom:'5px', fontWeight:'bold' }}>
          {t("Año")}:
        </label>
        <select
          value={selectedYear}
          onChange={e=>setSelectedYear(e.target.value)}
          style={{ width:'100%',padding:'10px',borderRadius:'4px',border:'1px solid #ddd' }}
        >
          <option value="Ninguno">{t("Ninguno")}</option>
          {years.map(y=> <option key={y} value={y}>{y}</option> )}
        </select>
      </div>
    ) : (
      <div style={{ flex:1, minWidth:'200px' }}>
        <label style={{ display:'block', marginBottom:'5px', fontWeight:'bold' }}>
          {t("Departamento")}:
        </label>
        <select
          value={selectedDepartment}
          onChange={e=>setSelectedDepartment(e.target.value)}
          style={{ width:'100%',padding:'10px',borderRadius:'4px',border:'1px solid #ddd' }}
        >
          <option value="Ninguno">{t("Ninguno")}</option>
          {[...new Set(departments.map(d=>d.name))].sort().map(dep=>
            <option key={dep} value={dep}>{dep}</option>
          )}
        </select>
      </div>
    );
    
  const handleDownloadImage = async () => {
    if(!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const link = document.createElement("a");
    link.download = displayTitle + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDownloadPDF = async () => {
    if(!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape","pt","a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img,"PNG",0,0,w,h);
    pdf.save(displayTitle + ".pdf");
  };

  const handlePrint = async () => {
    if(!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current);
    const dataUrl = canvas.toDataURL("image/png");
    const printWindow = window.open("","_blank","width=800,height=600");
    if(!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${displayTitle}</title>
          <style>
            body { margin:0; padding:20px; text-align:center; }
            h2 { margin-bottom:20px; }
            img { max-width:100%; height:auto; border:none; }
          </style>
        </head>
        <body>
          <h2>${displayTitle}</h2>
          <img src="${dataUrl}" alt="Gráfico" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  return (
    <Client>
      <div className="font">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height:"100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div style={{ width:'100%', height:'100%', padding:'20px' }}>
            {/* Filtros */}
            <div style={{ display:'flex', gap:'20px', marginBottom:'20px', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:'200px' }}>
                <label style={{ display:'block', marginBottom:'5px', fontWeight:'bold' }}>
                  {t("Nivel Educativo")}:
                </label>
                <select
                  value={selectedLevel}
                  onChange={e=>setSelectedLevel(e.target.value)}
                  style={{ width:'100%', padding:'10px', borderRadius:'4px', border:'1px solid #ddd' }}
                >
                  {levels.map(l=> <option key={l} value={l}>{l}</option> )}
                </select>
              </div>
              {renderFilter()}
            </div>

            {/* Zona exportable */}
            <div ref={exportRef}>
              <h2 style={{ marginBottom:'20px' }} id="Titulo">
                {displayTitle}
              </h2>
              <div style={{
                height:'500px',
                border:'1px solid #eee',
                borderRadius:'8px',
                padding:'20px',
                display:'flex',
                flexDirection:'column',
                position:'relative'
              }}>
                {showGraph ? (
                  <>
                    <div style={{ display:'flex', flex:1, gap:'20px', minHeight:0 }}>
                      <div style={{
                        flex:1,
                        minWidth:'300px',
                        position:'relative',
                        overflow:'hidden',
                        height:'100%'
                      }}>
                        {renderGraph()}
                      </div>

                      <div style={{
                        width:'50px',
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'center',
                        justifyContent:'center'
                      }} data-html2canvas-ignore>
                        <ListGroup defaultActiveKey="#link1">
                          <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico de Barras</Tooltip>}>
                            <ListGroup.Item action className='graphsMenu' onClick={()=>{setActiveGraph('bar');setActiveFilter('year');setSelectedDepartment("Ninguno")}}>
                              <i className="bi bi-bar-chart-line"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico de Líneas</Tooltip>}>
                            <ListGroup.Item action className='graphsMenu' onClick={()=>{setActiveGraph('line');setActiveFilter('department');setSelectedDepartment("Ninguno")}}>
                              <i className="bi bi-graph-up"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Gráfico Circular</Tooltip>}>
                            <ListGroup.Item action className='graphsMenu' onClick={()=>{setActiveGraph('pie');setActiveFilter('year');setSelectedDepartment("Ninguno")}}>
                              <i className="bi bi-pie-chart"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Guardar como imagen</Tooltip>}>
                            <ListGroup.Item action className="graphsMenu" onClick={handleDownloadImage}>
                              <i className="bi bi-download"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Imprimir gráfico</Tooltip>}>
                            <ListGroup.Item action className="graphsMenu" onClick={handlePrint}>
                              <i className="bi bi-printer"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Descargar PDF</Tooltip>}>
                            <ListGroup.Item action className="graphsMenu" onClick={handleDownloadPDF}>
                              <i className="bi bi-filetype-pdf"></i>
                            </ListGroup.Item>
                          </OverlayTrigger>
                          <OverlayTrigger placement="left" overlay={<Tooltip>Exportar a Excel</Tooltip>}>
                            <ListGroup.Item
                              action
                              className="graphsMenu d-flex align-items-center justify-content-center"
                              style={{ height:'40px' }}
                              onMouseEnter={()=>setIsHovered(true)}
                              onMouseLeave={()=>setIsHovered(false)}
                              onClick={exportExcel}
                            >
                              <img
                                src={isHovered?"images/excel1.png":"images/excel2.png"}
                                alt="Excel" width={30} height={30}
                              />
                            </ListGroup.Item>
                          </OverlayTrigger>
                        </ListGroup>
                      </div>
                    </div>
                    <FuenteDeDatos />
                  </>
                ) : (
                  <div style={{
                    display:'flex',
                    justifyContent:'center',
                    alignItems:'center',
                    height:'100%',
                    color:'#666'
                  }}>
                    No hay datos disponibles para los filtros seleccionados
                  </div>
                )}
              </div>
            </div>

            <LanguageSelector />
          </div>
        )}
      </div>
    </Client>
  );
}
