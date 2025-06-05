import NavBar from "@/navigation/NavBar";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import MapFilters from "@/sections/mapfilters";
import axios from 'axios'
import LanguageSelector from "@/buttons/LanguageSelector";
import { useTranslation } from "react-i18next";
import Client from '@/components/client';
import SmallNavBar from "@/navigation/SmallNavBar";
import LineGraph from "@/graphs/LineGraph";
const BarGraph = dynamic(() => import("@/graphs/BarGraph"), {
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

    {/*mapeo*/ }
    //metodo de mapeo
    const mapData = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
            const url = process.env.NEXT_PUBLIC_BACKEND_URL + extensionData
            //segundo query para los limites
            const url2 = process.env.NEXT_PUBLIC_BACKEND_URL + extensionLimits
            //años
            const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL

            const [response, response2, response3] = await Promise.all([
                axios.get(url, config),
                axios.get(url2, config),
                axios.get(BACKEND + '/periodosAnuales')
            ]);
            console.log(response2)
            const tempoDepartments: department[] = response.data.map((item: any) => ({
                name: item.departamento.toLowerCase(),
                legend: item.leyenda,
                value: parseFloat(item.tasa),
                year: item.periodo_anual,
                level: item.nivel
            }))

            console.log("Datos de prebásica:", tempoDepartments);

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

    useEffect(() => {
        mapData()
    }, [])

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
                    {/*{loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :*/}
                    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
                        {/* Menu */}
                        <MapFilters selectedYear={selectedYear} setSelectedYear={setSelectedYear} level={level} setLevel={setLevel} years={years} />
                        <div style={{ flex: 1, position: 'relative' }}>
                            <LineGraph />
                        </div>
                        {/*</div>}*/}
                        <LanguageSelector></LanguageSelector>
                    </div >
                </div >
            </>
        </Client>
    );
}