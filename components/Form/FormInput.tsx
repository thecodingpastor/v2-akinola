import { useState } from "react";

import { MdCancel } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { FormInputPropsType } from "./type";

import classes from "./FormInput.module.scss";

const FormInput: React.FC<FormInputPropsType> = ({
  type = "text",
  name,
  placeholder,
  required = false,
  autoComplete = "off",
  pattern = "",
  onChange,
  disabled,
  value,
  className,
  label,
  errorText,
  border,
  options,
  defaultValue,
  charsLeft = 1000,
}) => {
  const [ShowPassword, setShowPassword] = useState(false);
  const [Focused, setFocused] = useState(false);

  const handleBlur = () => {
    if (!Focused) setFocused(true);
  };

  let content: React.ReactNode;
  if (type === "select") {
    content = (
      <select
        name={name}
        id={name}
        onChange={onChange}
        value={value || defaultValue}
        disabled={disabled}
        className={border ? classes.border : ""}
        required={required}
      >
        <option disabled>{defaultValue}</option>
        {options.map((opt: any) => (
          <option key={opt.caption} value={opt.value}>
            {opt.caption}
          </option>
        ))}
      </select>
    );
  } else if (type === "textarea") {
    content = (
      <>
        <textarea
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete || "off"}
          className={border ? classes.border : ""}
        />
      </>
    );
  } else {
    content = (
      <input
        className={`${border ? classes.border : ""} `}
        type={
          type === "password" ? (!ShowPassword ? "password" : "text") : type
        }
        id={name}
        name={name}
        min={type === "number" ? 0 : ""}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        pattern={pattern || ".*"}
        onChange={onChange}
        value={value}
        onBlur={handleBlur}
        data-focused={Focused.toString()}
        disabled={disabled}
      />
    );
  }

  return (
    <div className={`${classes.Container} ${className ? className : ""}`}>
      {type === "password" ? (
        <span
          className={classes.Eyes}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {ShowPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      ) : (
        ""
      )}
      {content}
      {type !== "select" && (
        <label htmlFor={name} className={classes.Label}>
          {type === "textarea"
            ? charsLeft - value?.trim().length > 0
              ? charsLeft - value?.trim().length + " characters left."
              : `Maximum character count ${charsLeft} exceeded.`
            : label}
        </label>
      )}
      {Focused && (
        <span className={classes.ErrorText}>
          {errorText} &nbsp; <MdCancel />
        </span>
      )}
    </div>
  );
};

export default FormInput;
