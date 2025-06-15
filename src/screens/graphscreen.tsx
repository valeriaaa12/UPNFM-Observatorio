import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
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
import { isDataView } from 'node:util/types';

const BarGraph = dynamic(() => import("@/graphs/BarGraph"), {
    ssr: false
});

const LineGraph = dynamic(() => import("@/graphs/LineGraph2"), {
    ssr: false
});

const PieGraph = dynamic(() => import("@/graphs/PieGraph"), {
    ssr: false
});

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
    comparison: boolean;
}

interface Legend {
    level: string;
    message: string;
    lowerLimit: number;
    upperLimit: number;
    color: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits, comparison }: Params) {
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [departmentsData, setDepartmentsData] = useState<Department[]>([]);
    const [filteredData, setFilteredData] = useState<Department[]>([]);
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
                    fgColor: { argb: getDeptColor(dept.name).substring(1) },
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
                setShowGraph(selectedYear !== "Ninguno" && selectedLevel !== "Ninguno");
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            };

            const [data, legends] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config)
            ]);

            const departmentsData2: Department[] = data.data.map((item: any) => ({
                name: capitalizeWords(item.departamento.toLowerCase()),
                legend: item.leyenda,
                value: parseFloat(item.tasa) || 0,
                year: item.periodo_anual,
                level: item.nivel
            }));

            const legendsData: Legend[] = legends.data.map((item: any) => ({
                level: item.nivel,
                message: item.leyenda,
                lowerLimit: parseFloat(item.min),
                upperLimit: parseFloat(item.max)
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

                const departmentsData2: Department[] = data.data.map((item: any) => ({
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


                console.log("departmentsData2", data.data);

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

    const applyFilters = (data: Department[], year: string, level: string, department: string) => {
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

        result.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredData(result);

        if (activeGraph === 'bar' || activeGraph === 'pie') {
            setShowGraph(year !== "Ninguno" && level !== "Ninguno");
        } else {
            setShowGraph(department !== "Ninguno" && level !== "Ninguno");
        }
    };

    const formatDataForLineGraph = (data: Department[]) => {
        return data
            .sort((a, b) => parseInt(a.year) - parseInt(b.year))
            .map(({ year, value, name, legend }) => ({
                departamento: name,
                year,
                value,
                legend,
            }));
    };

    useEffect(() => {
        getYears();
        if (!comparison) {
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

    const renderGraph = () => {
        if (activeGraph === 'bar') {
            const barData = filteredData.map(d => ({
                name: d.name,
                value: d.value,
                legend: d.legend,
                year: d.year,
                level: d.level,
            }));
            return (
                < BarGraph
                    data={barData}
                    xAxisKey="name"
                    yAxisKey="value"
                    legendKey="legend"
                    legends={legends}
                />
            );
        }
        if (activeGraph === 'line') {
            const lineData = formatDataForLineGraph(filteredData);
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
                    data={filteredData.map(d => ({
                        name: d.name,
                        value: d.value,
                        legend: d.legend,
                        year: d.year,
                        level: d.level,
                    }))}
                />
            );
        }
    };

    const renderFilter = () => {
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
                                            {renderGraph()}
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
                                                        href="#link3"
                                                        className='graphsMenu'
                                                        active={false}
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
                                                        href="#link3"
                                                        className='graphsMenu'
                                                        active={false}
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
                                                        href="#link3"
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
                                                        href="#link5"
                                                        className='graphsMenu'
                                                        active={false}
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
                )}

                <LanguageSelector />
            </div>
        </Client >
    );
}