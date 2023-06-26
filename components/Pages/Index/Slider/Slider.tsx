import { useState, useEffect } from "react";

import Slide from "./Slide";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";

const Slider = ({ SliderData }: { SliderData: any }) => {
  const [Index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = SliderData?.length - 1;
    if (Index < 0) setIndex(SliderData?.length - 1);
    if (Index > lastIndex) setIndex(0);
  }, [Index, SliderData]);

  const handleForwardClick = () => {
    setIndex(Index + 1);
  };

  const handleBackwardClick = () => {
    setIndex(Index - 1);
  };

  useEffect(() => {
    let slider = setInterval(() => setIndex(Index + 1), 20000);

    return () => clearInterval(slider);
  }, [Index]);

  return (
    <section className="slider_section">
      <div className="slider_section__center">
        {SliderData?.map((slide: any, slideIndex: number) => {
          let position = "nextSlide";
          if (Index === slideIndex) position = "activeSlide";
          if (
            Index - 1 === slideIndex ||
            (Index === 0 && slideIndex === SliderData?.length - 1)
          )
            position = "lastSlide";

          return (
            <Slide key={slideIndex} position={position} slideData={slide} />
          );
        })}
      </div>
      <>
        <FiArrowLeftCircle
          className="slider_previous-arrow"
          onClick={handleBackwardClick}
        />
        <FiArrowRightCircle
          className="slider_next-arrow"
          onClick={handleForwardClick}
        />
      </>
    </section>
  );
};

export default Slider;
