import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface DataItem {
    name: string;
    value: number;
    year: string;
    level: string;
    department?: string;
}

interface LineGraphProps {
    data: DataItem[];
    xAxisKey: string;
    yAxisKey: string;
    extensionData: string;
    selectedLevel: string;
    selectedDepartment: string;
}

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#C9CBCF', '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C',
    '#1ABC9C', '#9B59B6', '#34495E', '#95A5A6', '#F39C12', '#D35400',
    '#1F618D', '#7D3C98', '#117A65', '#A04000', '#5D6D7E', '#7FB3D5',
    '#58D68D', '#F5B041', '#AAB7B8'
];

const LineGraph: React.FC<LineGraphProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    extensionData,
    selectedLevel,
    selectedDepartment,
}) => {
    const { t } = useTranslation('common');
    const [municipalData, setMunicipalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);


    const departmentData = useMemo(() => {
        return data.map(item => ({
            name: item.name,
            value: item.value,
            year: item.year,
            level: item.level?.toLowerCase() || '',
            department: item.department?.toLowerCase() || ''
        }));
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDepartment) {
                setMunicipalData([]);
                return;
            }

            setLoading(true);
            try {
                const config = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    params: { departamento: selectedDepartment.toUpperCase() }
                };
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}Municipal`, config);

                const processed = response.data.map((item: any) => ({
                    name: item.municipio,
                    value: parseFloat(item.tasa),
                    year: item.periodo_anual.toString(),
                    level: item.nivel?.toLowerCase() || '',
                    department: item.departamento?.toLowerCase() || ''
                }));

                console.log("✅ MUNICIPAL PROCESSED:", processed);
                setMunicipalData(processed);
            } catch (error) {
                console.error("❌ Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDepartment, extensionData]);

    const [years, setYears] = useState<string[]>([]); 
        useEffect(() => {
            const fetchYears = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`);
                    
                    const sortedYears = response.data.sort((a: string, b: string) => parseInt(a) - parseInt(b));
                    setYears(sortedYears);
                } catch (error) {
                    console.error("Error fetching years:", error);
                  
                    setYears(['2018', '2019', '2020', '2021', '2022', '2023']);
                }
            };

            fetchYears();
        }, []);

    const source = selectedDepartment && municipalData.length > 0 ? municipalData : departmentData;

    const filteredSource = useMemo(() => {
        return source.filter(item => {
            const matchesLevel = !selectedLevel || item.level === selectedLevel.toLowerCase();
            const matchesDepartment = !selectedDepartment || !municipalData.length || item.department === selectedDepartment.toLowerCase();
            return matchesLevel && matchesDepartment;
        });
    }, [source, municipalData, selectedLevel, selectedDepartment]);

    const lineNames = useMemo(() => {
        return Array.from(new Set(filteredSource.map(item => item.name)));
    }, [filteredSource]);

    const colorMap = useMemo(() => {
        return lineNames.reduce((acc, name, index) => {
            acc[name] = defaultColors[index % defaultColors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [lineNames]);

const graphData = useMemo(() => {

    const sortedYears = [...years].sort((a, b) => parseInt(a) - parseInt(b));
    
    return sortedYears.map(year => {
        const yearData: Record<string, string | number> = { year };
        filteredSource.forEach(item => {
            if (item.year === year) {
                yearData[item.name] = item.value;
            }
        });
        return yearData;
    });
}, [filteredSource, years]);
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            {/* Leyenda personalizada a la izquierda */}
            <div style={{ width: '25%', padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Municipios</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {lineNames.map((name, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '0.3rem',
                                fontSize: '0.75rem'
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 12,
                                    height: 10,
                                    backgroundColor: colorMap[name],
                                    marginRight: 6,
                                    borderRadius: 2
                                }}
                            />
                            <span>{name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gráfico a la derecha */}
            <div style={{ width: '75%', height: '400px' }}>
                {graphData.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                        No hay datos disponibles para los filtros seleccionados.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={graphData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const filteredPayload = hoveredLine
                                            ? payload.filter(p => p.name === hoveredLine)
                                            : payload;

                                        return (
                                            <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
                                                <p><strong>Año: {label}</strong></p>
                                                {filteredPayload.map((entry: any, index: number) => (
                                                    <div key={index} style={{ color: entry.color }}>
                                                        {entry.name}: {entry.value?.toFixed(2)}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {lineNames.map((name, index) => (
                                    <Line
                                        key={index}
                                        type="monotone"
                                        dataKey={name}
                                        name={name}
                                        stroke={colorMap[name]}
                                        dot={{ r: 2 }}
                                        strokeWidth={2}
                                        opacity={hoveredLine === null || hoveredLine === name ? 1 : 0.2}
                                        onMouseEnter={() => setHoveredLine(name)}
                                        onMouseLeave={() => setHoveredLine(null)}
                                    />
                                ))}

                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default LineGraph;
