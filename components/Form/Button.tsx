import Link from "next/link";

import { ButtonProps } from "./type";

import classes from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({
  type = "button",
  target,
  to,
  text,
  onClick,
  mode,
  disabled,
  size,
  style,
  className,
}) => {
  if (to) {
    return (
      <Link
        href={to}
        target={target && "__blank"}
        className={`${classes.Button} ${mode ? classes[mode] : ""}  ${
          size ? classes[size] : ""
        } ${className ? className : ""} ${disabled ? classes.Disabled : ""}`}
        style={style ? style : {}}
      >
        {text}
      </Link>
    );
  } else if (type === "submit") {
    return (
      <button
        type="submit"
        className={`${classes.Button} ${mode ? classes[mode] : ""}  ${
          size ? classes[size] : ""
        }  ${className ? className : ""}  ${disabled ? classes.Disabled : ""}`}
        style={style ? style : {}}
      >
        {text}
      </button>
    );
  }
  // button type
  return (
    <button
      type="button"
      className={`${classes.Button} ${mode ? classes[mode] : ""}  ${
        className ? className : ""
      }  ${size ? classes[size] : ""}  ${disabled ? classes.Disabled : ""}`}
      style={style ? style : {}}
      onClick={onClick && onClick}
    >
      {text}
    </button>
  );
};

export default Button;
