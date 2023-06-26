import classes from "./CreateBlog.module.scss";
import CreateBlogForm from "./CreateBlogForm";

const CreateBlog = ({ isEdit = false }) => {
  return (
    <div className={classes.Container}>
      <CreateBlogForm isEdit={isEdit} />
    </div>
  );
};

export default CreateBlog;
