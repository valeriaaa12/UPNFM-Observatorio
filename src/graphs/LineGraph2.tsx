import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
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
    legends?: LegendItem[];
    years: string[];
}

const ALL_LEVELS = [
    "Muy lejos de la meta",
    "Lejos de la meta",
    "Dentro de la meta",
    "Mucho mejor que la meta"
];

const colorMap: Record<string, string> = {
    "Mucho mejor que la meta": "#008000",
    "Dentro de la meta": "#27ae60",
    "Lejos de la meta": "#FFC300",
    "Muy lejos de la meta": "#e41a1c"
};

const LineGraph2: React.FC<LineGraphProps> = ({ data, legends = [], years }) => {
    const normalize = (str: string | undefined | null) =>
        typeof str === "string"
            ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

    const departments = Array.from(new Set(data.map(d => normalize(d.departamento))));

    const allLegends: LegendItem[] = ALL_LEVELS.map(level => {
        const match = legends.find(l => l.message === level);
        return {
            message: level,
            color: colorMap[level],
            lowerLimit: match?.lowerLimit ?? 0,
            upperLimit: match?.upperLimit ?? 0
        };
    });
    const transformedData = useMemo(() => {

        const sortedYears = [...years].sort((a, b) => parseInt(a) - parseInt(b));

        return sortedYears.map(year => {
            const yearData: any = { year };
            data.forEach(item => {
                if (item.year === year) {
                    yearData[normalize(item.departamento)] = parseFloat(item.value as any) || 0;
                }
            });
            return yearData;
        });
    }, [data, years]);

    const getColor = (department: string) => {
        const deptLegend = data.find(d => normalize(d.departamento) === department)?.legend;
        return legends.find(l => l.message === deptLegend)?.color || '#808080';
    };

    const capitalizeWords = (str: string) => {
        return str.toLowerCase().split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={transformedData}
                    margin={{ top: 20, right: 180, left: 10, bottom: 40 }}
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
                            stroke={index === 0 ? "#001f3f" : getColor(dep)}
                            dot={{ r: 2 }}
                            strokeWidth={2}
                        />
                    ))}
                    {allLegends.map((legend, index) => (
                        <ReferenceLine
                            key={index}
                            y={legend.lowerLimit}
                            stroke={legend.color}
                            strokeDasharray="3 3"
                            label={{
                                value: legend.message,
                                position: 'right',
                                fill: legend.color,
                                fontSize: 12,
                            }}
                        />
                    ))}

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph2;
