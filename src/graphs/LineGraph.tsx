import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface LegendItem {
    message: string;
    color: string;
}

interface DataItem {
    departamento: string;
    year: string;
    value: number;
    legend?: string;
}

interface LineGraphProps {
    data: DataItem[];
    xAxisKey: string; // e.g., "year"
    yAxisKey: string; // e.g., "value"
    legendKey?: string; // e.g., "legend"
    legends?: LegendItem[];
}

const LineGraph: React.FC<LineGraphProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    legendKey = 'legend',
    legends = []
}) => {

    // Agrupar datos por departamento
    const departments = Array.from(new Set(data.map(d => d.departamento)));

    // Años fijos en el eje X
    const years = ['2018', '2019', '2020', '2021', '2022', '2023'];

    // Reorganizar los datos por año
    const transformedData = years.map(year => {
        const yearData: any = { year };
        data.forEach(item => {
            if (item.year === year) {
                yearData[item.departamento] = item.value;
            }
        });
        return yearData;
    });

    // Obtener color por departamento
    const getColor = (department: string) => {
        const deptLegend = data.find(d => d.departamento === department)?.legend;
        return legends.find(l => l.message === deptLegend)?.color || '#808080';
    };

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


    return (
        <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
            <h2>Indicadores por Departamento (2018–2023)</h2>
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={transformedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
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
                                {entry.name}: {entry.value?.toFixed(2)}
                                </div>
                            ))}
                            </div>
                        );
                        }
                        return null;
                    }}
                    />

                    <Legend content={renderLegend} />
                    {departments.map((dep, index) => (
                        <Line
                            key={index}
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

export default LineGraph;
