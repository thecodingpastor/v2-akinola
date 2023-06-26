import classes from "./BlogPageLayout.module.scss";

const BlogPageLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className={classes.Container}>{children}</div>;
};

export default BlogPageLayout;
