import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';

export default function Carrusel() {
  return (
    <div className="sectionWhite font pb-5 mb-4">
      <Container fluid className="c1">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <div className="block-carousel mx-auto">
              <Carousel fade interval={2250}>
                {["carrusel1.jpg", "carrusel2.jpg", "carrusel3.jpg", "carrusel44.jpg", "carrusel5.jpg"].map((img, idx) => (
                  <Carousel.Item key={idx}>
                    <div style={{ aspectRatio: '16/9', width: '100%' }}>
                      <img
                        src={`/images/${img}`}
                        alt={`Slide ${idx + 1}`}
                        className="carousel-img img-fluid w-100 h-100"
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                      />
                    </div>
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


