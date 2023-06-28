import { useEffect } from "react";
import { useRouter } from "next/router";

import useAxiosProtected from "../../hooks/useAxiosProtected";
import { SelectAuth } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";

import ScrollUpButton from "../General/ScrollUpButton";
import ToastContainer from "../Toast/ToastContainer";
import Footer from "./Footer";
import Navigation from "../Navigation/Navigation";
import PersistLogin from "./PersistLogin";
import FloatingButtons from "../General/FloatingButtons";
import CaptchaContainer from "./CaptchaContainer";
import SideNav from "../Navigation/SideNav";

import { SelectUI, SetHits } from "../../features/UI/UISlice";
import {
  SelectBlog,
  SetOldPage,
  SetTotalItemsCount,
  SetTotalPages,
} from "../../features/blog/blogSlice";
import { GetBlogCountAndHits } from "../../features/blog/blogApi";

interface IProps {
  children?: React.ReactNode;
}

const Layout: React.FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const { alertMessages } = useAppSelector(SelectUI);
  const { userId } = useAppSelector(SelectAuth);
  const { currentBlog, draftBlog } = useAppSelector(SelectBlog);

  // This adds the accessToken to the request headers on load
  useAxiosProtected();

  const { pathname } = useRouter();

  const allowedRoutesFloatingButtonParams = [
    "/blog/[slug]",
    "/create",
    "/blog/[slug]/edit",
    "/project/[slug]",
    "/project/[slug]/edit",
  ];
  const draftMode = pathname === "/create";

  useEffect(() => {
    // This gets the total pages of blog, total number of blogs and total number of hits the site has.
    dispatch(GetBlogCountAndHits()).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        dispatch(SetTotalPages(data.payload.totalPages));
        dispatch(SetTotalItemsCount(data.payload.totalItemsCount));
        dispatch(SetHits(data.payload.hits));
      }
    });
  }, []);

  return (
    <CaptchaContainer>
      <PersistLogin>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navigation />
          <SideNav />
          {alertMessages.length > 0 && (
            <ToastContainer
              alertMessages={alertMessages}
              position="top-right"
            />
          )}
          <main style={{ marginTop: "7rem", marginBottom: "auto" }}>
            {props.children}
          </main>
          <Footer />
          <ScrollUpButton />
          {userId && allowedRoutesFloatingButtonParams.includes(pathname) && (
            <FloatingButtons
              itemID={draftMode ? draftBlog?.slug : currentBlog?.slug}
              isPublished={currentBlog?.isPublished!}
            />
          )}
        </div>
      </PersistLogin>
    </CaptchaContainer>
  );
};

export default Layout;
