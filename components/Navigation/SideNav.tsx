import Link from "next/link";
import { useRouter } from "next/router";

import { useAppSelector } from "../../fetchConfig/store";
import { SelectAuth } from "../../features/auth/authSlice";

import NavData from "./NavData";

import classes from "./SideNav.module.scss";

const SideNav = () => {
  const router = useRouter();
  const { accessToken } = useAppSelector(SelectAuth);
  const closeNav = () => {
    const checkbox = document.getElementById("navi_toggle");
    // @ts-ignore
    checkbox.checked = !checkbox.checked;
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute("href");
    // @ts-ignore
    const location = document.querySelector(target).offsetTop;
    closeNav();
    window.scrollTo({
      left: 0,
      top: location - 70,
    });
  };

  return (
    <div className={classes.navigation}>
      <input
        type="checkbox"
        className={classes.navigation__checkbox}
        id="navi_toggle"
      />
      <label htmlFor="navi_toggle" className={classes.navigation__button}>
        <span className={classes.navigation__icon}>&nbsp;</span>
      </label>
      <div className={classes.navigation__background}>&nbsp;</div>

      <nav className={classes.navigation__nav}>
        <ul className={classes.navigation__list}>
          <li className={classes.navigation__item} onClick={closeNav}>
            <Link href="/" className={classes.navigation__link}>
              Home
            </Link>
          </li>
          {router.pathname === "/" &&
            NavData.map((nav) => (
              <a
                href={nav.url}
                key={nav.id}
                className={`${classes.navigation__link} ${classes.navigation__item}`}
                onClick={(e: any) => handleClick(e)}
              >
                {nav.text}
              </a>
            ))}

          <li className={classes.navigation__item} onClick={closeNav}>
            <Link href="/blog" className={classes.navigation__link}>
              Blog
            </Link>
          </li>
          {accessToken && (
            <>
              <li className={classes.navigation__item} onClick={closeNav}>
                <Link href="/project" className={classes.navigation__link}>
                  New&nbsp;Projects
                </Link>
              </li>
              <li className={classes.navigation__item} onClick={closeNav}>
                <Link href="/create" className={classes.navigation__link}>
                  Create
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
