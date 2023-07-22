import { useState, useContext } from "react";

import Image from "next/image";

import Button from "../../Form/Button";
import Spin from "../../Loaders/Spin";

// import emailjs from "@emailjs/browser";

// import GlobalContext from "../../../context/General/GlobalContext";

import FormInput from "../../Form/FormInput";
import { BlurImageUrl, useAppDispatch } from "../../../fetchConfig/store";

import classes from "./Contact.module.scss";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SendMessage } from "../../../features/blog/blogApi";
import { AddAlertMessage } from "../../../features/UI/UISlice";

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useAppDispatch();
  const init = {
    FullName: "",
    Email: "",
    Message: "",
  };
  const [Values, setValues] = useState(init);
  const [Loading, setLoading] = useState(false);

  const Valid =
    /^\S+@\S+\.\S+$/.test(Values.Email.trim()) &&
    Values.FullName.trim().length > 2 &&
    Values.Message.trim().length > 4;

  const handleChange = (e: any) => {
    setValues((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // @ts-ignore
    executeRecaptcha("message").then((gReCaptchaToken) => {
      dispatch(SendMessage({ ...Values, gReCaptchaToken })).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          dispatch(
            AddAlertMessage({
              message:
                "Email has been sent successfully. Thanks for reaching out.",
              type: "success",
            })
          );
          setValues(init);
        }
        setLoading(false);
      });
    });
  };

  return (
    <div className={classes.Container} id="contact">
      <h3>Let&apos;s have a chat</h3>
      <div className={classes.Contact}>
        <form onSubmit={onSubmit} className={classes.ContactForm}>
          <h4 className="text-center">
            I will get back to you between 2 - 12 hours
          </h4>

          <FormInput
            name="FullName"
            placeholder="Your Full Name"
            onChange={handleChange}
            value={Values.FullName}
            label="Full Name: 3 or more characters"
            border
          />
          <FormInput
            type="email"
            name="Email"
            placeholder="Email"
            onChange={handleChange}
            value={Values.Email}
            label="Email"
            border
            errorText="Invalid email"
          />

          <FormInput
            type="textarea"
            name="Message"
            placeholder="Your message"
            value={Values.Message}
            onChange={handleChange}
            label="Message: 5 or more characters"
            border
            charsLeft={2000}
          />
          {Valid ? (
            <div className="flex-center">
              {!Loading ? (
                <Button text="Send Message" type="submit" />
              ) : (
                <Spin />
              )}
            </div>
          ) : (
            <p className="text-center fade_in">
              Fill in the right details to see submit button
            </p>
          )}
        </form>
        <div className={classes.ContactImage}>
          <Image
            src="/images/customer-service.png"
            width="380"
            height="380"
            alt="contact-image"
            blurDataURL={BlurImageUrl}
            placeholder="blur"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
