import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import ListGroup from 'react-bootstrap/ListGroup';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FuenteDeDatos from '@/components/FuenteDeDatos';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

//Departamentos
const BarGraph = dynamic(() => import("@/graphs/BarGraph"), {
    ssr: false
});

const LineGraph = dynamic(() => import("@/graphs/LineGraph2"), {
    ssr: false
});

const PieGraph = dynamic(() => import("@/graphs/PieGraph"), {
    ssr: false
});

//Municipios
const BarGraphM = dynamic(() => import("@/graphs/BarGraphM"), {
    ssr: false
});

const LineGraphM = dynamic(() => import("@/graphs/LineGraphM"), {
    ssr: false
});

const PieGraphM = dynamic(() => import("@/graphs/PieGraphM"), {
    ssr: false
});

interface Params {
    title: string;
    extensionData: string;
    extensionLimits: string;
    comparison: boolean;
    department: boolean;
}

interface Legend {
    level: string;
    message: string;
    lowerLimit: number;
    upperLimit: number;
    color: string;
}

interface DataItem {
    name: string;
    value: number;
    legend: string;
    year: string;
    level: string;
    department?: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits, comparison, department }: Params) {
    const exportRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [departmentsData, setDepartmentsData] = useState<DataItem[]>([]);
    const [municipios, setMunicipios] = useState<DataItem[] | null>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [legends, setLegends] = useState<Legend[]>([]);
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState<string[]>([]);
    const { t } = useTranslation('common');
    const levels = [t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")];
    const departments = ["Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso",
        "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira",
        "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"];
    const [activeGraph, setActiveGraph] = useState<'bar' | 'line' | 'pie'>('bar');
    const [activeFilter, setActiveFilter] = useState<'year' | 'department'>('year');
    const [isHovered, setIsHovered] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    const exportExcel = async () => {
        const nombre = "Departamentos"

        if (!departmentsData || selectedYear == "Ninguno" || selectedLevel == "Ninguno") {
            return
        }

        const excelFile = new ExcelJS.Workbook();
        const excelSheet = excelFile.addWorksheet(document.getElementById("Titulo")?.textContent || "Datos");
        if (activeGraph !== 'line') {
            excelSheet.columns = [
                { header: nombre, key: 'name', width: 30 },
                { header: 'Tasa', key: 'value', width: 15 },
                { header: 'Leyenda', key: 'legend', width: 50 },
                { header: 'Color', key: 'color', width: 30 },

            ]
        } else {
            excelSheet.columns = [
                { header: nombre, key: 'name', width: 30 },
                { header: 'Tasa', key: 'value', width: 15 },
                { header: 'Leyenda', key: 'legend', width: 50 },
                { header: 'Año', key: 'año', width: 15 },
                { header: 'Color', key: 'color', width: 30 },
            ]
        }
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
        filteredData.forEach((dept) => {
            if (activeGraph !== 'line') {
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
                    fgColor: { argb: getColor(dept.legend) },
                }
            } else {
                const tempRow = excelSheet.addRow({
                    name: capitalizeWords(dept.name),
                    value: dept.value + "%",
                    legend: dept.legend,
                    año: dept.year,
                    Color: ""
                })

                const tempCell = tempRow.getCell('color')

                tempCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: getDeptColor(dept.name, dept.year).substring(1) },
                }
            }
            number++;
        })
        number += 2;
        excelSheet.mergeCells(`A${number}:D${number}`);

        const cell = excelSheet.getCell(`A${number}`);
        excelSheet.getRow(number).alignment = { wrapText: true, horizontal: 'center' }
        excelSheet.getRow(number).height = 100;
        cell.value = "© 2025 observatorio.upnfm.edu.hn Todos los derechos reservados \n La información y los formatos presentados en este dashboard están protegidos por derechos de autor y son propiedad exclusiva del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM de Honduras (observatorio.upnfm.edu. hn). El uso de esta información está únicamente destinado a fines educativos, de investigación y para la toma de decisiones. El OUDENI-UPNFM no se responsabiliza por el uso indebido de los datos aquí proporcionados."

        const buffer = await excelFile.xlsx.writeBuffer();
        let fileName = `${title}${selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}.xlsx`;
        if (activeGraph === 'line') {
            fileName = `${title}${selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}.xlsx`;
        }
        saveAs(new Blob([buffer]), fileName);
    }
    const getColor = (msg: string) => {
        if (msg === "Mucho mejor que la meta") return "008000"; // verde oscuro
        else if (msg === "Dentro de la meta") return "27ae60"; // verde
        else if (msg === "Lejos de la meta") return "FFC300"; // amarillo           
        else if (msg === "Muy lejos de la meta") return "e41a1c"; // rojo
        return "#808080"; // gris
    }
    const fallback: Legend = {
        level: "",
        message: "",
        lowerLimit: 0,
        upperLimit: 0,
        color: "#FFFFFF"
    }

    const getDeptColor = (deptName: string, year?: string): string => {
        let currentDep = filteredData?.find((item) =>
            item.name.toLowerCase() == deptName.toLowerCase()
        )
        if (activeGraph === 'line') {
            currentDep = filteredData?.find((item) =>
                item.name.toLowerCase() === deptName.toLowerCase() && item.year === year
            );
        }

        const value = currentDep ? currentDep.value : -1;

        const darkgreen: Legend = legends?.find((item) =>
            item.message === "Mucho mejor que la meta" && item.level === selectedLevel
        ) ?? fallback;

        const green: Legend = legends?.find((item) =>
            item.message === "Dentro de la meta" && item.level === selectedLevel
        ) ?? fallback;

        const yellow: Legend = legends?.find((item) =>
            item.message === "Lejos de la meta" && item.level === selectedLevel
        ) ?? fallback;

        const red: Legend = legends?.find((item) =>
            item.message === "Muy lejos de la meta" && item.level === selectedLevel
        ) ?? fallback;

        if (selectedLevel == "Ninguno" || selectedYear == "Ninguno") return '#808080';
        if (value >= darkgreen.lowerLimit && value <= darkgreen!.upperLimit) return '#008000'; //verde oscuro
        if (value >= green!.lowerLimit && value <= green!.upperLimit) return '#27ae60'; //verde
        if (value >= yellow!.lowerLimit && value <= yellow!.upperLimit) return '#FFC300'; //amarillo
        if (value == -1) return '#808080'; //gris
        return '#e41a1c'; //rojo 
    };

    useEffect(() => {
        const handleGraph = () => {
            if (activeGraph === 'bar' || activeGraph === 'pie') {
                setShowGraph((selectedYear !== "Ninguno" && selectedDepartment !== "Ninguno") && selectedLevel !== "Ninguno");
            } else if (activeGraph === 'line') {
                setShowGraph(selectedDepartment !== "Ninguno" && selectedLevel !== "Ninguno");
            }
        };
        handleGraph();
    }, [selectedYear, selectedLevel, selectedDepartment, activeGraph]);

    const capitalizeWords = (str: string) => {
        return str.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const assignColorsToLegends = (legendsData: Legend[]): Legend[] => {
        const colorMap: Record<string, string> = {
            "Mucho mejor que la meta": "#008000",  // Verde oscuro
            "Dentro de la meta": "#27ae60",        // Verde
            "Lejos de la meta": "#FFC300",        // Amarillo
            "Muy lejos de la meta": "#e41a1c", // Rojo
            "N/A": "#808080"       // Gris
        };

        return legendsData.map(legend => ({
            ...legend,
            color: colorMap[legend.message] || "#808080" // sin datos (gris)
        }));
    };

    const filterData = (
        data: DataItem[] = [],
        year: string,
        level: string,
        department: string,
        isMunicipio = false,
        activeGraph: string
    ) => {
        return data.filter(item =>
            // Solo filtra por año si el gráfico NO es de línea
            (activeGraph === 'line' || year === "Ninguno" || item.year === year) &&
            (level === "Ninguno" || item.level?.toLowerCase() === level.toLowerCase()) &&
            (
                isMunicipio
                    ? (department === "Ninguno" || item.department?.toLowerCase() === department.toLowerCase())
                    : (department === "Ninguno" || item.name.toLowerCase() === department.toLowerCase())
            )
        );
    };

    const filteredDepartments = filterData(departmentsData, selectedYear, selectedLevel, selectedDepartment, false, activeGraph);
    const filteredMunicipios = filterData(municipios ?? [], selectedYear, selectedLevel, selectedDepartment, true, activeGraph);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            };

            const [departamentos, legends] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config)
            ]);

            const departmentsData2: DataItem[] = departamentos.data.map((item: any) => ({
                name: capitalizeWords(item.departamento?.toLowerCase() || ""),
                legend: item.leyenda || "",
                value: parseFloat(item.tasa) || 0,
                year: item.periodo_anual?.toString() || "",
                level: item.nivel?.toLowerCase() || "",
                department: item.departamento?.toLowerCase() || ""
            }));

            const legendsData: Legend[] = legends.data.map((item: any) => ({
                level: item.nivel || "",
                message: item.leyenda || "",
                lowerLimit: item.limite_inferior ?? 0,
                upperLimit: item.limite_superior ?? 0,
                color: item.color || "#808080"
            }));

            const legendsWithColors = assignColorsToLegends(legendsData);

            setDepartmentsData(departmentsData2);
            applyFilters(departmentsData, selectedYear, selectedLevel, selectedDepartment);
            setLegends(legendsWithColors);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!comparison && !department && selectedDepartment !== "Ninguno") {
            const fetchMunicipios = async () => {
                setLoading(true);
                try {
                    const config = {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        params: { departamento: selectedDepartment.toUpperCase() }
                    };
                    const [municipios, legends] = await Promise.all([
                        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
                        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config)
                    ]);

                    const legendsData: Legend[] = legends.data.map((item: any) => ({
                        level: item.nivel,
                        message: item.leyenda,
                        lowerLimit: parseFloat(item.min),
                        upperLimit: parseFloat(item.max)
                    }));

                    const municipiosData = municipios.data.map((item: any) => ({
                        name: item.municipio
                            ? capitalizeWords(item.municipio.toString().toLowerCase())
                            : item.departamento
                                ? capitalizeWords(item.departamento.toString().toLowerCase())
                                : 'Sin nombre',
                        value: parseFloat(item.tasa) || 0,
                        legend: item.leyenda,
                        year: item.periodo_anual?.toString() || '',
                        level: (item.nivel ?? '').toString().toLowerCase(),
                        department: (item.departamento ?? '').toString().toLowerCase(),
                    }));

                    const legendsWithColors = assignColorsToLegends(legendsData);
                    setMunicipios(municipiosData);
                    applyFilters(municipiosData, selectedYear, selectedLevel, selectedDepartment);
                    setLegends(legendsWithColors);
                } catch (error) {
                    console.error("Error fetching municipios:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMunicipios();
        }

        if (!comparison && !department && selectedDepartment === "Ninguno") {
            setMunicipios([]);
            setFilteredData([]);
        }
    }, [selectedDepartment, extensionData, comparison, department]);

    const postComparison = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (selectedDepartments.length > 0) {
                const departmentsUpper = selectedDepartments.map(dep => dep.toUpperCase());

                console.log("departmentsUpper", departmentsUpper);
                const [data] = await Promise.all([
                    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, {
                        nivel: selectedLevel, periodo_anual: selectedYear, departamentos: departmentsUpper,
                    }, config)
                ]);

                const departmentsData2: DataItem[] = data.data.map((item: any) => ({
                    name: capitalizeWords(item.departamento.toLowerCase()),
                    legend: item.leyenda,
                    value: parseFloat(item.tasa) || 0,
                    year: selectedYear,
                    level: selectedLevel
                }));

                const legendsData: Legend[] = data.data.map((item: any) => ({
                    level: item.nivel,
                    message: item.leyenda,
                    lowerLimit: parseFloat(item.min) || 0,
                    upperLimit: parseFloat(item.max) || 0
                }));

                const legendsWithColors = assignColorsToLegends(legendsData);
                setLegends(legendsWithColors);
                setDepartmentsData(departmentsData2);
                applyFilters(departmentsData2, selectedYear, selectedLevel, selectedDepartment);

            }
        } catch (error: any) {
            if (error.response) {
                console.error("Backend error:", error.response.data);
            } else {
                console.error("Error:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data: DataItem[], year: string, level: string, department: string) => {
        if ((year === "Ninguno" && level === "Ninguno") || (department === "Ninguno" && level === "Ninguno")) {
            setFilteredData([]);
            return;
        }

        let result = [...data];

        if (activeGraph === 'bar' || activeGraph === 'pie') {
            if (year !== "Ninguno") {
                result = result.filter(d => d.year === year);
            }
        } else if (activeGraph === 'line') {
            if (department !== "Ninguno") {
                result = result.filter(d => d.name.toLowerCase() === department.toLowerCase());
            }
        }

        if (level !== "Ninguno") {
            result = result.filter(d => d.level === level);
        }

        // Si es municipios, filtra por departamento también
        if (!department && selectedDepartment !== "Ninguno") {
            result = result.filter(d => d.department === selectedDepartment.toLowerCase());
        }

        result.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredData(result);

        if (activeGraph === 'bar' || activeGraph === 'pie') {
            setShowGraph(year !== "Ninguno" && level !== "Ninguno");
        } else {
            setShowGraph(department !== "Ninguno" && level !== "Ninguno");
        }
    };

    const formatDataForLineGraphD = (data: DataItem[]) => {
        return data
            .sort((a, b) => parseInt(a.year) - parseInt(b.year))
            .map(({ year, value, name, legend }) => ({
                departamento: name,
                year,
                value,
                legend,
            }));
    };

    const formatDataForLineGraphM = (data: DataItem[]) => {
        return data
            .sort((a, b) => parseInt(a.year) - parseInt(b.year))
            .map(({ year, value, name, legend, level }) => ({
                name,
                year,
                value,
                legend,
                level,
            }));
    };

    useEffect(() => {
        getYears();
        if (!comparison && department) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (departmentsData.length > 0) {
            applyFilters(departmentsData, selectedYear, selectedLevel, selectedDepartment);
        }
    }, [selectedYear, selectedLevel, selectedDepartment, departmentsData]);


    const renderGraphD = () => {
        if (activeGraph === 'bar') {
            return (
                < BarGraph
                    data={filteredDepartments}
                    yAxisKey="value"
                    legendKey="legend"
                    legends={legends}
                />
            );
        }
        if (activeGraph === 'line') {
            const lineData = formatDataForLineGraphD(filteredDepartments);
            return (
                <LineGraph
                    data={lineData}
                    legends={legends}
                    years={years}
                />
            );
        }
        if (activeGraph === 'pie') {
            return (
                <PieGraph
                    data={filteredDepartments}
                />
            );
        }
    };

    const renderGraphM = () => {
        if (activeGraph === 'bar') {
            return (
                <BarGraphM
                    data={filteredMunicipios}
                    legendKey="legend"
                    legends={legends}
                    yAxisKey="value"
                />
            );
        }
        if (activeGraph === 'line') {
            const lineData = formatDataForLineGraphM(filteredMunicipios);
            return (
                <LineGraphM
                    data={lineData}
                    years={years}
                />
            );
        }
        if (activeGraph === 'pie') {
            return (
                <PieGraphM
                    data={filteredMunicipios}
                />
            );
        }
    };

    const renderFilter = () => {
        if (department) {
            if (activeFilter === 'year') {
                return (
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            {t("Año")}:
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
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
                )
            } else {
                return (
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            {t("Departamento")}:
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="Ninguno">{t("Ninguno")}</option>
                            {departments.map((department, index) => (
                                <option key={index} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div >
                )
            }
        } else {
            return (
                <>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            {t("Año")}:
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
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
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            {t("Departamento")}:
                        </label>
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                            <option value="Ninguno">{t("Ninguno")}</option>
                            {departments.map((department, index) => (
                                <option key={index} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div >
                </>
            )
        }
    }


    const handleCheck = (dept: string) => {
        setSelectedDepartments((prev: string[]) =>
            prev.includes(dept)
                ? prev.filter((d: string) => d !== dept)
                : [...prev, dept]
        );
    };

    const getYears = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            };

            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`, config);
            setYears(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleDownloadImage = async () => {
        if (!exportRef.current) return;
        const off = document.createElement('div');
        Object.assign(off.style, {
            position: 'fixed', left: '-9999px',
            width: '800px', height: '600px',
            background: 'white', overflow: 'hidden'
        });
        document.body.appendChild(off);

        const clone = exportRef.current.cloneNode(true) as HTMLElement;
        clone.style.width = '800px';
        clone.style.height = '600px';
        off.appendChild(clone);

        await new Promise(r => setTimeout(r, 300));
        const canvas = await html2canvas(off, { scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.download = `${title}${selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        document.body.removeChild(off);
    };

    const handleDownloadPDF = async () => {
        if (!exportRef.current) return;
        const off = document.createElement('div');
        Object.assign(off.style, {
            position: 'fixed', left: '-9999px',
            width: '800px', height: '600px',
            background: 'white', overflow: 'hidden'
        });
        document.body.appendChild(off);

        const clone = exportRef.current.cloneNode(true) as HTMLElement;
        clone.style.width = '800px';
        clone.style.height = '600px';
        off.appendChild(clone);

        await new Promise(r => setTimeout(r, 300));
        const canvas = await html2canvas(off, { scale: 2, useCORS: true });
        const img = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const w = pdf.internal.pageSize.getWidth();
        const h = (canvas.height * w) / canvas.width;
        pdf.addImage(img, 'PNG', 0, 0, w, h);
        pdf.save(`${title}${selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}.pdf`);
        document.body.removeChild(off);
    };

    // Imprimir el gráfico (fija tamaño y evita distorsión)
    const handlePrintGraph = async () => {
        if (!exportRef.current) return;

        // 1) Crear contenedor off-screen de tamaño fijo
        const off = document.createElement('div');
        Object.assign(off.style, {
            position: 'fixed',
            left: '-9999px',
            width: '800px',
            height: '600px',
            background: 'white',
            overflow: 'hidden'
        });
        document.body.appendChild(off);

        // 2) Clonar el nodo real dentro de él
        const clone = exportRef.current.cloneNode(true) as HTMLElement;
        clone.style.width = '800px';
        clone.style.height = '600px';
        off.appendChild(clone);

        // 3) Esperar renderizado
        await new Promise(r => setTimeout(r, 300));

        // 4) Capturar con html2canvas
        const canvas = await html2canvas(off, { scale: 2, useCORS: true });
        const dataUrl = canvas.toDataURL('image/png');

        // 5) Abrir ventana nueva y escribir la imagen
        const pw = window.open('', '_blank', 'width=900,height=650');
        if (pw) {
            pw.document.write(`
      <html>
        <head><title>${title}${selectedLevel !== "Ninguno" ? ` - ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}</title></head>
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

        // 6) Limpiar
        document.body.removeChild(off);
    };



    return (
        <Client>
            <div className="font" >
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%', padding: '20px' }}>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            {/* Nivel */}
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    {t("Nivel Educativo")}:
                                </label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Filtros de comparacion */}
                            {comparison ? (
                                <>
                                    {/* Año */}
                                    <div style={{ flex: 1, minWidth: '220px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                            {t("Año")}:
                                        </label>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
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
                                    {/* Departamento */}
                                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <Dropdown autoClose={false}>
                                            <Dropdown.Toggle className='btn-orange' style={{ width: '100%', minHeight: '45px' }}>
                                                {t("Departamento")}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{ maxHeight: 300, overflowY: 'auto', width: '100%' }}>
                                                {departments.map((dept) => (
                                                    <Dropdown.Item
                                                        key={dept}
                                                        as="div"
                                                        className="px-2"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`dept-${dept}`}
                                                            label={dept}
                                                            checked={selectedDepartments.includes(dept)}
                                                            onChange={() => handleCheck(dept)}
                                                        />
                                                    </Dropdown.Item>
                                                ))}
                                                <Dropdown.Divider />
                                                <div className="d-flex px-2 py-1 justify-content-end ">
                                                    <button
                                                        className="btn btn-blue"
                                                        onClick={postComparison}
                                                        type="button"
                                                    >
                                                        Graficar
                                                    </button>
                                                </div>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </>
                            ) : (
                                renderFilter()
                            )}
                        </div>
                        <div ref={exportRef}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {title} {selectedLevel !== "Ninguno" ? `- ${selectedLevel}` : ""} {selectedYear !== "Ninguno" ? `(${selectedYear})` : ""}
                            </h2>
                            <div style={{
                                height: '500px',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative'
                            }}>
                                {showGraph ? (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            flex: 1,
                                            gap: '20px',
                                            minHeight: 0,
                                        }}>
                                            {/* Gráfico */}
                                            <div style={{
                                                flex: 1,
                                                minWidth: '300px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                height: '100%',
                                            }}>
                                                {department ? renderGraphD() : renderGraphM()}
                                            </div>

                                            {/* Menú derecho */}
                                            <div style={{
                                                width: '50px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <ListGroup defaultActiveKey="#link1">
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={<Tooltip>Gráfico de Barras</Tooltip>}
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('bar');
                                                                setActiveFilter('year');
                                                                setSelectedDepartment("Ninguno");
                                                            }}
                                                        >
                                                            <i className="bi bi-bar-chart-line"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Gráfico de Líneas
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('line');
                                                                setActiveFilter('department');
                                                                setSelectedDepartment("Ninguno");
                                                            }}
                                                        >
                                                            <i className="bi bi-graph-up"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Gráfico Circular
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('pie');
                                                                setActiveFilter('year');
                                                                setSelectedDepartment("Ninguno");
                                                            }}
                                                        >

                                                            <i className="bi bi-pie-chart"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Guardar como imagen
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            onClick={handleDownloadImage}
                                                        >
                                                            <i className="bi bi-download"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Imprimir Gráfico
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            onClick={handlePrintGraph}
                                                        >
                                                            <i className="bi bi-printer"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Exportar a Excel
                                                            </Tooltip>
                                                        }

                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu d-flex align-items-center justify-content-center'
                                                            style={{ height: "40px" }}
                                                            active={false}
                                                            onMouseEnter={() => setIsHovered(true)}
                                                            onMouseLeave={() => setIsHovered(false)}
                                                            onClick={() => exportExcel()}
                                                        >
                                                            <img
                                                                src={isHovered ? "images/excel1.png" : "images/excel2.png"}
                                                                alt="Excel"
                                                                width={30}
                                                                height={30}
                                                                style={{ display: "block" }}
                                                            />
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                Descargar PDF
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            onClick={handleDownloadPDF}
                                                        >
                                                            <i className="bi bi-filetype-pdf"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                </ListGroup>
                                            </div>
                                        </div>
                                        <FuenteDeDatos />

                                    </>

                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        color: '#666'
                                    }}>
                                        No hay datos disponibles para los filtros seleccionados
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <LanguageSelector />
            </div>
        </Client >
    );
}