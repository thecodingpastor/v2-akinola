import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Slide = ({ slideData, position }: any) => {
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
          src={slideData.images[0]?.url || "/images/placeholder.jpg"}
          alt={slideData.title}
          blurDataURL="/images/test.jpg"
          placeholder="blur"
          fill
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

          <div>{slideData.intro}</div>
        </div>
      </Link>
    </article>
  );
};

export default Slide;
