import Nav from "../components/nav";
import Footer from "../components/footer";
import SubTitle from "../components/sub_title";
import WorkExpCard from "../components/work_exp";
import AboutCard from "../components/about_card";
import CatWomanPic from "../assets/cat_woman.png";
import CatPic1 from "../assets/corner_cat.png";
import { SiAdobephotoshop, SiAdobeillustrator, SiCanva} from "react-icons/si";

import Hero from "../assets/hero.png";
// import { HiOutlineHeart } from "react-icons/hi";

const AboutMe = () => {
  return(
    <div className="relative bg-pink flex flex-col min-h-screen">
      <Nav text="ABOUT - ME"/>
      <div>
        <div className="relative flex m-8 flex-grow md:flex-row sm:flex-col ssm:flex-col">
          {/* gambar profil */}
          <div className="w-1/4 py-4 border-2 border-yellow-100 rounded-lg -z-60"><img src={Hero} alt="hero" className="object-contain place-self-center"/></div>
          {/* deskripsi singkat */}
          <div className="w-3/4 flex flex-col ml-6 p-2 pt-4 text-white font-bold">
            <div className="flex">
              <SubTitle text="Hello" className="text-4xl"/>
              <h1 className="text-2xl h-min rounded-full pb-1">✨</h1>
            </div>
            <p className="flex flex-grow mt-2 pr-4 p-2 text-2xl font-desc border-4 border-white rounded-xl">
              My name Keisha Surya Ardelia, but you can call me Marugo. It's a pleasure to meet you! 
              <br/><br/>I'm a freelance Illustrator and a Graphic Designer. I always excited to learn new things and explore creative possibilities in my field! I love doing illustration and fanart. 
              My portfolio will showcase a diverse range of projects that demonstrate my abilities as an illustrator and graphic designer, which may adapt my styles based on project requirements.
            </p>
            <p className="text-sm font-desc mt-2">*p.s all the illustrations here are made by me 😘</p>
          </div>
        </div>
        <div className="mx-8 my-8 relative">
          <SubTitle text="Work Experience" className="text-3xl"/>
          <div className="flex lg:flex-row ssm:flex-col">
            <div className="relative w-2/5 h-min my-2 border-2 border-white rounded-xl">
              <WorkExpCard 
                corp="Webtoon Lineartist • PT. Hive Kreasi Internasional"
                date="1 Feb 2019 - 25 Jun 2019 | Jakarta Barat"
              >
                <li>Drawing characters outline for Webtoon Story</li>
              </WorkExpCard>
              <WorkExpCard 
                corp="Graphic Designer Intern • Emina Cosmetics"
                date="Jan 2020 - Feb 2020 | Jakarta"
              >
                <li>Create graphic designs for various media including digital print and social media</li>
              </WorkExpCard>
              <WorkExpCard 
                corp="Graphic Designer Intern • Tokopedia"
                date="Apr 2020 - Jul 2020 | Jakarta Selatan"
              >
                <li>Create visual design for Tokopedia marketing, including banners, social media posts, newsletters, and landing pages.</li>
              </WorkExpCard>
              <WorkExpCard 
                corp="Creative Team • Emina Eureka Fest 2023"
                date="Jun 2023 - Jul 2023 | Senayan Park"
              >
                <li>Responsible for all visual work that the team needed including handling social media pos, merchandise, event ID card, and landing page.</li>
              </WorkExpCard>
              <img src={CatPic1} alt="cat" className="absolute -right-5 -bottom-10 h-24" />
            </div>
            <div className="relative w-2/5 mx-4">
              <img src={CatWomanPic} alt="cat pic" className="absolute w-5/6 -top-24 left-10"/>
            </div>
          </div>
          <div className="flex justify-center mt-8 gap-8 md:flex-row ssm:flex-col">
            <AboutCard name="Education" minSize="25">
              <h1 className="font-bold">SMAN 1 Cibinong | Apr 2018 - Jan 2020</h1>
              <div>
                <h2>Achievement:</h2>
                <ul className="list-disc ml-5">
                  <li>1st place in school painting competition</li>
                  <li>3rd place in the Yukaina Festival poster competition</li>
                  <li>Active in creating design projects and competitions in the field of e-commerce</li>
                </ul>
              </div>
            </AboutCard>
            <AboutCard name="Interest">
              <div className="text-nowrap">
                <h2 className="font-bold">Hobby</h2>
                <ul className="list-disc ml-5">
                  <li>Craft & Arts</li>
                  <li>Design & Illustration</li>
                  <li>Photography</li>
                </ul>
                <h2 className="font-bold">Toys</h2>
                <ul className="list-disc ml-5">
                  <li>Sylvanian Families</li>
                  <li>Mofusand</li>
                </ul>
              </div>
            </AboutCard>
            <AboutCard name="Software">
              <div className="flex gap-4 p-4 text-4xl">
                <SiAdobephotoshop/> <SiAdobeillustrator/> <SiCanva/>
              </div>
            </AboutCard>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
};

export default AboutMe