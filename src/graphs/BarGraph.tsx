import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Datos de ejemplo por departamento
const datosPorDepartamento = [
    { departamento: "Francisco Morazán", matriculados: 50000, aprobados: 42000 },
    { departamento: "Cortés", matriculados: 45000, aprobados: 38000 },
    { departamento: "Atlántida", matriculados: 20000, aprobados: 17000 },
    { departamento: "Yoro", matriculados: 18000, aprobados: 15000 },
    { departamento: "Choluteca", matriculados: 15000, aprobados: 12000 },
];

const GraficoDepartamentos = () => {
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

            {/* Gráfico de barras horizontales */}
            <ResponsiveContainer width="100%" height={500}>
                <BarChart
                    data={datosPorDepartamento}
                    layout="vertical"
                    margin={{ left: 100 }} // Espacio para nombres largos
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="departamento"
                        type="category"
                        width={150} // Ajuste para nombres de departamentos
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey={indicador}
                        fill="#8884d8"
                        name={indicador === "matriculados" ? "Total Matriculados" : "Total Aprobados"}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoDepartamentos;