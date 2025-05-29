import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

import LanguageSelector from "@/buttons/LanguageSelector";
import Boletin from "@/cards/Boletin"; // Cambia si tu ruta es diferente
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar";
import SmallNavBar from "@/navigation/SmallNavBar";

export default function Boletines() {
  const [showModal, setShowModal] = useState(false);
  const [boletinTitle, setBoletinTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation("common");

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFile(null);
    setBoletinTitle("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (file && file.type === "application/pdf") {
        setFile(file);
      } else {
        alert(t("SeleccionarValido"));
      }
    },
  });

  const handleGuardarBoletin = () => {
    if (!boletinTitle || !file) {
      alert(t("CompletarBoletin"));
      return;
    }

    // Aquí iría la lógica de subida (a servidor, Firebase, etc.)
    console.log(t("Titulo del Boletín"), boletinTitle);
    console.log(t("Archivo seleccionado"), file);

    // Cerrar modal
    handleCloseModal();
  };

  return (
    <>
      <LanguageSelector />
      <div className="font">
        <div className="blue blueNavbar">
          <NavBar />
          <div className="orange d-none d-md-block" style={{ height: "0.5rem" }} />
        </div>

        <SmallNavBar />

        <div className="d-flex justify-content-between align-items-center px-5 py-4">
          <p className="fontSection m-0">{t("Boletines")}</p>
          <Button variant="btn orange" onClick={handleOpenModal}>
            {t("Nuevo Boletín")}
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
          <Modal.Title>{t("Agregar Boletín")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="boletinTitle" className="mb-3">
              <Form.Label>{t("Titulo del Boletín")}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Boletín #"
                value={boletinTitle}
                onChange={(e) => setBoletinTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>{t("Archivo PDF")}</Form.Label>
              <div
                {...getRootProps()}
                className={`border border-2 rounded p-4 text-center ${isDragActive ? "bg-light" : ""}`}
                style={{ cursor: "pointer", minHeight: "120px" }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>{t("Suelta el archivo aqui")}</p>
                ) : file ? (
                  <p>
                    <strong>{t("Archivo seleccionado")}</strong> {file.name}
                  </p>
                ) : (
                  <p>{t("Arrastrar y soltar un archivo PDF aquí o hacer clic para seleccionarlo")}</p>
                )}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn outline-blue" onClick={handleCloseModal}>
            {t("Cerrar")}
          </Button>
          <Button variant="btn orange" onClick={handleGuardarBoletin}>
            {t("Guardar Boletin")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}
