import Nav from "../components/nav";
import Footer from "../components/footer";
import { motion } from "framer-motion";

import Emoji from "../assets/emoji.png"

const FourOFour: React.FC = () => {
    return (
        <div className="relative bg-pink flex flex-col min-h-screen">
            <Nav text="Page Not Found"/>
            <div className="relative flex-grow flex flex-col items-center justify-center">
                <div className="w-[10vw] p-2">
                    <motion.img 
                        src={Emoji}
                        className="object-cover"
                        drag
                        dragSnapToOrigin={true}
                        whileTap={{ scaleY: 0.8, scaleX: 0.95}}
                        animate={{ y: [0, -20, 0] }} // Bounce effect
                    >
                    </motion.img>
                </div>
                <div className="mt-2">
                    <h1 className="font-bold text-white font-school text-6xl">404 Page Not Found</h1>
                </div>
            </div>
            <Footer/>
        </div>
    )
};

export default FourOFour;