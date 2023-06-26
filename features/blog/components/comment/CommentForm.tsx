import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { useState } from "react";
import { useRouter } from "next/router";

import { useAppDispatch } from "../../../../fetchConfig/store";
import { CreateBlogComment } from "../../blogApi";

import FormInput from "../../../../components/Form/FormInput";
import Button from "../../../../components/Form/Button";
import Spin from "../../../../components/Loaders/Spin";

import { AddAlertMessage } from "../../../UI/UISlice";

import classes from "./CommentForm.module.scss";

const CommentForm = () => {
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const slug = useRouter().query.slug;
  const [Values, setValues] = useState({ text: "", author: "" });
  const [Loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setValues({ ...Values, [e.target.name]: e.target.value });
  };

  const checkRange = (num: number, min: number, max: number) => {
    return num > min && num < max;
  };

  let commentIsValid =
    checkRange(Values.text?.trim().length, 2, 1001) &&
    Values.text.trim().length > 0;
  let authorIsValid =
    checkRange(Values.author?.trim().length, 2, 51) &&
    Values.author.trim().length > 0;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!authorIsValid || !commentIsValid)
      return dispatch(
        AddAlertMessage({
          message:
            "Name must be at least 3 - 50 characters, message must be at least 5 - 1000 characters",
          type: "fail",
        })
      );
    setLoading(true);
    // @ts-ignore
    executeRecaptcha("comment").then((gReCaptchaToken) => {
      dispatch(CreateBlogComment({ ...Values, slug, gReCaptchaToken })).then(
        (data) => {
          if (data.meta.requestStatus === "fulfilled") {
            dispatch(
              AddAlertMessage({
                message: "Thanks for your feedback",
                type: "success",
              })
            );
            setValues({ text: "", author: "" });
          }
          setLoading(false);
        }
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.Container}>
      <FormInput
        border
        name="author"
        placeholder="Your name"
        label="Your name"
        errorText="Name must have 3 - 50 characters."
        value={Values.author}
        onChange={handleChange}
      />
      <FormInput
        type="textarea"
        placeholder="Let's have your thoughts..."
        label="Let's have your thoughts ..."
        name="text"
        border
        value={Values.text}
        onChange={handleChange}
      />
      <div style={{ textAlign: "center" }}>
        {Loading ? (
          <Spin />
        ) : (
          <Button
            type="submit"
            text="Send"
            mode="pry"
            className={classes.FadeIn}
          />
        )}
      </div>
    </form>
  );
};

export default CommentForm;
