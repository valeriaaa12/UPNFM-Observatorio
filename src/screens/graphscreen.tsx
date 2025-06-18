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
import MessageModal from '@/modals/modal';
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

interface Municipios {
    nombre: string;
    departamento: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits, comparison, department }: Params) {
    const { t } = useTranslation('common');
    const exportRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    const [departmentsData, setDepartmentsData] = useState<DataItem[]>([]);
    const [municipios, setMunicipios] = useState<DataItem[] | null>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [legends, setLegends] = useState<Legend[]>([]);

    const [years, setYears] = useState<string[]>([]);
    const levels = [{ name: t("Ninguno"), value: "Ninguno" }, { name: t("Pre-basica"), value: "Pre-básica" }, { name: t("BasicaI"), value: "Básica I Ciclo" }, { name: t("BasicaII"), value: "Básica II Ciclo" }, { name: t("BasicaIII"), value: "Básica III Ciclo" }, { name: t("Basica1y2"), value: "Básica I-II Ciclo" }, { name: t("Basica1,2,3"), value: "Básica I-II-III Ciclo" }, { name: t("Media"), value: "Media" }];
    const departments = ["Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso",
        "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira",
        "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"];
    const [activeGraph, setActiveGraph] = useState<'bar' | 'line' | 'pie'>('bar');
    const [municipiosList, setMuniList] = useState<Municipios[]>([]);

    //comparacion
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    //comparacion municipios
    const [selectedDepartmentsMuni, setSelectedDepartmentsMuni] = useState<string[]>([]);
    const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);
    const [showMunicipiosDropdown, setShowMunicipiosDropdown] = useState(false);

    //states para validaciones de menu
    const [dataSelectedImg, setDataSelectedImg] = useState<boolean>(false);
    const [dataSelectedPdf, setDataSelectedPdf] = useState<boolean>(false);
    const [dataSelectedExcel, setDataSelectedExcel] = useState<boolean>(false);
    const [dataSelectedPrint, setDataSelectedPrint] = useState<boolean>(false);
    const [dataSelectedComparison, setDataSelectedComparison] = useState<boolean>(false);

    //pruebas
    const exportExcel = async () => {
        const nombre = department ? "Departamentos" : "Municipios"

        if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
            setDataSelectedExcel(true);
            return
        }

        if (comparison && selectedDepartments.length === 0) {
            setDataSelectedComparison(true);
            return;
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
        const filteredList = department ? filteredDepartments : filteredMunicipios;
        filteredList.forEach((dept) => {
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
                    fgColor: { argb: getColor(dept.legend) },
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


    useEffect(() => {
        const handleGraph = () => {
            if (activeGraph === 'bar' || activeGraph === 'pie') {
                setShowGraph((department && selectedYear !== "Ninguno" && selectedLevel !== "Ninguno") || (!department && selectedDepartment !== "Ninguno" && selectedLevel !== "Ninguno" && selectedYear !== "Ninguno"));
            } else if (activeGraph === 'line') {
                setShowGraph(selectedDepartment !== "Ninguno" && selectedLevel !== "Ninguno");
            }
        };
        handleGraph();
    }, [selectedYear, selectedLevel, selectedDepartment, activeGraph]);

    const capitalizeWords = (str: string) => {
        if (!str) return '';
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

    // Si está en modo comparación y no es departamento, usar departmentsData para municipios comparados
    const filteredDepartments = filterData(departmentsData, selectedYear, selectedLevel, selectedDepartment, false, activeGraph);
    const filteredMunicipios = comparison && !department
        ? filterData(departmentsData, selectedYear, selectedLevel, selectedDepartment, true, activeGraph)
        : filterData(municipios ?? [], selectedYear, selectedLevel, selectedDepartment, true, activeGraph);

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
            console.log("legends1")
            console.log(legends.data)
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
                lowerLimit: item.limite_inferior || item.min || 0,
                upperLimit: item.limite_superior || item.max || 0,
                color: item.color || "#808080"
            }));

            const legendsWithColors = assignColorsToLegends(legendsData);



            setDepartmentsData(departmentsData2);
            setLegends(legendsWithColors);

            applyFilters(departmentsData, selectedYear, selectedLevel, selectedDepartment);


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
                            ? capitalizeWords(item.municipio.toString())
                            : item.departamento
                                ? capitalizeWords(item.departamento.toString())
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

    const postComparisonDepa = async () => {
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

            } else {
                setShowGraph(false);
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

    useEffect(() => {
        const departamentos = municipiosList
            .filter(muni => selectedMunicipios.includes(muni.nombre))
            .map(muni => muni.departamento);

        const departamentosUnicos = Array.from(new Set(departamentos));
        setSelectedDepartmentsMuni(departamentosUnicos);
    }, [selectedMunicipios, municipiosList]);

    const postComparisonMuni = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (selectedMunicipios.length > 0) {
                const municipiosUpper = selectedMunicipios.map(muni => muni.toUpperCase());
                const departamentosUpper = selectedDepartmentsMuni.map(dep => dep.toUpperCase());

                const [data] = await Promise.all([
                    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, {
                        departamentos: departamentosUpper, municipios: municipiosUpper, nivel: selectedLevel, periodo_anual: selectedYear
                    }, config)
                ]);

                const muniData: DataItem[] = data.data.map((item: any) => ({
                    name: capitalizeWords(item.municipio.toLowerCase()),
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
                setDepartmentsData(muniData);
                applyFilters(muniData, selectedYear, selectedLevel, selectedDepartment);
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

        if (!comparison && department) {
            fetchData();
        } else {
            setLoading(false);
        }

        getYears();
    }, []);

    useEffect(() => {
        if (departmentsData.length > 0) {
            applyFilters(departmentsData, selectedYear, selectedLevel, selectedDepartment);
        }
    }, [selectedYear, selectedLevel, selectedDepartment, departmentsData]);

    const fetchMunicipios = async (departamentos: string[]) => {
        setSelectedDepartmentsMuni([]);
        if (!departamentos || departamentos.length === 0) {
            setMuniList([]);
            return;
        }
        try {
            let allMunicipios: Municipios[] = [];
            for (const dept of departamentos) {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/getMunicipios`,
                    { params: { departamento: dept.toUpperCase() } }
                );
                const municipiosDept = response.data.map((item: any) => ({
                    nombre: capitalizeWords(item.municipio) || capitalizeWords(item.nombre),
                    departamento: dept
                }));
                allMunicipios = allMunicipios.concat(municipiosDept);
            }
            setMuniList(allMunicipios);
            setSelectedMunicipios(prev =>
                prev.filter(nombre => allMunicipios.some(muni => muni.nombre === nombre))
            );
        } catch (error) {
            console.error("Error fetching municipios:", error);
        }
    };

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
            const filteredLegends = legends.filter(item => item.level == selectedLevel)
            return (
                <LineGraph
                    data={lineData}
                    legends={filteredLegends}
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

    const handleCheck = (dept?: string, muni?: string) => {
        if (department) {
            if (dept) {
                setSelectedDepartments((prev: string[]) =>
                    prev.includes(dept)
                        ? prev.filter((d: string) => d !== dept)
                        : [...prev, dept]
                );
            }
        } else {
            if (dept) {
                setSelectedDepartmentsMuni((prev: string[]) =>
                    prev.includes(dept)
                        ? prev.filter((d: string) => d !== dept)
                        : [...prev, dept]
                );
            }
            if (muni) {
                setSelectedMunicipios((prev: string[]) =>
                    prev.includes(muni)
                        ? prev.filter((d: string) => d !== muni)
                        : [...prev, muni]
                );
            }
        }
    };

    const handleDownloadImage = async () => {
        if (!exportRef.current) return;
        if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
            setDataSelectedImg(true);
            return
        }
        if (comparison && selectedDepartments.length === 0) {
            setDataSelectedComparison(true);
            return;
        }
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
        if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
            setDataSelectedPdf(true);
            return
        }
        if (comparison && selectedDepartments.length === 0) {
            setDataSelectedComparison(true);
            return;
        }
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

    // Imprimir el gráfico
    const handlePrintGraph = async () => {
        if (!exportRef.current) return;

        if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
            setDataSelectedPrint(true)
            return
        }
        if (comparison && selectedDepartments.length === 0) {
            setDataSelectedComparison(true);
            return;
        }
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
                                        <option key={level.value} value={level.value}>
                                            {level.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Filtros */}
                            {(activeGraph !== 'line') && (
                                <>
                                    {/* Año */}
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
                                </>
                            )
                            }
                            {comparison && (
                                <>
                                    {/* Departamentos */}
                                    <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <Dropdown autoClose={false}>
                                            <Dropdown.Toggle className='btn-orange' style={{ width: '100%', minHeight: '45px' }}>
                                                {t("Departamento")}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu style={{ maxHeight: 300, overflowY: 'auto', width: '100%' }}>
                                                {departments.map((dept: string) => (
                                                    <Dropdown.Item
                                                        key={dept}
                                                        as="div"
                                                        className="px-2"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        {department ? (
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`dept-${dept}`}
                                                                label={dept}
                                                                checked={selectedDepartments.includes(dept)}
                                                                onChange={() => handleCheck(dept, undefined)}
                                                            />
                                                        ) : (
                                                            <Form.Check
                                                                type="checkbox"
                                                                id={`dept-${dept}`}
                                                                label={dept}
                                                                checked={selectedDepartmentsMuni.includes(dept)}
                                                                onChange={() => handleCheck(dept, undefined)}
                                                            />
                                                        )}

                                                    </Dropdown.Item>
                                                ))}
                                                <Dropdown.Divider />
                                                {
                                                    department ? (
                                                        <div className="d-flex px-2 py-1 justify-content-end ">
                                                            <button
                                                                className="btn btn-blue"
                                                                onClick={postComparisonDepa}
                                                                type="button"
                                                            >
                                                                Graficar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="d-flex px-2 py-1 justify-content-end ">
                                                            <button
                                                                className="btn btn-blue"
                                                                onClick={() => {
                                                                    fetchMunicipios(selectedDepartmentsMuni);
                                                                    setShowMunicipiosDropdown(true);
                                                                }}
                                                                type="button"
                                                            >
                                                                Listar Municipios
                                                            </button>
                                                        </div>)
                                                }

                                            </Dropdown.Menu >
                                        </Dropdown >
                                    </div >
                                </>
                            )
                            }

                            {
                                (!comparison) && (
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
                            {
                                (comparison && !department) && (
                                    <>
                                        {/* Municipios */}
                                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                            <Dropdown autoClose={false} show={showMunicipiosDropdown} onToggle={setShowMunicipiosDropdown}>
                                                <Dropdown.Toggle className='btn-orange' style={{ width: '100%', minHeight: '45px' }}>
                                                    {t("Municipios")}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu style={{ maxHeight: 300, overflowY: 'auto', width: '100%' }}>
                                                    {municipiosList.length === 0 ? (
                                                        <div className="px-2 py-1 text-center text-muted">
                                                            {t("Seleccione un departamento y luego haga click en 'Listar Municipios'")}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {municipiosList.map((muni: Municipios) => (
                                                                <Dropdown.Item
                                                                    key={muni.nombre}
                                                                    as="div"
                                                                    className="px-2"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id={`muni-${muni.nombre}`}
                                                                        label={muni.nombre}
                                                                        checked={selectedMunicipios.includes(muni.nombre)}
                                                                        onChange={() => handleCheck(undefined, muni.nombre)}
                                                                    />
                                                                </Dropdown.Item>
                                                            ))}
                                                            <Dropdown.Divider />
                                                            <div className="d-flex px-2 py-1 justify-content-end ">
                                                                <button
                                                                    className="btn btn-blue"
                                                                    onClick={() => {
                                                                        postComparisonMuni();
                                                                        setShowMunicipiosDropdown(false);
                                                                    }}
                                                                    type="button"
                                                                >
                                                                    Graficar
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </>
                                )
                            }
                        </div >
                        <div ref={exportRef}>
                            <h2 style={{ marginBottom: '20px' }}>
                                {title} {selectedLevel !== "Ninguno" ? `- ${selectedLevel}` : ""} {(selectedYear !== "Ninguno" && (activeGraph != "line" || comparison)) ? `(${selectedYear})` : ""}
                            </h2>
                            <div
                                style={{
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    background: '#fff'
                                }}
                            >
                                {true ? (
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: '20px',
                                                minHeight: 0,
                                            }}
                                        >
                                            {/* Gráfico */}
                                            {showGraph ? <div
                                                style={{
                                                    flex: 1,
                                                    minWidth: '300px',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    background: '#fff'
                                                }}
                                            >
                                                {department ? renderGraphD() : renderGraphM()}
                                            </div> :
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        minWidth: '300px',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        background: '#fff'
                                                    }}
                                                >

                                                </div>}

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
                                                        overlay={<Tooltip>{t("Gráfico de Barras")}</Tooltip>}
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('bar');
                                                                setSelectedDepartment("Ninguno");
                                                                department && setSelectedDepartment("Ninguno");
                                                            }}
                                                        >
                                                            <i className="bi bi-bar-chart-line"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                {t("Gráfico de Líneas")}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('line');
                                                                setSelectedDepartment("Ninguno");
                                                                department && setSelectedDepartment("Ninguno");
                                                            }}
                                                        >
                                                            <i className="bi bi-graph-up"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                {t("Gráfico Circular")}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <ListGroup.Item
                                                            action
                                                            className='graphsMenu'
                                                            active={false}
                                                            onClick={() => {
                                                                setActiveGraph('pie');
                                                                setSelectedDepartment("Ninguno");
                                                                department && setSelectedDepartment("Ninguno");
                                                            }}
                                                        >

                                                            <i className="bi bi-pie-chart"></i>
                                                        </ListGroup.Item>
                                                    </OverlayTrigger>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-graph">
                                                                {t("Guardar como imagen")}
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
                                                                {t("Imprimir Gráfico")}
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
                                                                {t("Exportar a Excel")}
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
                                                                {t("Descargar PDF")}
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
                                        {t("No hay datos disponibles para los filtros seleccionados")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div >
                )}


                <MessageModal title='Error' message={t('select_filters_download_images')} footer="" show={dataSelectedImg} onHide={() => setDataSelectedImg(false)} />
                <MessageModal title='Error' message={t('select_filters_download_pdf')} footer="" show={dataSelectedPdf} onHide={() => setDataSelectedPdf(false)} />
                <MessageModal title='Error' message={t('select_filters_download_excel')} footer="" show={dataSelectedExcel} onHide={() => setDataSelectedExcel(false)} />
                <MessageModal title='Error' message={t('select_filters_print')} footer="" show={dataSelectedPrint} onHide={() => setDataSelectedPrint(false)} />
                <MessageModal title='Error' message={t('select_departments_compare')} footer="" show={dataSelectedComparison} onHide={() => setDataSelectedComparison(false)} />

            </div >
        </Client >
    );
}