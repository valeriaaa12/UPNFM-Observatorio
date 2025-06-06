import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Client from '@/components/client';
import { useUser } from "@/context/usertype";
import { UserProvider } from '../context/usertype';
import { useRouter } from 'next/router';
export default function NavBar() {
  const { t, i18n } = useTranslation('common');
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  return (
    <Client>
      <div suppressHydrationWarning>
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
                  <Nav className="me-auto my-2 my-lg-0 nav-links-container" style={{
                    maxHeight: '100px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {/* Enlaces simples */}
                    <Nav.Link
                      className="whiteText"
                      href="/landingpage"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <b style={{
                        width: '100%',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>
                        {t('Home')}
                      </b>
                    </Nav.Link>

                    <Nav.Link
                      className="whiteText"
                      href="/aboutUs"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <b style={{
                        width: '100%',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>
                        {t('About Us')}
                      </b>
                    </Nav.Link>

                    <Nav.Link
                      className="whiteText"
                      href="#action2"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <b style={{
                        width: '100%',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        lineHeight: '1.2'
                      }}>
                        {t('Herramientas')}
                      </b>
                    </Nav.Link>

                    {/* Dropdowns */}
                    <NavDropdown
                      title={
                        <span className="whiteText fw-bold" style={{
                          display: 'inline-block',
                          width: '100%',
                          whiteSpace: 'normal',
                          textAlign: 'center',
                          lineHeight: '1.2',
                          padding: '5px 0'
                        }}>
                          {t("IndicadoresEducativos")}
                        </span>
                      }
                      id="navbarScrollingDropdown"
                      show={open3}
                      onMouseEnter={() => setOpen3(true)}
                      onMouseLeave={() => setOpen3(false)}
                      className="dropdown-with-fade"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <NavDropdown.Item
                        href="/Mapa/cobertura_bruta_screen"
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

                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        href="/Graficas/barGraphScreen"
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

                    <NavDropdown
                      title={
                        <span className="whiteText fw-bold" style={{
                          display: 'inline-block',
                          width: '100%',
                          whiteSpace: 'normal',
                          textAlign: 'center',
                          lineHeight: '1.2',
                          padding: '5px 0'
                        }}>
                          {t("DocumentosPublicaciones")}
                        </span>
                      }
                      id="navbarScrollingDropdown"
                      show={open}
                      onMouseEnter={() => setOpen(true)}
                      onMouseLeave={() => setOpen(false)}
                      className="dropdown-with-fade"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <NavDropdown.Item
                        href="/Documentos/Boletines"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {t("Boletines")}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        href="/Documentos/Articulos_de_Interes"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {t("Artículos")}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        href="/Documentos/Datos_Municipales"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {t("DatosMunicipales")}
                      </NavDropdown.Item>

                    </NavDropdown>

                    <NavDropdown
                      title={
                        <span className="whiteText fw-bold" style={{
                          display: 'inline-block',
                          width: '100%',
                          whiteSpace: 'normal',
                          textAlign: 'center',
                          lineHeight: '1.2',
                          padding: '5px 0'
                        }}>
                          {t("Comunidad")}
                        </span>
                      }
                      id="navbarScrollingDropdown"
                      show={open2}
                      align="end"
                      onMouseEnter={() => setOpen2(true)}
                      onMouseLeave={() => setOpen2(false)}
                      className="dropdown-with-fade"
                      style={{
                        minHeight: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 15px'
                      }}
                    >
                      <NavDropdown.Item
                        href="/login"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {t("Foros")}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        href="/login"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {t("ExplorarInvestigaciones")}
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>

                  {/* Avatar de usuario */}
                  <Dropdown
                    className="d-inline mx-2 no-underline no_underline"
                    align="end"
                    style={{
                      minHeight: '50px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
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
                    {!user ?
                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="/login"
                          style={{ whiteSpace: 'normal' }}
                        >
                          {t("Login")}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          href="/register"
                          style={{ whiteSpace: 'normal' }}
                        >
                          {t("Register")}
                        </Dropdown.Item>
                      </Dropdown.Menu> :
                      <Dropdown.Menu>
                        <Dropdown.Item
                          href="/login"
                          style={{ whiteSpace: 'normal' }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/landingpage";
                            setTimeout(() => setUser(null), 100);
                          }}><b>{t("Logout")}</b>
                        </Dropdown.Item>


                      </Dropdown.Menu>}
                  </Dropdown>
                </Navbar.Collapse>
              </div>
            </Container>
          </Navbar>
        </div>
      </div>
    </Client>
  );
}