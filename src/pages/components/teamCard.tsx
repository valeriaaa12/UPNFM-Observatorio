import React from 'react';

interface CardParams {
    image: string;
    title: string;
    role: string;
    email: string;
    studies: React.ReactNode;
    experience?: React.ReactNode;
}

export default function Card({ image, title, role, email, studies, experience }: CardParams) {
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
                <h5 className="cardTitle text-center orangeText fst-italic">{title}</h5>
                <p className="fst-italic text-center">{role}</p>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <img src="images/gmail.png" alt="Email icon" width={20} className="me-2" />
                    <a href={`mailto:${email}`} className="text-decoration-none blueText">{email}</a>
                </div>
            </div>
        </div>
    );
}
