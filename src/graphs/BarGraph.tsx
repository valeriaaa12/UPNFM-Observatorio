import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface BarGraphProps {
    data: Array<{
        name: string;
        value: number;
        legend?: string;
        year?: string;
        level?: string;
    }>;
    xAxisKey: string;
    yAxisKey: string;
    barColor?: string;
    legendKey?: string;
}

const BarGraph: React.FC<BarGraphProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    barColor = '#4285F4',
    legendKey
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
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Tooltip
                    formatter={(value, name, props) => [
                        value,
                        `Valor: ${value}\n` +
                        (props.payload.level ? `Nivel: ${props.payload.level}\n` : '') +
                        (props.payload.year ? `Año: ${props.payload.year}` : '')
                    ]}
                />
                {legendKey && <Legend />}
                <Bar
                    dataKey={yAxisKey}
                    fill={barColor}
                    name={legendKey}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarGraph;