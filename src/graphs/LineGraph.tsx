import React, { useMemo, useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts";
import axios from "axios";

interface DataItem {
    departamento: string;
    year: string;
    value: number;
}

interface LineGraphProps {
    data: DataItem[];
}

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#C9CBCF', '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C',
    '#1ABC9C', '#9B59B6', '#34495E', '#95A5A6', '#F39C12', '#D35400'
];

const normalize = (str: string | undefined | null) =>
    typeof str === "string"
        ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        : "";

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
    const [years, setYears] = useState<string[]>([]);

    const departments = useMemo(() => {
        return Array.from(new Set(data.map(d => normalize(d.departamento))));
    }, [data]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`);
                const sorted = response.data.sort((a: string, b: string) => parseInt(a) - parseInt(b));
                setYears(sorted);
            } catch (error) {
                console.error("Error fetching years:", error);
                setYears(['2018', '2019', '2020', '2021', '2022', '2023']); // fallback
            }
        };
        fetchYears();
    }, []);

    const colorMap = useMemo(() => {
        return departments.reduce((acc, dep, index) => {
            acc[dep] = defaultColors[index % defaultColors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [departments]);

    const transformedData = useMemo(() => {
        const sortedYears = [...years].sort((a, b) => parseInt(a) - parseInt(b));
        return sortedYears.map(year => {
            const yearData: any = { year };
            data.forEach(item => {
                if (item.year === year) {
                    yearData[normalize(item.departamento)] = item.value;
                }
            });
            return yearData;
        });
    }, [data, years]);

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            {/* Leyenda izquierda */}
            <div style={{ width: '25%', padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Departamentos</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {departments.map((dep, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.3rem', fontSize: '0.75rem' }}>
                            <span style={{
                                display: 'inline-block',
                                width: 12,
                                height: 10,
                                backgroundColor: colorMap[dep],
                                marginRight: 6,
                                borderRadius: 2
                            }} />
                            <span>{dep}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gráfico derecha */}
            <div style={{ width: '75%', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        {departments.map((dep, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey={dep}
                                stroke={colorMap[dep]}
                                dot={{ r: 2 }}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineGraph;
