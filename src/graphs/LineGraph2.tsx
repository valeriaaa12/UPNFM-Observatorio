import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine,
} from "recharts";

interface LegendItem {
    message: string;
    color: string;
    lowerLimit: number;
    upperLimit: number;
}

interface DataItem {
    departamento: string;
    year: string;
    value: number;
    legend?: string;
}

interface LineGraphProps {
    data: DataItem[];
    legends: LegendItem[];
    years: string[];
}

const ALL_LEVELS = [
    "Muy lejos de la meta",
    "Lejos de la meta",
    "Dentro de la meta",
    "Mucho mejor que la meta"
];

const colorMapLegend: Record<string, string> = {
    "Mucho mejor que la meta": "#008000",
    "Dentro de la meta": "#27ae60",
    "Lejos de la meta": "#FFC300",
    "Muy lejos de la meta": "#e41a1c"
};

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
    '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C',
    '#9B59B6', '#F39C12', '#D35400', '#1F618D', '#7D3C98', '#117A65',
    '#A04000', '#DE3163', '#58D68D'
];

const LineGraph2: React.FC<LineGraphProps> = ({ data, legends, years }) => {
    const { t } = useTranslation('common');
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    const departments = useMemo(() => {
        return Array.from(new Set(data.map(d => d.departamento)));
    }, [data]);

    const departmentColors = useMemo(() => {
        return departments.reduce((acc, name, index) => {
            acc[name] = defaultColors[index % defaultColors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [departments]);

    const uniqueLegendNames = Array.from(new Set(data.map(d => d.legend)))
        .filter((legend): legend is string => legend !== undefined);

    const filteredLegends = uniqueLegendNames.map(name => {
        const match = legends.find(
            l => l.message.toLowerCase() === name.toLowerCase()
        );
        return match && typeof match.lowerLimit === 'number'
            ? {
                message: match.message,
                color: match.color,
                lowerLimit: match.lowerLimit
            }
            : null;
    }).filter((l): l is { message: string, color: string, lowerLimit: number } => l !== null);

    const graphData = useMemo(() => {
        const uniqueYears = [...new Set(data.map(d => d.year))]
            .sort((a, b) => parseInt(a) - parseInt(b));

        return uniqueYears.map(year => {
            const yearData: any = { year };
            data.forEach(item => {
                if (item.year === year) {
                    yearData[item.departamento] = item.value;
                }
            });
            return yearData;
        });
    }, [data]);

    const departmentNames = useMemo(() => {
        return Array.from(new Set(data.map(item => item.departamento))).filter(Boolean);
    }, [data]);

    const departmentColorMap = useMemo(() => {
        return departmentNames.reduce((acc, name, index) => {
            acc[name!] = defaultColors[index % defaultColors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [departmentNames]);

    const CustomTooltip = ({ active, payload, label, hoveredLine }: any) => {
        if (!active || !payload || !payload.length) return null;

        const filteredPayload = hoveredLine
            ? payload.filter((p: any) => p.name === hoveredLine)
            : payload;

        let legendValue: string | undefined;
        let legendColor: string | undefined;
        if (filteredPayload.length === 1) {
            const entry = filteredPayload[0];
            const original = data.find(
                (d) => d.departamento === entry.name && d.year === label
            );
            legendValue = original?.legend;
            legendColor = legendValue ? colorMapLegend[legendValue] : undefined;
        }

        return (
            <div style={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
                <p style={{ fontWeight: 'bold', marginBottom: 8 }}>Año: {label}</p>
                {filteredPayload.map((entry: any, idx: number) => (
                    <div key={`item-${idx}`} style={{
                        color: entry.color,
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div >
                            <strong>{entry.name}</strong>: {entry.value}
                        </div>
                    </div>
                ))}
                {legendValue && (
                    <div style={{
                        color: legendColor || '#666',
                        fontSize: '0.95em',
                        marginTop: 6,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            width: 10,
                            height: 10,
                            backgroundColor: legendColor,
                            marginRight: 8,
                            borderRadius: 2
                        }} />
                        {legendValue}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                {/* Leyenda a la izquierda */}
                <div style={{ width: '25%', minWidth: 180, padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>{t("Departamentos")}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {departmentNames.map((name, index) => (
                            <li
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '0.3rem',
                                    fontSize: '0.75rem',
                                    fontWeight: hoveredLine === name ? 700 : 400,
                                    color: hoveredLine === name ? departmentColorMap[name!] : undefined,
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
                                        backgroundColor: departmentColorMap[name!],
                                        marginRight: 6,
                                        borderRadius: 2,
                                        border: hoveredLine === name ? `2px solid ${departmentColorMap[name!]}` : 'none',
                                        transition: 'border 0.2s'
                                    }}
                                />
                                <span>{name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Gráfico */}
                <div style={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart
                            data={graphData}
                            margin={{ top: 20, right: 40, left: 10, bottom: 40 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year"
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: t("Año"),
                                    position: "insideBottom",
                                    offset: -25,
                                    fontSize: 14,
                                }} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                label={{
                                    value: t("Valor"),
                                    angle: -90,
                                    position: "insideLeft",
                                    fontSize: 14,
                                }} />
                            <Tooltip
                                content={(props) => <CustomTooltip {...props} hoveredLine={hoveredLine} />}
                            />
                            {/*{legends.map((legend, index) => (
                                <ReferenceLine
                                    key={`lower-limit-${index}`}
                                    y={legend.lowerLimit}
                                    stroke={legend.color}
                                    strokeDasharray="3 3"
                                    label={{
                                        value: legend.message,
                                        position: 'right',
                                        fill: legend.color,
                                        fontSize: 12,
                                    }}
                                    ifOverflow="extendDomain"
                                />
                            ))
                            }*/}
                            {departments.map((dep, index) => (
                                <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={dep}
                                    stroke={departmentColors[dep]}
                                    dot={{ r: 2 }}
                                    strokeWidth={hoveredLine === dep ? 3 : 2}
                                    opacity={hoveredLine === null || hoveredLine === dep ? 1 : 0.25}
                                    onMouseEnter={() => setHoveredLine(dep)}
                                    onMouseLeave={() => setHoveredLine(null)}
                                />
                            ))}
                            {
                                filteredLegends.map((legend, index) => (
                                    <ReferenceLine
                                        key={`ref-${index}`}
                                        y={legend.lowerLimit}
                                        stroke={legend.color}
                                        strokeDasharray="4 4"
                                        label={{
                                            value: legend.message,
                                            position: 'right',
                                            fill: legend.color,
                                            fontSize: 11,
                                        }}
                                    />
                                ))
                            }

                        </LineChart >
                    </ResponsiveContainer >
                </div>
            </div >
        </div >
    );
};

export default LineGraph2;
