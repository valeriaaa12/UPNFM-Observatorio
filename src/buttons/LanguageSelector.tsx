import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'es', label: 'Español', img: '/images/spanish.jpg' },
    { code: 'en', label: 'English', img: '/images/ingles.jpg' },
];

export default function LanguageSelector() {
    const { i18n } = useTranslation('common');
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null; 

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <Dropdown>
            <Dropdown.Toggle
                className="bg-opacity-25 floating-sl d-flex align-items-center"
                id="dropdown-language"
                style={{
                    color: 'gray',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    border: '1px solid gray',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <img
                    src={currentLang.img}
                    alt={currentLang.label}
                    width={20}
                    height={20}
                    style={{ marginRight: 8, objectFit: 'cover', display: 'block',marginLeft: '12px' }}
                />
                <span>{currentLang.label}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {languages.map(lang => (
                    <Dropdown.Item
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        active={i18n.language === lang.code}
                        className="d-flex align-items-center"
                        style={{zIndex: 1000, cursor: 'pointer'}}
                    >   
                        <img
                            src={lang.img}
                            alt={lang.label}
                            width={20}
                            height={20}
                            style={{ marginRight: 8, objectFit: 'cover', display: 'block' }}
                        />
                        <span>{lang.label}</span>
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
