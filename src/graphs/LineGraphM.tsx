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
    legend: string;
}

interface LineGraphMProps {
    data: DataItem[];
    years: string[];
}

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
    '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C',
    '#9B59B6', '#F39C12', '#D35400', '#1F618D', '#7D3C98', '#117A65',
    '#A04000', '#DE3163', '#58D68D'
];

const LineGraphM: React.FC<LineGraphMProps> = ({ data, years }) => {
    const { t } = useTranslation('common');
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    const lineNames = useMemo(() => {
        return Array.from(new Set(data.map(item => item.name)));
    }, [data]);

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
            data.forEach(item => {
                if (item.year === year) {
                    yearData[item.name] = item.value;
                }
            });
            return yearData;
        });
    }, [data, years]);

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '25%', padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>{t("Municipios")}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {lineNames.map((name, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '0.3rem',
                                fontSize: '0.75rem',
                                fontWeight: hoveredLine === name ? 700 : 400,
                                color: hoveredLine === name ? colorMap[name] : undefined,
                                cursor: 'pointer',
                                background: hoveredLine === name ? 'rgba(0,0,0,0.04)' : undefined,
                                borderRadius: 3,
                                padding: '2px 4px'
                            }}
                            onMouseEnter={() => setHoveredLine(name)}
                            onMouseLeave={() => setHoveredLine(null)}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 12,
                                    height: 10,
                                    backgroundColor: colorMap[name],
                                    marginRight: 6,
                                    borderRadius: 2,
                                    border: hoveredLine === name ? `2px solid ${colorMap[name]}` : 'none',
                                    transition: 'border 0.2s'
                                }}
                            />
                            <span>{name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ width: '75%', height: '400px' }}>
                {graphData.length === 0 ? (
                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                        {t("No hay datos disponibles para los filtros seleccionados.")}
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={390}>
                        <LineChart
                            data={graphData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="year"
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: t("Año"),
                                    position: "insideBottom",
                                    offset: -25,
                                    fontSize: 14,
                                }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: t("Valor"),
                                    angle: -90,
                                    position: "insideLeft",
                                    fontSize: 14,
                                }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const filteredPayload = hoveredLine
                                            ? payload.filter(p => p.name === hoveredLine)
                                            : payload;

                                        return (
                                            <div style={{
                                                backgroundColor: 'white',
                                                border: '1px solid #ccc',
                                                padding: '10px',
                                                borderRadius: 6,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                            }}>
                                                <p style={{ margin: 0, fontWeight: 600 }}>
                                                    {t("Año")}: {label}
                                                </p>
                                                {filteredPayload.map((entry: any, index: number) => (
                                                    <div key={index} style={{ color: entry.color, fontSize: 13 }}>
                                                        <span style={{ fontWeight: 500 }}>{entry.name}:</span> {entry.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
                                    key={name}
                                    type="monotone"
                                    dataKey={name}
                                    name={name}
                                    stroke={colorMap[name]}
                                    dot={{ r: 3, stroke: colorMap[name], strokeWidth: 1, fill: "#fff" }}
                                    activeDot={{ r: 6 }}
                                    strokeWidth={hoveredLine === name ? 3 : 2}
                                    opacity={hoveredLine === null || hoveredLine === name ? 1 : 0.25}
                                    onMouseEnter={() => setHoveredLine(name)}
                                    onMouseLeave={() => setHoveredLine(null)}
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default LineGraphM;