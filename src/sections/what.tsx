import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function InfoCardsSegment() {
    return (
        <div className="textColor font py-5" style={{ backgroundColor: 'white' }}>
            <Container>
                <Row className="align-items-center">
                    <Col lg={7} md={12} className="order-lg-1 order-2 mb-4 mb-lg-0 py-4">
                        <h2 className="mb-4">
                            ¿Qué es el Observatorio Universitario de la Educación Nacional e Internacional (OUDENI)?
                        </h2>
                        <p className="lead">
                            Somos el Observatorio Universitario de la Educación Nacional e Internacional (OUDENI), una unidad de la Universidad Pedagógica Nacional Francisco Morazán (UPNFM), creada en 2017 con el propósito de recopilar, sistematizar, analizar y difundir datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación en Honduras. Nuestra misión es proporcionar información relevante y actualizada que sirva como base para la toma de decisiones en el ámbito educativo, apoyando la formulación, implementación y evaluación de políticas públicas. Trabajamos en áreas clave como cobertura educativa, deserción, repitencia, rendimiento académico y problemáticas sociales como la migración estudiantil y la violencia escolar, brindando herramientas fundamentadas en evidencia científica para fortalecer el sistema educativo nacional.
                        </p>
                        <p>
                           
                        </p>
                    </Col>
                    <Col lg={5} md={12} className="order-lg-2 order-1 d-flex justify-content-center">
                        <img
                            src="/images/upnfm.png"
                            alt="Infórmate de la educación"
                            className="img-fluid"
                            style={{ 
                                maxHeight: '400px',
                                width: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}