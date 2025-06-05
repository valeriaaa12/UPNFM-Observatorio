import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import SmallNavBar from "@/navigation/SmallNavBar";

const BarGraph = dynamic(() => import("@/graphs/BarGraph"), {
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
}

export default function GraphScreen({ title, extensionData, extensionLimits }: Params) {
    const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
    const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [filteredData, setFilteredData] = useState<Department[]>([]);
    const [legends, setLegends] = useState<Legend[]>([]);
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState<string[]>([]);
    const { t } = useTranslation('common');
    const levels = [t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")];

    // Obtener datos iniciales
    const fetchData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            };

            const [data, legends, years] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config),
                axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`, config)
            ]);

            const departmentsData: Department[] = data.data.map((item: any) => ({
                name: item.departamento.toLowerCase(),
                legend: item.leyenda,
                value: parseFloat(item.tasa),
                year: item.periodo_anual,
                level: item.nivel
            }));

            const legendsData: Legend[] = legends.data.map((item: any) => ({
                level: item.nivel,
                message: item.leyenda,
                lowerLimit: parseFloat(item.min),
                upperLimit: parseFloat(item.max)
            }));

            setDepartments(departmentsData);
            setLegends(legendsData);
            setYears(years.data);
            applyFilters(departmentsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data?: Department[]) => {
        const sourceData = data || departments;
        let result = [...sourceData];

        if (selectedYear !== "Ninguno") {
            result = result.filter(d => d.year === selectedYear);
        }

        if (selectedLevel !== "Ninguno") {
            result = result.filter(d => d.level === selectedLevel);
        }

        result.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredData(result);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
    };

    const handleLevelChange = (level: string) => {
        setSelectedLevel(level);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [selectedYear, selectedLevel, departments]);

    return (
        <Client>
            <div className="font">
                <div className="blue blueNavbar">
                    <NavBar />
                    <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
                </div>
                <SmallNavBar />

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
                        <h2 style={{ marginBottom: '20px' }}>
                            {title} - {selectedLevel !== "Ninguno" ? selectedLevel : "Todos los niveles"} {selectedYear !== "Ninguno" ? `(${selectedYear})` : ""}
                        </h2>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    {t("Nivel Educativo")}:
                                </label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => handleLevelChange(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="Ninguno">Todos los niveles</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                    {t("Año")}:
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="Ninguno">Todos los niveles</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ height: '500px', border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                            <BarGraph
                                data={filteredData.map(d => ({
                                    name: d.name,
                                    value: d.value,
                                    legend: d.legend,
                                    year: d.year,
                                    level: selectedLevel
                                }))}
                                xAxisKey="name"
                                yAxisKey="value"
                                barColor="#4285F4"
                                legendKey="legend"
                            />
                        </div>
                    </div>
                )}

                <LanguageSelector />
            </div>
        </Client>
    );
}