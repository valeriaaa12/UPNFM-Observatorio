import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import ComboBox from "@/components/combobox";
import React, { useState, useEffect, useRef } from 'react';
import MapFilters from "@/sections/mapfilters";
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import SmallNavBar from "@/navigation/SmallNavBar";
import html2canvas from 'html2canvas';


const MainMap = dynamic(() => import("@/maps/MainMap"), {
  ssr: false
});

//mapeo de datos
interface department {
  name: string;
  legend: string;
  value: number;
  year: string;
  level: string;
}

interface params {
  title: string;
  extensionData: string;
  extensionLimits: string;
}

interface legend {
  level: string;
  message: string;
  lowerLimit: number;
  upperLimit: number;
}

export default function MapScreen({ title, extensionData, extensionLimits }: params) {
  const [selectedYear, setSelectedYear] = useState("Ninguno");
  const [level, setLevel] = useState("Ninguno")

  const [filteredDepartments, setFilteredDepartments] = useState<department[] | null>(null);
  const [legends, setLegends] = useState<legend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<string[]>([]);
  const [mapaElegido, setMapaElegido] = useState("Honduras");
  const [mapa, setMapa] = useState("/others/hn.json");
  const leafletMapRef = useRef<L.Map | null>(null); // para Leaflet
  const exportRef = useRef<HTMLDivElement | null>(null); // para html2canvas  

  //metodo de mapeo
  const mapData = async () => {
    setLoading(true);
    try {
      let config = null;
      let url = process.env.NEXT_PUBLIC_BACKEND_URL + extensionData
      if (mapaElegido != "Honduras") {
        url += "Municipal"
        config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            departamento: mapaElegido.toUpperCase()


          }
        }
      } else {
        config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      }
      console.log(url)
      //segundo query para los limites
      const url2 = process.env.NEXT_PUBLIC_BACKEND_URL + extensionLimits
      //años
      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

      /*const [response, response2, response3] = await Promise.all([
        axios.get(url, config),
        axios.get(url2, config),
        axios.get(BACKEND + '/periodosAnuales')
      ]);*/
      const [response2, response3] = await Promise.all([
        axios.get(url2, config),
        axios.get(BACKEND + '/periodosAnuales')
      ]);
      let tempoDepartments: department[] | null = null;




      const tempoLegends: legend[] = response2.data.map((item: any) => ({
        level: item.nivel,
        message: item.leyenda,
        lowerLimit: parseFloat(item.min),
        upperLimit: parseFloat(item.max)

      }))

      setYears(response3.data);
      setLegends(tempoLegends)
      /*setDepartments(tempoDepartments)
      filterData()*/;
      setLoading(false);
    } catch (error) {
      setTimeout(() => {
        mapData();
      }, 3000);

    }
  }

  const [showFilters, setShowFilters] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setShowFilters(false); // Ocultar por default
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  /*const filterData = async () => {
    const filtered = departments?.filter(
      (item) => item.year == selectedYear && item.level == level
    ) ?? null;
    await setFilteredDepartments(filtered)

  }*/

  //useStated necesarios
  useEffect(() => {
    mapData()
  }, [mapaElegido])

  /*useEffect(() => {
    filterData()
  }, [selectedYear, level])*/

  const { t } = useTranslation('common');

  return (
    <div className="d-flex flex-column flex-md-row w-100" style={{ minHeight: '100vh' }}>
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
            <div className="d-flex flex-column flex-md-row w-100" style={{ minHeight: '100vh' }}>
              {/* Menu */}
              {isMobile ? (
                showFilters && (
                  <>
                    {/* Mobile Filters */}
                    <div
                      onClick={() => setShowFilters(false)}
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        zIndex: 998,
                      }}
                    />

                    {/* Click go brrr */}
                    <div className="floating-filters">
                      <MapFilters
                        title={title}
                        mapaElegido={mapaElegido}
                        setMapaElegido={setMapaElegido}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        level={level}
                        setLevel={setLevel}
                        years={years}
                        mapa={mapa}
                        setMapa={setMapa}
                        departments={filteredDepartments}
                        legends={legends}
                      />
                    </div>
                  </>
                )
              ) : (
                // Normie stuff
                <div className="d-none d-md-block" style={{ minWidth: '250px' }}>
                  <MapFilters
                    title={title}
                    mapaElegido={mapaElegido}
                    setMapaElegido={setMapaElegido}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    level={level}
                    setLevel={setLevel}
                    years={years}
                    mapa={mapa}
                    setMapa={setMapa}
                    departments={filteredDepartments}
                    legends={legends}
                  />
                </div>
              )}


              {/* Mapa */}
              <div className="flex-grow-1 position-relative">
                <MainMap
                  level={level}
                  map={mapa}
                  title={title}
                  year={selectedYear}
                  departments={filteredDepartments}
                  setDepartments={setFilteredDepartments}
                  legends={legends}
                  setLegends={setLegends}
                  filter={extensionData}
                  municipio={mapaElegido}
                  mapRef={leafletMapRef}
                  exportContainerRef={exportRef}
                  isMobile={isMobile}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                />
              </div>
            </div>
          )}
          <LanguageSelector />
        </div>
      </Client>
    </div>
  );
}