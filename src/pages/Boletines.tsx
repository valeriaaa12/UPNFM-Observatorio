import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

import Boletin from "@/pages/cards/Boletin";
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar";
import SmallNavBar from "@/navigation/SmallNavBar";

export default function Boletines() {
  const [showModal, setShowModal] = useState(false);
  const [boletinTitle, setBoletinTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFile(null);
    setBoletinTitle("");
  };

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: { 'application/pdf': [] },
  multiple: false,
  onDrop: (acceptedFiles) => {
    const file = acceptedFiles?.[0];
    if (file && file.type === "application/pdf") {
      setFile(file);
    } else {
      alert("Por favor selecciona un archivo PDF válido.");
    }
  }
});


  const handleGuardarBoletin = () => {
    if (!boletinTitle || !file) {
      alert("Por favor, completa el título y selecciona un archivo PDF.");
      return;
    }

    // Aquí iría la lógica de subida (a servidor, Firebase, etc.)
    console.log("Título del boletín:", boletinTitle);
    console.log("Archivo seleccionado:", file);

    // Cerrar modal
    handleCloseModal();
  };

  return (
    <>
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>
        <SmallNavBar />

        <div className="d-flex justify-content-between align-items-center px-5 py-4">
          <p className="fontSection m-0">Boletines</p>
          <Button variant="btn orange" onClick={handleOpenModal}>
            Nuevo Boletín
          </Button>
        </div>

        <div className="card-gallery pt-0 Boletines">
          <Boletin title="Boletín 1" pdf="/Boletin_1_Observatorio_educativo_UPNFM.pdf" />
          <Boletin title="Boletín 2" pdf="/Boletin_2_Observatorio_educativo_UPNFM.pdf" />
          <Boletin title="Boletín 3" pdf="/Boletin_3_Observatorio_educativo_UPNFM.pdf" />
          <Boletin title="Boletín 4" pdf="/Boletin_4_Observatorio_educativo_UPNFM.pdf" />
          <Boletin title="Boletín 5" pdf="/Boletín_No_5_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf" />
          <Boletin title="Boletín 6" pdf="/Boletín_No_6_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf" />
          <Boletin title="Boletín 7" pdf="/Boletín_No_7_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf" />
          <Boletin title="Boletín 8" pdf="/Boletín_No_8_Observatorio_Universitario_de_la_Educacion_Nacional_Internacional_UPNFM.pdf" />
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Boletín</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="boletinTitle" className="mb-3">
              <Form.Label>Título del Boletín</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Boletín #"
                value={boletinTitle}
                onChange={(e) => setBoletinTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Archivo PDF</Form.Label>
              <div
                {...getRootProps()}
                className={`border border-2 rounded p-4 text-center ${isDragActive ? "bg-light" : ""}`}
                style={{ cursor: "pointer", minHeight: "120px" }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Suelta el archivo aquí...</p>
                ) : file ? (
                  <p><strong>Archivo seleccionado:</strong> {file.name}</p>
                ) : (
                  <p>Arrastra un archivo PDF aquí o haz clic para seleccionarlo</p>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn outline-blue" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="btn orange" onClick={handleGuardarBoletin}>
            Guardar Boletín
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
  