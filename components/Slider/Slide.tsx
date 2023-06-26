import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PositionTypes } from "./types";

const Slide: React.FC<{ slideData: any; position: any }> = ({
  // const Slide: React.FC<{ slideData: any; position: PositionTypes }> = ({
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
          src={slideData.coverImage || "/images/placeholder.jpg"}
          alt={slideData.title}
          blurDataURL="/images/question.jpg"
          placeholder="blur"
          layout="fill"
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
