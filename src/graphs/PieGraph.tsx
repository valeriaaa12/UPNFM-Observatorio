import React, { useState, useEffect } from 'react'; // ya importado
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF',
    '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C', '#9B59B6', '#34495E',
    '#95A5A6', '#F39C12'
];

interface DataItem {
    name: string;
    value: number;
    year: string;
    level: string;
}

interface PieGraphProps {
    data: DataItem[];
}

const PieGraph: React.FC<PieGraphProps> = ({ data }) => {
    const { t } = useTranslation('common');

    const departmentColors: Record<string, string> = {};
    data.forEach((item, index) => {
        if (!departmentColors[item.name]) {
            departmentColors[item.name] = defaultColors[index % defaultColors.length];
        }
    });

    const processedData = data.map(item => ({
        ...item,
        value: item.value,
        color: departmentColors[item.name]
    }));

    return (
        <div className="pie-chart-wrapper">
            <div className="pie-legend">
                {processedData.map((entry, index) => (
                    <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: entry.color,
                            marginRight: '8px',
                            display: 'inline-block'
                        }} />
                        <span>{entry.name}</span>
                    </div>
                ))}
            </div>
            <div className="pie-container" style={{ minHeight: '300px' }}>
                {processedData.length === 0 ? (
                    <p>No hay datos</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip />
                            <Pie
                                data={processedData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={window.innerWidth < 768 ? 120 : 180}
                                label={false}
                            >
                                {processedData.map((entry, index) => (
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
