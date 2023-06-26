import { useEffect } from "react";

import Slider from "./Slider/Slider";
import { useAppDispatch, useAppSelector } from "../../../fetchConfig/store";
import { SelectBlog } from "../../../features/blog/blogSlice";
import { GetSliderData } from "../../../features/blog/blogApi";
import AuthPageLoading from "../../Loaders/AuthPageLoading";

const SlideShow = () => {
  const dispatch = useAppDispatch();
  const { sliderData } = useAppSelector(SelectBlog);

  useEffect(() => {
    if (sliderData === null) dispatch(GetSliderData());
  }, []);

  if (sliderData === null) return <AuthPageLoading />;

  if (sliderData.length < 3) return <></>;
  return <Slider SliderData={sliderData} />;
};

export default SlideShow;
