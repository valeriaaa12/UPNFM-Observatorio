import React from 'react';

interface CardParams {
    image: string;
    title: string;
    text: string;
}

export default function HCard({ image, title, text }: CardParams) {
    return (
        <div className="card mb-3 border-0 shadow-0">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={image} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt={title} />
                </div>
                <div className="col-md-8 d-flex align-items-center">
                    <div className="card-body">
                        <h5 className="cardTitle orangeText">{title}</h5>
                        <p className="card-text">{text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};