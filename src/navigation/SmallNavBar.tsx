import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SmallNavBar() {
  const { t, i18n } = useTranslation('common');  
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  return (
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
                <Nav.Link className=" whiteText" href="/landingpage"><b>Inicio</b></Nav.Link>
                <Nav.Link className=" whiteText" href="/aboutUs"><b>Quienes Somos</b></Nav.Link>
                <Nav.Link className=" whiteText" href="#action2"><b>Indicadores Educativos</b></Nav.Link>
                <Nav.Link className=" whiteText" href="#action2"><b>Herramientas</b></Nav.Link>

                <NavDropdown className='whiteText' menuVariant='dark' title={<span className="whiteText fw-bold">DocumentosPublicaciones</span>} id="basic-nav-dropdown">

                  <NavDropdown.Item className='whiteText' href="/Boletines">Boletines</NavDropdown.Item>

                  <NavDropdown.Item className='whiteText' href="#action5">Artículos</NavDropdown.Item>

                  <NavDropdown.Item className='whiteText' href="#action6">DatosMunicipales</NavDropdown.Item>
                </NavDropdown>

                <NavDropdown className='whiteText' menuVariant='dark' title={<span className="whiteText fw-bold">Comunidad</span>} id="basic-nav-dropdown">

                  <NavDropdown.Item href="/login">Foros</NavDropdown.Item>

                  <NavDropdown.Item href="/login">ExplorarInvestigaciones</NavDropdown.Item>
                </NavDropdown>

                <Nav.Link className=" whiteText" href="/login"><b>{t("Login")}</b></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="orange" style={{ height: "0.5rem" }} />
      </div>


    </>
  );
}