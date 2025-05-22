import React from 'react';

interface CardParams {
    title: string;
    text?: string;
    objectives?: string[];
}

export default function Card({ title, text, objectives }: CardParams) {
    return (
        <div className="card-body">
            <h5 className="card-title">{title}</h5>
            {text && (
                <p className="card-text">{text}</p>
            )}
            {objectives && (
                <>
                    <ul className="text-start">
                        {objectives.map((objective, index) => (
                            <li key={index}> {objective}</li>
                        ))
                        }
                    </ul>
                </>
            )}
        </div>
    );
};