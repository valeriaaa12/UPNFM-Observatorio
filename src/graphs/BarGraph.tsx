import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Definición de tipos mejorada
interface LegendItem {
    message: string;
    color: string;
    level?: string;
    lowerLimit?: number;
    upperLimit?: number;
}

interface DataItem {
    name: string;
    value: number;
    legend?: string;
    year?: string;
    level?: string;
}

interface BarGraphProps {
    data: DataItem[];
    xAxisKey: string;
    yAxisKey: string;
    legendKey?: string;
    legends?: LegendItem[]; // Hacer opcional y definir tipo correctamente
}

const BarGraph: React.FC<BarGraphProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    legendKey = 'legend', // Valor por defecto
    legends = [] // Valor por defecto
}) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                    dataKey={xAxisKey}
                    type="category"
                    width={150}
                    tickFormatter={(value) => typeof value === 'string' ?
                        value.charAt(0).toUpperCase() + value.slice(1) :
                        String(value)}
                />
                <Tooltip />
                <Legend />
                {data.map((item, index) => {
                    const legendItem = legends.find(l => l.message === item.legend);
                    const fillColor = legendItem?.color || '#4285F4';
                    const barName = legendKey ? item[legendKey as keyof DataItem] : undefined;

                    return (
                        <Bar
                            key={`${index}-${item.name}`}
                            dataKey={yAxisKey}
                            fill={fillColor}
                            name={typeof barName === 'string' ? barName : undefined}
                        />
                    );
                })}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarGraph;