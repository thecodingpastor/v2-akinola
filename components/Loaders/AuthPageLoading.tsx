import React from "react";

import classes from "./AuthPageLoading.module.scss";

const AuthPageLoading = () => {
  return (
    <div className={classes.Container}>
      <div className={classes.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>Please wait ...</p>
    </div>
  );
};

export default AuthPageLoading;
