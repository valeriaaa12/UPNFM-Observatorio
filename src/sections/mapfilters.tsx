import ComboBox from "@/components/combobox";
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useTranslation } from 'react-i18next';
interface params {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  years: string[];
}

export default function MapFilters({ level, setLevel, selectedYear, setSelectedYear, years }: params) {
   const { t, i18n } = useTranslation('common');  
   console.log('Current language:', i18n.language);
  return (
    <>
      {/* Menú*/}
      <div style={{
        width: '250px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #dee2e6',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{t("OpcionesMapa")}</h2>

        {/* Filtros */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>{t("Filtro")}</h4>
          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title="Nivel Educativo"
              options={["Ninguno", "Prebásica", "Básica I-II Ciclo", "Básica III Ciclo", "Media"]}
              value={level}
              onChange={setLevel}
            >
            </ComboBox>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title="Año"
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}>
            </ComboBox>
          </div>

        </div>

        {/* Visualización */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>{t("Visualizacion")}</h4>
          <button style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {t("ReiniciarVista")}
          </button>
          <button style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {t("Imprimir")}
          </button>
        </div>
      </div>
    </>
  )

}
