import { useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";

import Button from "../components/Form/Button";
import FormInput from "../components/Form/FormInput";
import Spin from "../components/Loaders/Spin";

import { useAppDispatch } from "../fetchConfig/store";
import { ResetPassword } from "../features/auth/authApi";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import classes from "./reset.module.scss";

const PasswordRestPage = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [Values, setValues] = useState({
    password_reset: "",
    confirm_password_reset: "",
  });
  const [Loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setValues({ ...Values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // @ts-ignore
    executeRecaptcha("resetPassword").then((gReCaptchaToken) => {
      dispatch(
        ResetPassword({ ...Values, token, email, gReCaptchaToken })
      ).then(() => {
        setLoading(false);
        router.replace("/");
      });
    });
  };

  const isValid =
    Values.password_reset.trim().length > 5 &&
    Values.confirm_password_reset.trim().length > 5 &&
    Values.password_reset.trim() === Values.confirm_password_reset.trim();

  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <h2 className={classes.h2}>Password Reset</h2>
      <form onSubmit={handleSubmit} className={classes.Form}>
        <FormInput
          type="password"
          name="password_reset"
          placeholder="Enter your new password"
          label="Enter your new password"
          onChange={handleChange}
          value={Values.password_reset}
          pattern={Values.confirm_password_reset}
          required
          border
          errorText="Passwords do not match"
        />
        <FormInput
          type="password"
          name="confirm_password_reset"
          placeholder="Confirm password"
          label="Confirm password"
          onChange={handleChange}
          value={Values.confirm_password_reset}
          pattern={Values.password_reset}
          required
          border
          errorText="Passwords do not match"
        />
        {!isValid ? (
          <p className="text-center fade">
            Passwords must match and be more than 5 characters
          </p>
        ) : Loading ? (
          <Spin />
        ) : (
          <Button text="Change Password" type="submit" mode="pry" />
        )}
      </form>
    </>
  );
};

export default PasswordRestPage;
