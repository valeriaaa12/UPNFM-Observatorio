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
    extensionLineData?: string;
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
    id: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits, extensionLineData, comparison, department }: Params) {
    const [departmentsDataLine, setDepartmentsDataLine] = useState<DataItem[]>([]);

    const { t } = useTranslation('common');
    const exportRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showClick, setShowClick] = useState(false);
    const [departmentsData, setDepartmentsData] = useState<DataItem[]>([]);
    const [municipios, setMunicipios] = useState<DataItem[] | null>([]);
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

    const [dataSelectedFilters, setDataSelectedFilters] = useState<boolean>(false);

    //states para validaciones de menu
    const [dataSelectedImg, setDataSelectedImg] = useState<boolean>(false);
    const [dataSelectedPdf, setDataSelectedPdf] = useState<boolean>(false);
    const [dataSelectedExcel, setDataSelectedExcel] = useState<boolean>(false);
    const [dataSelectedPrint, setDataSelectedPrint] = useState<boolean>(false);
    const [dataSelectedComparison, setDataSelectedComparison] = useState<boolean>(false);
    const [dataSelectedMunicipal, setDataSelectedMunicipal] = useState<boolean>(false)
    //pruebas
    const exportExcel = async () => {
        const nombre = department ? "Departamentos" : "Municipios"
        if (!comparison) {
            if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" && !comparison || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
                setDataSelectedExcel(true);
                return
            }
        } else {
            if (department) {
                if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedComparison(true);
                    return
                }
            } else {
                if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedComparison(true);
                    return
                }
            }
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
        excelSheet.getRow(number).height = 150;
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
            if (comparison) {
                return
            }
            if (comparison) {
                if (department) {
                    // Para comparación de departamentos
                    setShowGraph(
                        selectedLevel !== "Ninguno" &&
                        selectedDepartments.length > 0 &&
                        showClick
                    );
                } else {
                    // Para comparación de municipios
                    setShowGraph(
                        selectedLevel !== "Ninguno" &&
                        selectedMunicipios.length > 0 &&
                        showClick
                    );
                }
            } else {
                // Para visualización normal (no comparación)
                if (activeGraph === 'line') {
                    setShowGraph(
                        selectedLevel !== "Ninguno" &&
                        (department
                            ? selectedDepartment !== "Ninguno" // Ahora sí requiere departamento seleccionado
                            : selectedDepartment !== "Ninguno")
                    );
                } else {
                    setShowGraph(
                        selectedLevel !== "Ninguno" &&
                        selectedYear !== "Ninguno" &&
                        (department ? true : selectedDepartment !== "Ninguno")
                    );
                }
            }
        };
        handleGraph();
    }, [selectedYear, selectedLevel, selectedDepartment, activeGraph, selectedDepartments, selectedMunicipios, showClick]);

    useEffect(() => {
        if (activeGraph === 'line') {
            setSelectedYear("Ninguno");
        }
        else if (selectedYear === "Ninguno" && years.length > 0) {
            setSelectedYear("Ninguno");
        }
    }, [activeGraph, years]);

    useEffect(() => {
        if (comparison && !department && showClick) {
            postComparisonMuni()
        } else if (comparison && department && showClick) {
            postComparisonDepa()
        }
    }, [selectedYear, selectedLevel])
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
        return data.filter(item => {
            const yearCondition = activeGraph === 'line'
                ? true  // Ignore year filter for line graphs
                : year === "Ninguno" || item.year === year;

            const levelCondition = level === "Ninguno" ||
                item.level?.toLowerCase() === level.toLowerCase();

            const locationCondition = isMunicipio
                ? department === "Ninguno" ||
                item.department?.toLowerCase() === department.toLowerCase()
                : department === "Ninguno" ||
                (!comparison && activeGraph === 'line'
                    ? item.name.toLowerCase() === department.toLowerCase()
                    : selectedDepartments.includes(item.name));

            return yearCondition && levelCondition && locationCondition;
        });
    };

    const filteredDepartments = filterData(
        departmentsData,
        selectedYear,
        selectedLevel,
        selectedDepartment,
        false,
        activeGraph
    );

    const filteredMunicipiosRaw = filterData(municipios ?? [], selectedYear, selectedLevel, selectedDepartment, true, activeGraph);

    const filteredMunicipios = filteredMunicipiosRaw.map(item => ({
        ...item,
        department: item.department ?? ""
    }));

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
                lowerLimit: item.limite_inferior || item.min || 0,
                upperLimit: item.limite_superior || item.max || 0,
                color: item.color || "#808080"
            }));



            const legendsWithColors = assignColorsToLegends(legendsData);

            setDepartmentsData(departmentsData2);
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
                            ? capitalizeWords(item.municipio.toString())
                            : item.departamento
                                ? capitalizeWords(item.departamento.toString())
                                : 'Sin nombre',
                        value: parseFloat(item.tasa) || 0,
                        legend: item.leyenda,
                        year: item.periodo_anual?.toString() || '',
                        level: (item.nivel ?? '').toString().toLowerCase(),
                        department: capitalizeWords(item.departamento?.toString() || "")
                    }));

                    const legendsWithColors = assignColorsToLegends(legendsData);
                    setMunicipios(municipiosData);
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
        }
    }, [selectedDepartment, extensionData, comparison, department]);

    useEffect(() => {
        const filteredData = filteredDepartments
        if (activeGraph === 'line' && filteredData.length > 0) {
            // console.log("llegue")
        }
    }, [filteredDepartments, activeGraph]);


    const postComparisonDepa = async () => {

        if (department) {
            if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                setDataSelectedComparison(true);
                return
            }
        } else {
            if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                setDataSelectedMunicipal(true);
                return
            }
        }

        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (selectedDepartments.length > 0) {
                setShowClick(true);
                const departmentsUpper = selectedDepartments.map(dep => dep.toUpperCase());

                let data: any;

                if (activeGraph !== 'line') {
                    [data] = await Promise.all([
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, {
                            nivel: selectedLevel, periodo_anual: selectedYear, departamentos: departmentsUpper,
                        }, config)
                    ]);
                } else {
                    [data] = await Promise.all([
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLineData}`, {
                            nivel: selectedLevel, departamentos: departmentsUpper,
                        }, config)
                    ]);
                }

                const departmentsData2: DataItem[] = data.data.map((item: any) => ({
                    name: capitalizeWords(item.departamento.toLowerCase()),
                    legend: item.leyenda,
                    value: parseFloat(item.tasa) || 0,
                    year: (selectedYear !== "Ninguno" ? selectedYear : item.periodo_anual?.toString()) || "",
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
                setShowGraph(true);
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
        if (department) {
            if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                setDataSelectedComparison(true);
                return
            }
        } else {
            if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                setDataSelectedMunicipal(true);
                return
            }
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            if (selectedMunicipios.length > 0) {
                setShowClick(true)
                const municipiosUpper = selectedMunicipios.map(id => {
                    const muni = municipiosList.find(m => m.id === id);
                    return muni ? muni.nombre.toUpperCase() : '';
                });

                const departamentosUpper = Array.from(
                    new Set(
                        selectedMunicipios.map(id => {
                            const muni = municipiosList.find(m => m.id === id);
                            return muni ? muni.departamento.toUpperCase() : '';
                        }).filter(Boolean)
                    )
                );

                let data: any;

                if (activeGraph !== 'line') {
                    [data] = await Promise.all([
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, {
                            departamentos: departamentosUpper, municipios: municipiosUpper, nivel: selectedLevel, periodo_anual: selectedYear
                        }, config)
                    ]);
                } else {
                    [data] = await Promise.all([
                        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLineData}`, {
                            departamentos: departamentosUpper, municipios: municipiosUpper, nivel: selectedLevel
                        }, config)
                    ]);
                }

                const muniData: DataItem[] = data.data.map((item: any) => ({
                    name: capitalizeWords(item.municipio.toLowerCase()),
                    legend: item.leyenda,
                    value: parseFloat(item.tasa) || 0,
                    year: (selectedYear !== "Ninguno" ? selectedYear : item.periodo_anual?.toString()) || "",
                    level: selectedLevel,
                    department: capitalizeWords(item.departamento?.toLowerCase() || "")
                }));

                const legendsData: Legend[] = data.data.map((item: any) => ({
                    level: item.nivel,
                    message: item.leyenda,
                    lowerLimit: parseFloat(item.min) || 0,
                    upperLimit: parseFloat(item.max) || 0
                }));

                const legendsWithColors = assignColorsToLegends(legendsData);
                setLegends(legendsWithColors);
                setMunicipios(muniData);
                setShowGraph(true)
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

    const formatDataForLineGraphD = (data: DataItem[]) =>
        [...data]
            .sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))
            .map(({ name: departamento, year, value, legend }) => ({
                departamento,
                year,
                value,
                legend
            }));

    const formatDataForLineGraphM = (data: DataItem[]) => {
        const grouped = data.reduce((acc: Record<string, DataItem[]>, item) => {
            (acc[item.name] = acc[item.name] || []).push(item);
            return acc;
        }, {});

        return Object.entries(grouped).map(([name, items]) => ({
            name,
            data: [...items].sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0))
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
                const municipiosDept = response.data.map((item: any) => {
                    const nombre = capitalizeWords(item.municipio) || capitalizeWords(item.nombre);
                    const departamento = dept;
                    return {
                        nombre,
                        departamento,
                        id: `${nombre}__${departamento}`
                    };
                });
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
            console.log("filteredDepartments", filteredDepartments);

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
                    data={lineData.flatMap(item =>
                        item.data.map(d => ({
                            name: item.name,
                            value: d.value,
                            legend: d.legend,
                            year: d.year,
                            level: selectedLevel // or d.level if available
                        }))
                    )}
                    years={lineData[0]?.data.map(d => d.year) || []}
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

        if (!comparison) {
            if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" && !comparison || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
                setDataSelectedImg(true);
                return
            }
        } else {
            if (department) {
                if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedComparison(true);
                    return
                }
            } else {
                if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedMunicipal(true);
                    return
                }
            }
        }

        const el = exportRef.current;

        const menu = el.querySelector<HTMLElement>('.chart-menu');
        const prevDisplay = menu?.style.display;
        if (menu) menu.style.display = 'none';

        // Calcula tamaño A4 en px
        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const pdfW = pdf.internal.pageSize.getWidth();    // en pt
        const pdfH = pdf.internal.pageSize.getHeight();   // en pt
        const pxW = Math.round(pdfW * 96 / 72);
        const pxH = Math.round(pdfH * 96 / 72);

        // Guarda estilos y fuerza nuevo tamaño
        const prevW = el.style.width;
        const prevH = el.style.height;
        el.style.width = `${pxW}px`;
        el.style.height = `${pxH}px`;
        window.dispatchEvent(new Event('resize'));
        // dejamos que re-renderice
        await new Promise(res => setTimeout(res, 2500));

        // Captura con html2canvas
        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#fff'
        });
        const dataUrl = canvas.toDataURL('image/png');

        // Dispara la descarga
        const link = document.createElement('a');
        const filename = `${title}${selectedLevel !== "Ninguno" ? ` – ${selectedLevel}` : ""
            }${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""
            }.png`;
        link.download = filename;
        link.href = dataUrl;
        link.click();

        // Restaura todo
        el.style.width = prevW;
        el.style.height = prevH;
        if (menu) menu.style.display = prevDisplay || '';
        window.dispatchEvent(new Event('resize'));
    };


    const handleDownloadPDF = async () => {
        if (!exportRef.current) return;

        if (!comparison) {
            if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" && !comparison || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
                setDataSelectedPdf(true);
                return
            }
        } else {
            if (department) {
                if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedComparison(true);
                    return
                }
            } else {
                if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedMunicipal(true);
                    return
                }
            }
        }

        const el = exportRef.current;

        const menu = el.querySelector<HTMLElement>('.chart-menu');
        const menuDisplay = menu?.style.display;
        if (menu) menu.style.display = 'none';

        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        const pxW = Math.round(pdfW * 96 / 72);
        const pxH = Math.round(pdfH * 96 / 72);

        const origW = el.style.width;
        const origH = el.style.height;
        el.style.width = `${pxW}px`;
        el.style.height = `${pxH}px`;
        window.dispatchEvent(new Event('resize'));

        await new Promise(r => setTimeout(r, 2500));

        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#fff',
        });
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
        const filename = `${title}${selectedLevel !== "Ninguno" ? ` – ${selectedLevel}` : ""}${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}.pdf`;
        pdf.save(filename);

        el.style.width = origW;
        el.style.height = origH;
        if (menu) menu.style.display = menuDisplay || '';
        window.dispatchEvent(new Event('resize'));
    };


    // Imprimir el gráfico (fija tamaño y evita distorsión)
    const handlePrintGraph = async () => {
        if (!exportRef.current) return;
        if (!comparison) {
            if (!departments || ((selectedYear == "Ninguno" || selectedLevel == "Ninguno") && activeGraph != "line") || ((selectedDepartment == "Ninguno" && !comparison || selectedLevel == "Ninguno") && activeGraph == "line") || (!department && selectedDepartment === "Ninguno")) {
                setDataSelectedPrint(true);
                return
            }
        } else {
            if (department) {
                if (selectedDepartments.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedComparison(true);
                    return
                }
            } else {
                if (selectedMunicipios.length == 0 || (activeGraph == 'line' && selectedLevel == "level") || (activeGraph != 'line' && (selectedLevel == 'Ninguno' || selectedYear == 'Ninguno'))) {
                    setDataSelectedMunicipal(true);
                    return
                }
            }
        }
        const el = exportRef.current;

        const menu = el.querySelector<HTMLElement>('.chart-menu');
        const menuDisplay = menu?.style.display;
        if (menu) menu.style.display = 'none';

        const pdf = new jsPDF('landscape', 'pt', 'a4');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        const pxW = Math.round(pdfW * 96 / 72);
        const pxH = Math.round(pdfH * 96 / 72);

        const origW = el.style.width;
        const origH = el.style.height;
        el.style.width = `${pxW}px`;
        el.style.height = `${pxH}px`;
        window.dispatchEvent(new Event('resize'));
        await new Promise(r => setTimeout(r, 2500));  // esperamos re-render

        const canvas = await html2canvas(el, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#fff',
        });
        const img = canvas.toDataURL('image/png');

        const pw = window.open('', '_blank', `width=${pxW},height=${pxH}`);
        if (pw) {
            pw.document.write(`
        <html><head><title>
            ${title}
            ${selectedLevel !== "Ninguno" ? ` – ${selectedLevel}` : ""}
            ${selectedYear !== "Ninguno" ? ` (${selectedYear})` : ""}
        </title></head>
        <body style="margin:0;padding:0;text-align:center;background:#fff">
            <img src="${img}" style="width:100%;height:auto;display:block;margin:0 auto"/>
        </body></html>
        `);
            pw.document.close();
            pw.onload = () => {
                pw.focus();
                pw.print();
                pw.close();
            }

        }

        el.style.width = origW;
        el.style.height = origH;
        if (menu) menu.style.display = menuDisplay || '';
        window.dispatchEvent(new Event('resize'));
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
                                (!comparison && (activeGraph === "line" || !department)) && (
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
                                                                    key={muni.id}
                                                                    as="div"
                                                                    className="px-2"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        id={`muni-${muni.id}`}
                                                                        label={muni.nombre}
                                                                        checked={selectedMunicipios.includes(muni.id)}
                                                                        onChange={() => handleCheck(undefined, muni.id)}
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
                                {title} {selectedLevel !== "Ninguno" ? `- ${selectedLevel}` : ""} {(selectedYear !== "Ninguno" && (activeGraph != "line" || comparison)) ? `(${selectedYear})` : ""} {(!comparison && (!department || activeGraph === "line") && selectedDepartment !== "Ninguno") ? `(${selectedDepartment})` : ""}
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
                                            <div className='chart-menu' style={{
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
                                                                (comparison) && setShowGraph(false);
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
                                                                (comparison) && setShowGraph(false);
                                                                (department && !comparison) && setSelectedDepartment("Ninguno");
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
                                                                (comparison) && setShowGraph(false);
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
                )
                }


                <MessageModal title='Error' message={t('select_filters_download_images')} footer="" show={dataSelectedImg} onHide={() => setDataSelectedImg(false)} />
                <MessageModal title='Error' message={t('select_filters_download_pdf')} footer="" show={dataSelectedPdf} onHide={() => setDataSelectedPdf(false)} />
                <MessageModal title='Error' message={t('select_filters_download_excel')} footer="" show={dataSelectedExcel} onHide={() => setDataSelectedExcel(false)} />
                <MessageModal title='Error' message={t('select_filters_print')} footer="" show={dataSelectedPrint} onHide={() => setDataSelectedPrint(false)} />
                <MessageModal title='Error' message={t('select_departments_compare')} footer="" show={dataSelectedComparison} onHide={() => setDataSelectedComparison(false)} />
                <MessageModal title='Error' message={t('select_municipal_compare')} footer="" show={dataSelectedMunicipal} onHide={() => setDataSelectedMunicipal(false)} />
                <MessageModal
                    title='Error'
                    message={t('Debe seleccionar un nivel y un año para graficar municipios')}
                    footer=""
                    show={dataSelectedFilters}
                    onHide={() => setDataSelectedFilters(false)}
                />
            </div >
        </Client >
    );
}