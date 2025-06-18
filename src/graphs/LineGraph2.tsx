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
    legend: string;
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

const colorMap: Record<string, string> = {
    "Mucho mejor que la meta": "#008000",
    "Dentro de la meta": "#27ae60",
    "Lejos de la meta": "#FFC300",
    "Muy lejos de la meta": "#e41a1c"
};

const LineGraph2: React.FC<LineGraphProps> = ({ data, legends = [], years }) => {
    const { t } = useTranslation('common');



    const normalize = (str: string | undefined | null) =>
        typeof str === "string"
            ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            : "";

    const departments = useMemo(
        () => Array.from(new Set(data.map(d => d.departamento))),
        [data]
    );

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
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: 6,
                                            padding: "12px 16px",
                                            minWidth: 200,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                                        }}
                                    >
                                        {payload.map((entry, idx) => {
                                            const original = data.find(
                                                d => d.departamento === entry.name && d.year === label
                                            );
                                            const legendColor = legends.find(
                                                l => l.message === original?.legend
                                            )?.color || "#666";
                                            return (
                                                <div key={idx}>
                                                    <div style={{ fontSize: 18 }}>
                                                        <strong>{entry.name}</strong>: {entry.value}
                                                    </div>
                                                    <div style={{ fontSize: 14, marginBottom: 6 }}>
                                                        <strong>{t("Año")}:</strong>  {label}
                                                    </div>
                                                    {original?.legend && (
                                                        <div style={{ color: legendColor, fontSize: 13, fontWeight: 600 }}>
                                                            {original.legend}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
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
