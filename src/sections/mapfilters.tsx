import ComboBox from "@/components/combobox";
interface params {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapFilters({ level, setLevel, selectedYear, setSelectedYear }: params) {
  const years = ['Todos', '2020', '2021', '2022', '2023', '2024'];
  return (
    <>
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
              options={["Todos", "Prebásica", "Básica I-II Ciclo", "Básica III Ciclo", "Media"]}
              value={level}
              onChange={setLevel}
            >
            </ComboBox>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <ComboBox
              title="Año"
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}>
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
    </>
  )

}
