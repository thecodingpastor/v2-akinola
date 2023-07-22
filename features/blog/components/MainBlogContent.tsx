import { useState } from "react";
import Image from "next/image";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import PlaceholderImage from "../../../public/images/placeholder.jpg";

import { BlogPostType } from "../types";
import Tiptap from "../../../components/editor/TipTapEditor";
import CommentForm from "./comment/CommentForm";

import CommentList from "./comment/CommentList";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { BiMessageAlt } from "react-icons/bi";

import { BlurImageUrl, useAppDispatch } from "../../../fetchConfig/store";
import Spin from "../../../components/Loaders/Spin";
import { ToggleBlogPostLike } from "../blogApi";

import classes from "./MainBlogContent.module.scss";

const MainBlogContent: React.FC<{ currentBlog: BlogPostType | null }> = ({
  currentBlog,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useAppDispatch();
  const [Loading, setLoading] = useState(false);
  let author = localStorage.getItem("akinId")!;

  const handleLike = () => {
    setLoading(true);
    // @ts-ignore
    executeRecaptcha("like").then((gReCaptchaToken) => {
      dispatch(
        ToggleBlogPostLike({ gReCaptchaToken, author, slug: currentBlog?.slug })
      ).then(() => setLoading(false));
    });
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Inner}>
        <div className={classes.ImageContainer}>
          <Image
            src={currentBlog?.images[0]?.url || PlaceholderImage}
            alt={currentBlog?.title || ""}
            fill
            blurDataURL={BlurImageUrl}
            placeholder="blur"
            className={classes.Img}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h1 className={classes.Title}>{currentBlog?.title}</h1>
        <section>
          <div className={classes.Intro}>{currentBlog?.intro}</div>
          <div className={classes.Content}>
            <Tiptap
              setState={() => {}}
              MainContent={currentBlog?.mainContent || ""}
              setValue={() => {}}
              //
            />
          </div>
        </section>
      </div>
      <footer>
        <div className={classes.LikeCountContainer}>
          {!currentBlog?.likes.includes(author) ? (
            <>{Loading ? <Spin /> : <FaRegThumbsUp onClick={handleLike} />}</>
          ) : (
            <>{Loading ? <Spin /> : <FaThumbsUp onClick={handleLike} />}</>
          )}
          {currentBlog && currentBlog?.likes?.length > 0 && (
            <span>{currentBlog?.likes.length}</span>
          )}
        </div>
        <div className={classes.CommentCountContainer}>
          <BiMessageAlt />{" "}
          {currentBlog!.comments?.length > 0 && (
            <span>{currentBlog?.comments?.length}</span>
          )}
        </div>
      </footer>
      <CommentForm />
      {currentBlog && currentBlog.comments.length > 0 && (
        <CommentList comments={currentBlog?.comments} />
      )}
    </div>
  );
};

export default MainBlogContent;
