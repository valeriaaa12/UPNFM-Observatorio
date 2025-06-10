import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, GeoJsonObject, Geometry } from 'geojson';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';

//mapeo de datos
interface department {
  name: string;
  legend: string;
  value: number;
  year: string;
  level: string;
}

//fin de mapeo
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
interface legend {
  level: string;
  message: string;
  lowerLimit: number;
  upperLimit: number;
}
interface MapParams {
  title: string;
  departments: department[] | null;
  setDepartments: React.Dispatch<React.SetStateAction<department[] | null>>;
  legends: legend[] | null;
  setLegends: React.Dispatch<React.SetStateAction<legend[] | null>>;
  map: string;
  level: string;
  year: string;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

const FitBounds = ({ geoData }: { geoData: FeatureCollection | null }) => {
  const map = useMap();
  const fittedRef = useRef(false);

  const isValidLatLng = (geometry: any): boolean => {
    if (!geometry || !geometry.type || !geometry.coordinates) return false;
    return Array.isArray(geometry.coordinates) && geometry.coordinates.flat(Infinity).every((val: any) => typeof val === 'number' && !isNaN(val));
  };

  useEffect(() => {
    if (!geoData || fittedRef.current || !Array.isArray(geoData.features)) return;

    const validFeatures = geoData.features.filter((f) => isValidLatLng(f.geometry));
    if (validFeatures.length === 0) return;

    try {
      const layer = L.geoJSON({
        type: 'FeatureCollection',
        features: validFeatures
      } as FeatureCollection);

      const bounds = layer.getBounds();

      if (!bounds.isValid() || [bounds.getNorth(), bounds.getSouth(), bounds.getEast(), bounds.getWest()].some(isNaN)) return;

      map.fitBounds(bounds, { padding: [50, 50] });
      fittedRef.current = true;
    } catch (err) {
      console.error("Error en fitBounds:", err);
    }
  }, [geoData]);

  return null;
};

const MainMap = ({ title, departments, setDepartments, legends, setLegends, year, map, level, mapRef }: MapParams) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const geoJsonLayerRef = useRef<L.GeoJSON>(null);
  const hasZero = () => {
    if (legends?.find((item) => item.lowerLimit == 0) && level != 'Ninguno') {
      return true;
    } else if (legends?.find((item) => item.upperLimit == 0) && level != 'Ninguno') {
      return true;
    } else {
      console.log("falsoooo")
      return false;
    }

  }
  const fallback: legend = {
    level: "",
    message: "",
    lowerLimit: 0,
    upperLimit: 0
  }

  const getDeptColor = (deptName: string): string => {
    const currentDep = departments?.find((item) =>
      item.name == deptName.toLowerCase()
    )
    console.log(departments)
    const value = currentDep?.value || -1;
    console.log(level)
    const darkgreen: legend = legends?.find((item) =>
      item.message === "Mucho mejor que la meta" && item.level === level
    ) ?? fallback;
    console.log(legends)
    const green: legend = legends?.find((item) =>
      item.message === "Dentro de la meta" && item.level === level
    ) ?? fallback;

    const orange: legend = legends?.find((item) =>
      item.message === "Lejos de la meta" && item.level === level
    ) ?? fallback;

    const red: legend = legends?.find((item) =>
      item.message === "Muy lejos de la meta" && item.level === level
    ) ?? fallback;


    if (level == "Ninguno" || year == "Ninguno") return '#808080';
    if (value >= darkgreen.lowerLimit && value <= darkgreen!.upperLimit) return '#008000'; //verde oscuro
    if (value >= green!.lowerLimit && value <= green!.upperLimit) return '#2ecc71 '; //verde
    if (value >= orange!.lowerLimit && value <= orange!.upperLimit) return '#ff7f00'; //naranja
    if (value == -1) return '#808080'; //gris
    return '#e41a1c'; //rojo 
  };

  //Loading...
  useEffect(() => {
    setIsLoading(true);
    fetch(map)
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setGeoData(data);
          setIsLoading(false);
        }, 3000);
      })
      .catch(() => setIsLoading(false));
  }, []);

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

  //Limites
  const limites = () => {

    const darkgreen: legend = legends?.find((item) =>
      item.message === "Mucho mejor que la meta" && item.level === level
    ) ?? fallback;
    console.log(legends)
    const green: legend = legends?.find((item) =>
      item.message === "Dentro de la meta" && item.level === level
    ) ?? fallback;

    const orange: legend = legends?.find((item) =>
      item.message === "Lejos de la meta" && item.level === level
    ) ?? fallback;

    const red: legend = legends?.find((item) =>
      item.message === "Muy lejos de la meta" && item.level === level
    ) ?? fallback;

    return (<>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#F0F0F0',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        border: '1px solid #ccc'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{t("Limites")}</div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#008000', marginRight: '5px' }}></div>
          <span>{darkgreen.lowerLimit} - {darkgreen.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#2ecc71', marginRight: '5px' }}></div>
          <span>{green.lowerLimit} - {green.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#ff7f00', marginRight: '5px' }}></div>
          <span>{orange.lowerLimit} - {orange.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
          <span>{red.lowerLimit} - {red.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#808080', marginRight: '5px' }}></div>
          <span>N/A</span>
        </div>
      </div>
    </>);
  }
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
  const { t, i18n } = useTranslation('common');
  console.log('Current language:', i18n.language);
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
      }}
    >
      {/* Spinner de carga */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1001
        }}>
          <div className="loading-spinner-container">
            <div className="loading-spinner" />
            <p className="loading-text">{t("Cargando")}</p>
          </div>
        </div>
      )}

      {/* Título*/}
      <div ref={mapRef}>
        <div style={{ padding: '12px 20px', backgroundColor: '#2c3e50', color: 'white', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <p style={{ margin: 0 }}>{t("Nivel Educativo")}: {level}</p>
          <p style={{ margin: 0 }}>{t("Año")}: {year}</p>
        </div>
        <div id="map-container" style={{ width: '100%', height: '100%' }}>
          <MapContainer //cambie algo aqui
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
            )} //aqui termino
          >
            {geoData && (
              <GeoJSON
                data={geoData}
                style={deptStyle}
                onEachFeature={onEachDepartment}
                ref={geoJsonLayerRef}
              />
            )}
            {geoData && geoData.features?.length > 0 && (
              <FitBounds geoData={geoData} />
            )}

          </MapContainer>
        </div>

        {/* Limites */}
        {limites()}
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
          <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>{t("NivelCumplimiento")}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#008000', marginRight: '5px' }}></div>
            <span>{t("l1")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#2ecc71', marginRight: '5px' }}></div>
            <span>{t("l2")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#ff7f00', marginRight: '5px' }}></div>
            <span>{t("l3")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
            <span>{t("l4")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#808080', marginRight: '5px' }}></div>
            <span>N/A</span>
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
            <p>{t("Valor")}: {
              (() => {
                const dept = departments?.find(
                  (item) => item.name === selectedDept.toLowerCase()
                );
                return dept && (dept.value !== 0 || hasZero()) ? dept.value : 'N/A';
              })()}</p>

            {(() => {
              const dept = departments?.find(
                (item) => item.name.toLowerCase() === selectedDept.toLowerCase()
              );

              if (!dept?.legend) return <p> </p>;

              if (dept.legend === 'Mucho mejor que la meta') return <p>{t("l1")}</p>;
              if (dept.legend === 'Dentro de la meta') return <p>{t("l2")}</p>;
              if (dept.legend === 'Lejos de la meta') return <p>{t("l3")}</p>;
              if (dept.legend === 'Muy lejos de la meta') return <p>{t("l4")}</p>;
              // Fallback
              return <p>{dept.legend}</p>;
            })()}

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
              {t("Cerrar")}
            </button>
          </div>
        )}
      </div>
    </div >
  );
};

export default MainMap;
export { FitBounds };
