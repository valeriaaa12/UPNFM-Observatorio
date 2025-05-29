type ComboBoxProps = {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const ComboBox = ({ title, options, value, onChange }: ComboBoxProps) => {
  return (
    <div>
      <label>{title}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ /* your existing styles here */ }}
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