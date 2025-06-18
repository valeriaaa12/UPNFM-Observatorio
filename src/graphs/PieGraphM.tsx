import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

const defaultColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
    '#8E44AD', '#2ECC71', '#E67E22', '#3498DB', '#E74C3C', '#1ABC9C',
    '#9B59B6', '#F39C12', '#D35400', '#1F618D', '#7D3C98', '#117A65',
    '#A04000', '#DE3163', '#58D68D'
];

interface DataItem {
    name: string;
    value: number;
    legend?: string;
    year: string;
    level: string;
    department?: string;
}

interface PieGraphMProps {
    data: DataItem[];
}

const PieGraphM: React.FC<PieGraphMProps> = ({ data }) => {
    const { t } = useTranslation('common');

    const graphData = useMemo(() => (
        data.map((item, index) => ({
            ...item,
            color: defaultColors[index % defaultColors.length]
        }))
    ), [data]);

    return (<ResponsiveContainer width="100%" height={450}>
        <PieChart>
            <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
            <Pie
                data={graphData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={160}
                label={({ name }) => name}
            >
                {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
        </PieChart>
    </ResponsiveContainer>
    );
};

export default PieGraphM;