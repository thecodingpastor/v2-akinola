import Image from "next/image";

import PlaceholderImage from "../../../assets/images/placeholder.jpg";

import Link from "next/link";
import { BlurImageUrl, useAppDispatch } from "../../../fetchConfig/store";
import { SetCurrentBlog } from "../blogSlice";

import classes from "./RelatedBlogPosts.module.scss";

const RelatedBlogPosts = ({ relatedPosts }: { relatedPosts: any[] }) => {
  const dispatch = useAppDispatch();

  return (
    <div className={classes.Container}>
      <h3 className="text-center">You may also like.</h3>

      {relatedPosts?.map((post) => (
        <Link
          key={post._id}
          className={classes.Post}
          href={`/blog/${post.slug}`}
          onClick={() => dispatch(SetCurrentBlog(null))}
        >
          <div className={classes.ImageContainer}>
            <Image
              src={post?.images[0]?.url || PlaceholderImage}
              alt={post?.title || ""}
              fill
              blurDataURL={BlurImageUrl}
              placeholder="blur"
              // sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              sizes="20vw"
            />
          </div>
          <div className={classes.TitleDesc}>
            <h4>{post?.title}</h4>
            <small>{post?.intro}</small>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedBlogPosts;
