import OrangeCard from "@/pages/components/orangeCard"
import Card from "@/pages/components/teamCard"

export default function aboutUs() {
    return (
        <>
            <div className="imageContainer">
                <div className="imageOverlay" />
                <div className="overlayText">
                    <p className="bigTitle">Quiénes Somos</p>
                    <p>Contenido inspirador sobre nuestra misión y visión.</p>
                </div>
            </div>
            <div id="aboutUs">
                <div className="row">
                    <div className="col-sm-6 mb-3 d-flex">
                        <OrangeCard
                            image="images/mision.jpg"
                            title="Misión"
                            text="Recoger, sistematizar, analizar y proveer datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación, en Honduras y en la región."
                        />
                    </div>
                    <div className="col-sm-6 mb-3 d-flex">
                        <OrangeCard
                            image="images/vision2.jpg"
                            title="Visión"
                            text="Ser un ente que proporcione al sistema educativo hondureño, herramientas, datos, información e investigaciones que se usen para la toma de decisiones a nivel administrativo y ejecutivo."
                        />
                    </div>
                    {/*<div className="col-sm-4 mb-3 d-flex">
                        <OrangeCard
                            image="images/objetivos.jpg"
                            title="Objetivos"
                            text="Gestionar los conocimientos científicos que aportan a la resolución de problemas en el campo educativo sea a nivel local, departamental, regional, nacional o internacional, generando la difusión y administración de conocimiento; y finalmente el monitoreo permanente de los indicadores educativos seleccionados para apoyar el diseño, implementación y evaluación de políticas públicas en educación."
                        />
                    </div>*/}
                </div>

                <div className="card mb-3 orange text-white">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src="images/objetivos.jpg" className="img-fluid rounded-start" alt="..." />
                        </div>
                        <div className="col-md-8 d-flex align-items-center">
                            <div className="card-body">
                                <h5 className="cardTitle">Objetivos</h5>
                                <p className="card-text">
                                    <br />1. Gestionar conocimientos científicos que aporten a la resolución de problemas en el campo educativo a nivel local, departamental, regional, nacional e internacional.<br />
                                    <br />2. Generar y promover la difusión y administración del conocimiento educativo para que esté disponible y sea accesible a los actores del sistema educativo.<br />
                                    <br />3. Monitorear permanentemente los indicadores educativos seleccionados, con el fin de apoyar el diseño, la implementación y la evaluación de políticas públicas en educación.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <hr />

            <div id="ourTeam" >
                <p className="bigTitle text-center mb-8">Nuestro Equipo</p>
                {/*<div className="fondo disposicion">
                    <img src="images/Russbel-Hernandez.png" alt=""
                        className="circle-img mx-auto d-block" />
                    <div id="texto">
                        <p className="cardTitle orangeText fw-bold fst-italic">Russbel Hernández</p>
                        <p className="fst-italic">Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM.</p>
                        <div className="team-member card p-3 mb-4">
                            <p className="mb-1"><strong>Doctorado:</strong> Economía – Universidad de Flensburg, Alemania.</p>
                            <p className="mb-1"><strong>Maestría:</strong> Política Económica (Economía Ecológica y Desarrollo Sostenible) – Universidad Nacional, Costa Rica.</p>
                            <p className="mb-0"><strong>Licenciatura:</strong> Matemáticas con orientación en Computación – UPNFM, Honduras.</p>
                        </div>

                    </div>
                </div>*/}

                <div id="ourTeam" className="row">
                    <div className="col-sm-4 mb-3 d-flex">
                        <Card
                            image="images/Russbel-Hernandez.png"
                            title="Russbel Hernández"
                            role="Director del Instituto de Investigación y Evaluación Educativas y Sociales (INIEES), de la UPNFM."
                            email="russbelh@upnfm.edu.hn"
                            studies=<>
                                <ul className="text-start">
                                    <li className="mb-1"><strong>Doctor en Economía -</strong> Universidad de Flensburg, Alemania.</li>
                                    <li className="mb-1"><strong>Magíster en Política Económica con énfasis en Economía Ecológica y Desarrollo Sostenible -</strong> Universidad Nacional, Costa Rica.</li>
                                    <li className="mb-1"><strong>Profesor de Educación Media en el grado de Licenciatura en Matemáticas con orientación en Computación -</strong> Universidad Pedagógica Nacional Francisco Morazán (UPNFM), Honduras.</li>
                                </ul>
                            </>
                        />
                    </div>
                    <div className="col-sm-4 mb-3 d-flex">
                        <Card
                            image="images/Mario Alas.png"
                            title="Mario Alas"
                            role="Director del Observatorio Universitario de la Educación Nacional e Internacional (OUDENI) de la UPNFM."
                            email="marioalas@upnfm.edu.hn"
                            studies=<>
                                <ul className="text-start">
                                    <li className="mb-1"><strong>Doctorado en Educación -</strong> Universidad de Flensburg, Alemania.</li>
                                    <li className="mb-1"><strong>Maestría en Sociología -</strong> Universidad de Costa Rica.</li>
                                    <li className="mb-1"><strong>Profesor en Matemáticas y Ciencias Sociales - </strong> UPNFM.</li>
                                </ul>
                            </>
                            experience=<>
                                <p>Cuenta con más de 25 años de experiencia en:</p>
                                <ul className="text-start">
                                    <li>Investigación educativa.</li>
                                    <li>Docencia en grados de pregrado y posgrado en la UPNFM.</li>
                                </ul>
                            </>
                        />
                    </div>
                    <div className="col-sm-4 mb-3 d-flex">
                        <Card
                            image="images/German Moncada.png"
                            title="German Moncada"
                            role="Investigador en el OUDENI de la UPNFM. "
                            email="germanmoncada@upnfm.edu.hn"
                            studies=<>
                                <ul className="text-start">
                                    <li className="mb-1"><strong>Licenciado en Psicología -</strong> Universidad Nacional Autónoma de Honduras (UNAH).</li>
                                    <li className="mb-1"><strong>Doctor en Psicología -</strong> Universidad de Granada, España.</li>
                                    <li className="mb-1"><strong>Doctor en Educación - </strong> Universidad de Flensburg, Alemania.</li>
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
            </div>
        </>
    );
};