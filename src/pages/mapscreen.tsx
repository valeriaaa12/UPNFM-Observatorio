
import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import ComboBox from "@/components/combobox";
import React, { useState } from 'react';

const MainMap = dynamic(() => import("@/maps/MainMap"), {
  ssr: false
});

export default function MapScreen() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const years = ['Todos', '2020', '2021', '2022', '2023', '2024'];

  return (
    <>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
          {/* Menú*/}
          <div style={{
            width: '250px',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRight: '1px solid #dee2e6',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Opciones del Mapa</h2>

            {/* Filtros */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Filtros</h4>
              <div style={{ marginBottom: '10px' }}>
                <ComboBox
                  title="Nivel Educativo"
                  options={["Todos", "Prebásica", "Básica I-II Ciclo", "Básica III Ciclo", "Media"]}>
                </ComboBox>
                <ComboBox
                  title="Año"
                  options={years}>
                </ComboBox>
              </div>
            </div>

            {/* Visualización */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Visualización</h4>
              <button style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                backgroundColor: '#e9ecef',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Reiniciar vista
              </button>
              <button style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#e9ecef',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Imprimir Mapa
              </button>
            </div>
          </div>

          {/* Mapa */}
          <div style={{ flex: 1, position: 'relative' }}>
            <MainMap title="Tasa de Deserción Escolar en Honduras" />
          </div>
        </div>

      </div >
    </>
  );
}