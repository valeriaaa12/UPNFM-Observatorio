import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
  const { t, i18n } = useTranslation('common');
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className='d-none d-lg-block'>
        <Navbar expand="lg" className="font vw-100">
          <Container fluid className='d-flex justify-content-between align-items-center'>
            <Navbar.Brand href="/landingpage">
              <img
                src="/images/logo2.png"
                width={'300px'}
                height={'auto'}
                className="d-inline-block align-top"
                alt="Logo"
              />
            </Navbar.Brand>

            <div className="d-flex align-items-center gap-3 ms-auto whiteText">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto my-2 my-lg-0 nav-links-container" style={{ maxHeight: '100px' }}>
                  <Nav.Link className=" whiteText" href="/landingpage"><b>{t('Home')}</b></Nav.Link>
                  <Nav.Link className=" whiteText" href="/aboutUs"><b>{t("About Us")}</b></Nav.Link>
                  <Nav.Link className=" whiteText" href="#action2"><b>{t("Herramientas")}</b></Nav.Link>

                  {/* Dropdowns */}
                  <NavDropdown
                    title={<span className="whiteText fw-bold">Indicadores Educativos</span>}
                    id="navbarScrollingDropdown"
                    show={open3}
                    onMouseEnter={() => setOpen3(true)}
                    onMouseLeave={() => setOpen3(false)}
                    className="dropdown-with-fade"
                  >
                    <NavDropdown.Item href="/Boletines">{t("Cobertura")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/mapscreen">{t("Desercion")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => i18n.changeLanguage('es')}>{t("Repitencia")}</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title={<span className="whiteText fw-bold">{t("DocumentosPublicaciones")}</span>}
                    id="navbarScrollingDropdown"
                    show={open}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    className="dropdown-with-fade"
                  >
                    <NavDropdown.Item href="/Boletines">{t("Boletines")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => i18n.changeLanguage('en')}>{t("Artículos")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => i18n.changeLanguage('es')}>{t("DatosMunicipales")}</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown
                    title={<span className="whiteText fw-bold">{t("Comunidad")}</span>}
                    id="navbarScrollingDropdown"
                    show={open2}
                    align="end"
                    onMouseEnter={() => setOpen2(true)}
                    onMouseLeave={() => setOpen2(false)}
                    className="dropdown-with-fade"
                  >
                    <NavDropdown.Item href="/login">{t("Foros")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/login">{t("ExplorarInvestigaciones")}</NavDropdown.Item>
                  </NavDropdown>
                  {/* Fin dropdowns */}
                </Nav>

                <Dropdown className="d-inline mx-2 no-underline no_underline" align="end">
                  <Dropdown.Toggle
                    id="dropdown-autoclose-true"
                    className="p-0 border-0 bg-transparent userMenu"
                    as="div"
                  >
                    <img
                      src="/images/usuario.png"
                      width="50px"
                      height="auto"
                      className="d-inline-block align-top me-3"
                      alt="User menu"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/login">{t("Login")}</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/register">{t("Register")}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Navbar.Collapse>
            </div>
          </Container>
        </Navbar>
      </div>
    </>
  );
}