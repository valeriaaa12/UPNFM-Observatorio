import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(180);

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

    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) {
            console.log('Yikes');
            return;
        }

        console.log('Noice');

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const newRadius = Math.max(60, Math.min(180, width / 3));
                console.log('container width:', width, ' → radius:', newRadius);
                setRadius(newRadius);
            }
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const width = containerRef.current?.offsetWidth ?? 0;
            const fallbackRadius = 40;
            console.log('⏱ setTimeout fallback width:', width, ' → radius:', fallbackRadius);
            setRadius(fallbackRadius);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    console.log('Usando radius:', radius);
    return (
        <div className="pie-chart-wrapper">
            <div className="pie-legend">
                {processedData.map((entry, index) => (
                    <div key={`legend-${index}`} className="legend-item">
                        <div
                            className="legend-color"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.name}</span>
                    </div>
                ))}
            </div>
            <div
                ref={containerRef}
                className="pie-container"
                style={{ minHeight: '300px', overflow: 'hidden' }}
            >
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
                                outerRadius={radius}
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
