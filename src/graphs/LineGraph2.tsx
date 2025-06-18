import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
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
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#ff69b4", "#00ced1", "#ffa07a", "#20b2aa", "#9370db",
    "#3cb371", "#f4a460", "#778899"
];

const LineGraph2: React.FC<LineGraphProps> = ({ data, legends, years }) => {
    
   

    const departments = useMemo(() => {
        return Array.from(new Set(data.map(d => d.departamento)));
    }, [data]);

    const departmentColors = useMemo(() => {
        return departments.reduce((acc, name, index) => {
            acc[name] = defaultColors[index % defaultColors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [departments]);
// Obtener leyendas únicas desde los datos
const uniqueLegendNames = Array.from(new Set(data.map(d => d.legend)))
    .filter((legend): legend is string => legend !== undefined);

// Buscar detalles de leyendas desde la lista completa
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

    const capitalizeWords = (str: string) => {
        return str.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto", display: 'flex' }}>
            <div style={{ width: 200, paddingRight: 20 }}>
                <h4 style={{ marginBottom: 10 }}>Departamentos</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {departments.map((dep, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                            <div style={{
                                width: 12, height: 12,
                                backgroundColor: departmentColors[dep],
                                marginRight: 8
                            }}></div>
                            <span>{capitalizeWords(dep)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={graphData}
                    margin={{ top: 20, right: 40, left: 0, bottom: 40 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
                                        <p><strong>Año: {label}</strong></p>
                                        {payload.map((entry: any, index: number) => (
                                            <div key={index} style={{ color: entry.color }}>
                                                {capitalizeWords(entry.name)}: {entry.value?.toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    {departments.map((dep, index) => (
                        <Line
                            key={index}
                            type="monotone"
                            dataKey={dep}
                            stroke={departmentColors[dep]}
                            dot={{ r: 2 }}
                            strokeWidth={2}
                        />
                    ))}
                    {filteredLegends.map((legend, index) => (
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
                    ))}

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph2;
