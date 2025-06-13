import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Client from '@/components/client';
import { useUser } from '@/context/usertype';
export default function SmallNavBar() {
  const { t, i18n } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const { user, setUser } = useUser();
  return (
    <Client>
      <>
        <div className='d-lg-none'>
          <Navbar expand="lg" className="smolNavbar paddingSmolNavbar">
            <Container fluid>
              <Navbar.Brand href="/landingpage">
                <img
                  src="/images/logo2.png"
                  width={'150px'}
                  height={'auto'}
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Navbar.Brand>

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link className="whiteText" href="/landingpage"><b>{t("Home")}</b></Nav.Link>
                  <Nav.Link className="whiteText" href="/aboutUs"><b>{t("About Us")}</b></Nav.Link>
                  <Nav.Link className="whiteText" href="#action2"><b>{t("Herramientas")}</b></Nav.Link>

                  <NavDropdown
                    className='whiteText' menuVariant='dark' title={<span className="whiteText fw-bold">{t("IndicadoresEducativos")}</span>}


                  >
                    <NavDropdown.Item
                      href="/cobertura_bruta_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Cobertura bruta")}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/Mapa/cobertura_neta_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Cobertura neta")}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/Mapa/aprobacion_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Aprobacion")}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/Mapa/desercion_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Desercion")}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/Mapa/repitencia_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Repitencia")}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/Mapa/reprobacion_screen"
                      style={{ whiteSpace: 'normal' }}
                    >
                      {t("Reprobacion")}
                    </NavDropdown.Item>
                     <NavDropdown.Item
                        href="/dashboard"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {"Gráficos Estadísticos"}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        href="/Graficas/lineGraphScreen"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {"Line Graph"}
                      </NavDropdown.Item>
                    {user?.admin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          className='admin-option'
                          href="/uploadExcel"

                        >
                          {t("Subir Archivos")}
                        </NavDropdown.Item>
                      </>
                    )}
                  </NavDropdown>

                  <NavDropdown className='whiteText' menuVariant='dark' title={<span className="whiteText fw-bold">{t("DocumentosPublicaciones")}</span>} id="basic-nav-dropdown">
                    <NavDropdown.Item className='whiteText' href="/Documentos/Boletines">{t("Boletines")}</NavDropdown.Item>
                    <NavDropdown.Item className='whiteText' href="/Documentos/Articulos_de_Interes">{t("Artículos")}</NavDropdown.Item>
                    <NavDropdown.Item className='whiteText' href="/Documentos/Datos_Municipales">{t("DatosMunicipales")}</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown className='whiteText' menuVariant='dark' title={<span className="whiteText fw-bold">{t("Comunidad")}</span>} id="basic-nav-dropdown">
                    <NavDropdown.Item href="/login">{t("Foros")}</NavDropdown.Item>
                    <NavDropdown.Item href="/login">{t("ExplorarInvestigaciones")}</NavDropdown.Item>
                  </NavDropdown>
                  {
                    !user ?
                      <Nav.Link className="whiteText" href="/login"><b>{t("Login")}</b></Nav.Link> :
                      <Nav.Link className="orangeText" onClick={(e) => {
                        e.preventDefault();
                        setUser(null);
                        setTimeout(() => {
                      
                          window.location.href = "/landingpage";
                        }, 100);
                      }}><b>{t("Logout")}</b></Nav.Link>
                  }
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div className="orange" style={{ height: "0.5rem" }} />
        </div>
      </>
    </Client>
  );
}
