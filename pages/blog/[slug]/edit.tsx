import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectBlog } from "../../../features/blog/blogSlice";
import { AddAlertMessage } from "../../../features/UI/UISlice";

import CreateBlog from "../../../features/blog/components/CreateBlog";
import { GetSingleBlogFromBackend } from "../../../features/blog/blogApi";
import Transition from "../../../components/General/Transition";
import AuthPageLoading from "../../../components/Loaders/AuthPageLoading";

const EditBlogPost = () => {
  const { query, replace } = useRouter();

  const dispatch = useAppDispatch();
  const { currentBlog, blogLoading } = useAppSelector(SelectBlog);

  useEffect(() => {
    dispatch(GetSingleBlogFromBackend(query?.slug as string)).then((data) => {
      if (!data.payload._id) {
        replace("/blog");
        dispatch(AddAlertMessage({ message: "Blog not found" }));
        return;
      }
    });
  }, []);

  if (blogLoading === "default") return <AuthPageLoading />;

  return (
    <Transition mode="slide-right">
      <CreateBlog {...currentBlog} isEdit />
    </Transition>
  );
};

export default EditBlogPost;
