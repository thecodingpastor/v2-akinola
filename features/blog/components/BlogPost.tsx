import Link from "next/link";
import Image from "next/image";

import { BlogPostType } from "../types";

import __ from "../../../utils/formatDate";

import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";

import { BlurImageUrl, useAppSelector } from "../../../fetchConfig/store";

import { AiOutlineEye } from "react-icons/ai";
import { SelectAuth } from "../../auth/authSlice";
import { BiMessageAlt } from "react-icons/bi";

import classes from "./BlogPost.module.scss";
import { SelectBlog } from "../blogSlice";

const BlogPost: React.FC<BlogPostType> = ({
  title,
  intro,
  images,
  estimatedReadTime,
  slug,
  likes,
  comments,
  createdAt,
  views,
}) => {
  const { userId } = useAppSelector(SelectAuth);
  const { blogLoading } = useAppSelector(SelectBlog);

  return (
    <Link
      href={`/blog/${slug}`}
      className={`${classes.Container} ${
        blogLoading === "default" ? classes.Loading : ""
      }`}
    >
      <div style={{ width: "100%", height: "13rem", position: "relative" }}>
        <Image
          src={images[0]?.url || "/images/placeholder.webp"}
          fill
          blurDataURL={BlurImageUrl}
          placeholder="blur"
          alt={title}
          // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          sizes="500px"
        />
      </div>
      <div className={classes.Heading}>
        <h3 title={title}>{title}</h3>
        <div>
          <span>{__(createdAt)} </span>
          <small className={classes.Read}>{estimatedReadTime} mins read</small>
        </div>
      </div>

      <div className={classes.Description}>{intro}</div>
      <footer>
        <div className={classes.LikeCountContainer}>
          {!likes?.includes(localStorage.getItem("akinId")!) ? (
            <FaRegThumbsUp />
          ) : (
            <FaThumbsUp />
          )}
          {likes?.length > 0 && (
            <span className={classes.count}>{likes.length}</span>
          )}
        </div>
        <div className={classes.CommentCountContainer}>
          <BiMessageAlt />
          {comments?.length > 0 && <span>{comments?.length}</span>}
        </div>
        {userId && views > 0 && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <AiOutlineEye style={{ fontSize: "2rem" }} /> <span>{views}</span>
          </div>
        )}
      </footer>
    </Link>
  );
};

export default BlogPost;
