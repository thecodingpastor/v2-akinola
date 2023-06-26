import { useState } from "react";

import Button from "../Form/Button";
import Spin from "../Loaders/Spin";

import FormInput from "../Form/FormInput";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";
import {
  AddAlertMessage,
  SelectUI,
  SetConfirmModal,
} from "../../features/UI/UISlice";
import { ForgotPassword, Login } from "../../features/auth/authApi";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const LoginModal = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { showModal } = useAppSelector(SelectUI);
  const dispatch = useAppDispatch();
  const [Values, setValues] = useState({ email: "", password: "" });
  const [IsLoginMode, setIsLoginMode] = useState(true);
  const [ForgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const [Loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (IsLoginMode) {
      setLoading(true);
      // @ts-ignore
      executeRecaptcha("login").then((gReCaptchaToken) => {
        dispatch(Login({ ...Values, gReCaptchaToken })).then((data) => {
          if (data.meta.requestStatus === "fulfilled") {
            dispatch(
              AddAlertMessage({
                message: "Logged in successfully",
                type: "success",
              })
            );
            dispatch(SetConfirmModal(""));
          }
          setLoading(false);
        });
      });
    } else {
      setLoading(true);
      // @ts-ignore
      executeRecaptcha("forgotPassword").then((gReCaptchaToken) => {
        dispatch(ForgotPassword({ ForgotPasswordEmail, gReCaptchaToken })).then(
          (data) => {
            if (data.meta.requestStatus === "fulfilled") {
              dispatch(SetConfirmModal(""));
            }
            setLoading(false);
          }
        );
      });
    }
  };

  return (
    <Modal
      close={() => dispatch(SetConfirmModal(""))}
      isOpen={showModal === "login"}
    >
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">
          {IsLoginMode ? "Login" : "Forgot Password"}
        </h3>
        {IsLoginMode ? (
          <>
            <FormInput
              name="email"
              type="email"
              placeholder="Email"
              label="Email"
              onChange={handleChange}
              value={Values.email}
              required
              errorText="Email is required"
            />
            <FormInput
              name="password"
              type="password"
              placeholder="Password"
              label="Password"
              onChange={handleChange}
              value={Values.password}
              required
              errorText="Password is required"
            />
          </>
        ) : (
          <FormInput
            name="reset_password"
            type="email"
            placeholder="Enter your login email"
            label="Login email is required"
            onChange={(e: any) => setForgotPasswordEmail(e.target.value)}
            value={ForgotPasswordEmail}
            required
            errorText="Invalid email"
          />
        )}

        <div className="flex-center">
          {Loading ? (
            <Spin style={{ marginRight: "2rem" }} />
          ) : (
            <Button
              text={IsLoginMode ? "Login" : "Change Password"}
              type="submit"
              mode="pry"
              style={{ marginRight: "1rem" }}
            />
          )}
          <span
            onClick={() => setIsLoginMode(!IsLoginMode)}
            style={{
              fontStyle: "italic",
              fontWeight: "thin",
              cursor: "pointer",
            }}
          >
            {IsLoginMode ? "Forgot Password ?" : "Login"}
          </span>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
