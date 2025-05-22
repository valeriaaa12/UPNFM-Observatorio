import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown } from 'react-bootstrap';

import Fade from 'react-bootstrap/Fade';
import {useState} from 'react';


export default function NavBar() {
   const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
  return (
    
    <Navbar expand="lg" className="backgroundNavbar font">
      <Container fluid className='d-flex justify-content-between align-items-center'>
        <Navbar.Brand href="/landingpage">
            <img
              src="/images/logo.png"
              width={'300px'}
              height={'auto'}
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        

        <div className="d-flex align-items-center gap-3 ms-auto  whiteText">       
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
           <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
         
          >
            <Nav.Link  className=" whiteText"  href="#action1"><b>Inicio</b></Nav.Link>
            <Nav.Link  className=" whiteText"  href="#action2"><b>Quienes Somos</b></Nav.Link>
            <Nav.Link  className=" whiteText"  href="#action2"><b>Indicadores Educativos</b></Nav.Link>
            <Nav.Link  className=" whiteText"  href="#action2"><b>Herramientas</b></Nav.Link>

        

            {/*Inicio dropdowns */}
            <NavDropdown
                title={<span className="whiteText fw-bold">Documentos y Publicaciones</span>}
                id="navbarScrollingDropdown"
                show={open}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="dropdown-with-fade" // Add this class
              >
                        
                  <NavDropdown.Item href="#action3">Boletines</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">Artículos de Interés</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action6">Datos Municipales</NavDropdown.Item>
             
            </NavDropdown>

            <NavDropdown
                title={<span className="whiteText fw-bold">Comunidad</span>}
                id="navbarScrollingDropdown"
                show={open2}
                onMouseEnter={() => setOpen2(true)}
                onMouseLeave={() => setOpen2(false)}
                className="dropdown-with-fade" // Add this class
              >
                        
                  <NavDropdown.Item href="#action3">Foros</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action5">Explorar Investigaciones</NavDropdown.Item>
 
             
            </NavDropdown>

            {/*Fin dropdowns */}
          </Nav>
         
          
          <img
              src="/images/usuario.png"
              width={'50px'}
              height={'auto'}
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
           
          
        </Navbar.Collapse>
        </div>
      </Container>
      
    </Navbar>

   
  );
}
