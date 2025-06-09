import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import MapFilters from "@/sections/mapfilters";
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import SmallNavBar from "@/navigation/SmallNavBar";
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
  const [departments, setDepartments] = useState<department[] | null>(null);
  const [filteredDepartments, setFilteredDepartments] = useState<department[] | null>(null);
  const [legends, setLegends] = useState<legend[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<string[]>([]);
  const [mapaElegido, setMapaElegido] = useState("Honduras");

  const [mapa, setMapa] = useState("/others/hn.json");

  {/*mapeo*/ }
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

      const [response, response2, response3] = await Promise.all([
        axios.get(url, config),
        axios.get(url2, config),
        axios.get(BACKEND + '/periodosAnuales')
      ]);

      let tempoDepartments: department[] | null = null;

      if (mapaElegido === "Honduras") {
        //mapa base de honduras
        tempoDepartments = response.data.map((item: any) => ({
          name: item.departamento.toLowerCase(),
          legend: item.leyenda,
          value: parseFloat(item.tasa),
          year: item.periodo_anual,
          level: item.nivel
        }));
      } else {
        console.log(response)
        //mapa municipal
        tempoDepartments = response.data.map((item: any) => ({
          name: item.municipio.toLowerCase(),
          legend: item.leyenda,
          value: parseFloat(item.tasa),
          year: item.periodo_anual,
          level: item.nivel
        }));
        console.log(tempoDepartments)
      }


      const tempoLegends: legend[] = response2.data.map((item: any) => ({
        level: item.nivel,
        message: item.leyenda,
        lowerLimit: parseFloat(item.min),
        upperLimit: parseFloat(item.max)

      }))

      setYears(response3.data);
      setLegends(tempoLegends)
      setDepartments(tempoDepartments)
      filterData();
      setLoading(false);
    } catch (error: unknown) {

    }
  }

  const filterData = async () => {
    const filtered = departments?.filter(
      (item) => item.year == selectedYear && item.level == level
    ) ?? null;
    await setFilteredDepartments(filtered)

  }

  //useStated necesarios
  useEffect(() => {
    mapData()
  }, [mapaElegido])

  useEffect(() => {
    filterData()
  }, [selectedYear, level])
  const { t } = useTranslation('common');

  return (
    <Client>
      <>
        <div className="font">
          <div className="blue blueNavbar">
            <NavBar />
            <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
          </div>
          <SmallNavBar></SmallNavBar>
          {loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div> :
            <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
              {/* Menu */}
              <MapFilters mapaElegido={mapaElegido} setMapaElegido={setMapaElegido} selectedYear={selectedYear} setSelectedYear={setSelectedYear} level={level} setLevel={setLevel} years={years} mapa={mapa} setMapa={setMapa} />

              {/* Mapa */}
              <div style={{ flex: 1, position: 'relative' }}>
                <MainMap level={level} map={'/others/hn.json'} title={title} year={selectedYear} departments={filteredDepartments} setDepartments={setFilteredDepartments} legends={legends} setLegends={setLegends} />
              </div>
            </div>}
          <LanguageSelector />
        </div >
      </>
    </Client>
  );
}