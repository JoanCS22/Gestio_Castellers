import "./Input.css"; 

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  readonly = false
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      readonly={readonly}
      className="custom-input"
    />
  );
}

export default Input;