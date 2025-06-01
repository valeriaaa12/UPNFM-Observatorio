type ComboBoxProps = {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const ComboBox = ({ title, options, value, onChange }: ComboBoxProps) => {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '5px' }}>{title}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '5px' }}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
export default ComboBox