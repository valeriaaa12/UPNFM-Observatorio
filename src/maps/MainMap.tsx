import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, GeoJsonObject } from 'geojson';

interface DepartmentProperties {
  name: string;
  [key: string]: any;
}

interface DepartmentFeature {
  type: string;
  properties: DepartmentProperties;
  geometry: any;
}

interface HondurasGeoJSON {
  type: string;
  features: DepartmentFeature[];
}

interface MapParams {
  title: string;
}

const departmentStats: Record<string, { value: number }> = {
  'Atlántida': { value: 60 },
  'Choluteca': { value: 30 },
  'Colón': { value: 45 },
  'Comayagua': { value: 99.43 },
  'Copán': { value: 70 },
  'Cortés': { value: 40 },
  'El Paraíso': { value: 55 },
  'Francisco Morazán': { value: 75 },
  'Gracias a Dios': { value: 20 },
  'Intibucá': { value: 35 },
  'Islas de la Bahía': { value: 25 },
  'La Paz': { value: 40 },
  'Lempira': { value: 50 },
  'Ocotepeque': { value: 100 },
  'Olancho': { value: 60 },
  'Santa Bárbara': { value: 45 },
  'Valle': { value: 30 },
  'Yoro': { value: 50 }
};

const MainMap = ({ title }: MapParams) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON>(null);

  const getDeptColor = (deptName: string): string => {
    const value = departmentStats[deptName]?.value || 0;
    if (value > 75) return '#008000'; //verde oscuro
    if (value > 50) return '#2ecc71 '; //verde
    if (value > 25) return '#ff7f00'; //naranja
    return '#e41a1c'; //rojo
  };

  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  const deptStyle = (feature?: DepartmentFeature): L.PathOptions => {
    const deptName = feature?.properties.name;
    return {
      fillColor: deptName ? getDeptColor(deptName) : '#cccccc',
      weight: 1,

      color: 'black',
      fillOpacity: 0.85,
      ...(deptName === hoveredDept && {
        fillOpacity: 1,
      }),
      ...(deptName === selectedDept && {
        fillOpacity: 1,
        weight: 2,
        color: 'black'
      })
    };
  };

  // Event handlers
  const onEachDepartment = (feature: DepartmentFeature, layer: L.Layer) => {
    const deptName = feature.properties.name;

    layer.on({
      click: () => setSelectedDept(deptName),
      mouseover: () => setHoveredDept(deptName),
      mouseout: () => setHoveredDept(null)
    });

    layer.bindTooltip(deptName, {
      permanent: false,
      direction: 'auto',
      className: 'dept-tooltip'
    });
  };

  useEffect(() => {
    fetch('/others/hn.json')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  const FitBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (geoJsonLayerRef.current) {
        const bounds = geoJsonLayerRef.current.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [map]);

    return null;
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      backgroundColor: 'white'
    }}>
      {/* Título*/}
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: '500'
        }}>
          {title}
        </h2>
      </div>
      <div style={{
        height: 'calc(100vh - 60px)',
        width: '100%',
        position: 'relative'
      }}>
        <MapContainer
          center={[14.8, -86.8]}
          zoom={7}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white'
          }}
          minZoom={6}
          maxBounds={L.latLngBounds(
            L.latLng(12.98, -89.36),
            L.latLng(16.51, -83.12)
          )}
        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={deptStyle}
              onEachFeature={onEachDepartment}
              ref={geoJsonLayerRef}
            />
          )}

          <FitBounds />
        </MapContainer>

        {/* Leyendas */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          border: '1px solid #ccc'
        }}>
          <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Nivel de Cumplimiento</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#008000', marginRight: '5px' }}></div>
            <span>Supera la meta (76-100%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#2ecc71', marginRight: '5px' }}></div>
            <span>Cumple la meta (51-75%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ff7f00', marginRight: '5px' }}></div>
            <span>Por debajo de la meta (26-50%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
            <span>Lejos de la meta (0-25%)</span>
          </div>
        </div>

        {/* Department Info */}
        {selectedDept && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '300px',
            border: '1px solid #ccc'
          }}>
            <h3 style={{ marginTop: 0 }}>{selectedDept}</h3>
            <p>Valor: {departmentStats[selectedDept]?.value || 'N/A'}</p>
            <button
              onClick={() => setSelectedDept(null)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMap;