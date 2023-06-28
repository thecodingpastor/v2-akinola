import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import FormInput from "./FormInput";
import { useAppDispatch } from "../../fetchConfig/store";
import { GetRelatedBlogPosts } from "../../features/blog/blogApi";

import Spin from "../Loaders/Spin";
import { RelatedPostType } from "../../features/blog/types";
import { AddAlertMessage } from "../../features/UI/UISlice";

import classes from "./DebounceInput.module.scss";

interface IProps {
  SelectedRelatedPosts: RelatedPostType[];
  setSelectedRelatedPosts: React.Dispatch<
    React.SetStateAction<RelatedPostType[]>
  >;
}
const DebounceInput: React.FC<IProps> = ({
  SelectedRelatedPosts,
  setSelectedRelatedPosts,
}) => {
  const dispatch = useAppDispatch();
  const [Value, setValue] = useState("");
  const [Loading, setLoading] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPostType[]>([]);
  const { query } = useRouter();

  useEffect(() => {
    // This is for debounce
    let timer: NodeJS.Timeout;
    if (Value.trim().length > 4) {
      setLoading(true);
      timer = setTimeout(() => {
        setRelatedPosts([]);
        dispatch(
          GetRelatedBlogPosts({
            searchTerm: Value,
            currentBlogSlug: query?.slug as string,
          })
        ).then((data) => {
          if (data.meta.requestStatus === "fulfilled") {
            setRelatedPosts(data.payload);
            data.payload.length > 0 && setValue("");
          }
          setLoading(false);
        });
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [Value]);

  useEffect(() => {
    // To remove the loading state from the Loading if request was perhaps not made
    let timer: NodeJS.Timeout;
    if (Value.trim().length < 5) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [Value]);

  return (
    <div className={classes.Container}>
      <FormInput
        name="relatedPost"
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
        border
        value={Value}
        label="Enter at least 5 characters"
        placeholder="Related Blog Posts"
      />
      {Loading && (
        <Spin style={{ position: "absolute", right: "1rem", top: "1rem" }} />
      )}
      {Loading ? (
        <p className="text-center" style={{ marginBottom: "1rem" }}>
          Please wait ...
        </p>
      ) : relatedPosts.length > 0 ? (
        <ul className={classes.RelatedPosts}>
          {relatedPosts.map((post) => (
            <li
              key={post?._id}
              onClick={() => {
                setSelectedRelatedPosts((prev) => {
                  let isThere = prev.find((p) => p._id === post._id);
                  if (isThere) {
                    dispatch(
                      AddAlertMessage({
                        message: `"${post.title}" already selected`,
                      })
                    );
                    return prev;
                  }
                  return [post, ...prev];
                });
                setRelatedPosts((prev) =>
                  prev.filter((p) => p._id !== post._id)
                );
              }}
            >
              {post.title}
            </li>
          ))}
        </ul>
      ) : relatedPosts.length === 0 && Value.trim()?.length < 5 ? (
        <p className="text-center">Enter at least 5 characters to search.</p>
      ) : (
        <p className="text-center" style={{ marginBottom: "1rem" }}>
          {SelectedRelatedPosts.length === 0 && (
            <>
              No related post with the search term <b>{Value}</b> was found.
            </>
          )}
        </p>
      )}

      {SelectedRelatedPosts.length > 0 && (
        <ul className={classes.Selected}>
          <h3 className="text-center">Selected Blog Posts.</h3>
          {SelectedRelatedPosts?.map((post) => (
            <li key={post?._id}>
              {post?.title}{" "}
              <span
                onClick={() => {
                  setSelectedRelatedPosts((prev) =>
                    prev.filter((p) => p._id !== post._id)
                  );
                }}
              >
                x
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebounceInput;
