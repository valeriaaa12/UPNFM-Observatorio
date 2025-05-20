export default function aboutUs() {
    return (
        <>
            <div className="imageContainer">
                <div className="imageOverlay"></div>
                <div className="overlayText">
                    <p className="bigTitle">Quiénes Somos</p>
                    <p>Contenido inspirador sobre nuestra misión y visión.</p>
                </div>
            </div>
            <div id="aboutUs">
                <div className="row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Misión</h5>
                                <p className="card-text">Recoger, sistematizar, analizar y proveer datos educativos que contribuyan al mejoramiento continuo de la calidad de la educación, en Honduras y en la región.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Visión</h5>
                                <p className="card-text">Ser un ente que proporcione al sistema educativo hondureño, herramientas, datos, información e investigaciones que se usen para la toma de decisiones a nivel administrativo y ejecutivo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};