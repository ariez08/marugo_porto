import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Main from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Collection from "./pages/Collection";
import Page404 from "./pages/Page404";
import { AuthProvider } from "./context/AuthContext";
import Portfolio from "./pages/Portfolio";
import Happy21 from "./pages/Happy21";
import UsersPage from "./pages/Users";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Main />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/hbd-keca-21" element={<Happy21 />} />
        {/* Catch-All Route */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
