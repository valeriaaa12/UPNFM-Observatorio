import InfoCard from "@/cards/basicCard";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';
export default function InfoCardsSegment() {
    const { t, i18n } = useTranslation('common');
    return (
        <>
            <div className="sectionGray font fondoGris">
                <p className="blueText fontSection p-4 center">{t("Características Clave")}</p>
                <Container className="d-flex justify-content-center" >
                    <div style={{ margin: "0 auto", maxWidth: "1200px" }}>
                        <Row xs={1} md={2} lg={3} className="gx-4 justify-content-center">
                            <Col key={0} className="justify-content-center">
                                <InfoCard title={t("Informate")} img="/images/card1-img.jpeg" body={t("InformateB")}></InfoCard>
                            </Col>
                            <Col key={1} className="gx2 justify-content-center">
                                <InfoCard title={t("InformacionIntuitiva")} img="/images/card2-img.jpeg" body={t("InformacionIntuitivaB")} ></InfoCard>
                            </Col>
                            <Col key={4} className="justify-content-center">
                                <InfoCard title={t("FacilitaProceso")} img="/images/card3-img.jpg" body={t("FacilitaProcesoB")}></InfoCard>
                            </Col>
                            <Col key={2} className="justify-content-center">
                                <InfoCard title={t("ParticipaForos")} img="/images/card4-img.jpg" body={t("ParticipaForosB")}></InfoCard>
                            </Col>
                            <Col key={3} className="justify-content-center">
                                <InfoCard title={t("PublicaInvestigaciones")} img="/images/card5-img.jpg" body={t("PublicaInvestigacionesB")}></InfoCard>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

        </>);
}