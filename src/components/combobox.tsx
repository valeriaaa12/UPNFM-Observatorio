import Form from 'react-bootstrap/Form';

interface SelectParams {
    title: string;
    options: string[];
}

function ComboBox({ title, options }: SelectParams) {
    return (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{title}:</label>
            <Form.Select aria-label="Default select example" >
                {options.map((option, index) => (
                    <option key={index}>{option}</option>
                ))}
            </Form.Select>
        </div>
    );
}

export default ComboBox;