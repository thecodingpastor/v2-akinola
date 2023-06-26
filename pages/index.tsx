import About from "../components/Pages/Index/About";
import Contact from "../components/Pages/Index/Contact";
import SlideShow from "../components/Pages/Index/SlideShow";
import SocialMedia from "../components/Pages/Index/SocialMedia";
import Transition from "../components/General/Transition";
import Project from "../components/Pages/Index/Project";

const Home = () => {
  return (
    <div id="home">
      <Transition>
        <SlideShow />
        <About />
        <Project />
        <Contact />
        <SocialMedia />
      </Transition>
    </div>
  );
};

export default Home;
