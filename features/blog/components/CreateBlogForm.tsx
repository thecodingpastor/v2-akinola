import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { SetDraftBlog } from "../blogSlice";
import { BlogFormInputsArray } from "../BlogFormInputs";

import Transition from "../../../components/General/Transition";
import ImageUpload from "../../../components/editor/ImageUpload";
import FormInput from "../../../components/Form/FormInput";
import Tiptap from "../../../components/editor/TipTapEditor";
import Spin from "../../../components/Loaders/Spin";
import Button from "../../../components/Form/Button";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectBlog } from "../blogSlice";
import { AddAlertMessage } from "../../UI/UISlice";
import { CreateBlog, UpdateBlog } from "../blogApi";
import useAxiosProtected from "../../../hooks/useAxiosProtected";

import classes from "./CreateBlog.module.scss";
import DebounceInput from "../../../components/Form/DebounceInput";
import { RelatedPostType } from "../types";

const BlogForm: React.FC<{ isEdit?: boolean }> = ({ isEdit }) => {
  let isMounted = false;
  useAxiosProtected();
  const [DataIsSaved, setDataIsSaved] = useState(false);

  useEffect(() => {
    // Clear the LS and  draft course store
    if (DataIsSaved) {
      localStorage.removeItem("akin_draft_blog");
      dispatch(SetDraftBlog(null));
    }
    return () => {
      if (isMounted) {
        // Update draft course in store when user leaves page
        if (!DataIsSaved) {
          dispatch(
            // @ts-ignore
            SetDraftBlog(JSON.parse(localStorage.getItem("akin_draft_blog")))
          );
        }
      }

      isMounted = true;
    };
  }, [DataIsSaved]);

  const dispatch = useAppDispatch();
  const { draftBlog, currentBlog, blogLoading } = useAppSelector(SelectBlog);
  const { replace } = useRouter();

  const init = !isEdit
    ? {
        title: draftBlog?.title || "",
        estimatedReadTime: draftBlog?.estimatedReadTime || "",
        intro: draftBlog?.intro || "",
        mainContent: draftBlog?.mainContent || "",
        relatedPosts: draftBlog?.relatedPosts || [],
      }
    : {
        title: currentBlog?.title || "",
        estimatedReadTime: currentBlog?.estimatedReadTime || "",
        intro: currentBlog?.intro || "",
        mainContent: currentBlog?.mainContent || "",
        relatedPosts: currentBlog?.relatedPosts || [],
      };

  const [MainContent, setMainContent] = useState<string>(
    !isEdit ? draftBlog?.mainContent || "" : currentBlog?.mainContent
  );
  const [BlogFormValues, setBlogFormValues] = useState(init);

  const [Images, setImages] = useState<any[]>(
    !isEdit ? draftBlog?.images || [] : currentBlog?.images || []
  );
  const [SelectedRelatedPosts, setsetSelectedRelatedPosts] = useState<
    RelatedPostType[]
  >(!isEdit ? draftBlog?.relatedPosts || [] : currentBlog?.relatedPosts || []);

  const { title, estimatedReadTime, intro } = BlogFormValues;

  const BlogIsValid = /^.{5,100}$/.test(title) && /\d+/.test(estimatedReadTime);
  //  &&
  //  /^.{100,200}$/.test(intro);
  // /^.{100,200}$/

  // console.log(/^.{100,200}$/.test(intro));
  // console.log(BlogIsValid);

  // I only implemented this to create course, not to edit it
  const [Value, setValue] = useLocalStorage(
    "akin_draft_blog",
    {
      ...BlogFormValues,
      mainContent: MainContent,
      images: Images,
      relatedPosts: SelectedRelatedPosts,
    },
    !isEdit
  );

  const submit = () => {
    if (!BlogIsValid)
      return dispatch(
        AddAlertMessage({
          message:
            "You did not fill in the right data. Please look closely at the placeholder texts and error messages",
        })
      );
    if (MainContent.trim().length < 100) {
      return dispatch(
        AddAlertMessage({
          message: "Main content too small. Type more content in the editor",
        })
      );
    }
    const handleReset = (data: any) => {
      if (data.meta.requestStatus === "fulfilled") {
        setDataIsSaved(true);
        replace("/blog/" + data.payload.slug);
        setMainContent("");
        setBlogFormValues(init);
      }
    };

    if (!isEdit) {
      return dispatch(
        CreateBlog({
          title,
          intro,
          estimatedReadTime,
          mainContent: MainContent,
          images: Images,
          relatedPosts: SelectedRelatedPosts,
        })
      ).then((data) => {
        handleReset(data);
      });
    } else {
      dispatch(
        UpdateBlog({
          title,
          intro,
          estimatedReadTime,
          slug: currentBlog?.slug,
          mainContent: MainContent,
          images: Images,
          relatedPosts: SelectedRelatedPosts.map((post) => post._id),
        })
      ).then((data) => {
        handleReset(data);
      });
    }
  };

  return (
    <Transition mode="slide-right" className={classes.Container}>
      <h2 className="text-center">
        {!isEdit ? "Create Blog" : `Edit "${currentBlog?.title}"`}
      </h2>
      <ImageUpload
        Images={Images}
        setImages={setImages}
        setValue={setValue}
        title="Select Images"
        isEdit={isEdit}
        isMultiple
      />
      <form encType="multipart/form-data">
        {BlogFormInputsArray.map((input) => {
          return (
            <FormInput
              key={input.name}
              //@ts-ignore
              value={BlogFormValues[input.name]}
              focused="false"
              border
              {...input}
              onChange={(e: any) => {
                setBlogFormValues({
                  ...BlogFormValues,
                  [e.target.name]: e.target.value,
                });
                // @ts-ignore
                setValue(() => {
                  if (typeof Value === "object") {
                    return {
                      ...Value,
                      [e.target.name]: e.target.value,
                    };
                  }
                });
              }}
            />
          );
        })}
        <DebounceInput
          setSelectedRelatedPosts={setsetSelectedRelatedPosts}
          SelectedRelatedPosts={SelectedRelatedPosts}
        />
        <Tiptap
          setState={setMainContent}
          MainContent={MainContent}
          setValue={setValue}
          mode="write"
        />

        <div className="text-center">
          {blogLoading ? (
            <Spin />
          ) : (
            <Button
              text={isEdit ? "Update Blog" : "Create Blog"}
              type="button"
              mode="pry"
              disabled={!BlogIsValid}
              onClick={!BlogIsValid ? () => {} : submit}
            />
          )}
        </div>
      </form>
    </Transition>
  );
};

export default BlogForm;
