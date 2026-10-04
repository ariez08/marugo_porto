import Nav from "../components/nav";
import Footer from "../components/footer";
import PopTitle from "../components/pop_title";
import WorkExpCard from "../components/work_exp";
import AboutCard from "../components/about_card";
import CatWomanPic from "../assets/cat_woman.png";
import CatPic1 from "../assets/corner_cat.png";
import { TbBrandAdobePhotoshop, TbBrandAdobeIllustrator, TbPalette } from "react-icons/tb";
import { motion } from "framer-motion";

import Hero from "../assets/hero.png";

const AboutMe = () => {
  return (
    <div className="relative bg-pink flex flex-col min-h-screen overflow-x-hidden">
      <Nav text="ABOUT - ME" />

      <main className="grow max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-10">
        {/* Section 1: Intro Profile & Bio */}
        <section className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Hero Card with Floating Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-40 sm:w-48 md:w-1/4 py-4 px-2 border-3 border-yellow-100 rounded-3xl z-10 shrink-0 bg-yellow-100/20 shadow-lg"
          >
            <motion.img
              src={Hero}
              alt="Marugo Avatar"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="object-contain mx-auto max-h-48 drop-shadow-md"
            />
          </motion.div>

          {/* Bio Description Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="w-full md:w-3/4 flex flex-col text-white font-bold"
          >
            <div className="flex items-center gap-2">
              <PopTitle text="Hello ✨" color="text-white" className="text-4xl md:text-5xl" />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 p-4 sm:p-6 text-base sm:text-lg font-desc border-3 md:border-4 border-white rounded-3xl bg-white/10 backdrop-blur-xs leading-relaxed shadow-lg font-normal"
            >
              My name is Keisha Surya Ardelia, but you can call me Marugo. It&apos;s a pleasure to meet you!
              <br /><br />
              I&apos;m a freelance Illustrator and Graphic Designer. I&apos;m always excited to learn new things and explore creative possibilities in my field! I love doing illustrations, comic outlines, and character fanart.
              My portfolio showcases a diverse range of projects demonstrating my abilities to adapt styles based on project needs.
            </motion.p>
            <p className="text-sm font-desc mt-2 text-white/90">
              *p.s all the illustrations here are made by me 😘
            </p>
          </motion.div>
        </section>

        {/* Section 2: Work Experience */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <PopTitle text="Work Experience" color="text-white" className="text-3xl sm:text-4xl md:text-5xl mb-4" />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Timeline Cards Container */}
            <div className="relative w-full lg:w-3/5 border-3 border-white rounded-3xl bg-white/10 backdrop-blur-xs shadow-lg overflow-hidden">
              <WorkExpCard
                corp="Webtoon Lineartist • PT. Hive Kreasi Internasional"
                date="1 Feb 2019 - 25 Jun 2019 | Jakarta Barat"
                delay={0.1}
              >
                <li>Drawing characters outline for Webtoon Story</li>
              </WorkExpCard>

              <WorkExpCard
                corp="Graphic Designer Intern • Emina Cosmetics"
                date="Jan 2020 - Feb 2020 | Jakarta"
                delay={0.2}
              >
                <li>Create graphic designs for various media including digital print and social media</li>
              </WorkExpCard>

              <WorkExpCard
                corp="Graphic Designer Intern • Tokopedia"
                date="Apr 2020 - Jul 2020 | Jakarta Selatan"
                delay={0.3}
              >
                <li>Create visual design for Tokopedia marketing, including banners, social media posts, newsletters, and landing pages.</li>
              </WorkExpCard>

              <WorkExpCard
                corp="Creative Team • Emina Eureka Fest 2023"
                date="Jun 2023 - Jul 2023 | Senayan Park"
                delay={0.4}
              >
                <li>Responsible for all visual work that the team needed including handling social media posts, merchandise, event ID cards, and landing pages.</li>
              </WorkExpCard>

              {/* Decorative Corner Cat */}
              <img
                src={CatPic1}
                alt="Decoration Cat"
                className="absolute -right-2 -bottom-2 h-16 sm:h-20 pointer-events-none object-contain"
              />
            </div>

            {/* Desktop Illustration */}
            <div className="relative hidden lg:block w-2/5 self-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                src={CatWomanPic}
                alt="Cat Character Illustration"
                className="w-full max-w-sm mx-auto object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Education, Hobbies & Software Cards */}
        <section className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 items-center md:items-stretch">
          <AboutCard name="Education" delay={0.1}>
            <h3 className="font-bold text-base sm:text-lg text-yellow-100">
              SMAN 1 Cibinong | Apr 2018 - Jan 2020
            </h3>
            <div className="mt-2 text-white/95">
              <h4 className="font-bold text-sm text-yellow-200">Achievement:</h4>
              <ul className="list-disc ml-4 mt-1 space-y-1 text-xs sm:text-sm">
                <li>1st place in school painting competition</li>
                <li>3rd place in the Yukaina Festival poster competition</li>
                <li>Active in creating design projects and competitions in the field of e-commerce</li>
              </ul>
            </div>
          </AboutCard>

          <AboutCard name="Interest" delay={0.2}>
            <div>
              <h4 className="font-bold text-sm text-yellow-200">Hobby</h4>
              <ul className="list-disc ml-4 mt-1 space-y-1 text-xs sm:text-sm text-white/95">
                <li>Craft & Arts</li>
                <li>Design & Illustration</li>
                <li>Culinary</li>
              </ul>
              <h4 className="font-bold text-sm text-yellow-200 mt-3">Toys & Collectibles</h4>
              <ul className="list-disc ml-4 mt-1 space-y-1 text-xs sm:text-sm text-white/95">
                <li>Sylvanian Families</li>
                <li>Mofusand</li>
              </ul>
            </div>
          </AboutCard>

          <AboutCard name="Software" delay={0.3}>
            <div className="flex items-center justify-around p-4 text-5xl">
              <TbBrandAdobePhotoshop
                title="Adobe Photoshop"
                className="hover:scale-115 transition-transform cursor-pointer"
              />
              <TbBrandAdobeIllustrator
                title="Adobe Illustrator"
                className="hover:scale-115 transition-transform cursor-pointer"
              />
              <TbPalette
                title="Digital Art & Canvas"
                className="hover:scale-115 transition-transform cursor-pointer"
              />
            </div>
          </AboutCard>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutMe;
