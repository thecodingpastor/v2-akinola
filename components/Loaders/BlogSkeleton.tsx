import classes from "./BlogSkeleton.module.scss";

const BlogSkeleton = ({ count = 12 }: { count?: number }) => {
  // @ts-ignore
  const display = [...Array(count).keys()].map((i) => (
    <div className={classes.Container} key={i}>
      <div className={`${classes.Image} ${classes.Skeleton}`}></div>
      <div className={classes.Inner}>
        <div className={classes.Group}>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
        </div>

        <div className={`${classes.Date} ${classes.Group}`}>
          <span className={`${classes.Half} ${classes.Skeleton}`}></span>
          <span className={`${classes.Half} ${classes.Skeleton}`}></span>
        </div>

        <div className={classes.Group}>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
          <span className={`${classes.Full} ${classes.Skeleton}`}></span>
        </div>
        <div className={classes.Footer}>
          <span className={`${classes.Box} ${classes.Skeleton}`}></span>
          <span className={`${classes.Half} ${classes.Skeleton}`}></span>
        </div>
      </div>
    </div>
  ));

  return <>{display}</>;
};

export default BlogSkeleton;
