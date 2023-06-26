import { useState, useEffect } from "react";

import Image from "next/image";

import { AiOutlineLogout } from "react-icons/ai";

import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";
import { SelectAuth } from "../../features/auth/authSlice";
import { LogOut } from "../../features/auth/authApi";
import { SelectUI, SetConfirmModal } from "../../features/UI/UISlice";
import LoginModal from "../Modal/Login";

import classes from "./Footer.module.scss";

function Footer() {
  const { showModal, hits } = useAppSelector(SelectUI);
  const { accessToken } = useAppSelector(SelectAuth);
  const dispatch = useAppDispatch();

  return (
    <footer className={classes.Container}>
      {hits > 0 && accessToken && (
        <p className={classes.Count}>
          This site has been visited <span>{hits} </span> times and counting
        </p>
      )}
      <div className={classes.footer}>
        {accessToken && <AiOutlineLogout onClick={() => dispatch(LogOut())} />}
        <div>
          <Image
            src="/images/logo.png"
            alt="Michael Akinola"
            width={30}
            height="30"
            className="round"
            onDoubleClick={
              !accessToken ? () => dispatch(SetConfirmModal("login")) : () => {}
            }
          />
          &nbsp; Michael Akinola &copy; {new Date().getFullYear()}
        </div>
        {showModal === "login" && <LoginModal />}
      </div>
      <small>
        Powered by:{" "}
        <a href="http://michaelayeni.me" target="__blank">
          TheCodingPastor
        </a>
      </small>
    </footer>
  );
}

export default Footer;
