import Image from "next/image";

import classes from "./MyImage.module.scss";
import { BlurImageUrl } from "../../fetchConfig/store";
import { useState } from "react";

interface IProps {
  src: any;
  width: number;
  height: number;
  className?: string;
  style?: any;
  alt: string;
  fill?: boolean;
  sizes?: string;
}

const MyImage = ({
  src,
  width,
  height,
  alt,
  className,
  style,
  fill,
  sizes,
}: IProps) => {
  const [Loading, setLoading] = useState(true);

  const props = {
    src,
    // placeholder: "blur",
    alt: alt || "Image",
    blurDataURL:
      "https://res.cloudinary.com/indelible-success/image/upload/v1687537144/akinola/loading-removebg-preview_y3jn5v.png",
    onLoadingComplete: () => setLoading(false),
    className: `${classes.MyImage} ${className || ""} ${
      Loading ? classes.Loading : ""
    }`,
    style: style || {},
    sizes: sizes || "",
  };

  return (
    <div style={{ width: "100%" }}>
      {fill ? (
        <Image {...props} placeholder="blur" fill />
      ) : (
        <Image {...props} placeholder="blur" width={width} height={height} />
      )}

      {/* // src={src}
        // width={width || null}
        // height={height || ""}
        // blurDataURL={BlurImageUrl}
        // placeholder="blur"
        // alt={alt || "Image"}
        // // fill={!width && fill}
        // onLoadingComplete={() => setLoading(false)}
        // className={`${classes.MyImage} ${className || ""} ${
        //   Loading ? classes.Loading : ""
        // }`}
        // style={style || {}}
        // sizes={sizes || ""}
      // /> */}
    </div>
  );
};

export default MyImage;
