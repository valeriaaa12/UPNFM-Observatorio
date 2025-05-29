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
                className="bg-opacity-25 floating-sl"
                id="dropdown-language"
                style={{ backgroundColor: 'white', color: '#19467f' }}
            >
                <img src={currentLang.img} alt={currentLang.label} width={20} style={{ marginRight: 8 }} />
                {currentLang.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {languages.map(lang => (
                    <Dropdown.Item
                        key={lang.code}
                        onClick={() => i18n.changeLanguage(lang.code)}
                        active={i18n.language === lang.code}
                    >
                        <img src={lang.img} alt={lang.label} width={20} style={{ marginRight: 8 }} />
                        {lang.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

