import InfoCard from "@/cards/basicCard";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';

export default function InfoCardsSegment() {
    const { t } = useTranslation('common');

    return (
        <div id="cardsInfo" className="sectionGray font fondoGris py-5 h-100 d-flex flex-column">
            <p className="blueText fontSection text-center mb-3 px-3">
                {t("Características Clave")}
            </p>

            <Container fluid="md">
                <Row xs={1} sm={2} lg={3} className="g-3 g-md-4 justify-content-center">
                    {[
                        { title: t("Informate"), img: "/images/card1-img.jpeg", body: t("InformateB") },
                        { title: t("InformacionIntuitiva"), img: "/images/card2-img.jpeg", body: t("InformacionIntuitivaB") },
                        { title: t("FacilitaProceso"), img: "/images/card3-img.jpg", body: t("FacilitaProcesoB") },
                        { title: t("ParticipaForos"), img: "/images/card4-img.jpg", body: t("ParticipaForosB") },
                        { title: t("PublicaInvestigaciones"), img: "/images/card5-img.jpg", body: t("PublicaInvestigacionesB") }
                    ].map((card, index) => (
                        <Col key={index} className="d-flex justify-content-center g-5">
                            <InfoCard
                                title={card.title}
                                img={card.img}
                                body={card.body}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}