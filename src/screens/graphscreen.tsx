import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import ListGroup from 'react-bootstrap/ListGroup';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FuenteDeDatos from '@/components/FuenteDeDatos';
import LineGraphScreen from "../screens/linegraphscreen2";

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
}

interface Legend {
    level: string;
    message: string;
    lowerLimit: number;
    upperLimit: number;
    color: string;
}

export default function GraphScreen({ title, extensionData, extensionLimits }: Params) {
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("Ninguno");
    const [showGraph, setShowGraph] = useState<boolean>(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filteredData, setFilteredData] = useState<Department[]>([]);
    const [legends, setLegends] = useState<Legend[]>([]);
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState<string[]>([]);
    const { t } = useTranslation('common');
    const levels = [t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")];
    const [activeGraph, setActiveGraph] = useState<'bar' | 'line' | 'pie'>('bar');
    const [activeFilter, setActiveFilter] = useState<'year' | 'department'>('year');
    const [isHovered, setIsHovered] = useState(false);

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
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            const [data, legends, years] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`, config)
            ]);

            const departmentsData: Department[] = data.data.map((item: any) => ({
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

            console.log(departmentsData)
            setDepartments(departmentsData);
            setLegends(legendsWithColors);
            setYears(years.data);
            applyFilters(departmentsData, selectedYear, selectedLevel, selectedDepartment);
        } catch (error) {
            console.error("Error fetching data:", error);
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
                result = result.filter(d => d.name === department.toLowerCase());
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
        fetchData();
    }, []);

    useEffect(() => {
        if (departments.length > 0) {
            applyFilters(departments, selectedYear, selectedLevel, selectedDepartment);
        }
    }, [selectedYear, selectedLevel, selectedDepartment, departments]);

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
                    xAxisKey="year"
                    yAxisKey="value"
                    legendKey="legend"
                    legends={legends}
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
                        {[...new Set(departments.map(d => d.name))].sort().map(dep => (
                            <option key={dep} value={dep}>{dep.charAt(0).toUpperCase() + dep.slice(1)}</option>
                        ))}
                    </select>
                </div >
            )
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
                            {renderFilter()}
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
                                            height: '100%'
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