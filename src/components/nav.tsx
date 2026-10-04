import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt2 } from "react-icons/hi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const Nav = ({text}: {text: string}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); 
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggingOut", "true");
    logout();
    navigate("/");
    console.log("Logging out")
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
      <nav className="sticky top-0 z-50 flex items-center justify-between md:p-3 ssm:p-2 gap-2 lg:flex-row text-white bg-blue shadow-md">
        <div className="basis-1/4 relative">
          <button
            onClick={toggleDropdown}
            className="px-3.5 py-1.5 text-2xl md:text-3xl cursor-pointer w-fit hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <AiOutlineClose /> : <HiMenuAlt2 />}
          </button>

          {/* Backdrop & Pop-up Menu */}
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute left-2 sm:left-4 top-14 w-64 sm:w-72 bg-[#faf5ed] border-3 border-black-200 rounded-3xl p-5 shadow-[6px_6px_0px_#1c1c1c] z-50 text-black-100 flex flex-col gap-3 font-desc"
                >
                  {/* Decorative Washi Tape on Top Center */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink/80 border border-black-200/50 transform -rotate-1 rounded-xs pointer-events-none shadow-xs" />

                  {/* Public Navigation Section */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-white hover:bg-yellow-200 border-2 border-black-200 rounded-full font-bold text-sm text-center shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black-100 block"
                    >
                      Home
                    </Link>
                    <Link
                      to="/about-me"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-white hover:bg-yellow-200 border-2 border-black-200 rounded-full font-bold text-sm text-center shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black-100 block"
                    >
                      About Me
                    </Link>
                    <Link
                      to="/portfolio"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-white hover:bg-yellow-200 border-2 border-black-200 rounded-full font-bold text-sm text-center shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black-100 block"
                    >
                      Portfolio
                    </Link>
                  </div>
                  {/* Area Khusus Setelah Login (Admin Portal / Secret Zone) */}
                  {isAuthenticated && (
                    <div className="mt-1 pt-3 border-t-2 border-dashed border-black-200/30">
                      <div className="bg-yellow-100 border-2 border-black-200 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold bg-blue text-white px-2.5 py-0.5 rounded-full border border-black-200">
                            Area Admin
                          </span>
                          {user && (
                            <span className="text-xs text-gray-600 font-school font-bold truncate max-w-[120px]">
                              {user}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 mt-1">
                          <Link
                            to="/collection"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                            className="w-full px-3.5 py-1.5 bg-white hover:bg-yellow-200 border-2 border-black-200 rounded-full font-bold text-xs text-center shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black-100 block"
                          >
                            Koleksi Ilustrasi
                          </Link>
                          <Link
                            to="/users"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                            }}
                            className="w-full px-3.5 py-1.5 bg-white hover:bg-yellow-200 border-2 border-black-200 rounded-full font-bold text-xs text-center shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black-100 block"
                          >
                            Kelola User
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-black-200/20">
                          <button
                            onClick={handleLogout}
                            className="w-full py-1.5 bg-red text-white font-bold text-xs rounded-full border-2 border-black-200 shadow-[2px_2px_0px_#1c1c1c] active:translate-x-0.5 active:translate-y-0.5 hover:brightness-110 transition-all cursor-pointer text-center"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="basis-3/4 border-4 border-yellow-200 py-2 rounded-xl">
          <p className="font-nav font-bold text-3xl text-center">{text}</p>
        </div>

        <div className="relative basis-1/4 place-items-center ">
          {(isAuthenticated && user) ? 
            <div className='flex rounded-lg md:border-2 border-yellow-200 md:ml-8'>
            <h1 
              className='font-school md:text-base font-bold ssm:text-sm capitalize md:no-underline ssm:underline ssm:underline-offset-2 ssm:decoration-yellow-200 md:px-1'
            >
              Hai {user}
            </h1>
            <h1 className='text-sm'>😘</h1>
            </div>
            : <h1></h1>}
        </div>
      </nav>
  );
};

export default Nav;
