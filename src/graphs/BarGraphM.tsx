import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useTranslation } from "react-i18next";

interface DataItem {
    name: string;
    value: number;
    legend: string;
    year: string;
    level: string;
    department?: string;
}
interface LegendItem {
    message: string;
    color: string;
    level: string;
    lowerLimit: number;
    upperLimit: number;
}

interface BarGraphProps {
    data: DataItem[];
    yAxisKey: string;
    legendKey: string;
    legends: LegendItem[];
}

const BarGraphM: React.FC<BarGraphProps> = ({ data, yAxisKey, legendKey, legends = [] }) => {
    const { t } = useTranslation('common');

    const processedData = data.map(item => ({
        ...item,
        color: legends.find(
            l => l.message.toLowerCase() === (item as any)[legendKey].toLowerCase()
        )?.color || '#808080',
        displayName: item.name
    }));

    const renderLegend = () => {
        const uniqueLegends = Array.from(new Set(data.map(item => item.legend)))
            .filter((legend): legend is string => legend !== undefined)
            .map(legend => {
                const legendItem = legends.find(l => l.message.toLowerCase() === legend.toLowerCase());
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
        if (!active || !payload || payload.length === 0) return null;
        const item = payload[0].payload;

        const rows = [
            {
                label: item.department ? t("Municipio") : t("Departamento"),
                value: item.name
            },
            {
                label: t("Valor"),
                value: item.value
            },
            {
                label: t("Leyenda"),
                value: item.legend
            },
            {
                label: t("Año"),
                value: item.year
            }
        ].filter(Boolean);

        return (
            <div style={{
                background: "#fff",
                padding: 12,
                border: "1px solid #ccc",
                borderRadius: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                minWidth: 180
            }}>
                {rows.map((row, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{row.label}:</span>{" "}
                        <span>{row.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={450}>
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

export default BarGraphM;
