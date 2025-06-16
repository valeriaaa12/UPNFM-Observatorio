import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useTranslation } from "react-i18next";

interface LegendItem {
    message: string;
    color: string;
    level: string;
    lowerLimit: number;
    upperLimit: number;
}

interface DataItem {
    name: string;
    value: number;
    legend: string;
    year: string;
    level: string;
    department?: string;
}

interface BarGraphProps {
    data: DataItem[];
    yAxisKey: string;
    legendKey: string;
    legends: LegendItem[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data, yAxisKey, legendKey, legends = [] }) => {
    const { t } = useTranslation('common');

    const processedData = data.map(item => {
        const legendValue = (item as any)[legendKey] ?? '';
        const legendColor = legends.find(
            l => (l.message ?? '').toString().toLowerCase() === legendValue.toString().toLowerCase()
        )?.color || '#808080';

        return {
            ...item,
            color: legendColor,
            displayName: item.name
        };
    });

    const renderLegend = () => {
        const uniqueLegends = Array.from(new Set(data.map(item => item.legend)))
            .filter((legend): legend is string => legend !== undefined)
            .map(legend => {
                const legendItem = legends.find(
                    l => (l.message ?? '').toString().toLowerCase() === (legend ?? '').toString().toLowerCase()
                );
                return {
                    value: legend,
                    color: legendItem?.color || '#808080'
                };
            });

        return (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                {uniqueLegends.map((entry, index) => (
                    <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: entry.color,
                            marginRight: '5px',
                            display: 'inline-block'
                        }} />
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    const customTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length > 0) {
            const item = payload[0].payload;
            return (
                <div style={{
                    background: "#fff",
                    padding: "12px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    minWidth: 220
                }}>
                    <div style={{ marginBottom: 6 }}>
                        <strong>
                            {item.department ? t("Municipio") : t("Departamento")}:
                        </strong> {item.name}
                    </div>
                    {item.department && (
                        <div style={{ marginBottom: 6 }}>
                            <strong>{t("Departamento")}:</strong> {item.department}
                        </div>
                    )}
                    <div style={{ marginBottom: 6 }}>
                        <strong>{t("Valor")}:</strong> {item.value}
                    </div>
                    <div style={{ marginBottom: 6 }}>
                        <strong>{t("Leyenda")}:</strong> {item.legend}
                    </div>
                    <div>
                        <strong>{t("Año")}:</strong> {item.year}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={processedData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                    dataKey="displayName"
                    type="category"
                    width={200}
                    interval={0}
                />
                <Tooltip content={customTooltip} />
                <Legend content={renderLegend} />
                <Bar dataKey={yAxisKey} name={t("Valor")}>
                    {processedData.map((item, index) => (
                        <Cell key={`cell-${index}`} fill={item.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarGraph;
