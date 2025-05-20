import React from 'react';

interface CardParams {
    image: string;
    title: string;
    text: string;
}

export default function Card({ image, title, text }: CardParams) {
    return (
        <div className="card orange text-white">
            <img src={image} className="MYcard-img-top " alt={title}></img>
            <div className="card-body">
                <h5 className="cardTitle text-center">{title}</h5>
                <p className="card-text text-center">{text}</p>
            </div>
        </div >
    );
};