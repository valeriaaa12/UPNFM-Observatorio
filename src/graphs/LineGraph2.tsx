import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
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
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
    "#ff69b4", "#00ced1", "#ffa07a", "#20b2aa", "#9370db",
    "#3cb371", "#f4a460", "#778899"
];


const LineGraph2: React.FC<LineGraphProps> = ({ data, legends = [], years }) => {
    const { t } = useTranslation('common');
    const normalize = (str: string | undefined | null) =>
        typeof str === "string"
            ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

    const departments = useMemo(() => {
        return Array.from(new Set(data.map(d => d.departamento)));
    }, [data]);

const transformedData = useMemo(() => {
        const sortedYears = [...years].sort((a, b) => parseInt(a) - parseInt(b));
        return sortedYears.map(year => {
            const yearData: Record<string, string | number> = { year };
            data.forEach(item => {
                if (item.year === year) {
                    yearData[item.departamento] = item.value;
                }
            });
            return yearData;
        });
    }, [data, years]);

    const getColor = (dep: string) => {
        const depData = data.find(d => d.departamento === dep);
        if (!depData) return "#808080";
        const legendItem = legends.find(
            l => normalize(l.message) === normalize(depData.legend)
        );
        return legendItem?.color || "#808080";
    };
    return (
        <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height={390}>
                <LineChart
                    data={transformedData}
                    margin={{ top: 20, right: 180, left: 10, bottom: 40 }}
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
                    <Tooltip />
                    {legends.map((legend, index) => (
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
                    ))}
                    {departments.map(dep => (
                        <Line
                            key={dep}
                            type="monotone"
                            dataKey={dep}
                            stroke={getColor(dep)}
                            dot={{ r: 2 }}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph2;
