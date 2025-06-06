import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import SmallNavBar from "@/navigation/SmallNavBar";

const LineGraph = dynamic(() => import("@/graphs/LineGraph"), {
    ssr: false
});

interface department {
  name: string;
  legend: string;
  value: number;
  year: string;
  level: string;
}

interface Params {
  title: string;
  extensionData: string;
  extensionLimits: string;
}

interface Legend {
  level: string;
  message: string;
  lowerLimit: number;
  upperLimit: number;
  color: string;
}

export default function LineGraphScreen({ title, extensionData, extensionLimits }: Params) {
  const [selectedYear, setSelectedYear] = useState<string>("Ninguno");
  const [selectedLevel, setSelectedLevel] = useState<string>("Ninguno");
  const [departments, setDepartments] = useState<department[]>([]);
  const [filteredData, setFilteredData] = useState<department[]>([]);
  const [legends, setLegends] = useState<Legend[]>([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<string[]>([]);
  const { t } = useTranslation('common');
  const levels = [t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")];

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

      const [data, legends, years] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionData}`, config),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${extensionLimits}`, config),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/periodosAnuales`, config)
      ]);

      const departmentsData: department[] = data.data.map((item: any) => ({
        name: item.departamento.toLowerCase(),
        legend: item.leyenda,
        value: parseFloat(item.tasa),
        year: item.periodo_anual,
        level: item.nivel
      }));

      const legendsData: Legend[] = legends.data.map((item: any) => ({
        level: item.nivel,
        message: item.leyenda,
        lowerLimit: parseFloat(item.min),
        upperLimit: parseFloat(item.max)
      }));

      const legendsWithColors = assignColorsToLegends(legendsData);

      setDepartments(departmentsData);
      setLegends(legendsWithColors);
      setYears(years.data);
      setFilteredData([]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignColorsToLegends = (legendsData: Legend[]): Legend[] => {
        const colorMap: Record<string, string> = {
            "Mucho mejor que la meta": "#008000",  // Verde oscuro
            "Dentro de la meta": "#27ae60",        // Verde
            "Lejos de la meta": "#FFC300",        // Amarillo
            "Muy lejos de la meta": "#e41a1c", // Rojo
            "N/A": "#808080"       // Gris
        };
    return legendsData.map(legend => ({
      ...legend,
      color: colorMap[legend.message] ?? "#808080"
    }));
  };

  const applyFilters = () => {
    if (selectedYear === "Ninguno" && selectedLevel === "Ninguno") {
      setFilteredData([]);
      return;
    }

    let result = [...departments];

    if (selectedYear !== "Ninguno") {
      result = result.filter(d => d.year === selectedYear);
    }

    if (selectedLevel !== "Ninguno") {
      result = result.filter(d => d.level === selectedLevel);
    }

    result.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredData(result);
  };

  const formatDataForLineGraph = (data: department[]) => {
  const grouped: Record<string, any> = {};

  data.forEach(({ name, year, value }) => {
    if (!grouped[name]) {
      grouped[name] = { name };
    }
    grouped[name][year] = value;
  });

  return Object.values(grouped);
};

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { applyFilters(); }, [selectedYear, selectedLevel, departments]);

  return (
    <Client>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <SmallNavBar />

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', padding: '20px' }}>
            <h2 style={{ marginBottom: '20px' }}>
              {title} - {selectedLevel !== "Ninguno" ? selectedLevel : "Todos los niveles"} {selectedYear !== "Ninguno" ? `(${selectedYear})` : ""}
            </h2>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t("Nivel Educativo")}:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{t("Año")}:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="Ninguno">{t("Ninguno")}</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ height: '500px', border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
              {filteredData.length > 0 ? (
               <LineGraph
                    data={filteredData.map(({ name, ...rest }) => ({
                      departamento: name,
                      ...rest
                    }))}
                    xAxisKey="year"
                    yAxisKey="value"
                    legendKey="legend"
                    legends={legends}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: '#666'
                }}>
                  No hay datos disponibles para los filtros seleccionados
                </div>
              )}
            </div>
          </div>
        )}

        <LanguageSelector />
      </div>
    </Client>
  );
}
