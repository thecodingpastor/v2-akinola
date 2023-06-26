import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import classes from "./Navigation.module.scss";

import NavData from "./NavData";

import { RiSuitcase3Line } from "react-icons/ri";
import { useAppSelector } from "../../fetchConfig/store";
import { SelectAuth } from "../../features/auth/authSlice";
import { BsFillPencilFill } from "react-icons/bs";

const Navigation = () => {
  const { accessToken } = useAppSelector(SelectAuth);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (router.pathname !== "/") return;
    e.preventDefault();
    // @ts-ignore
    const target = e.target.getAttribute("href");
    const location = document.querySelector(target).offsetTop;
    // SOmething to be done

    window.scrollTo({
      left: 0,
      top: location - 70,
    });
  };

  return (
    <nav className={classes.Container}>
      <div className={classes.Logo}>
        <Link href="/">
          <div className={classes.LogoContainer}>
            <Image
              src="/images/logo.png"
              alt="Michael Akinola's Logo"
              width="40"
              height="40"
            />
          </div>
        </Link>
        <Link href="/">Michael Akinola</Link>
      </div>
      <ul className={classes.Links}>
        {router.pathname === "/" &&
          NavData.map((nav) => (
            <a key={nav.id} href={nav.url} onClick={(e) => handleClick(e)}>
              {nav.text}
            </a>
          ))}
        <Link
          href="/blog"
          className={router.pathname === "/blog" ? classes.Active : ""}
        >
          Blog
        </Link>
        {accessToken && (
          <>
            <Link
              href="/create"
              className={
                router.pathname === "/create"
                  ? classes.Active + " flex-center"
                  : "flex-center"
              }
            >
              <BsFillPencilFill />
            </Link>
            <Link
              href="/project"
              className={
                router.pathname === "/project"
                  ? classes.Active + " flex-center"
                  : "flex-center"
              }
            >
              <RiSuitcase3Line />
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
