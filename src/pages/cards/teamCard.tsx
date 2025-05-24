import React from 'react';
import Card from 'react-bootstrap/Card';

interface CardParams {
    image: string;
    title: string;
    role: string;
    email: string;
    studies: React.ReactNode;
    experience?: React.ReactNode;
}

{/*export default function Card({ image, title, role, email, studies, experience }: CardParams) {
    return (
        <div className="card team-card">
            <div className="card-image-wrapper">
                <img src={image} className="ourTeamImage" alt={title} />
                <div className="card-overlay">
                    <div className="overlay-text">
                        {experience && (
                            <>
                                <h5 className="fw-bold mb-3">🧑‍🏫 Experiencia</h5>
                                <div>{experience}</div>
                            </>
                        )}
                        <h5 className="fw-bold mb-3">🎓 Formación académica</h5>
                        {studies}
                    </div>
                </div>
            </div>
            <div className="card-body">
                <h5 className="cardTitle text-center orangeText">{title}</h5>
                <p className="fst-italic text-center">{role}</p>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <img src="images/gmail.png" alt="Email icon" width={20} className="me-2" />
                    <a href={`mailto:${email}`} className="text-decoration-none blueText">{email}</a>
                </div>
            </div>
        </div>
    );
}*/}

export default function TeamCard({ image, title, role, email }: CardParams) {
    return (
        <Card className="h-100 shadow-sm hover-effect">
            <div className="ratio ratio-1x1"> {/* Contenedor de relación de aspecto 1:1 */}
                <Card.Img
                    variant="top"
                    src={image}
                    className="object-fit-cover"
                    style={{
                        borderTopLeftRadius: 'var(--bs-card-border-radius)',
                        borderTopRightRadius: 'var(--bs-card-border-radius)'
                    }}
                />
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className='cardTitle text-center orangeText mb-3'>{title}</Card.Title>
                <Card.Text className="fst-italic text-center mb-4">
                    {role}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-center mt-auto">
                    <img
                        src="images/gmail.png"
                        alt="Email icon"
                        width={20}
                        height={20}
                        className="me-2"
                        style={{ minWidth: '20px' }}
                    />
                    <a
                        href={`mailto:${email}`}
                        className="text-decoration-none blueText text-break"
                        style={{ fontSize: '0.9rem' }}
                    >
                        {email}
                    </a>
                </div>
            </Card.Body>
        </Card>
    );
}