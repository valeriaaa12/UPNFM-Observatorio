import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

export default function Carrusel() {
  return (
    <div className="sectionWhite font pb-5 mb-4">
      <Container className="c1">
        <Row className="justify-content-center">
          <Col md="auto">
            <div className="block-carousel mx-auto">
              <Carousel fade interval={2250}>
                {["carrusel1.jpg", "carrusel2.jpg", "carrusel3.jpg", "carrusel44.jpg", "carrusel5.jpg"].map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      src={`/images/${img}`}
                      alt={`Slide ${idx + 1}`}
                      className="carousel-img"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


