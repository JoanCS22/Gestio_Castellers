import "./Button.css";

function Button({
    text = "text",
    icon,
    action
}) {
    return (
        <div className="button-style" onClick={action}>
            {icon}
            <span>{text}</span>
        </div>
    );
}

export default Button;