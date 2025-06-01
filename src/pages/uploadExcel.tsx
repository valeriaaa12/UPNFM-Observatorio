'use client';

import NavBar from '@/navigation/NavBar';
import Footer from '@/sections/footer';
import Client from '@/components/client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SubirExcelPage() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<(string | number | boolean | null)[][] | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const supabase = createClientComponentClient();
    const requiredColumns = [
        'PERIODO_ID', 'FECHA_ID', 'Departamento', 'MUNICIPIO', 'ALDEA', 'DIRECCION',
        'DOCENTES_GRADOS', 'CODIGOSEE', 'CODIGO', 'NOMBRE_CENTRO', 'DISTRITO', 'PERIODO_ESCOLAR',
        'Administración', 'Zona', 'Nivel', 'CICLOS_EDUCATIVOS', 'TIPOCENTRO', 'PUEBLO_ETNICO',
        'DIRECTOR', 'TEL_CENTRO', 'CEL_CENTRO', 'CORREO_CENTRO', 'CODIGO_MODALIDAD',
        'MODALIDAD', 'GRADO', 'GRADO_ID', 'EDAD', 'genero', 'INICIAL', 'FINAL', 'DESERCION',
        'CANCELACIONES', 'REPITENCIA', 'APROBADOS', 'REPROBADOS'
    ];

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1
            }) as (string | number | boolean | null)[][];
            const headers = jsonData[0];
            const firstDataRow = jsonData[1];

            const missingColumns = requiredColumns.filter(col => !headers.includes(col));
            if (missingColumns.length > 0) {
                toast.error(`❌ El archivo no tiene el formato requerido`);
                setFileName(null);
                setExcelData(null);
                return;
            }

            const hasContent = firstDataRow?.some(cell => cell !== null && cell !== '');
            if (!hasContent) {
                toast.error('❌ El archivo no contiene datos que subir');
                setFileName(null);
                setExcelData(null);
                return;
            }

            toast.success('✅ El archivo tiene el formato correcto');
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        multiple: false,
        onDrop,
        disabled: !!fileName,
    });

    type PayloadType = {
        ubicacion: { departamento: string; municipio: string; aldea: string }[];
        modalidad: { codigo_modalidad: number; modalidad: string }[];
        contacto: { director: string; telefono: string; celular: string; correo: string }[];
        distrito: { distrito: string }[];
        grado: { grado_id: number; grado: string }[];
        nivel: { nivel: string; ciclo_educativo: string }[];
        centro: {
            codigo_SACE: string;
            codigo_SEE: string;
            nombre: string;
            direccion: string;
            docentes_grados: string;
            periodo_escolar: string;
            administracion: string;
            zona: string;
            tipo_centro: string;
            pueblo_etnico: string;
            fk_ubicacion: number;
            fk_modalidad: number;
            fk_contacto: number;
            fk_distrito: number;
        }[];
        curso: {
            curso_id: number;
            periodo_anual: number;
            fecha: number;
            fk_centro_codigo: string;
            fk_grado_id: number;
            fk_nivel_educativo: number;
        }[];
        desempeno: {
            desempeno_id: number;
            desercion: number;
            cancelaciones: number;
            repitencia: number;
            aprobados: number;
            reprobados: number;
        }[];
        detalle: {
            detalle_id: number;
            fk_curso_id: number;
            edad: number;
            genero: string;
            matricula_inicial: number;
            matricula_final: number;
            fk_desempeno_id: number;
        }[];
    };

    const uploadToDatabase = async () => {
        if (!excelData || excelData.length < 2) {
            toast.warning('No hay datos válidos para subir');
            return;
        }

        try {
            setUploading(true);
            setProgress(10);
            const payload: PayloadType = {
                ubicacion: [],
                modalidad: [],
                contacto: [],
                distrito: [],
                grado: [],
                nivel: [],
                centro: [],
                curso: [],
                desempeno: [],
                detalle: []
            };
            const headers = excelData[0] as string[];
            const rows = excelData.slice(1);
            const objects = rows.map(row => {
                const obj: Record<string, any> = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                return obj;
            });

            for (let i = 0; i < objects.length; i++) {
                const row = objects[i];

                payload.ubicacion.push({
                    departamento: row.Departamento,
                    municipio: row.MUNICIPIO,
                    aldea: row.ALDEA
                });

                payload.modalidad.push({
                    codigo_modalidad: row.CODIGO_MODALIDAD,
                    modalidad: row.MODALIDAD
                });

                payload.contacto.push({
                    director: row.DIRECTOR,
                    telefono: row.TEL_CENTRO,
                    celular: row.CEL_CENTRO,
                    correo: row.CORREO_CENTRO
                });

                payload.distrito.push({
                    distrito: row.DISTRITO
                });

                payload.grado.push({
                    grado_id: row.GRADO_ID,
                    grado: row.GRADO
                });

                payload.nivel.push({
                    nivel: row.Nivel,
                    ciclo_educativo: row.CICLOS_EDUCATIVOS
                });

                payload.centro.push({
                    codigo_SACE: row.CODIGO,
                    codigo_SEE: row.CODIGOSEE,
                    nombre: row.NOMBRE_CENTRO,
                    direccion: row.DIRECCION,
                    docentes_grados: row.DOCENTES_GRADOS,
                    periodo_escolar: row.PERIODO_ESCOLAR,
                    administracion: row.Administración,
                    zona: row.Zona,
                    tipo_centro: row.TIPOCENTRO,
                    pueblo_etnico: row.PUEBLO_ETNICO,
                    fk_ubicacion: 1,
                    fk_modalidad: row.CODIGO_MODALIDAD,
                    fk_contacto: 1,
                    fk_distrito: 1
                });

                payload.curso.push({
                    curso_id: i + 1,
                    periodo_anual: row.PERIODO_ID,
                    fecha: row.FECHA_ID,
                    fk_centro_codigo: row.CODIGO,
                    fk_grado_id: row.GRADO_ID,
                    fk_nivel_educativo: 1
                });

                payload.desempeno.push({
                    desempeno_id: i + 1,
                    desercion: row.DESERCION,
                    cancelaciones: row.CANCELACIONES,
                    repitencia: row.REPITENCIA,
                    aprobados: row.APROBADOS,
                    reprobados: row.REPROBADOS
                });

                payload.detalle.push({
                    detalle_id: i + 1,
                    fk_curso_id: i + 1,
                    edad: row.EDAD,
                    genero: row.genero,
                    matricula_inicial: row.INICIAL,
                    matricula_final: row.FINAL,
                    fk_desempeno_id: i + 1
                });
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/insertarExcel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Error al insertar los datos");
            toast.success('✅ Datos enviados correctamente al backend');
            setFileName(null);
            setExcelData(null);
        } catch (error) {
            console.error(error);
            toast.error('❌ Error al subir los datos');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Client>
            <div className="blue">
                <NavBar />
            </div>
            <div className="background">
                <div className="upload-excel-container d-flex flex-column align-items-center justify-content-start py-5">
                    <ToastContainer position="bottom-right" autoClose={5000} />

                    <h2 className="mb-4 text-center">Subir archivo Excel</h2>

                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${fileName ? 'dropzone-disabled' : ''}`}
                        style={{
                            width: 400,
                            height: 200,
                            border: '2px dashed #19467f',
                            borderRadius: 10,
                            backgroundColor: fileName ? '#f0f0f0' : 'white',
                            color: '#19467f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: fileName ? 'not-allowed' : 'pointer',
                            transition: 'border-color 0.3s',
                            marginBottom: '1rem'
                        }}
                    >
                        <input {...getInputProps()} />
                        {fileName ? (
                            <div className="file-actions d-flex align-items-center justify-content-between mt-3 w-100 px-3" style={{ maxWidth: 600 }}>
                                <span className="text-truncate">{fileName}</span>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => {
                                        setFileName(null);
                                        setExcelData(null);
                                        toast.info('Archivo eliminado');
                                    }}>
                                        🗑 Eliminar
                                    </button>
                                    <button className="btn btn-success btn-sm" onClick={uploadToDatabase} disabled={uploading}>
                                        ☁️ Subir
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="m-0 px-2 text-center">Arrastra un archivo Excel aquí o haz clic para seleccionarlo</p>
                        )}
                    </div>

                    {excelData && (
                        <div className="mt-4 w-100 px-3" style={{ maxWidth: 800 }}>
                            <h5>Vista previa del Excel:</h5>
                            <div className="preview-table">
                                <table className="table table-bordered table-sm mt-2">
                                    <thead className="table-light">
                                        <tr>
                                            {excelData[0]?.map((header, index) => (
                                                <th key={index}>{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {excelData.slice(1, 6).map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, colIndex) => (
                                                    <td key={colIndex}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                        {excelData.length > 6 && (
                                            <tr>
                                                <td colSpan={excelData[0].length} className="text-center text-muted">
                                                    ... mostrando 5 de {excelData.length - 1} filas ...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {uploading && (
                                <div className="text-center mt-2 text-muted">
                                    Progreso: {progress}%
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </Client>
    );
}
