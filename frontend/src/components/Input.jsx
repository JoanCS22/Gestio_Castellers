import "./Input.css";

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  readOnly = false,
  inputTitle = "títol"
}) {
  return (
    <div className="input-wrapper">
      
      <div>
        {inputTitle}
      </div>

      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          readOnly={readOnly}
          className="custom-input"
        />
      ) : (
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
      )}
    </div>
  );
}

export default Input;