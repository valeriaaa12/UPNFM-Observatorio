import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, GeoJsonObject } from 'geojson';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import LanguageSelector from "@/buttons/LanguageSelector";
'@/components/FuenteDeDatos';

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
  filter: string;
  municipio: string
}

const FitBounds = ({ geoData }: { geoData: FeatureCollection | null }) => {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (geoData) {

      const bounds = L.geoJSON(geoData).getBounds();
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
      setTimeout(() => {
        if (map.getZoom() < 7) {
          map.setZoom(7);
        }
      }, 500);
      fittedRef.current = true;
    }
  }, [geoData, map]);

  return null;
};


const MainMap = ({ title, departments, setDepartments, legends, setLegends, year, map, level, filter, municipio }: MapParams) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation('common');
  const levelsList = [
        {  name: t("Ninguno"), value: "Ninguno"}, {name: t("Pre-basica"), value: "Pre-básica"}, {name: t("BasicaI"), value: "Básica I Ciclo"}, {name: t("BasicaII"), value: "Básica II Ciclo"}, {name: t("BasicaIII"), value: "Básica III Ciclo"}, {name: t("Basica1y2"), value: "Básica I-II Ciclo"}, {name: t("Basica1,2,3"), value: "Básica I-II-III Ciclo"}, {name: t("Media"), value: "Media"}];
  const mapRef = useRef<L.Map | null>(null);


  const geoJsonLayerRef = useRef<L.GeoJSON>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([14.8, -86.8]);

  const getCenterFromGeoJSON = (geoData: FeatureCollection): [number, number] => {
    const bounds = L.geoJSON(geoData).getBounds();
    const center = bounds.getCenter();
    return [center.lat, center.lng]; // Convert LatLng to [number, number]
  };
  //Inicio de pruebas de mapa cargado a backend dinamico

  const generateData = async () => {
    if (year == "Ninguno" || level == "Ninguno") {
      setDepartments([])
      return
    }
    setIsLoading(true);
    try {
      let url = process.env.NEXT_PUBLIC_BACKEND_URL + filter

      if (municipio != "Honduras") {
        url += "Municipal";
      }

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          departamento: municipio.toUpperCase(),
          anio: year == "Ninguno" ? "2020" : year,
          nivel: level == "Ninguno" ? "Básica III Ciclo" : level
        }
      }
      //petición a backend
      const response = await axios.get(url, config)

      //mapeo a lista temporal
      let tempoDepartments: department[] | null = null;
      if (municipio === "Honduras") {
        tempoDepartments = response.data.map((item: any) => ({
          name: item.departamento.toLowerCase(),
          legend: item.leyenda,
          value: parseFloat(item.tasa),
          year: item.periodo_anual,
          level: item.nivel
        }));
      } else {
        tempoDepartments = response.data.map((item: any) => ({
          name: item.municipio.toLowerCase(),
          legend: item.leyenda,
          value: parseFloat(item.tasa),
          year: item.periodo_anual,
          level: item.nivel
        }));
      }

      setDepartments(tempoDepartments)

      setIsLoading(false);
    } catch (error) {
      setTimeout(() => {
        generateData();
      }, 3000);
    }

  }
  useEffect(() => {

    generateData();
  }, [year, level])
  //fin de pruebas
  const hasZero = () => {
    if (legends?.find((item) => item.lowerLimit == 0) && level != 'Ninguno') {
      return true;
    } else if (legends?.find((item) => item.upperLimit == 0) && level != 'Ninguno') {
      return true;
    } else {

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

    const value = currentDep ? currentDep.value : -1;

    const darkgreen: legend = legends?.find((item) =>
      item.message === "Mucho mejor que la meta" && item.level === level
    ) ?? fallback;

    const green: legend = legends?.find((item) =>
      item.message === "Dentro de la meta" && item.level === level
    ) ?? fallback;

    const yellow: legend = legends?.find((item) =>
      item.message === "Lejos de la meta" && item.level === level
    ) ?? fallback;

    const red: legend = legends?.find((item) =>
      item.message === "Muy lejos de la meta" && item.level === level
    ) ?? fallback;


    if (level == "Ninguno" || year == "Ninguno") return '#808080';
    if (value >= darkgreen.lowerLimit && value <= darkgreen!.upperLimit) return '#008000'; //verde oscuro
    if (value >= green!.lowerLimit && value <= green!.upperLimit) return '#27ae60'; //verde
    if (value >= yellow!.lowerLimit && value <= yellow!.upperLimit) return '#FFC300'; //amarillo
    if (value == -1) return '#808080'; //gris
    return '#e41a1c'; //rojo 
  };

  //Loading...
  useEffect(() => {
    setIsLoading(true);
    setGeoData(null);
    setSelectedDept(null);  // Reset selected department

    fetch(map)
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setGeoData(data);
          setIsLoading(false);
          if (data) {
            const center = getCenterFromGeoJSON(data);
            setMapCenter(center); // Update center based on GeoJSON
          }
          // Recenter the map after new data loads
          if (mapRef.current && data) {
            const bounds = L.geoJSON(data).getBounds();
            const paddedBounds = bounds.pad(10);
            mapRef.current.setMaxBounds(paddedBounds);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] },);
          }
        }, 3000);
      })
      .catch(() => setIsLoading(false));
  }, [map]);
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  const deptStyle = (feature?: DepartmentFeature): L.PathOptions => {
    const deptName = feature?.properties.name ?? feature?.properties.NOMBRE;
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

  useEffect(() => {
    const styleId = 'dept-tooltip-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .dept-tooltip {
          font-size: 1rem !important;
          font-weight: 600;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  //Limites
  const limites = () => {
    const darkgreen: legend = legends?.find((item) =>
      item.message === "Mucho mejor que la meta" && item.level === level
    ) ?? fallback;

    const green: legend = legends?.find((item) =>
      item.message === "Dentro de la meta" && item.level === level
    ) ?? fallback;

    const yellow: legend = legends?.find((item) =>
      item.message === "Lejos de la meta" && item.level === level
    ) ?? fallback;

    const red: legend = legends?.find((item) =>
      item.message === "Muy lejos de la meta" && item.level === level
    ) ?? fallback;

    return (<>
      <div
        id="limits-container"
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '20px',
          backgroundColor: '#F0F0F0',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          border: '1px solid #ccc'
        }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Límites</div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#008000', marginRight: '5px' }}></div>
          <span>{darkgreen.lowerLimit} - {darkgreen.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#27ae60', marginRight: '5px' }}></div>
          <span>{green.lowerLimit} - {green.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#FFC300', marginRight: '5px' }}></div>
          <span>{yellow.lowerLimit} - {yellow.upperLimit}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
          <span>{red.lowerLimit} - {red.upperLimit}</span>
        </div>
        {map != '/others/hn.json' && <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
          <div style={{ width: '15px', height: '15px', backgroundColor: '#808080', marginRight: '5px' }}></div>
          <span>N/D</span>
        </div>}
      </div>
    </>);
  }
  // Event handlers
  const onEachDepartment = (feature: DepartmentFeature, layer: L.Layer) => {
    const deptName = feature.properties.name ?? feature.properties.NOMBRE;

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
  

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      width: '100%',
      height: '100%'
    }}>
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
      <div style={{
        padding: '12px 20px',
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 id="Titulo" style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: '500'
        }}>
          {title} {level !== "Ninguno" ? `- ${levelsList.find(l => l.value === level)?.name}` : ""} {year !== "Ninguno" ? `(${year})` : ""}
        </h2>
      </div>
      <div style={{
        height: 'calc(100% - 51px)',
        width: '100%',
        position: 'relative'
      }}>

        <MapContainer
          className='map-container'
          center={mapCenter}
          zoom={7}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
          }}
          minZoom={6}
          maxBounds={L.geoJSON(geoData).getBounds()}

        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={deptStyle}
              onEachFeature={onEachDepartment}
              ref={geoJsonLayerRef}
              key={JSON.stringify(geoData)}
            />
          )}

          <FitBounds geoData={geoData} />
        </MapContainer>

        {/* Limites */}
        {limites()}
        {/* Leyendas */}
        <div
          id="legends-container"
          style={{

            position: 'absolute',
            bottom: '80px',
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
            <div style={{ width: '15px', height: '15px', backgroundColor: '#27ae60', marginRight: '5px' }}></div>
            <span>{t("l2")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#FFC300', marginRight: '5px' }}></div>
            <span>{t("l3")}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: '#e41a1c', marginRight: '5px' }}></div>
            <span>{t("l4")}</span>
          </div>
          {map != '/others/hn.json' &&
            <div style={{ display: 'flex', alignItems: 'center', margin: '3px 0' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#808080', marginRight: '5px' }}></div>
              <span>N/D</span>
            </div>}
        </div>

        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#666',
          zIndex: 1000,
          padding: '2px 0'
        }}>
          Fuente: Secretaría de Educación, Sistema de Administración de Centros Educativos (SACE, 2018-2023)
          <br></br>
          Elaborado por: Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) - Instituto de Investigación y Evaluación Educativas y Sociales (INIEES). UPNFM. {new Date().getFullYear()}
        </div>

        {/* Department Info */}
        {selectedDept && (
          <div
            id="info-container"
            style={{
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
            <p>
              {t("Valor")}: {
                (() => {
                  const dept = departments?.find(
                    (item) => item.name === selectedDept.toLowerCase()
                  );
                  return dept && (dept.value !== 0 || hasZero()) ? `${dept.value}%` : 'N/D';
                })()
              }
            </p>

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