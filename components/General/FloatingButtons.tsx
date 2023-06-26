import { useRouter } from "next/router";

import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { IoArrowUndoSharp } from "react-icons/io5";
import {
  MdOutlinePublishedWithChanges,
  MdOutlineUnpublished,
} from "react-icons/md";
import { RiSlideshow2Line } from "react-icons/ri";

import useAxiosProtected from "../../hooks/useAxiosProtected";

import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";
import {
  DeleteBlog,
  PublishAndUnpublishBlog,
  ToggleSlider,
} from "../../features/blog/blogApi";
import { SelectBlog } from "../../features/blog/blogSlice";
import { SelectUI, SetConfirmModal } from "../../features/UI/UISlice";
import { DeleteProject } from "../../features/project/projectApi";
import { SelectProject } from "../../features/project/projectSlice";

import ConfirmModal from "../Modal/ConfirmModal";

import classes from "./FloatingButtons.module.scss";

interface IProps {
  itemID: string;
  isPublished: boolean;
  isDraft?: boolean;
}

const FloatingButtons: React.FC<IProps> = ({ itemID, isPublished }) => {
  const {
    pathname,
    push,
    replace,
    back,
    query: { slug },
  } = useRouter();

  const dispatch = useAppDispatch();
  const { showModal } = useAppSelector(SelectUI);
  const { blogLoading, currentBlog } = useAppSelector(SelectBlog);
  const { projectLoading } = useAppSelector(SelectProject);
  useAxiosProtected();

  const editMode = ["/blog/[slug]/edit", "/project/[slug]"].includes(pathname);
  const createMode = pathname === "/create";
  const removeEditAndPublishButton =
    editMode || createMode || pathname.startsWith("/project/[slug]");
  const showDeleteButton =
    editMode || ["/blog/[slug]", "/project/[slug]"].includes(pathname);
  const ConfirmModalIsOpen = [
    "Delete Blog",
    "Delete Project",
    "Add To Slider",
    "Remove From Slider",
  ].includes(showModal);

  const HandleConfirmAction = () => {
    if (["Remove From Slider", "Add To Slider"].includes(showModal)) {
      return dispatch(
        ToggleSlider({ slug, isSlider: currentBlog?.isSlider })
      ).then(() => dispatch(SetConfirmModal("")));
    } else if (pathname.startsWith("/blog/[slug]")) {
      return dispatch(DeleteBlog(itemID)).then(() => {
        replace("/blog");
        dispatch(SetConfirmModal(""));
      });
    } else {
      dispatch(DeleteProject(slug as string)).then(() => {
        replace("/#projects");
        dispatch(SetConfirmModal(""));
      });
    }
  };

  const GetBlogToEdit = () => {
    push("/blog/" + slug + "/edit");
  };

  const HandlePublish = (itemID: string, isPublished: boolean) => {
    dispatch(PublishAndUnpublishBlog({ slug: itemID, isPublished }));
  };

  const ConfirmDelete = () => {
    if (pathname.startsWith("/blog/[slug]"))
      dispatch(SetConfirmModal("Delete Blog"));
    else dispatch(SetConfirmModal("Delete Project"));
  };

  return (
    <div className={classes.Container}>
      <IoArrowUndoSharp onClick={() => back()} />
      {/* Edit Project Button */}
      {pathname === "/project/[slug]" && (
        <AiFillEdit onClick={() => push(`/project/${slug}/edit`)} />
      )}
      {!removeEditAndPublishButton && <AiFillEdit onClick={GetBlogToEdit} />}
      {removeEditAndPublishButton ? null : !isPublished ? (
        <MdOutlinePublishedWithChanges
          onClick={() => HandlePublish(itemID, isPublished)}
        />
      ) : (
        <MdOutlineUnpublished
          onClick={() => HandlePublish(itemID, isPublished)}
        />
      )}
      {pathname === "/blog/[slug]" && (
        <RiSlideshow2Line
          className={currentBlog?.isSlider ? classes.Selected : ""}
          onClick={() =>
            dispatch(
              SetConfirmModal(
                currentBlog?.isSlider ? "Remove From Slider" : "Add To Slider"
              )
            )
          }
        />
      )}
      {showDeleteButton && (
        <AiFillDelete
          className={classes.DeleteButton}
          onClick={ConfirmDelete}
        />
      )}
      {ConfirmModalIsOpen && (
        <ConfirmModal
          isOpen={ConfirmModalIsOpen}
          close={() => dispatch(SetConfirmModal(""))}
          loading={
            ["Add To Slider", "Delete Blog", "Remove From Slider"].includes(
              blogLoading!
            ) || projectLoading === "Delete Project"
          }
          proceedWithAction={HandleConfirmAction}
          closeButtonText={showModal || "Delete"}
        />
      )}
    </div>
  );
};

export default FloatingButtons;
