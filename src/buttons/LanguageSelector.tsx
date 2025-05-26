import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector(){
    const { t, i18n } = useTranslation('common'); 

    return(<>
        <Form.Select 
        aria-label="Language selector"
        className='bg-opacity-25 floating-sl'
        onChange={(e) => {
            if (e.target.value === "1") {
            i18n.changeLanguage("es");
            } else if (e.target.value === "2") {
            i18n.changeLanguage("en");
            }
        }}
        defaultValue="1"
        >
        
        <option value="1">Español</option>
        <option value="2">English</option>
        </Form.Select>
    </>);
}

