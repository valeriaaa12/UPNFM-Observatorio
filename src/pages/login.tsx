import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "@/buttons/LanguageSelector";
import Client from '@/components/client';
import { useUser } from '../context/usertype';
import { useRouter } from 'next/router';


const backgroundImages = [
    '/images/bg1.png',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg',
];

const Demo = () => {
    const [bgIndex, setBgIndex] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { t, i18n } = useTranslation('common');
    const { setUser } = useUser();
    const router = useRouter();

    console.log('Current language:', i18n.language);
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async () => {
        setError("");
        console.log("🔐 Se ejecutó handleLogin");

        if (document.visibilityState !== 'visible') {
            console.warn("La pestaña no está visible. Esperando...");
            document.addEventListener('visibilitychange', handleLogin, { once: true });
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("✅ Usuario autenticado:", user.email);
            console.log("UID del usuario:", user?.uid);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/esAdmin/${user.uid}`);
            const data = await response.json();

            if (data.admin) {
                console.log("🛡️ Usuario es administrador");
                setUser({ uid: user.uid, email: user.email!, admin: true });
                router.push('/landingpage');

            } else {
                console.log("👤 Usuario no es administrador");
                setUser({ uid: user.uid, email: user.email!, admin: false });
                router.push('/landingpage');
            };
        } catch (error: any) {
            console.error("❌ Error en login:", error);
            setError("Credenciales inválidas. Intenta nuevamente.");
            if (error.code === "auth/visibility-check-was-unavailable") {
                setError("Error de visibilidad. Intenta hacer login con la pestaña activa.");
            } else {
                setError("Credenciales inválidas. Intenta nuevamente.");
            }
        };
    };


    return (
        <>
            <Client>
                <div style={{ minHeight: '100vh', background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
                    {/* Imagen de fondo dinámica */}
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
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(25, 70, 127, 0.15)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }} />
                    <nav style={{
                        width: '100%',
                        height: '60px',
                        background: '#19467f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingLeft: '20px',
                        boxSizing: 'border-box',
                        marginBottom: '32px',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        zIndex: 1000
                    }}>
                        <a href="/landingpage" style={{ display: 'inline-block' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-house-door-fill" viewBox="0 0 16 16" style={{ marginRight: '12px', verticalAlign: 'middle' }}>
                                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5" />
                            </svg>
                        </a>
                        <span style={{
                            color: 'white',
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat',
                            verticalAlign: 'middle',
                            whiteSpace: 'pre-line',
                            lineHeight: 1.1,
                        }}>
                            {t("OUDENI")}
                        </span>
                    </nav>
                    <div style={{
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '60px',
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <Card className="cardShadow responsive-card" style={{
                            width: '90vw',
                            maxWidth: '400px',
                            margin: '2vw',
                            borderRadius: '12px',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                        }}>
                            <Card.Body>
                                <div className="container">
                                    <div className="header">
                                        <div className="text font textColor center padding" style={{
                                            fontWeight: 'bold',
                                            fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                                            paddingBottom: "27px",
                                            paddingTop: "19px"
                                        }}>
                                            {t("Login")}
                                        </div>
                                        <div className="underline"></div>
                                    </div>
                                    <div className="inputs">
                                        <p className="text font textColor padding" style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)' }}>{t("Correo")}</p>
                                        <div className="input" style={{ marginBottom: '0.7rem', minHeight: '32px', display: 'flex', alignItems: 'center', height: '36px', border: '1px solid #ccc', borderRadius: '6px', background: '#f8f9fa', padding: '0 8px' }}>
                                            <img src="email.png" alt="" style={{ width: '18px', marginRight: '8px' }} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0 4px',
                                                    fontSize: '1rem',
                                                    height: '28px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                        <p className="text font textColor" style={{ fontSize: 'clamp(0.75rem, 1vw, 0.9rem)' }}>{t("Contraseña")}</p>
                                        <div className="input" style={{ marginBottom: '0.7rem', minHeight: '32px', display: 'flex', alignItems: 'center', height: '36px', border: '1px solid #ccc', borderRadius: '6px', background: '#f8f9fa', padding: '0 8px' }}>
                                            <img src="password.png" alt="" style={{ width: '18px', marginRight: '8px' }} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0 4px',
                                                    fontSize: '1rem',
                                                    height: '28px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    outline: 'none'
                                                }}
                                            />
                                        </div>
                                        {error && (
                                            <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                                                {error}
                                            </div>
                                        )}
                                        <div className="submit container" style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingTop: '16px',
                                        }}>
                                            <button
                                                onClick={handleLogin}
                                                style={{
                                                    backgroundColor: '#19467f',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '12px 32px',
                                                    font: 'inherit',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    fontSize: '1rem',
                                                    paddingBottom: '12px',
                                                    marginBottom: '1rem'
                                                }}
                                            >
                                                {t("Login")}
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
                            left: '4vw',
                            bottom: '4vw',
                            width: '12vw',
                            maxWidth: '74px',
                            height: 'auto',
                            zIndex: 1001,
                            opacity: 0.9,
                        }}
                    />
                    <style>
                        {`
                    @media (max-width: 600px) {
                        .responsive-card {
                            max-width: 98vw !important;
                            margin: 1vw !important;
                            padding: 0 !important;
                        }
                        nav span {
                            font-size: 1rem !important;
                            white-space: normal !important;
                        }
                    }
                    `}
                    </style>
                </div>
                <LanguageSelector />
            </Client>
        </>
    );
};

export default Demo;
