import { useRef, useState } from "react";

import { useAppDispatch } from "../../fetchConfig/store";

import { AddAlertMessage } from "../../features/UI/UISlice";

import classes from "./ImageUpload.module.scss";
import ImageTile from "./ImageTile";
import { BlogImageType } from "../../features/blog/types";

const ImageUpload: React.FC<{
  Images: BlogImageType[];
  setImages: React.Dispatch<any>;
  setValue: React.Dispatch<any>;
  title: string;
  isMultiple?: boolean;
  isEdit?: boolean;
}> = ({ Images, setImages, setValue, title, isEdit, isMultiple = false }) => {
  const pickRef = useRef();
  const [FileNames, setFileNames] = useState([]);
  const dispatch = useAppDispatch();

  // @ts-ignore
  const pick = () => pickRef?.current?.click();

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    let files = (e.target as HTMLInputElement).files;
    const acceptableImages = ["image/png", "image/jpeg", "image/jpg"];
    //@ts-ignore
    const imageFiles: any[] = [...files];
    if (imageFiles.length > 4)
      return dispatch(
        AddAlertMessage({ message: "You cannot upload more than 4 images." })
      );

    let newImages: any = [];
    let newFileNames: string[] = [];

    imageFiles.forEach((file) => newFileNames.push(file.name));

    imageFiles.forEach((file) => {
      if (!file) {
        return dispatch(AddAlertMessage({ message: "File does not exist" }));
      }

      const { size, type, name } = file;

      if (size > 1000000) {
        return dispatch(
          AddAlertMessage({
            message: "Image too big. Should be less than 1MB",
          })
        );
      }

      if (!acceptableImages.includes(type)) {
        return dispatch(
          AddAlertMessage({
            message: "Invalid image. Image should be .png, .jpg, or .jpeg",
          })
        );
      }

      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          newImages.push({ url: reader.result as string, size, type, name });

          if ([...Images, ...newImages].length > 4)
            return dispatch(
              AddAlertMessage({ message: "Maximum of 4 Images allowed." })
            );

          // The if check prevents the same image from being added twice
          // @ts-ignore
          if (!FileNames.includes(file.name)) {
            setImages((prev: BlogImageType[]) => [
              ...prev,
              { url: reader.result as string, size, type, name },
            ]);

            // @ts-ignore
            setFileNames([...FileNames, ...newFileNames]);

            setValue((prev: any) => {
              return {
                ...prev,
                images: [
                  ...prev.images,
                  { url: reader.result as string, size, type, name },
                ],
              };
            });
          } else {
            dispatch(
              AddAlertMessage({
                message: "Duplicate image detected",
              })
            );
          }
        }
        // @ts-ignore
        e.target.value = null;
      };
    });
  };

  return (
    <div className={classes.Container}>
      {Images?.length > 0 && (
        <>
          <ImageTile
            Images={Images}
            setImages={setImages}
            isEdit={isEdit}
            setValue={setValue}
            setFileNames={setFileNames}
            onClick={pick}
          />
        </>
      )}
      {Images?.length === 0 && (
        <span onClick={pick} className="pointer">
          {title}
        </span>
      )}
      <input
        type="file"
        name="fileToUpload"
        onChange={handleOnChange}
        // @ts-ignore
        ref={pickRef}
        accept="image/*"
        multiple={isMultiple}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUpload;
