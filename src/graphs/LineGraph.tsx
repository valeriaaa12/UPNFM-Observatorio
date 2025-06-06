import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const datosPorDepartamento = [
    { departamento: "Francisco Morazán", matriculados: 50000, aprobados: 42000 },
    { departamento: "Cortés", matriculados: 45000, aprobados: 38000 },
    { departamento: "Atlántida", matriculados: 20000, aprobados: 17000 },
    { departamento: "Yoro", matriculados: 18000, aprobados: 15000 },
    { departamento: "Choluteca", matriculados: 15000, aprobados: 12000 },
];
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

interface LineGraphProps {
    data: DataItem[];
    xAxisKey: string;
    yAxisKey: string;
    legendKey?: string;
    legends?: LegendItem[]; // Hacer opcional y definir tipo correctamente
}



const LineGraph: React.FC<LineGraphProps> = ({
    data,
    xAxisKey,
    yAxisKey,
    legendKey = 'legend', // Valor por defecto
    legends = [] // Valor por defecto
}) => {
    const [indicador, setIndicador] = useState("matriculados");

    return (
        <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
            <h2>Indicadores Educativos por Departamento (Honduras)</h2>

            {/* Filtro de indicador */}
            <div style={{ marginBottom: 20 }}>
                <label>
                    Indicador:
                    <select
                        value={indicador}
                        onChange={(e) => setIndicador(e.target.value)}
                        style={{ marginLeft: 10 }}
                    >
                        <option value="matriculados">Matriculados</option>
                        <option value="aprobados">Aprobados</option>
                    </select>
                </label>
            </div>

            {/* Gráfico de líneas */}
            <ResponsiveContainer width="100%" height={500}>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="departamento"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {data.map((item, index) => {
                                        const legendItem = legends.find(l => l.message === item.legend);
                                        const fillColor = legendItem?.color || '#4285F4';
                                        const barName = legendKey ? item[legendKey as keyof DataItem] : undefined;
                    
                                        return (
                                            <Line
                                                key={`${index}-${item.name}`}
                                                dataKey={yAxisKey}
                                                fill={fillColor}
                                                name={typeof barName === 'string' ? barName : undefined}
                                            />
                                        );
                                    })}
                    <Line
                        type="monotone"
                        dataKey={indicador}
                        stroke="#8884d8"
                        activeDot={{ r: 18 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineGraph;