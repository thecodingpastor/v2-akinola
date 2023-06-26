import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiFillCloseCircle } from "react-icons/ai";
// import { SingleImageType } from "../../features/Project/type";

// import ConfirmModal from "../modal/ConfirmModal";

import classes from "./ImageTile.module.scss";
import { useAppDispatch, useAppSelector } from "../../fetchConfig/store";
import { AddAlertMessage } from "../../features/UI/UISlice";
import { BsUpload } from "react-icons/bs";
import { BlogImageType } from "../../features/blog/types";
import ConfirmModal from "../Modal/ConfirmModal";
import { SelectBlog } from "../../features/blog/blogSlice";
import { DeleteBlogImageFromCloud } from "../../features/blog/blogApi";
import { SelectProject } from "../../features/project/projectSlice";

const ImageTile: React.FC<{
  setImages: React.Dispatch<any>;
  setValue: React.Dispatch<any>;
  Images: BlogImageType[];
  isEdit?: boolean;
  setFileNames?: React.Dispatch<any>;
  onClick: any;
}> = ({ setImages, Images, isEdit, setValue, setFileNames, onClick }) => {
  const dispatch = useAppDispatch();
  const [ShowConfirm, setShowConfirm] = useState("");
  const { projectLoading } = useAppSelector(SelectProject);
  const { blogLoading } = useAppSelector(SelectBlog);
  const { query } = useRouter();

  const DeleteImage = () => {
    dispatch(
      DeleteBlogImageFromCloud({
        fileId: ShowConfirm,
        slug: query?.slug as string,
      })
    ).then((data) => {
      // to remove the deleted image from the frontend
      if (data.meta.requestStatus === "fulfilled") {
        setImages((prev: any[]) => {
          return prev.filter((img) => img.fileId !== ShowConfirm);
        });
      }
      setShowConfirm("");
    });
  };

  const clear = (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    obj: { identifier: string; isNew: boolean }
  ) => {
    e.stopPropagation();

    const { isNew, identifier } = obj;
    if (!isNew) {
      return setShowConfirm(identifier);
    } else {
      setImages((prev: any[]) => {
        return prev.filter((img) => img.name !== identifier);
      });

      setImages((prev: any[]) => {
        return prev.filter((img) => {
          if (img.name) {
            // For newly uploaded files
            return img.name !== identifier;
          } else {
            return img.public_id !== identifier;
          }
        });
      });
      if (!isEdit) {
        setValue((prev: any) => {
          return {
            ...prev,
            images: prev.images.filter((img: any) => img.name !== identifier),
          };
        });
      }
      // @ts-ignore
      setFileNames((prev: string[]) => {
        return prev.filter((fileName) => fileName !== identifier);
      });
    }
  };

  return (
    <div className={classes.Container}>
      <div className={classes.Inner}>
        <BsUpload className={classes.Upload} onClick={onClick} />
        {Images.map((img: any, i) => (
          <div key={i} className={classes.ImgDiv}>
            <AiFillCloseCircle
              onClick={(e) => {
                clear(
                  e,
                  img.name
                    ? { identifier: img.name, isNew: true }
                    : { identifier: img.fileId, isNew: false }
                );
              }}
            />
            <Image
              src={img?.url?.toString() || img?.url}
              alt="Picked Image"
              width="100"
              height="120"
              onClick={onClick}
            />
          </div>
        ))}
      </div>
      <ConfirmModal
        close={() => setShowConfirm("")}
        isOpen={!!ShowConfirm}
        loading={
          projectLoading === "delete-image" || blogLoading === "delete-image"
        }
        message="Are you sure you want to delete this image?"
        proceedWithAction={DeleteImage}
        closeButtonText="Remove Image ? "
      />
    </div>
  );
};

export default ImageTile;
