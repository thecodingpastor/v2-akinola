import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlurImageUrl } from "../../fetchConfig/store";

const Slide: React.FC<{ slideData: any; position: any }> = ({
  slideData,
  position,
}) => {
  const [Slide, setSlide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (position === "activeSlide") setSlide(true);
      else setSlide(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [position]);
  return (
    <article className={`slider_article ${position}`}>
      <div
        className="slider_image_container"
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          src={slideData.coverImage || "/images/placeholder.webp"}
          fill
          blurDataURL={BlurImageUrl}
          placeholder="blur"
          alt={slideData.title}
        />
      </div>
      <div className="slider_overlay"></div>
      <Link href={`/blog/${slideData.slug}`}>
        <div
          className={`slider_article__section pointer ${
            position === "activeSlide" && Slide && "slide_in_from_left"
          }`}
        >
          <div className="heading">
            <div className="second">{slideData.title}</div>
          </div>

          <div>{slideData.description}</div>
        </div>
      </Link>
    </article>
  );
};

export default Slide;
