import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

const backgroundImages = [
    '/images/bg1.png',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg',
];

const Demo = () => {
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <img
                src={backgroundImages[bgIndex]}
                alt=""
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    zIndex: 0,
                    filter: 'blur(5px) brightness(0.7)',
                    transition: 'opacity 1s',
                    opacity: 1,
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(25, 70, 127, 0.15)',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            />
            <nav
                style={{
                    width: '100%',
                    height: '60px',
                    background: '#19467f',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '32px',
                    boxSizing: 'border-box',
                    marginBottom: '32px',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                }}
            >
                <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
                    Observatorio Educativo UPNFM
                </span>
            </nav>
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: '60px',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <Card className="cardShadow" style={{ width: '25rem', height: '25rem' }}>
                    <Card.Body>
                        <div className="container">
                            <div className="header">
                                <div
                                    className="text font textColor center padding"
                                    style={{ fontWeight: 'bold', fontSize: "20px", paddingBottom: "27px",paddingTop: "19px" }}
                                >
                                    Iniciar Sesión
                                </div>
                                <div className="underline"></div>
                            </div>
                            <div className="inputs">
                                
                                <p className="text font textColor padding">Correo Electrónico</p>
                                <div className="input">
                                    <img src="email.png" alt="" />
                                    <input type="email" />
                                </div>
                                <p className="text font textColor">Contraseña</p>
                                <div className="input">
                                    <img src="password.png" alt="" />
                                    <input type="password" />
                                </div>
                                <div
                                    className="submit container"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                    }}
                                >
                                    <button
                                        style={{
                                            backgroundColor: '#19467f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 32px',
                                            font: 'inherit',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <img
                src="images/logo UPNFM.png"
                alt="UPNFM Logo"
                style={{
                    position: 'fixed',
                    right: '70px',
                    bottom: '50px',
                    width: '74px',
                    height: 'auto',
                    zIndex: 1001,
                    opacity: 0.9,
                }}
            />
        </div>
    );
};

export default Demo;