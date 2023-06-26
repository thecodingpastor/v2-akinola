import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectBlog } from "../../../features/blog/blogSlice";
import { AddAlertMessage } from "../../../features/UI/UISlice";

import CreateBlog from "../../../features/blog/components/CreateBlog";
import { GetSingleBlogFromBackend } from "../../../features/blog/blogApi";
import Transition from "../../../components/General/Transition";

const EditBlogPost = () => {
  const { pathname, query, replace } = useRouter();

  const dispatch = useAppDispatch();
  const { currentBlog } = useAppSelector(SelectBlog);

  useEffect(() => {
    // This works when the edit page is reloaded
    if (pathname === "/blog/[slug]/edit") {
      dispatch(GetSingleBlogFromBackend(query?.slug as string));
    }
  }, []);

  if (!currentBlog?._id) {
    replace("/blog");
    dispatch(AddAlertMessage({ message: "Blog not found" }));
    return;
  }

  return (
    <Transition mode="slide-right">
      <CreateBlog {...currentBlog} isEdit />
    </Transition>
  );
};

export default EditBlogPost;
