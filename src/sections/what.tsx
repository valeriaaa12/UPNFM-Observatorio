import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function InfoCardsSegment() {
    return (
        <div className="textColor font">
            <Container className="d-flex justify-content-center">
                <div style={{ margin: "0 auto", height: "500px", width: "100%", maxWidth: "1200px" }}>
                    <Row className="align-items-center h-100">
                        <Col md={7} className="d-flex flex-column justify-content-center">
                            <h2>
                                ¿Qué es el Observatorio Universitario de la Educación Nacional e Internacional (OUDENI)?
                            </h2>
                            <p>
                                Somos el Observatorio Universitario de la Educación Nacional e Internacional (OUDENI), una unidad de la Universidad Pedagógica Nacional Francisco Morazán (UPNFM), creada en 2017 con el propósito de recopilar, sistematizar, analizar y difundir datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación en Honduras. Nuestra misión es proporcionar información relevante y actualizada que sirva como base para la toma de decisiones en el ámbito educativo, apoyando la formulación, implementación y evaluación de políticas públicas. Trabajamos en áreas clave como cobertura educativa, deserción, repitencia, rendimiento académico y problemáticas sociales como la migración estudiantil y la violencia escolar, brindando herramientas fundamentadas en evidencia científica para fortalecer el sistema educativo nacional.
                            </p>
                        </Col>
                        <Col md={5} className="d-flex justify-content-end">
                            <img
                                src="/images/upnfm.png"
                                alt="Infórmate de la educación"
                                style={{ maxWidth: "100%", maxHeight: "400px" }}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}