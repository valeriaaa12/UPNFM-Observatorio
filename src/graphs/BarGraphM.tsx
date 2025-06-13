import React, { useEffect, useMemo, useState } from 'react';
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
import axios from 'axios';

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
    initialData: any[];
    extensionData: string;
    extensionLimits: string;
    title: string;
    selectedDepartment: string;
    selectedYear: string;
    selectedLevel: string;
    legendKey: string;
    legends: LegendItem[];
    yAxisKey: string;
}

const BarGraph: React.FC<BarGraphProps> = ({
    initialData,
    extensionData,
    extensionLimits,
    title,
    selectedDepartment,
    selectedLevel,
    selectedYear,
     legendKey, legends = [] ,yAxisKey
}) => {
    const { t } = useTranslation('common');
    const [municipalData, setMunicipalData] = useState<any[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    
    const processedData = initialData.map(item => {
        const legendColor = legends.find(
            l => l.message === (item as any)[legendKey]
        )?.color || '#808080';

        return {
            ...item,
            color: legendColor,
            displayName: item.department ? `${t("Municipio")}: ${item.name}` : item.name
        };
    });

    const renderLegend = () => {
    const uniqueLegends = Array.from(new Set(graphData.map(item => item.legend)))
        .filter((legend): legend is string => legend !== undefined)
        .map(legend => {
            const legendItem = legends.find(l => l.message === legend);
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

    const departmentData = useMemo(() => {
        return initialData.map(item => ({
            name: item.departamento,
            value: parseFloat(item.tasa) || 0,
            legend: item.leyenda,
            year: item.periodo_anual?.toString() || '',
            level: item.nivel?.toLowerCase() || '',
            department: item.departamento?.toLowerCase() || ''
        }));
    }, [initialData]);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDepartment) {
                setMunicipalData([]);
                return;
            }

            setLoading(true);
            try {
                const yearsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`);
                setYears(yearsResponse.data);

                const config = {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    params: { departamento: selectedDepartment.toUpperCase() }
                };
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}Municipal`, config);
                console.log("📦 Municipios recibidos:", response.data);
                setMunicipalData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDepartment, extensionData]);

    const graphData = useMemo(() => {
    const dataSource = selectedDepartment && municipalData.length > 0 ?
        municipalData.map(item => ({
            name: item.municipio || item.departamento || 'Sin nombre',
            value: parseFloat(item.tasa) || 0,
            legend: item.leyenda,
            year: item.periodo_anual?.toString() || '',
            level: item.nivel?.toLowerCase() || '',
            department: item.departamento?.toLowerCase() || ''
        })) :
        departmentData;

    const filtered = dataSource.filter(item => {
        const matchesYear = !selectedYear || item.year === selectedYear.toString();
        const matchesLevel = !selectedLevel || item.level === selectedLevel.toLowerCase();
        const matchesDepartment = !selectedDepartment || !municipalData.length || item.department === selectedDepartment.toLowerCase();
        return matchesYear && matchesLevel && matchesDepartment;
    });

    // ✅ Asignar color según leyenda
    const colored = filtered.map(item => ({
        ...item,
        color: legends.find(l => l.message === item.legend)?.color || '#808080'
    }));

    return colored;
}, [departmentData, municipalData, selectedYear, selectedLevel, selectedDepartment, legends]);


    const chartHeight = Math.max(300, graphData.length * 40); // más espacio por barra


    const dynamicFontSize = graphData.length > 30 ? 8 :
                        graphData.length > 20 ? 10 :
                        graphData.length > 12 ? 12 : 14;

    return (
      
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={graphData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={200}
                            interval={0}
                            tick={({ x, y, payload }) => {
                                const name = payload.value.length > 30 ? payload.value.slice(0, 30) + "…" : payload.value;
                                return (
                                    <text x={x} y={y} dy={4} fontSize={dynamicFontSize} textAnchor="end">
                                        {name}
                                    </text>
                                );
                            }}
                        />

                        <Tooltip
                            formatter={(value: any, name: any, props: any) => [
                                `${value}%`,
                                `${selectedDepartment ? 'Municipio' : 'Departamento'}: ${props.payload.name}`,
                                selectedDepartment && `Departamento: ${selectedDepartment}`,
                                `Año: ${props.payload.year}`,
                                `Nivel: ${props.payload.level}`
                            ]}
                        />
                       <Legend content={renderLegend} />
                             <Bar dataKey={yAxisKey} name={t("Valor")}>
                                   {graphData.map((item, index) => (
                                   <Cell key={`cell-${index}`} fill={item.color} />
                                    ))}
                               </Bar>
                    </BarChart>
                </ResponsiveContainer>
           
    );
};

export default BarGraph;
