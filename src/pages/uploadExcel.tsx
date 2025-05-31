'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './uploadExcel.module.css'; // Importa los estilos

export default function SubirExcelPage() {
    const [fileName, setFileName] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<(string | number | boolean | null)[][] | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const supabase = createClientComponentClient();
    const router = useRouter();

    // Verificar si el usuario es admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setIsAdmin(data?.role === 'admin');
            } catch (error) {
                console.error('Error verificando admin:', error);
                toast.error('Error al verificar permisos');
            } finally {
                setLoading(false);
            }
        };

        checkAdminStatus();
    }, [supabase, router]);

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
    });

    const uploadToDatabase = async () => {
        if (!excelData || excelData.length < 2) {
            toast.warning('No hay datos válidos para subir');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const headers = excelData[0];
            const rows = excelData.slice(1);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rowData: Record<string, any> = {};

                headers.forEach((header, index) => {
                    if (typeof header === 'string') { // Asegurar que header es string
                        rowData[header] = row[index];
                    }
                });

                const { error } = await supabase
                    .from('tu_tabla')
                    .insert(rowData);

                if (error) throw error;
                setProgress(Math.round((i + 1) / rows.length * 100));
            }

            toast.success('Datos subidos correctamente');
        } catch (error) {
            console.error('Error subiendo datos:', error);
            toast.error('Error al subir los datos');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className={`${styles.container} text-center`}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className={styles.container}>
                <div className="alert alert-danger" role="alert">
                    No tienes permisos para acceder a esta sección
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <h2 className="mb-4">Subir archivo Excel</h2>

            <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
            >
                <input {...getInputProps()} />
                {fileName ? (
                    <p><strong>Archivo seleccionado:</strong> {fileName}</p>
                ) : (
                    <p>Arrastra un archivo Excel aquí o haz clic para seleccionarlo</p>
                )}
            </div>

            {excelData && (
                <div className="mt-4">
                    <h5>Vista previa del Excel:</h5>
                    <div className={styles.previewTable}>
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

                    <div className={styles.uploadButton}>
                        <button
                            onClick={uploadToDatabase}
                            className="btn btn-primary"
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Subiendo... <span className={styles.progressText}>{progress}%</span>
                                </>
                            ) : 'Subir a la base de datos'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}