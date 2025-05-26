import React from 'react';
import Card from 'react-bootstrap/Card';
import { useState } from 'react';

interface CardParams {
    image: string;
    title: string;
    role: string;
    email: string;
    studies: school[];
    experience?: string[];
}

interface school {
    grado: string;
    institucion: string;
}

export default function TeamCard({ image, title, role, email, studies, experience }: CardParams) {
    const [activeTab, setActiveTab] = useState<'studies' | 'experience'>('studies');
    const hasExperience = Boolean(experience);

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
                        {hasExperience && (
                            <div className="d-flex mb-3 overlay-tabs">
                                <button
                                    className={`btn btn-sm btn-outline-light me-2 ${activeTab === 'studies' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('studies')}
                                >
                                    Estudios
                                </button>
                                <button
                                    className={`btn btn-sm btn-outline-light ${activeTab === 'experience' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('experience')}
                                >
                                    Experiencia
                                </button>
                            </div>
                        )}

                        <div className="overflow-auto flex-grow-1">
                            {(!hasExperience || activeTab === 'studies') ? (
                                <div className="studies-content text-white">
                                    <h6 className="fw-bold mb-3">Formación Académica</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {studies.map((estudio, index) => (
                                            <li key={index} className="mb-1">
                                                <strong>{estudio.grado} -</strong> {estudio.institucion}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="experience-content text-white">
                                    <h6 className="fw-bold mb-3">Trayectoria Profesional</h6>
                                    <ul className="text-start" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                                        {experience?.map((listbox, index) =>
                                            <li key={index} className="mb-1">
                                                {listbox}
                                            </li>
                                        )}
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