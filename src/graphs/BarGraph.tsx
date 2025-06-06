import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import LanguageSelector from "@/buttons/LanguageSelector";
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
}

interface BarGraphProps {
    data: DataItem[];
    xAxisKey: string;
    yAxisKey: string;
    legendKey?: string;
    legends: LegendItem[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data, xAxisKey, yAxisKey, legendKey = 'legend', legends = [] }) => {
    const { t } = useTranslation('common');

    const processedData = data.map(item => {
        const legendColor = legends.find(
            l => l.message === (item as any)[legendKey]
        )?.color || '#808080';

        return {
            ...item,
            color: legendColor
        };
    });

    const renderLegend = (props: any) => {
        const { payload } = props;

        const uniqueLegends = Array.from(new Set(data.map(item => item.legend)))
            .filter((legend): legend is string => legend !== undefined)
            .map(legend => {
                const legendItem = legends.find(l => l.message === legend);
                return {
                    value: legend,
                    color: legendItem?.color || '#808080',
                    id: legend
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

    console.log(processedData)

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
                    dataKey={xAxisKey}
                    type="category"
                    width={150}
                    interval={0}
                />
                <Tooltip />
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
