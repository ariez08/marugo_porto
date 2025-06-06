import Nav from "../components/nav";
import Footer from "../components/footer";
import HomeCard from "../components/home_card";
import { HiChevronDown } from "react-icons/hi";

import IconPic1 from "../assets/icon_home1.png";
import IconPic2 from "../assets/icon_home2.png";
import IconPic3 from "../assets/icon_home3.png";
import ArrowIcon from "../assets/arrow.svg";

const Main: React.FC = () => {
    return (
      <div className="relative min-h-screen flex flex-col bg-pink">
        <Nav text="- H O M E -"/>
        <div className="flex-grow">
          <div className="m-5 text-white">
            <div className="flex">
              <h1 className="font-londrina font-bold text-6xl">H e l l o</h1>
              <HiChevronDown className="place-self-end" />
            </div>
            <p className="font-school">Welcome to my website, hope you like it :D</p>
          </div>
          <div className="flex md:flex-row ssm:flex-col gap-4 items-center justify-center ssm:p-2 md:p-8 font-bold place-items-center">
            <HomeCard 
              bgColor="bg-blue" 
              imgSrc={IconPic1} 
              altText="Icon 1" 
              buttonText="Portofolio" 
              buttonClass="bg-orange"
              delayTime={0.2}
              buttonLink="/no"
            />
            {/* arrow 1 */}
            <div className="hidden md:block w-48"><img src={ArrowIcon} alt="Arrow" className="object-none"/></div>
            <HomeCard 
              bgColor="bg-yellow-200" 
              imgSrc={IconPic2} 
              altText="Icon 2" 
              buttonText="Collection" 
              buttonClass="bg-purple"
              buttonLink="/collection"
            />
            {/* arrow 2 */}
            <div className="hidden md:block w-48"><img src={ArrowIcon} alt="Arrow" className="object-none"/></div>
            <HomeCard 
              bgColor="bg-blue" 
              imgSrc={IconPic3} 
              altText="Icon 3" 
              buttonText="About Me" 
              buttonClass="bg-lime-green" 
              buttonLink="/about-me"
              delayTime={0.4} 
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  export default Main;
