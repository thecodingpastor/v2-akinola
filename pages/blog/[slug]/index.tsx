import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Transition from "../../../components/General/Transition";
import { SelectBlog, SetCurrentBlog } from "../../../features/blog/blogSlice";
import { BlogPostType } from "../../../features/blog/types";
import { AddAlertMessage } from "../../../features/UI/UISlice";
import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";

import BlogPageLayout from "../../../features/blog/components/BlogPageLayout";
import MainBlogContent from "../../../features/blog/components/MainBlogContent";

import RelatedBlogPosts from "../../../features/blog/components/RelatedBlogPosts";

import classes from "./Slug.module.scss";
import AuthPageLoading from "../../../components/Loaders/AuthPageLoading";
import { SelectAuth } from "../../../features/auth/authSlice";
import { IncreaseBlogView } from "../../../features/blog/blogApi";

const SingleBlogPage = (props: BlogPostType) => {
  const dispatch = useAppDispatch();
  const { replace, query } = useRouter();
  const { userId } = useAppSelector(SelectAuth);
  const { currentBlog } = useAppSelector(SelectBlog);

  useEffect(() => {
    // Debounce
    let timer: NodeJS.Timeout;
    if (!userId) {
      timer = setTimeout(() => {
        dispatch(IncreaseBlogView(query?.slug as string));
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [userId]);

  useEffect(() => {
    if (props._id) {
      dispatch(SetCurrentBlog(props));
    } else {
      dispatch(
        AddAlertMessage({
          message: "Something is not right. Please try again later.",
        })
      );
      replace("/blog");
      return;
    }
  }, [props?.slug]);

  if (currentBlog === null) return <AuthPageLoading />;

  return (
    <Transition mode="slide-right" className={classes.Container}>
      <Head>
        <title>{currentBlog?.title || "Michael Akinola's Blog"}</title>
      </Head>

      <BlogPageLayout>
        <MainBlogContent currentBlog={currentBlog} />
        {currentBlog &&
          currentBlog.relatedPosts &&
          currentBlog.relatedPosts.length > 0 && (
            <RelatedBlogPosts relatedPosts={currentBlog?.relatedPosts} />
          )}
      </BlogPageLayout>
    </Transition>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data;
  try {
    const res = await fetch(
      process.env.NODE_ENV === "production"
        ? process.env.LIVE_SITE + "/api/blog/" + context.params?.slug
        : "http://localhost:3000/api/blog/" + context.params?.slug
    );
    const data = await res.json();
    return {
      props: data,
    };
  } catch (err) {
    return {
      props: { notFound: true },
    };
  }
};

export default SingleBlogPage;
