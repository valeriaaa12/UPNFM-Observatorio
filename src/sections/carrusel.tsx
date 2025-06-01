import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

export default function Carrusel() {
  return (
    <div className="sectionWhite font carrusel-compact pb-5">
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col xs={12} className="p-0">
            <Carousel fade interval={2250} className="compact-carousel">
              {["carrusel1.jpg", "carrusel2.jpg", "carrusel3.jpg", "carrusel44.jpg", "carrusel5.jpg"].map((img, idx) => (
                <Carousel.Item key={idx} className="compact-carousel-item">
                  <img
                    src={`/images/${img}`}
                    alt={`Slide ${idx + 1}`}
                    className="compact-carousel-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}