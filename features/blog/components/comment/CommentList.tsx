import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { noYearDate } from "../../../../utils/formatDate";
import { CommentType } from "../../types";

import { useAppDispatch, useAppSelector } from "../../../../fetchConfig/store";
import { SelectAuth } from "../../../auth/authSlice";
import { SelectUI, SetConfirmModal } from "../../../UI/UISlice";
import { SelectBlog } from "../../blogSlice";

import ConfirmModal from "../../../../components/Modal/ConfirmModal";

import classes from "./CommentList.module.scss";
import { DeleteBlogComment } from "../../blogApi";
import { useRouter } from "next/router";

const CommentList = ({ comments }: { comments: CommentType[] }) => {
  const [CommentId, setCommentId] = useState("");
  const { userId } = useAppSelector(SelectAuth);
  const { blogLoading } = useAppSelector(SelectBlog);
  const { showModal } = useAppSelector(SelectUI);
  const dispatch = useAppDispatch();

  const { query } = useRouter();

  return (
    <div className={classes.Container}>
      <h2 className="text-center">Comments</h2>
      <ul>
        {comments.map((c) => (
          <li key={c._id}>
            <h3>{c.author}</h3>
            <small>{noYearDate(c.createdAt)}</small>
            <p>{c.text}</p>
            {userId && (
              <BsTrash
                onClick={() => {
                  setCommentId(c._id);
                  dispatch(SetConfirmModal("delete-comment"));
                }}
              />
            )}
          </li>
        ))}
      </ul>
      {showModal === "delete-comment" && (
        <ConfirmModal
          close={() => {
            setCommentId("");
            dispatch(SetConfirmModal(""));
          }}
          isOpen={showModal === "delete-comment"}
          loading={blogLoading === "delete-comment"}
          proceedWithAction={() =>
            dispatch(
              DeleteBlogComment({
                userId,
                commentId: CommentId,
                slug: query.slug,
              })
            ).then((data) => {
              if (data.meta.requestStatus == "fulfilled") {
                setCommentId("");
                dispatch(SetConfirmModal(""));
              }
            })
          }
          closeButtonText="Delete comment?"
        />
      )}
    </div>
  );
};

export default CommentList;
