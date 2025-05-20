import InfoCard from "@/cards/InfoCard";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default function InfoCardsSegment(){
    return(<>
        <div className="sectionGray font">
        <div className="center" >
            <b><h1>Caracteristicas Clave</h1></b>
        </div>
        <Container className="d-flex justify-content-center">
        <div style={{ margin: "0 auto", maxWidth:"1200px"}}>
            <Row xs={1} md={2} lg={3} className="gx-4 justify-content-center">
            <Col key={0} className="justify-content-center">
                <InfoCard title="Informate de la educación a un nivel Nacional" img="/images/card1-img.jpeg"  body="Explora indicativos educativos en Honduras, como la tasa de deserción, repitencia, y aprobación a traves del tiempo en un solo lugar"></InfoCard>
            </Col>

            <Col key={1} className="gx2 justify-content-center">
                <InfoCard title="Información intuitiva y facil de analizar" img="/images/card2-img.jpeg"  body="Utiliza mapas codificados por colores y datos interactivos para conocer diversas características del sistema educativo en Honduras a lo largo del tiempo."></InfoCard>
            </Col>

            <Col key={4} className="justify-content-center">
                <InfoCard title="Facilita el proceso de Investigación" img="/images/card3-img.jpg"  body="Usa las herramientas incorporadas para la investigación, que permiten el calculo de presupuestos, muestras probabilisticas,  desarrollo de cuestionarios, etc"></InfoCard>
            </Col>

            <Col key={2} className="justify-content-center">
                <InfoCard title="Participa en foros de discusión" img="/images/card4-img.jpg"  body="Comparte tus opiniones y preguntas con otros investigadores o estudiantes en nuestros foros, y forma parte de un ambiente colaborativo"></InfoCard>
            </Col>

            <Col key={3} className="justify-content-center">
                <InfoCard title="Publica tus propias investigaciones" img="/images/card5-img.jpg"  body="Comparte investigaciones terminadas, o sube investigaciones en desarrollo para que las personas con interes en ella sigan tu progreso"></InfoCard>
            </Col>

            
            </Row>
        </div>
        </Container>
        </div>

    </>);
}