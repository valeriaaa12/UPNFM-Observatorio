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
  setMapa: React.Dispatch<React.SetStateAction<string>>;
  mapa: string;
  mapaElegido: string;
  setMapaElegido: React.Dispatch<React.SetStateAction<string>>;
}

interface deptMaps {
  deptName: string,
  geojson: string
}

export default function MapFilters({ mapaElegido, setMapaElegido, level, setLevel, selectedYear, setSelectedYear, years, mapa, setMapa }: params) {
  const { t, i18n } = useTranslation('common');
  const [select, setSelect] = useState("Honduras");
  const deptList: deptMaps[] = [
    { deptName: "Honduras", geojson: "/others/hn.json" },
    { deptName: "Atlántida", geojson: "/others/hn-municipios-01-atlantida.geo.json" },
    { deptName: "Colón", geojson: "/others/hn-municipios-02-colon.geo.json" },
    { deptName: "Comayagua", geojson: "/others/hn-municipios-03-comayagua.geo.json" },
    { deptName: "Copán", geojson: "/others/hn-municipios-04-copan.geo.json" },
    { deptName: "Cortés", geojson: "/others/hn-municipios-05-cortes.geo.json" },
    { deptName: "Choluteca", geojson: "/others/hn-municipios-06-choluteca.geo.json" },
    { deptName: "El Paraíso", geojson: "/others/hn-municipios-07-elparaiso.geo.json" },
    { deptName: "Francisco Morazán", geojson: "/others/hn-municipios-08-franciscomorazan.geo.json" },
    { deptName: "Gracias a Dios", geojson: "/others/hn-municipios-09-graciasadios.geo.json" },
    { deptName: "Intibucá", geojson: "/others/hn-municipios-10-intibuca.geo.json" },
    { deptName: "Islas de la Bahía", geojson: "/others/hn-municipios-11-islasdelabahia.geo.json" },
    { deptName: "La Paz", geojson: "/others/hn-municipios-12-lapaz.geo.json" },
    { deptName: "Lempira", geojson: "/others/hn-municipios-13-lempira.geo.json" },
    { deptName: "Ocotepeque", geojson: "/others/hn-municipios-14-ocotepeque.geo.json" },
    { deptName: "Olancho", geojson: "/others/hn-municipios-15-olancho.geo.json" },
    { deptName: "Santa Bárbara", geojson: "/others/hn-municipios-16-santabarbara.geo.json" },
    { deptName: "Valle", geojson: "/others/hn-municipios-17-valle.geo.json" },
    { deptName: "Yoro", geojson: "/others/hn-municipios-18-yoro.geo.json" }
  ];
  const deptNames: string[] = [
    "Honduras", "Atlántida", "Choluteca", "Colón", "Comayagua", "Copán", "Cortés", "El Paraíso", "Francisco Morazán", "Gracias a Dios", "Intibucá", "Islas de la Bahía", "La Paz", "Lempira", "Ocotepeque", "Olancho", "Santa Bárbara", "Valle", "Yoro"
  ];

  const changeValue = (value: string) => {
    setSelect(value)
    const dept = deptList.find((item) => item.deptName == value)
    setMapa(dept ? dept.geojson : "/others/hn.json")
    setMapaElegido(dept ? value : "Honduras")
    setSelectedYear("Ninguno")
    setLevel("Ninguno")
    console.log("mapa: " + mapa)
  }
  const setValue = () => {
    const dept = deptList.find((item) => item.geojson == mapa)
    return dept ? dept.deptName : "Honduras"
  }
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
              title={t("Nivel Educativo")}
              options={[t("Ninguno"), t("Pre-basica"), t("BasicaI"), t("BasicaII"), t("BasicaIII"), t("Basica1y2"), t("Basica1,2,3"), t("Media")]}
              value={level}
              onChange={setLevel}
            >
            </ComboBox>
          </div>


          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title={t("Año")}
              options={[t("Ninguno"), ...years]}
              value={selectedYear}
              onChange={setSelectedYear}>
            </ComboBox>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title={"Mapa Seleccionado"}
              options={deptNames}
              value={setValue()}
              onChange={changeValue}>
            </ComboBox>
          </div>
        </div>

        {/* Visualización */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>{t("Visualizacion")}</h4>

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
