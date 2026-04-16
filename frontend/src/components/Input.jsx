import "./Input.css"; 

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  readOnly = false
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      readOnly={readOnly}
      className="custom-input"
    />
  );
}

export default Input;