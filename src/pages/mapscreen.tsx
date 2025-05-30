
import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import ComboBox from "@/components/combobox";
import React, { useState, useEffect } from 'react';
import MapFilters from "@/sections/mapfilters";
import axios from 'axios'

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



export default function MapScreen() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [level, setLevel] = useState("Básica III Ciclo")
  const [departments, setDepartments] = useState<department[] | null>(null);
  const [filteredDepartments, setFilteredDepartments] = useState<department[] | null>(null);

  {/*mapeo*/ }
  //metodo de mapeo
  const mapData = async () => {
    console.log("start")
    try {
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/desercion"
      const response = await axios.get(url, config)

      const tempoDepartments: department[] = response.data.map((item: any) => ({
        name: item.departamento.toLowerCase(),
        legend: item.leyenda,
        value: item.tasa_desercion,
        year: item.periodo_anual,
        level: item.nivel
      }))

      console.log(response)
      await setDepartments(tempoDepartments)

      filterData();
    } catch (error: unknown) {
      console.log(error)
      console.log("end")
    }
  }

  const filterData = async () => {
    const filtered = departments?.filter(
      (item) => item.year == selectedYear && item.level == level
    ) ?? null;
    await setFilteredDepartments(filtered)
    console.log(filtered)
  }

  //useStated necesarios
  useEffect(() => {
    mapData()
  }, [])

  useEffect(() => {
    filterData()
  }, [selectedYear, level])
  return (
    <>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
          {/*menu */}
          <MapFilters selectedYear={selectedYear} setSelectedYear={setSelectedYear} level={level} setLevel={setLevel}></MapFilters>

          {/* Mapa */}
          <div style={{ flex: 1, position: 'relative' }}>
            <MainMap title="Tasa de Deserción Escolar en Honduras" departments={filteredDepartments} setDepartments={setFilteredDepartments} />
          </div>
        </div>

      </div >
    </>
  );
}