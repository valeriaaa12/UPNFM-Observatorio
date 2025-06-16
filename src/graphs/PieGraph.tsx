import React from 'react';
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
        <div style={{ display: 'flex', width: '100%', height: '500px' }}>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Tooltip />
                        <Pie
                            data={processedData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={180}
                            label={({ name }) => name}
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PieGraph;
