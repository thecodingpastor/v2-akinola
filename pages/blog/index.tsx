import Head from "next/head";
import { useEffect, useState } from "react";

import __ from "../../utils/formatDate";

import BlogPost from "../../features/blog/components/BlogPost";
import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";
import { SelectAuth } from "../../features/auth/authSlice";
import { SelectBlog, SetOldPage } from "../../features/blog/blogSlice";
import { GetAllBlogPosts } from "../../features/blog/blogApi";

import Transition from "../../components/General/Transition";
import BlogSkeleton from "../../components/Loaders/BlogSkeleton";

import classes from "./BlogPage.module.scss";
import MyPagination from "../../features/blog/components/pagination";
import { AddAlertMessage } from "../../features/UI/UISlice";

const BlogPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(SelectAuth);
  const {
    blogPosts,
    oldPage,
    page,
    totalItemsCount,
    totalPages,
    itemsPerPage,
  } = useAppSelector(SelectBlog);

  console.log({
    blogPosts,
    oldPage,
    page,
    totalItemsCount,
    totalPages,
    itemsPerPage,
  });

  useEffect(() => {
    if (blogPosts === null || oldPage !== page) {
      if (page > totalPages) {
        dispatch(AddAlertMessage({ message: `Invalid page number` }));
        return;
      }

      dispatch(GetAllBlogPosts({ page, userId: userId || "" })).then((data) => {
        if (data.meta.requestStatus === "fulfilled") dispatch(SetOldPage(page));
      });
    }
  }, [page]);

  let content: React.ReactNode;

  if (blogPosts === null) content = <BlogSkeleton />;
  else
    content = blogPosts.map((post) => {
      return <BlogPost key={post._id} {...post} />;
    });

  return (
    <>
      <Head>
        <title>Michael Akinola - Blog Posts</title>
      </Head>

      <Transition className={classes.Container} mode="slide-right">
        {content}
      </Transition>
      <MyPagination
        currentPage={page}
        itemsPerPage={itemsPerPage || 0}
        totalItemsCount={totalItemsCount}
        totalPages={totalPages}
      />
    </>
  );
};

export default BlogPage;
