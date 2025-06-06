import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useTranslation } from 'react-i18next';

interface CardParams {
    image: string;
    title: string;
    role: string;
    email: string;
    studies: school[];
    experience: string[];
    interests?: string[];
    investigations?: string[];
}

interface school {
    grado: string;
    institucion: string;
}

export default function TeamCard({ image, title, role, email, studies = [], experience = [], interests = [], investigations = [] }: CardParams) {
    const [activeTab, setActiveTab] = useState<'studies' | 'experience' | 'interests' | 'investigations'>('studies');
    const { t } = useTranslation('common');

    return (
        <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden team-card font">
            <div className="ratio ratio-1x1 position-relative">
                <Card.Img
                    variant="top"
                    src={image}
                    className="object-fit-cover"
                />

                {/* Overlay con información académica/profesional */}
                <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 p-4">
                    <div className="h-100 d-flex flex-column">
                        {(experience.length > 0 || interests.length > 0) && (
                            <div className="d-flex mb-3 overlay-tabs flex-wrap">
                                <button
                                    className={`btn btn-sm btn-outline-light me-2 mb-1 ${activeTab === 'studies' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('studies')}
                                >
                                    {t('Estudios')}
                                </button>
                                {experience.length > 0 && (
                                    <button
                                        className={`btn btn-sm btn-outline-light me-2 mb-1 ${activeTab === 'experience' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('experience')}
                                    >
                                        {t('Experiencia')}
                                    </button>
                                )}
                                {interests.length > 0 && (
                                    <button
                                        className={`btn btn-sm btn-outline-light mb-1 ${activeTab === 'interests' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('interests')}
                                    >
                                        {t('Intereses')}
                                    </button>
                                )}
                                {investigations.length > 0 && (
                                    <button
                                        className={`btn btn-sm btn-outline-light mb-1 ${activeTab === 'investigations' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('investigations')}
                                    >
                                        {t('Investigacion2')}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="overflow-auto flex-grow-1">
                            {activeTab === 'studies' && (
                                <div className="text-white">
                                    <h6 className="fw-bold mb-3">{t('Formacion')}</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {studies.map((estudio, index) => (
                                            <li key={index} className="mb-1">
                                                <strong>{estudio.grado} -</strong> {estudio.institucion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'experience' && experience.length > 0 && (
                                <div className="text-white">
                                    <h6 className="fw-bold mb-3">{t('Trayectoria')}</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {experience.map((exp, index) => (
                                            <li key={index} className="mb-1">
                                                {exp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'interests' && interests.length > 0 && (
                                <div className="text-white">
                                    <h6 className="fw-bold mb-3">{t('Temas')}</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {interests.map((interest, index) => (
                                            <li key={index} className="mb-1">
                                                {interest}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'investigations' && investigations.length > 0 && (
                                <div className="text-white">
                                    <h6 className="fw-bold mb-3">{t('Investigacion')}</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {investigations.map((investigation, index) => (
                                            <li key={index} className="mb-1">
                                                {investigation}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Card.Body className="bg-white position-relative pt-4 pb-3">
                <div className="main-content">
                    <Card.Title className="cardTitle text-center orangeText mb-3">{title}</Card.Title>
                    <Card.Text className="text-muted mb-3 text-center small">{role}</Card.Text>
                    <div className="email-container d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-pill py-2 px-3 mt-2">
                        <img
                            src="images/gmail.png"
                            alt="Email icon"
                            width={18}
                            height={18}
                            className="me-2"
                        />
                        <a
                            href={`mailto:${email}`}
                            className="text-primary text-decoration-none text-break small"
                        >
                            {email}
                        </a>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}