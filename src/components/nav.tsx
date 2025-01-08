import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt2} from "react-icons/hi";
import { useState } from "react";

const Nav = ({text}: {text: string}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); 
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("isLoggingOut", "true");
    logout();
    navigate("/home");
    console.log("Logging out")
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
      <div className="flex items-center justify-between p-3 lg:flex-row text-white bg-blue">
        <div className="basis-1/4">
          <button onClick={toggleDropdown} className="px-4 text-3xl">
            {isOpen ? <AiOutlineClose /> : <HiMenuAlt2 />}
          </button>
          <div
            className={`absolute bg-white left-10 mt-2 w-48 rounded-md transition-all duration-300 ${
              isOpen ? "opacity-100 translate-y-0 z-50" : "opacity-0 -translate-y-2 pointer-events-none z-50"
            }`}
          >
            <ul className="p-2 text-blue text-lg">
              <li className="my-2 px-3 py-1 bg-white hover:bg-gray-100 cursor-pointer rounded">
                <Link to="/" className="block w-full h-full">Home</Link>
              </li>
              <li className="my-2 px-3 py-1 bg-white hover:bg-gray-100 cursor-pointer rounded">
                <Link to="/about-me" className="block w-full h-full">About Me</Link>
              </li>
              {isAuthenticated ? 
              <li className="my-2 px-3 py-1 bg-white hover:bg-gray-100 cursor-pointer rounded">
                <Link to="/collection" className="block w-full h-full">Show</Link>
              </li> : <div></div>}
              
              {(isAuthenticated && user) ? 
              <li className="my-2 px-3 py-1 bg-red text-white hover:bg-opacity-85 cursor-pointer rounded" onClick={handleLogout}>
                <button>Log Out</button>
              </li> : <div></div>}
            </ul>
          </div>
        </div>

        <div className="basis-3/4 border-4 border-yellow-200 py-2 rounded-xl">
          <p className="font-nav font-bold text-3xl text-center">{text}</p>
        </div>

        <div className="basis-1/4">
          {(isAuthenticated && user) ? <h1 className='capitalize'>Hai {user}</h1>: <h1></h1>}
        </div>
      </div>
  );
};

export default Nav;
