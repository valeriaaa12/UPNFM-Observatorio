import Card from "@/pages/cards/teamCard"
import HCard from "@/pages/cards/horizontalCard"
import Footer from "@/sections/footer";
import NavBar from "@/navigation/NavBar"
import SmallNavBar from "@/navigation/SmallNavBar"
import ImgOverlay from "@/components/imageOverlay";

export default function aboutUs() {
    return (
        <>
            <div className="backgroundNavbar navbarSpacing">
                <NavBar />
            </div>
            <SmallNavBar />
            <ImgOverlay image="images/AboutUs.png" text="Sobre Nosotros" center={true} />
            <div id="aboutUs" className="font container-fluid px-3 px-md-5 py-4">
                {/* Misión y Visión */}
                <div className="row g-4">
                    <div className="col-12 col-lg-6">
                        <HCard
                            image="images/mision.jpg"
                            title="Misión"
                            text="Recoger, sistematizar, analizar y proveer datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación, en Honduras y en la región."
                        />
                    </div>
                    <div className="col-12 col-lg-6">
                        <HCard
                            image="images/vision2.jpg"
                            title="Visión"
                            text="Ser un ente que proporcione al sistema educativo hondureño, herramientas, datos, información e investigaciones que se usen para la toma de decisiones a nivel administrativo y ejecutivo."
                        />
                    </div>

                    {/*<div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "18rem",
                            boxShadow: "-20px 20px 0 #FE5000",
                        }}>
                            <BasicCard
                                title="Misión"
                                text="Recoger, sistematizar, analizar y proveer datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación, en Honduras y en la región."
                            />
                        </div>
                    </div >

                    <div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "18rem",
                            boxShadow: "-20px 20px 0 #003DA5",
                        }}>
                            <BasicCard
                                title="Visión"
                                text="Ser un ente que proporcione al sistema educativo hondureño, herramientas, datos, información e investigaciones que se usen para la toma de decisiones a nivel administrativo y ejecutivo."
                            />
                        </div>
                    </div >

                    <div className="col-sm-4 mb-3 d-flex">
                        <div className="card" style={{
                            width: "24rem",
                            boxShadow: "-20px 20px 0 #FEDD00",
                        }}>
                            <BasicCard
                                title="Objetivos"
                                objectives={[
                                    "Gestionar conocimientos científicos que aporten a la resolución de problemas en el campo educativo a nivel local, departamental, regional, nacional e internacional.",
                                    "Generar y promover la difusión y administración del conocimiento educativo para que esté disponible y sea accesible a los actores del sistema educativo.",
                                    "Monitorear permanentemente los indicadores educativos seleccionados, con el fin de apoyar el diseño, la implementación y la evaluación de políticas públicas en educación."
                                ]}
                            />
                        </div>
                    </div >*/}
                </div>

                <hr className="my-4" />

                {/* Objetivos */}
                <div className="card mb-4 border-0 shadow-0">
                    <div className="row g-0">
                        <div className="col-md-3 mb-3 mb-md-0">
                            <img
                                src="images/objetivos.jpg"
                                alt="Objetivos"
                                className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                                style={{ objectFit: "cover", objectPosition: "center" }}
                            />
                        </div>
                        <div className="col-md-9">
                            <div className="card-body">
                                <h5 className="cardTitle orangeText">Objetivos</h5>
                                <ul className="list-unstyled ps-0 ps-md-3">
                                    <li className="mb-3 d-flex">
                                        <span className="me-2">•</span>
                                        <span>Gestionar conocimientos científicos que aporten a la resolución de problemas en el campo educativo a nivel local, departamental, regional, nacional e internacional.</span>
                                    </li>
                                    <li className="mb-3 d-flex">
                                        <span className="me-2">•</span>
                                        <span>Generar y promover la difusión y administración del conocimiento educativo para que esté disponible y sea accesible a los actores del sistema educativo.</span>
                                    </li>
                                    <li className="d-flex">
                                        <span className="me-2">•</span>
                                        <span>Monitorear permanentemente los indicadores educativos seleccionados, con el fin de apoyar el diseño, la implementación y la evaluación de políticas públicas en educación.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div >

            {/*<div className="row">
                <div id="ourTeam" className="fondoGris disposicion">
                    <img src="images/Russbel-Hernandez.png" alt="" className="circle-img mx-auto d-block" />
                    <div className="informacion">
                        <div className="pb-3">
                            <p className="orangeText fw-bold fst-italic mb-1" style={{ fontSize: "3rem" }}>Russbel Hernández</p>
                            <p className="fst-italic fw-bold">Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM.</p>
                        </div>
                        <p>El Dr. Russbel Hernández es Doctor en Economía por la Universidad de Flensburg, Alemania. Posee una Maestría en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible, otorgada por la Universidad Nacional de Heredia, Costa Rica. Además, cuenta con una formación como Profesor de Educación Media con Licenciatura en Matemáticas y orientación en Computación, por la Universidad Pedagógica Nacional Francisco Morazán (UPNFM) de Honduras. Su trayectoria combina una sólida base académica con una profunda vocación por la educación y el desarrollo sostenible.</p>
                    </div>
                </div>

                <div id="ourTeam" className="disposicion">
                    <div className="informacion">
                        <div className="pb-3">
                            <p className="orangeText fw-bold fst-italic mb-1" style={{ fontSize: "3rem" }}>Russbel Hernández</p>
                            <p className="fst-italic fw-bold">Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM.</p>
                        </div>
                        <p>El Dr. Russbel Hernández es Doctor en Economía por la Universidad de Flensburg, Alemania. Posee una Maestría en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible, otorgada por la Universidad Nacional de Heredia, Costa Rica. Además, cuenta con una formación como Profesor de Educación Media con Licenciatura en Matemáticas y orientación en Computación, por la Universidad Pedagógica Nacional Francisco Morazán (UPNFM) de Honduras. Su trayectoria combina una sólida base académica con una profunda vocación por la educación y el desarrollo sostenible.</p>
                    </div>
                    <img src="images/Russbel-Hernandez.png" alt="" className="circle-img mx-auto d-block" />
                </div>
            </div>*/}

            {/* Nuestro Equipo */}
            < div id="ourTeam" className="font fondoGris container-fluid px-3 px-md-5 py-5">
                <p className="blueText mb-5 fontSection">Nuestro Equipo</p>
                <div className="row g-4 justify-content-center">
                    <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                        <Card
                            image="images/Russbel-Hernandez.png"
                            title="Russbel Hernández"
                            role="Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM."
                            email="russbelh@upnfm.edu.hn"
                            studies=<>
                                <ul className="text-start">
                                    <li className="mb-2"><strong>Doctor en Economía -</strong> Universidad de Flensburg, Alemania.</li>
                                    <li className="mb-2"><strong>Magíster en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible -</strong> Universidad Nacional, Costa Rica.</li>
                                    <li><strong>Profesor de Educación Media en el grado de Licenciatura en Matemáticas con orientación en Computación -</strong> Universidad Pedagógica Nacional Francisco Morazán (UPNFM), Honduras.</li>
                                </ul>
                            </>
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                        <Card
                            image="images/Mario Alas.png"
                            title="Mario Alas"
                            role="Director del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM."
                            email="marioalas@upnfm.edu.hn"
                            studies=
                            <>
                                <ul className="text-start">
                                    <li className="mb-1"><strong>Doctorado en Educación -</strong> Universidad de Flensburg, Alemania.</li>
                                    <li className="mb-1"><strong>Maestría en Sociología -</strong> Universidad de Costa Rica.</li>
                                    <li className="mb-1"><strong>Profesor en Matemáticas y Ciencias Sociales - </strong> UPNFM.</li>
                                </ul>
                            </>
                            experience=
                            <>
                                <p>Cuenta con más de 25 años de experiencia en:</p>
                                <ul className="text-start">
                                    <li>Investigación educativa.</li>
                                    <li>Docencia en grados de pregrado y posgrado en la UPNFM.</li>
                                </ul>
                            </>
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                        <Card
                            image="images/German Moncada.png"
                            title="German Moncada"
                            role="Investigador en el OUDENI de la UPNFM. "
                            email="germanmoncada@upnfm.edu.hn"
                            studies=<>
                                <ul className="text-start">
                                    <li className="mb-2"><strong>Licenciado en Psicología -</strong> Universidad Nacional Autónoma de Honduras (UNAH).</li>
                                    <li className="mb-2"><strong>Doctor en Psicología -</strong> Universidad de Granada, España.</li>
                                    <li className="mb-2"><strong>Doctor en Educación - </strong> Universidad de Flensburg, Alemania.</li>
                                </ul>
                            </>
                            experience=<>
                                <ul className="text-start">
                                    <li>Ha sido Director de Investigación y Director de Postgrado de la Universidad Pedagógica Nacional Francisco Morazán (UPNFM).</li>
                                    <li>Actualmente es investigador en el OUDENI de la UPNFM.</li>
                                </ul>
                            </>
                        />
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
};