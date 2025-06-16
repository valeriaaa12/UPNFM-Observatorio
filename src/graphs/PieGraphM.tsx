import React, { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";
import axios from 'axios';

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
    '#C9CBCF', '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C',
    '#9B59B6', '#34495E', '#95A5A6', '#F39C12', '#D35400', '#1F618D', '#7D3C98',
    '#117A65', '#A04000', '#5D6D7E', '#7FB3D5', '#58D68D', '#F5B041', '#AAB7B8'
];

interface DataItem {
    name: string;
    value: number;
    year: string;
    level: string;
    department?: string;
}
interface DataItem2 {
    name: string;
    value: number;
    legend: string;
    year: string;
    level: string;
    department?: string;
}
interface PieGraphProps {
    data: DataItem[];
    selectedYear: string;
    selectedLevel: string;
    selectedDepartment: string;
    extensionData: string;
    extensionLimits: string;
    title: string;
    setMunicipios: React.Dispatch<React.SetStateAction<DataItem2[] | null>>;
}

const PieGraph: React.FC<PieGraphProps> = ({
    data,
    selectedYear,
    selectedLevel,
    selectedDepartment,
    extensionData,
    extensionLimits,
    title,
    setMunicipios
}) => {
    const { t } = useTranslation('common');
    const [municipalData, setMunicipalData] = useState<any[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const departmentData = useMemo(() => {
        return data.map(item => ({
            name: item.department,
            value: item.value || 0,
            year: item.year || '',
            level: item.level?.toLowerCase() || '',
            department: item.department?.toLowerCase() || ''
        }));
    }, [data]);

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
                console.log("Municipios recibidos:", response.data);
                setMunicipalData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDepartment, extensionData]);

    //seteo de municipios para el excel
    useEffect(() => {
            //filter and set
            const dataSource = selectedDepartment && municipalData.length > 0
            ? municipalData.map(item => ({
                name: item.municipio || item.departamento || 'Sin nombre',
                value: parseFloat(item.tasa) || 0,
                year: item.periodo_anual?.toString() || '',
                level: item.nivel?.toLowerCase() || '',
                department: item.departamento?.toLowerCase() || '',
                legend: item.leyenda || ''
            }))
            : departmentData;
            const filtered = dataSource?.filter(item => {
                const matchesLevel = !selectedLevel || item.level === selectedLevel.toLowerCase();
                const matchesDepartment = !selectedDepartment || !municipalData.length || item.department === selectedDepartment.toLowerCase();        
                const matchesYear = !selectedYear || item.year === selectedYear.toString();
                return matchesLevel && matchesDepartment && matchesYear;
            });
                
            //setMunicipios(filtered)
    },[municipalData, selectedLevel, selectedDepartment, selectedYear])

    const graphData = useMemo(() => {
        const dataSource = selectedDepartment && municipalData.length > 0
            ? municipalData.map(item => ({
                name: item.municipio || item.departamento || 'Sin nombre',
                value: parseFloat(item.tasa) || 0,
                year: item.periodo_anual?.toString() || '',
                level: item.nivel?.toLowerCase() || '',
                department: item.departamento?.toLowerCase() || ''
            }))
            : departmentData;

        return dataSource
            .filter(item => {
                const matchesYear = !selectedYear || item.year === selectedYear.toString();
                const matchesLevel = !selectedLevel || item.level === selectedLevel.toLowerCase();
                const matchesDepartment = !selectedDepartment || !municipalData.length || item.department === selectedDepartment.toLowerCase();
                return matchesYear && matchesLevel && matchesDepartment;
            })
            .map((item, index) => ({
                ...item,
                color: defaultColors[index % defaultColors.length]
            }));
    }, [selectedDepartment, municipalData, departmentData, selectedYear, selectedLevel]);

    return (
        <div style={{ display: 'flex', width: '100%', height: '400px', alignItems: 'center' }}>
            <div style={{ width: '25%', padding: '1rem', maxHeight: '100%', overflowY: 'auto' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Municipios</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {graphData.map((item, index) => (
                        <li
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '0.3rem', // menos espacio entre elementos
                                fontSize: '0.75rem' // texto más pequeño (~12px)
                            }}
                        >
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: 12,
                                    height: 10,
                                    backgroundColor: item.color,
                                    marginRight: 6,
                                    borderRadius: 2
                                }}
                            />
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>

            </div>

            <div style={{ width: '70%', height: '100%' }}>
                {graphData.length === 0 ? (
                    <p>No hay datos para mostrar.</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                            <Pie
                                data={graphData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={160}
                                label={false}
                            >
                                {graphData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default PieGraph;
