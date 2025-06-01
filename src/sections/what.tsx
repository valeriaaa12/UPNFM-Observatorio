import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';


export default function InfoCardsSegment() {
    const { t, i18n } = useTranslation('common');
    console.log('Current language:', i18n.language);
    return (
        <div className="textColor font py-5 px-3" style={{ backgroundColor: 'sectionGray' }}>
            <Container>
                <Row className="align-items-center">
                    <Col
                        lg={7}
                        md={12}
                        className="order-lg-1 order-1 mb-4 mb-lg-0 py-4 text-center text-lg-start"
                    >
                        <h2 className="mb-4">
                            {t("WhatisOUDENI?")}
                        </h2>
                        <p className="lead">
                            {t("OUDENIDescription")}
                        </p>
                    </Col>
                    <Col
                        lg={5}
                        md={12}
                        className="order-lg-2 order-2 d-flex justify-content-center align-items-center mb-4 mb-lg-0"
                    >
                        <img
                            src="/images/upnfm.png"
                            alt="Infórmate de la educación"
                            className="img-fluid"
                            style={{
                                maxHeight: '300px',
                                maxWidth: '50%',
                                width: 'auto',
                                height: 'auto',
                                borderRadius: '8px',

                            }}
                        />
                    </Col>
                </Row>

            </Container>
        </div>
    );
}